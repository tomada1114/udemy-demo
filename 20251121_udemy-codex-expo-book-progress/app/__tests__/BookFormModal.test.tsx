import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import BookFormModal from '../(modals)/book-form';
import { BookStore, BookStoreState } from '../../src/state/bookStore';
import { BookStoreProvider } from '../../src/state/BookStoreProvider';
import { DEFAULT_CATEGORIES } from '../../src/constants/categories';

const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn(() => ({}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
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

function createStore(overrides: Partial<BookStoreState> = {}): {
  store: BookStore;
  addBook: jest.Mock;
  updateBook: jest.Mock;
} {
  const listeners = new Set<() => void>();
  let state = createState(overrides);
  const addBook = jest.fn(async () => true);
  const updateBook = jest.fn(async () => true);

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
      addBook,
      updateBook,
      updateProgress: jest.fn(async () => true),
      deleteBook: jest.fn(async () => true),
      clearError: jest.fn(() => {
        state = { ...state, error: null };
        listeners.forEach((listener) => listener());
      }),
      setDailyGoal: jest.fn(async () => true),
    },
    addBook,
    updateBook,
  };
}

describe('BookFormModal', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockUseLocalSearchParams.mockReturnValue({});
  });

  it('新規作成フォームで入力内容を保存する', async () => {
    const { store, addBook } = createStore();

    render(
      <BookStoreProvider value={store}>
        <BookFormModal />
      </BookStoreProvider>
    );

    fireEvent.changeText(screen.getByPlaceholderText('タイトルを入力'), 'Clean Architecture');
    fireEvent.changeText(screen.getByPlaceholderText('最大ページ数'), '350');
    fireEvent.press(screen.getByRole('button', { name: '技術書' }));

    fireEvent.press(screen.getByRole('button', { name: '保存' }));

    await waitFor(() =>
      expect(addBook).toHaveBeenCalledWith({
        title: 'Clean Architecture',
        maxPages: 350,
        categoryId: 1,
      })
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('必須項目が入力されていない場合エラーメッセージを表示する', async () => {
    const { store, addBook } = createStore();

    render(
      <BookStoreProvider value={store}>
        <BookFormModal />
      </BookStoreProvider>
    );

    fireEvent.press(screen.getByRole('button', { name: '保存' }));

    expect(await screen.findByText('タイトルを入力してください')).toBeTruthy();
    expect(addBook).not.toHaveBeenCalled();
  });

  it('編集モードで既存情報を更新する', async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'book-1' });
    const existingBook = {
      id: 'book-1',
      title: '旧タイトル',
      maxPages: 200,
      currentPages: 50,
      categoryId: 2,
      createdAt: '2025-10-01T00:00:00.000Z',
      updatedAt: '2025-10-02T00:00:00.000Z',
      category: DEFAULT_CATEGORIES[1],
      progress: 0.25,
      remainingPages: 150,
      status: 'reading' as const,
    };

    const { store, updateBook } = createStore({
      books: [existingBook],
    });

    render(
      <BookStoreProvider value={store}>
        <BookFormModal />
      </BookStoreProvider>
    );

    expect(screen.getByDisplayValue('旧タイトル')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('タイトルを入力'), '新タイトル');
    fireEvent.changeText(screen.getByPlaceholderText('最大ページ数'), '220');
    fireEvent.press(screen.getByRole('button', { name: '小説' }));
    fireEvent.press(screen.getByRole('button', { name: '保存' }));

    await waitFor(() =>
      expect(updateBook).toHaveBeenCalledWith('book-1', {
        title: '新タイトル',
        maxPages: 220,
        categoryId: 2,
      })
    );
    expect(mockBack).toHaveBeenCalled();
  });
});
