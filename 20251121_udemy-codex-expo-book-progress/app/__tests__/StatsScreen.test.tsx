import { render, screen } from '@testing-library/react-native';

import StatsScreen from '../(tabs)/stats';
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
      totalBooks: 3,
      unreadBooks: 1,
      readingBooks: 1,
      completedBooks: 1,
      totalCompletedPages: 450,
    },
    categoryStats: DEFAULT_CATEGORIES.map((category, index) => ({
      categoryId: category.id,
      categoryName: category.name,
      bookCount: index + 1,
      completedBooks: index % 2,
    })),
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

function createStore(stateOverrides: Partial<BookStoreState> = {}): BookStore {
  const listeners = new Set<() => void>();
  let state = createState(stateOverrides);

  return {
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
      listeners.forEach((listener) => listener());
    }),
    setDailyGoal: jest.fn(async () => true),
  };
}

describe('StatsScreen', () => {
  it('全体統計を表示する', () => {
    const store = createStore();
    render(
      <BookStoreProvider value={store}>
        <StatsScreen />
      </BookStoreProvider>
    );

    expect(screen.getByText('登録冊数')).toBeTruthy();
    expect(screen.getAllByText('3 冊').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('読了ページ数')).toBeTruthy();
    expect(screen.getByText('450 ページ')).toBeTruthy();
  });

  it('カテゴリ別統計を表示する', () => {
    const store = createStore();
    render(
      <BookStoreProvider value={store}>
        <StatsScreen />
      </BookStoreProvider>
    );

    expect(screen.getByText('カテゴリ別統計')).toBeTruthy();
    expect(screen.getByText('技術書')).toBeTruthy();
    expect(screen.getByText('小説')).toBeTruthy();
  });

  it('日次目標が未設定の場合にガイダンスを表示する', () => {
    const store = createStore({
      dailyGoal: {
        targetPages: null,
        pagesReadToday: 0,
      },
    });

    render(
      <BookStoreProvider value={store}>
        <StatsScreen />
      </BookStoreProvider>
    );

    expect(screen.getByText('日次目標')).toBeTruthy();
    expect(
      screen.getByText('日次目標がまだ設定されていません。設定タブから目標を登録しましょう。')
    ).toBeTruthy();
  });

  it('日次目標の進捗を表示する', () => {
    const store = createStore({
      dailyGoal: {
        targetPages: 80,
        pagesReadToday: 60,
      },
    });

    render(
      <BookStoreProvider value={store}>
        <StatsScreen />
      </BookStoreProvider>
    );

    expect(screen.getByText('日次目標')).toBeTruthy();
    expect(screen.getByText('目標')).toBeTruthy();
    expect(screen.getByText('80 ページ')).toBeTruthy();
    expect(screen.getByText('今日')).toBeTruthy();
    expect(screen.getByText('60 ページ')).toBeTruthy();
    expect(screen.getByText('達成率')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
    expect(screen.getByText('達成まで残り 20 ページです。')).toBeTruthy();
  });
});
