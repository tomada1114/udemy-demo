import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import SettingsScreen from '../(tabs)/settings';
import { BookStore, BookStoreState } from '../../src/state/bookStore';
import { BookStoreProvider } from '../../src/state/BookStoreProvider';
import { DEFAULT_CATEGORIES } from '../../src/constants/categories';

function createState(overrides: Partial<BookStoreState> = {}): BookStoreState {
  return {
    loading: false,
    error: null,
    categories: [...DEFAULT_CATEGORIES],
    books: [],
    summary: {
      totalBooks: 0,
      unreadBooks: 0,
      readingBooks: 0,
      completedBooks: 0,
      totalCompletedPages: 0,
    },
    categoryStats: [],
    filters: {
      status: 'all',
      categoryId: undefined,
      searchKeyword: '',
    },
    dailyGoal: {
      targetPages: null,
      pagesReadToday: 0,
    },
    ...overrides,
  };
}

function createStore(initialState: Partial<BookStoreState> = {}) {
  const listeners = new Set<() => void>();
  let state = createState(initialState);

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setDailyGoal = jest.fn(async (target: number | null) => {
    state = {
      ...state,
      error: null,
      dailyGoal: {
        targetPages: target,
        pagesReadToday: 0,
      },
    };
    notify();
    return true;
  });

  const store: BookStore = {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    initialize: jest.fn(async () => undefined),
    refresh: jest.fn(async () => undefined),
    applyFilters: jest.fn(async () => true),
    addBook: jest.fn(async () => true),
    updateBook: jest.fn(async () => true),
    updateProgress: jest.fn(async () => true),
    deleteBook: jest.fn(async () => true),
    clearError: jest.fn(() => {
      state = { ...state, error: null };
      notify();
    }),
    setDailyGoal,
  };

  return { store, setDailyGoal, updateState: (next: Partial<BookStoreState>) => {
    state = { ...state, ...next };
    notify();
  } };
}

function renderWithStore(store: BookStore) {
  return render(
    <BookStoreProvider value={store}>
      <SettingsScreen />
    </BookStoreProvider>
  );
}

describe('SettingsScreen', () => {
  it('現在の目標を表示する', () => {
    const { store } = createStore({
      dailyGoal: {
        targetPages: 80,
        pagesReadToday: 20,
      },
    });

    renderWithStore(store);

    expect(screen.getByText('現在の目標: 80 ページ')).toBeTruthy();
  });

  it('目標を入力して保存できる', async () => {
    const { store, setDailyGoal } = createStore();

    renderWithStore(store);

    fireEvent.changeText(screen.getByPlaceholderText('例: 60'), '90');
    fireEvent.press(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => expect(setDailyGoal).toHaveBeenCalledWith(90));
    expect(screen.getByText('日次目標を更新しました')).toBeTruthy();
  });

  it('未入力で保存するとバリデーションを表示する', async () => {
    const { store, setDailyGoal } = createStore();

    renderWithStore(store);

    fireEvent.press(screen.getByRole('button', { name: '保存' }));

    expect(await screen.findByText('日次目標は1以上の整数で入力してください')).toBeTruthy();
    expect(setDailyGoal).not.toHaveBeenCalled();
  });

  it('リセットボタンで目標を解除する', async () => {
    const { store, setDailyGoal } = createStore({
      dailyGoal: {
        targetPages: 60,
        pagesReadToday: 0,
      },
    });

    renderWithStore(store);

    fireEvent.press(screen.getByRole('button', { name: 'リセット' }));

    await waitFor(() => expect(setDailyGoal).toHaveBeenCalledWith(null));
    expect(screen.getByText('日次目標をリセットしました')).toBeTruthy();
  });
});
