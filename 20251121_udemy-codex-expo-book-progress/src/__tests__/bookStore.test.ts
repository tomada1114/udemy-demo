import { DEFAULT_CATEGORIES } from '../constants/categories';
import { createBookRepository } from '../database/bookRepository';
import { createSqlJsAdapter } from '../database/sqljsAdapter';
import { BookFilters, BookWithProgress } from '../domain/types';
import { createBookStore, BookStore } from '../state/bookStore';
import { PreferencesStorage } from '../storage/preferencesStorage';

class InMemoryPreferencesStorage implements PreferencesStorage {
  private map = new Map<string, string>();

  async getItem<T>(key: string): Promise<T | null> {
    if (!this.map.has(key)) {
      return null;
    }
    return JSON.parse(this.map.get(key) ?? 'null') as T;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.map.set(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    this.map.delete(key);
  }
}

async function setup(options: { seed?: (store: BookStore) => Promise<void> } = {}) {
  const adapter = await createSqlJsAdapter();
  const repository = createBookRepository(adapter);
  await repository.init();
  const storage = new InMemoryPreferencesStorage();
  const store = createBookStore({
    repository,
    preferencesStorage: storage,
  });

  await store.initialize();
  if (options.seed) {
    await options.seed(store);
  }

  return { store, repository, storage };
}

function expectBookTitles(books: BookWithProgress[]): string[] {
  return books.map((book) => book.title).sort();
}

describe('createBookStore', () => {
  it('初期化時にカテゴリと統計・書籍一覧を読み込む', async () => {
    const { store } = await setup();
    const state = store.getState();

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.categories.map((c) => c.name)).toEqual(
      DEFAULT_CATEGORIES.map((c) => c.name)
    );
    expect(state.summary.totalBooks).toBe(0);
    expect(state.books).toHaveLength(0);
  });

  it('保存済みフィルターを復元して一覧を読み込む', async () => {
    const adapter = await createSqlJsAdapter();
    const repository = createBookRepository(adapter);
    await repository.init();
    const storage = new InMemoryPreferencesStorage();
    const filters: BookFilters = {
      status: 'reading',
      categoryId: 2,
      searchKeyword: '物語',
    };
    await storage.setItem('book-progress/filters', filters);

    const store = createBookStore({ repository, preferencesStorage: storage });
    await store.initialize();

    expect(store.getState().filters).toEqual({
      status: 'reading',
      categoryId: 2,
      searchKeyword: '物語',
    });
  });

  it('書籍を追加すると一覧と統計が更新される', async () => {
    const { store } = await setup();

    const success = await store.addBook({
      title: 'テスト駆動開発',
      maxPages: 300,
      categoryId: 1,
    });

    const state = store.getState();
    expect(success).toBe(true);
    expect(state.books).toHaveLength(1);
    expect(state.summary.totalBooks).toBe(1);
    expect(state.summary.unreadBooks).toBe(1);
  });

  it('フィルター適用時に永続化され、対象の書籍のみが表示される', async () => {
    const { store, storage } = await setup({
      seed: async (seedStore) => {
        await seedStore.addBook({
          title: 'SwiftUI徹底解説',
          maxPages: 450,
          categoryId: 1,
        });
        const completedResult = await seedStore.addBook({
          title: '物語の終わり',
          maxPages: 250,
          categoryId: 2,
        });
        const book = seedStore
          .getState()
          .books.find((b) => b.title === '物語の終わり');
        if (completedResult && book) {
          await seedStore.updateProgress(book.id, 250);
        }
      },
    });

    await store.applyFilters({
      status: 'completed',
      categoryId: 2,
      searchKeyword: '物語',
    });

    const state = store.getState();
    expect(expectBookTitles(state.books)).toEqual(['物語の終わり']);
    const persisted = await storage.getItem<BookFilters>(
      'book-progress/filters'
    );
    expect(persisted).toEqual({
      status: 'completed',
      categoryId: 2,
      searchKeyword: '物語',
    });
  });

  it('進捗更新で状態と統計が更新される', async () => {
    const { store } = await setup();
    await store.addBook({
      title: 'リファクタリング',
      maxPages: 400,
      categoryId: 4,
    });
    const target = store
      .getState()
      .books.find((book) => book.title === 'リファクタリング');
    expect(target).toBeTruthy();

    const updated = await store.updateProgress(target!.id, 400);
    const state = store.getState();

    expect(updated).toBe(true);
    expect(expectBookTitles(state.books)).toEqual(['リファクタリング']);
    expect(state.books[0].status).toBe('completed');
    expect(state.summary.completedBooks).toBe(1);
    expect(state.summary.totalCompletedPages).toBe(400);
  });

  it('書籍の編集内容が反映される', async () => {
    const { store } = await setup();
    await store.addBook({
      title: '初期タイトル',
      maxPages: 200,
      categoryId: 3,
    });
    const original = store
      .getState()
      .books.find((book) => book.title === '初期タイトル');
    expect(original).toBeTruthy();

    const success = await store.updateBook(original!.id, {
      title: '更新後タイトル',
      maxPages: 220,
      categoryId: 4,
    });

    const state = store.getState();
    expect(success).toBe(true);
    expect(expectBookTitles(state.books)).toEqual(['更新後タイトル']);
    expect(state.books[0].maxPages).toBe(220);
    expect(state.books[0].categoryId).toBe(4);
  });

  it('書籍削除で一覧と統計が更新される', async () => {
    const { store } = await setup();
    await store.addBook({
      title: '削除対象',
      maxPages: 120,
      categoryId: 5,
    });
    const target = store
      .getState()
      .books.find((book) => book.title === '削除対象');
    expect(target).toBeTruthy();

    const success = await store.deleteBook(target!.id);
    const state = store.getState();

    expect(success).toBe(true);
    expect(state.books).toHaveLength(0);
    expect(state.summary.totalBooks).toBe(0);
  });

  it('エラー発生時にはstate.errorにメッセージが設定される', async () => {
    const { store } = await setup();
    await store.addBook({
      title: 'エラーテスト',
      maxPages: 100,
      categoryId: 1,
    });
    const target = store
      .getState()
      .books.find((book) => book.title === 'エラーテスト');
    expect(target).toBeTruthy();

    const success = await store.updateProgress(target!.id, 120);

    expect(success).toBe(false);
    expect(store.getState().error).toContain('現在ページ数は0から最大ページ数の範囲である必要があります');
    store.clearError();
    expect(store.getState().error).toBeNull();
  });

  describe('日次目標', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('目標を設定して永続化できる', async () => {
      jest.setSystemTime(new Date('2025-10-10T09:00:00Z'));
      const { store, storage } = await setup();

      const success = await store.setDailyGoal(60);

      expect(success).toBe(true);
      expect(store.getState().dailyGoal).toEqual({
        targetPages: 60,
        pagesReadToday: 0,
      });
      const persisted = await storage.getItem<{
        targetPages: number | null;
        anchorDate: string;
        anchorTotalPages: number;
      }>('book-progress/daily-goal');
      expect(persisted).toEqual({
        targetPages: 60,
        anchorDate: '2025-10-10',
        anchorTotalPages: 0,
      });
    });

    it('進捗更新で日次達成状況が更新される', async () => {
      jest.setSystemTime(new Date('2025-10-10T09:00:00Z'));
      const { store } = await setup();

      await store.addBook({
        title: 'テストブック',
        maxPages: 200,
        categoryId: 1,
      });
      const book = store.getState().books[0];
      expect(book).toBeDefined();

      await store.setDailyGoal(80);
      const updated = await store.updateProgress(book!.id, 30);

      expect(updated).toBe(true);
      expect(store.getState().dailyGoal).toEqual({
        targetPages: 80,
        pagesReadToday: 30,
      });
    });

    it('目標設定前に読了したページもカウントする', async () => {
      jest.setSystemTime(new Date('2025-10-10T09:00:00Z'));
      const { store, storage } = await setup();

      await store.addBook({
        title: '遅れて設定',
        maxPages: 200,
        categoryId: 1,
      });
      const book = store.getState().books[0];
      expect(book).toBeDefined();

      await store.updateProgress(book!.id, 40);
      expect(store.getState().dailyGoal.pagesReadToday).toBe(40);

      const success = await store.setDailyGoal(100);

      expect(success).toBe(true);
      expect(store.getState().dailyGoal).toEqual({
        targetPages: 100,
        pagesReadToday: 40,
      });
      const persisted = await storage.getItem<{
        targetPages: number | null;
        anchorDate: string;
        anchorTotalPages: number;
      }>('book-progress/daily-goal');
      expect(persisted).toEqual({
        targetPages: 100,
        anchorDate: '2025-10-10',
        anchorTotalPages: 0,
      });
    });

    it('日付が変わると日次進捗がリセットされる', async () => {
      jest.setSystemTime(new Date('2025-10-10T09:00:00Z'));
      const { store } = await setup();

      await store.addBook({
        title: 'タイムトラベル',
        maxPages: 300,
        categoryId: 2,
      });
      const book = store.getState().books[0];
      expect(book).toBeDefined();

      await store.setDailyGoal(120);
      await store.updateProgress(book!.id, 60);
      expect(store.getState().dailyGoal.pagesReadToday).toBe(60);

      jest.setSystemTime(new Date('2025-10-11T08:15:00Z'));
      await store.refresh();
      expect(store.getState().dailyGoal.pagesReadToday).toBe(0);

      await store.updateProgress(book!.id, 90);
      expect(store.getState().dailyGoal.pagesReadToday).toBe(30);
    });
  });
});
