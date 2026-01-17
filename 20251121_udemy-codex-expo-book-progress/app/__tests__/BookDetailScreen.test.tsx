import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import BookDetailScreen from '../book/[id]';
import { BookStoreState } from '../../src/state/bookStore';
import { BookStoreProvider } from '../../src/state/BookStoreProvider';
import { DEFAULT_CATEGORIES } from '../../src/constants/categories';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn(() => ({ id: 'book-1' }));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

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

function createStore(overrides: Partial<BookStoreState> = {}) {
  const listeners = new Set<() => void>();
  let state = createState(overrides);
  const updateProgress = jest.fn(async () => true);
  const deleteBook = jest.fn(async () => true);

  return {
    store: {
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
      updateProgress,
      deleteBook,
      clearError: jest.fn(() => {
        state = { ...state, error: null };
        listeners.forEach((listener) => listener());
      }),
      setDailyGoal: jest.fn(async () => true),
    },
    updateProgress,
    deleteBook,
  };
}

describe('BookDetailScreen', () => {
beforeEach(() => {
  mockPush.mockClear();
  mockBack.mockClear();
  mockUseLocalSearchParams.mockReturnValue({ id: 'book-1' });
});

beforeAll(() => {
  jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    const destructive = buttons?.find((button) => button.style === 'destructive');
    destructive?.onPress?.();
  });
});

  it('書籍の詳細情報を表示する', () => {
    const book = {
      id: 'book-1',
      title: '詳細テスト',
      maxPages: 300,
      currentPages: 150,
      categoryId: 1,
      createdAt: '2025-10-01T00:00:00.000Z',
      updatedAt: '2025-10-02T00:00:00.000Z',
      category: DEFAULT_CATEGORIES[0],
      progress: 0.5,
      remainingPages: 150,
      status: 'reading' as const,
    };
    const { store } = createStore({ books: [book] });

    render(
      <BookStoreProvider value={store}>
        <BookDetailScreen />
      </BookStoreProvider>
    );

    expect(screen.getByText('詳細テスト')).toBeTruthy();
    expect(screen.getByText('カテゴリ: 技術書')).toBeTruthy();
    expect(screen.getByText(/進捗 50%/)).toBeTruthy();
    expect(screen.getByDisplayValue('150')).toBeTruthy();
  });

  it('進捗を更新できる', async () => {
    const book = {
      id: 'book-1',
      title: '詳細テスト',
      maxPages: 300,
      currentPages: 150,
      categoryId: 1,
      createdAt: '2025-10-01T00:00:00.000Z',
      updatedAt: '2025-10-02T00:00:00.000Z',
      category: DEFAULT_CATEGORIES[0],
      progress: 0.5,
      remainingPages: 150,
      status: 'reading' as const,
    };
    const { store, updateProgress } = createStore({ books: [book] });

    render(
      <BookStoreProvider value={store}>
        <BookDetailScreen />
      </BookStoreProvider>
    );

    fireEvent.changeText(screen.getByPlaceholderText('現在ページ数を入力'), '200');
    fireEvent.press(screen.getByRole('button', { name: '進捗を更新' }));

    await waitFor(() =>
      expect(updateProgress).toHaveBeenCalledWith('book-1', 200)
    );
  });

  it('削除ボタンで書籍を削除する', async () => {
    const book = {
      id: 'book-1',
      title: '詳細テスト',
      maxPages: 300,
      currentPages: 150,
      categoryId: 1,
      createdAt: '2025-10-01T00:00:00.000Z',
      updatedAt: '2025-10-02T00:00:00.000Z',
      category: DEFAULT_CATEGORIES[0],
      progress: 0.5,
      remainingPages: 150,
      status: 'reading' as const,
    };
    const { store, deleteBook } = createStore({ books: [book] });

    render(
      <BookStoreProvider value={store}>
        <BookDetailScreen />
      </BookStoreProvider>
    );

    fireEvent.press(screen.getByRole('button', { name: '削除' }));

    await waitFor(() => expect(deleteBook).toHaveBeenCalledWith('book-1'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('編集ボタンでフォームへ遷移する', () => {
    const book = {
      id: 'book-1',
      title: '詳細テスト',
      maxPages: 300,
      currentPages: 150,
      categoryId: 1,
      createdAt: '2025-10-01T00:00:00.000Z',
      updatedAt: '2025-10-02T00:00:00.000Z',
      category: DEFAULT_CATEGORIES[0],
      progress: 0.5,
      remainingPages: 150,
      status: 'reading' as const,
    };
    const { store } = createStore({ books: [book] });

    render(
      <BookStoreProvider value={store}>
        <BookDetailScreen />
      </BookStoreProvider>
    );

    fireEvent.press(screen.getByRole('button', { name: '編集' }));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(modals)/book-form',
      params: { id: 'book-1' },
    });
  });
});
