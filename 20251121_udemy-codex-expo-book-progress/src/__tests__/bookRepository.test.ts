import { DEFAULT_CATEGORIES } from '../constants/categories';
import { createBookRepository } from '../database/bookRepository';
import { createSqlJsAdapter } from '../database/sqljsAdapter';
import {
  BookFilters,
  CategoryStat,
  CreateBookInput,
  ProgressSummary,
  UpdateBookInput,
} from '../domain/types';

describe('BookRepository (SQL.js adapter)', () => {
  async function setup() {
    const adapter = await createSqlJsAdapter();
    const repository = createBookRepository(adapter);
    await repository.init();
    return { repository };
  }

  it('初期化時にデフォルトカテゴリが投入される', async () => {
    const { repository } = await setup();

    const categories = await repository.getCategories();

    expect(categories).toHaveLength(DEFAULT_CATEGORIES.length);
    expect(categories.map((c) => c.name).sort()).toEqual(
      DEFAULT_CATEGORIES.map((c) => c.name).sort()
    );
  });

  it('書籍を作成し取得できる', async () => {
    const { repository } = await setup();
    const bookInput: CreateBookInput = {
      title: 'エンジニアの道具箱',
      maxPages: 320,
      categoryId: 1,
    };

    const created = await repository.createBook(bookInput);
    const fetched = await repository.getBookById(created.id);

    expect(created.currentPages).toBe(0);
    expect(created.progress).toBe(0);
    expect(fetched?.title).toBe(bookInput.title);
    expect(fetched?.category.name).toBe('技術書');
    expect(new Date(created.createdAt).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
  });

  it('現在ページ数の更新で進捗が計算される', async () => {
    const { repository } = await setup();
    const created = await repository.createBook({
      title: 'アルゴリズム図鑑',
      maxPages: 200,
      categoryId: 2,
    });

    const updated = await repository.updateProgress(created.id, 50);

    expect(updated.currentPages).toBe(50);
    expect(updated.progress).toBeCloseTo(0.25);
    expect(updated.remainingPages).toBe(150);
    expect(updated.status).toBe('reading');
  });

  it('フィルタと検索が期待通りに機能する', async () => {
    const { repository } = await setup();
    await repository.createBook({
      title: 'SwiftUI実践',
      maxPages: 400,
      categoryId: 1,
    });
    const inProgress = await repository.createBook({
      title: '物語の終わり',
      maxPages: 300,
      categoryId: 2,
    });
    await repository.updateProgress(inProgress.id, 150);
    const completed = await repository.createBook({
      title: '経営戦略大全',
      maxPages: 500,
      categoryId: 4,
    });
    await repository.updateProgress(completed.id, 500);

    const filters: BookFilters = {
      status: 'reading',
      categoryId: 2,
      searchKeyword: '物語',
    };
    const filtered = await repository.listBooks(filters);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('物語の終わり');
    expect(filtered[0].status).toBe('reading');
  });

  it('書籍情報の更新が反映される', async () => {
    const { repository } = await setup();
    const book = await repository.createBook({
      title: '初期タイトル',
      maxPages: 100,
      categoryId: 3,
    });
    const payload: UpdateBookInput = {
      title: '更新後タイトル',
      maxPages: 120,
      categoryId: 4,
    };

    const updated = await repository.updateBook(book.id, payload);

    expect(updated.title).toBe(payload.title);
    expect(updated.maxPages).toBe(payload.maxPages);
    expect(updated.categoryId).toBe(payload.categoryId);
    expect(updated.updatedAt).not.toBe(book.updatedAt);
  });

  it('統計情報が正しく集計される', async () => {
    const { repository } = await setup();
    await repository.createBook({
      title: '未読の本',
      maxPages: 150,
      categoryId: 1,
    });
    const second = await repository.createBook({
      title: '読書中の本',
      maxPages: 200,
      categoryId: 2,
    });
    await repository.updateProgress(second.id, 50);
    const third = await repository.createBook({
      title: '読了した本',
      maxPages: 180,
      categoryId: 3,
    });
    await repository.updateProgress(third.id, 180);

    const summary: ProgressSummary = await repository.getProgressSummary();
    const categoryStats: CategoryStat[] = await repository.getCategoryStats();

    expect(summary.totalBooks).toBe(3);
    expect(summary.readingBooks).toBe(1);
    expect(summary.completedBooks).toBe(1);
    expect(summary.totalCompletedPages).toBe(230);
    expect(categoryStats.find((c) => c.categoryId === 3)?.completedBooks).toBe(
      1
    );
  });

  it('削除した書籍は一覧に含まれない', async () => {
    const { repository } = await setup();
    const book = await repository.createBook({
      title: '削除される本',
      maxPages: 90,
      categoryId: 5,
    });

    await repository.deleteBook(book.id);
    const books = await repository.listBooks();

    expect(books).toHaveLength(0);
  });

  it('バリデーション違反の場合はエラーを投げる', async () => {
    const { repository } = await setup();

    await expect(
      repository.createBook({
        title: '',
        maxPages: 0,
        categoryId: 1,
      })
    ).rejects.toThrow('タイトルは1文字以上100文字以下で入力してください');

    const created = await repository.createBook({
      title: '検証用',
      maxPages: 150,
      categoryId: 1,
    });

    await expect(repository.updateProgress(created.id, 160)).rejects.toThrow(
      '現在ページ数は0から最大ページ数の範囲である必要があります'
    );
  });
});
