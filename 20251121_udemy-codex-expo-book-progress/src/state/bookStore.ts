import {
  BookFilters,
  BookWithProgress,
  Category,
  CategoryStat,
  CreateBookInput,
  ProgressSummary,
  UpdateBookInput,
} from '../domain/types';
import { BookRepository } from '../database/bookRepository';
import {
  FILTERS_STORAGE_KEY,
  DAILY_GOAL_STORAGE_KEY,
  PreferencesStorage,
} from '../storage/preferencesStorage';

type FiltersState = {
  status: 'all' | 'unread' | 'reading' | 'completed';
  categoryId?: number;
  searchKeyword: string;
};

export type DailyGoalState = {
  targetPages: number | null;
  pagesReadToday: number;
};

type DailyGoalPreferences = {
  targetPages: number | null;
  anchorDate: string;
  anchorTotalPages: number;
};

export interface BookStoreState {
  loading: boolean;
  error: string | null;
  categories: Category[];
  books: BookWithProgress[];
  summary: ProgressSummary;
  categoryStats: CategoryStat[];
  filters: FiltersState;
  dailyGoal: DailyGoalState;
}

export interface BookStore {
  getState(): BookStoreState;
  subscribe(listener: () => void): () => void;
  initialize(): Promise<void>;
  refresh(): Promise<void>;
  applyFilters(filters: Partial<FiltersState>): Promise<boolean>;
  addBook(input: CreateBookInput): Promise<boolean>;
  updateBook(id: string, payload: UpdateBookInput): Promise<boolean>;
  updateProgress(id: string, currentPages: number): Promise<boolean>;
  deleteBook(id: string): Promise<boolean>;
  clearError(): void;
  setDailyGoal(targetPages: number | null): Promise<boolean>;
}

interface CreateBookStoreOptions {
  repository: BookRepository;
  preferencesStorage: PreferencesStorage;
}

const DEFAULT_FILTERS: FiltersState = {
  status: 'all',
  categoryId: undefined,
  searchKeyword: '',
};

const EMPTY_SUMMARY: ProgressSummary = {
  totalBooks: 0,
  unreadBooks: 0,
  readingBooks: 0,
  completedBooks: 0,
  totalCompletedPages: 0,
};

const EMPTY_STATE: BookStoreState = {
  loading: false,
  error: null,
  categories: [],
  books: [],
  summary: { ...EMPTY_SUMMARY },
  categoryStats: [],
  filters: { ...DEFAULT_FILTERS },
  dailyGoal: {
    targetPages: null,
    pagesReadToday: 0,
  },
};

function cloneState(state: BookStoreState): BookStoreState {
  return {
    ...state,
    categories: [...state.categories],
    books: [...state.books],
    summary: { ...state.summary },
    categoryStats: [...state.categoryStats],
    filters: { ...state.filters },
    dailyGoal: { ...state.dailyGoal },
  };
}

function normalizeFilters(input?: Partial<FiltersState>): FiltersState {
  const statusCandidates: FiltersState['status'][] = [
    'all',
    'unread',
    'reading',
    'completed',
  ];
  const sanitizedStatus: FiltersState['status'] = statusCandidates.includes(
    input?.status as FiltersState['status']
  )
    ? (input?.status as FiltersState['status'])
    : 'all';

  const categoryId =
    typeof input?.categoryId === 'number' && Number.isInteger(input.categoryId)
      ? input.categoryId
      : undefined;

  const searchKeyword =
    typeof input?.searchKeyword === 'string'
      ? input.searchKeyword.trim()
      : '';

  return {
    status: sanitizedStatus,
    categoryId,
    searchKeyword,
  };
}

function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function createDefaultDailyGoalPreferences(): DailyGoalPreferences {
  return {
    targetPages: null,
    anchorDate: getLocalDateKey(),
    anchorTotalPages: 0,
  };
}

function normalizeDailyGoalPreferences(
  input?: Partial<DailyGoalPreferences>
): DailyGoalPreferences {
  const base = createDefaultDailyGoalPreferences();

  const targetPages =
    typeof input?.targetPages === 'number' &&
    Number.isInteger(input.targetPages) &&
    input.targetPages > 0
      ? input.targetPages
      : null;

  const anchorDate =
    typeof input?.anchorDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.anchorDate)
      ? input.anchorDate
      : base.anchorDate;

  const anchorTotalPages =
    typeof input?.anchorTotalPages === 'number' &&
    Number.isFinite(input.anchorTotalPages) &&
    input.anchorTotalPages >= 0
      ? input.anchorTotalPages
      : base.anchorTotalPages;

  return {
    targetPages,
    anchorDate,
    anchorTotalPages,
  };
}

function validateDailyGoalTarget(targetPages: number | null) {
  if (targetPages === null) {
    return;
  }
  if (!Number.isInteger(targetPages) || targetPages <= 0) {
    throw new Error('日次目標は1以上の整数で設定してください');
  }
}

function toRepositoryFilters(filters: FiltersState): BookFilters {
  return {
    categoryId: filters.categoryId,
    status: filters.status === 'all' ? undefined : filters.status,
    searchKeyword: filters.searchKeyword.length > 0 ? filters.searchKeyword : undefined,
  };
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '不明なエラーが発生しました';
}

export function createBookStore({
  repository,
  preferencesStorage,
}: CreateBookStoreOptions): BookStore {
  let state: BookStoreState = cloneState(EMPTY_STATE);
  const subscribers = new Set<() => void>();

  const notify = () => {
    subscribers.forEach((listener) => listener());
  };

  const setState = (
    updater:
      | Partial<BookStoreState>
      | ((previous: BookStoreState) => BookStoreState)
  ) => {
    const nextState =
      typeof updater === 'function'
        ? updater(cloneState(state))
        : { ...cloneState(state), ...updater };
    state = nextState;
    notify();
  };

  let dailyGoalPrefs = createDefaultDailyGoalPreferences();

  const persistDailyGoalPreferences = async () => {
    if (dailyGoalPrefs.targetPages === null) {
      await preferencesStorage.removeItem(DAILY_GOAL_STORAGE_KEY);
      return;
    }
    await preferencesStorage.setItem(DAILY_GOAL_STORAGE_KEY, dailyGoalPrefs);
  };

  const syncDailyGoalWithSummary = async (
    summary: ProgressSummary
  ): Promise<DailyGoalState> => {
    const totalPages = Math.max(summary.totalCompletedPages, 0);
    const today = getLocalDateKey();
    let mutated = false;

    if (dailyGoalPrefs.anchorDate !== today) {
      dailyGoalPrefs = {
        ...dailyGoalPrefs,
        anchorDate: today,
        anchorTotalPages: totalPages,
      };
      mutated = true;
    }

    if (totalPages < dailyGoalPrefs.anchorTotalPages) {
      dailyGoalPrefs = {
        ...dailyGoalPrefs,
        anchorTotalPages: totalPages,
      };
      mutated = true;
    }

    const pagesReadToday = Math.max(
      totalPages - dailyGoalPrefs.anchorTotalPages,
      0
    );

    if (mutated && dailyGoalPrefs.targetPages !== null) {
      await persistDailyGoalPreferences();
    }

    return {
      targetPages: dailyGoalPrefs.targetPages,
      pagesReadToday,
    };
  };

  const fetchData = async (filters: FiltersState) => {
    const listFilters = toRepositoryFilters(filters);
    const [books, summary, categoryStats] = await Promise.all([
      repository.listBooks(listFilters),
      repository.getProgressSummary(),
      repository.getCategoryStats(),
    ]);

    return {
      books,
      summary,
      categoryStats,
    };
  };

  const refreshInternal = async (filters?: FiltersState) => {
    const nextFilters = filters ? { ...filters } : { ...state.filters };
    const data = await fetchData(nextFilters);
    const nextDailyGoal = await syncDailyGoalWithSummary(data.summary);
    setState((previous) => ({
      ...previous,
      filters: { ...nextFilters },
      books: [...data.books],
      summary: { ...data.summary },
      categoryStats: [...data.categoryStats],
      loading: false,
      error: null,
      dailyGoal: { ...nextDailyGoal },
    }));
  };

  const handleFailure = (error: unknown) => {
    const message = toErrorMessage(error);
    setState((previous) => ({
      ...previous,
      loading: false,
      error: message,
    }));
    return message;
  };

  const store: BookStore = {
    getState() {
      return state;
    },
    subscribe(listener) {
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
      };
    },
    async initialize() {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      try {
        const [savedFilters, savedDailyGoal] = await Promise.all([
          preferencesStorage.getItem<FiltersState>(FILTERS_STORAGE_KEY),
          preferencesStorage.getItem<DailyGoalPreferences>(DAILY_GOAL_STORAGE_KEY),
        ]);
        const normalizedFilters = normalizeFilters({
          ...DEFAULT_FILTERS,
          ...savedFilters,
        });
        dailyGoalPrefs = normalizeDailyGoalPreferences(savedDailyGoal ?? undefined);
        const [categories] = await Promise.all([
          repository.getCategories(),
        ]);

        setState((previous) => ({
          ...previous,
          categories: [...categories],
          filters: { ...normalizedFilters },
          dailyGoal: {
            targetPages: dailyGoalPrefs.targetPages,
            pagesReadToday: 0,
          },
        }));

        await refreshInternal(normalizedFilters);
      } catch (error) {
        handleFailure(error);
      }
    },
    async refresh() {
      setState((previous) => ({
        ...previous,
        loading: true,
      }));
      try {
        await refreshInternal();
      } catch (error) {
        handleFailure(error);
      }
    },
    async applyFilters(filters) {
      const normalized = normalizeFilters({ ...state.filters, ...filters });
      setState((previous) => ({
        ...previous,
        filters: { ...normalized },
        loading: true,
        error: null,
      }));
      try {
        await preferencesStorage.setItem(FILTERS_STORAGE_KEY, normalized);
        await refreshInternal(normalized);
        return true;
      } catch (error) {
        handleFailure(error);
        return false;
      }
    },
    async addBook(input) {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));
      try {
        await repository.createBook(input);
        await refreshInternal();
        return true;
      } catch (error) {
        handleFailure(error);
        return false;
      }
    },
    async updateBook(id, payload) {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));
      try {
        await repository.updateBook(id, payload);
        await refreshInternal();
        return true;
      } catch (error) {
        handleFailure(error);
        return false;
      }
    },
    async updateProgress(id, currentPages) {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));
      try {
        await repository.updateProgress(id, currentPages);
        await refreshInternal();
        return true;
      } catch (error) {
        handleFailure(error);
        return false;
      }
    },
    async deleteBook(id) {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));
      try {
        await repository.deleteBook(id);
        await refreshInternal();
        return true;
      } catch (error) {
        handleFailure(error);
        return false;
      }
    },
    clearError() {
      setState((previous) => ({
        ...previous,
        error: null,
      }));
    },
    async setDailyGoal(targetPages: number | null) {
      try {
        validateDailyGoalTarget(targetPages);
      } catch (validationError) {
        const message = toErrorMessage(validationError);
        setState((previous) => ({
          ...previous,
          error: message,
        }));
        return false;
      }

      try {
        const today = getLocalDateKey();
        const totalPages = Math.max(state.summary.totalCompletedPages, 0);

        const baselineTotalPages = dailyGoalPrefs.anchorDate === today
          ? Math.max(totalPages - state.dailyGoal.pagesReadToday, 0)
          : totalPages;

        dailyGoalPrefs = {
          targetPages,
          anchorDate: today,
          anchorTotalPages: baselineTotalPages,
        };

        await persistDailyGoalPreferences();

        const pagesReadToday = Math.max(totalPages - baselineTotalPages, 0);
        setState((previous) => ({
          ...previous,
          error: null,
          dailyGoal: {
            targetPages,
            pagesReadToday,
          },
        }));
        return true;
      } catch (error) {
        handleFailure(error);
        return false;
      }
    },
  };

  return store;
}
