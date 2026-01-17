import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '../(tabs)/index';
import { BookStore, BookStoreState } from '../../src/state/bookStore';
import { BookStoreProvider } from '../../src/state/BookStoreProvider';
import { DEFAULT_CATEGORIES } from '../../src/constants/categories';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

function createBaseState(): BookStoreState {
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
  };
}

function createMockBookStore(initialState: Partial<BookStoreState> = {}): BookStore {
  let state: BookStoreState = { ...createBaseState(), ...initialState };
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const mockStore: BookStore = {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    initialize: jest.fn(async () => undefined),
    refresh: jest.fn(async () => undefined),
    applyFilters: jest.fn(async (filters) => {
      state = {
        ...state,
        filters: {
          ...state.filters,
          ...filters,
        },
      };
      notify();
      return true;
    }),
    addBook: jest.fn(async () => true),
    updateBook: jest.fn(async () => true),
    updateProgress: jest.fn(async () => true),
    deleteBook: jest.fn(async () => true),
    clearError: jest.fn(() => {
      state = { ...state, error: null };
      notify();
    }),
    setDailyGoal: jest.fn(async () => true),
  };

  return mockStore;
}

function renderWithStore(store: BookStore) {
  return render(
    <BookStoreProvider value={store}>
      <HomeScreen />
    </BookStoreProvider>
  );
}

describe('HomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('初期表示で空状態メッセージと追加ボタンを表示する', async () => {
    const store = createMockBookStore();

    renderWithStore(store);
    await waitFor(() => expect(store.initialize).toHaveBeenCalled());
    expect(
      screen.getByText('書籍がまだ登録されていません')
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: '書籍を追加' })).toBeTruthy();

    const statusChip = screen.getByRole('button', { name: 'すべて' });
    const resolvedStatusStyles = typeof statusChip.props.style === 'function'
      ? statusChip.props.style({ pressed: false })
      : statusChip.props.style;
    const statusStylesArray = Array.isArray(resolvedStatusStyles)
      ? resolvedStatusStyles
      : [resolvedStatusStyles];
    expect(statusStylesArray).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ alignSelf: 'flex-start' }),
      ])
    );

    const categoryChip = screen.getByRole('button', { name: '全カテゴリ' });
    const resolvedCategoryStyles = typeof categoryChip.props.style === 'function'
      ? categoryChip.props.style({ pressed: false })
      : categoryChip.props.style;
    const categoryStylesArray = Array.isArray(resolvedCategoryStyles)
      ? resolvedCategoryStyles
      : [resolvedCategoryStyles];
    expect(categoryStylesArray).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ alignSelf: 'flex-start' }),
      ])
    );
  });

  it('書籍が存在する場合カードとして詳細を表示する', async () => {
    const store = createMockBookStore({
      books: [
        {
          id: 'book-1',
          title: 'テスト駆動開発',
          maxPages: 300,
          currentPages: 150,
          categoryId: 1,
          createdAt: '2025-10-01T00:00:00.000Z',
          updatedAt: '2025-10-02T00:00:00.000Z',
          category: DEFAULT_CATEGORIES[0],
          progress: 0.5,
          remainingPages: 150,
          status: 'reading',
        },
      ],
      summary: {
        totalBooks: 1,
        unreadBooks: 0,
        readingBooks: 1,
        completedBooks: 0,
        totalCompletedPages: 0,
      },
    });

    renderWithStore(store);

    expect(screen.queryByText('書籍がまだ登録されていません')).toBeNull();
    expect(screen.getByText('テスト駆動開発')).toBeTruthy();
    expect(screen.getByText('150 / 300ページ')).toBeTruthy();
    expect(screen.getByText('進捗 50%')).toBeTruthy();
  });

  it('ステータスタブを押すとフィルターが適用される', async () => {
    const store = createMockBookStore();

    renderWithStore(store);

    const readingTab = await screen.findByRole('button', { name: '読書中' });
    fireEvent.press(readingTab);

    expect(store.applyFilters).toHaveBeenCalledWith({
      status: 'reading',
    });
  });

  it('カードを押下すると詳細画面へ遷移する', async () => {
    const store = createMockBookStore({
      books: [
        {
          id: 'book-2',
          title: 'リファクタリング',
          maxPages: 400,
          currentPages: 400,
          categoryId: 4,
          createdAt: '2025-10-03T00:00:00.000Z',
          updatedAt: '2025-10-04T00:00:00.000Z',
          category: DEFAULT_CATEGORIES[3],
          progress: 1,
          remainingPages: 0,
          status: 'completed',
        },
      ],
      summary: {
        totalBooks: 1,
        unreadBooks: 0,
        readingBooks: 0,
        completedBooks: 1,
        totalCompletedPages: 400,
      },
    });

    renderWithStore(store);

    fireEvent.press(screen.getByText('リファクタリング'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/book/[id]',
      params: { id: 'book-2' },
    });
  });

  it('追加ボタンでモーダルへ遷移する', async () => {
    const store = createMockBookStore();

    renderWithStore(store);

    fireEvent.press(screen.getByRole('button', { name: '書籍を追加' }));
    expect(mockPush).toHaveBeenCalledWith('/(modals)/book-form');
  });
});
