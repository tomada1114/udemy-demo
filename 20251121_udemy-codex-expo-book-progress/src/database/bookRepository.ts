import { DEFAULT_CATEGORIES } from '../constants/categories';
import {
  BookWithProgress,
  BookStatus,
  Category,
  CategoryStat,
  CreateBookInput,
  ProgressSummary,
  UpdateBookInput,
  BookFilters,
} from '../domain/types';
import { generateUuid } from '../utils/generateUuid';
import { DatabaseAdapter, SqlParams } from './adapter';

type BookRow = {
  id: string;
  title: string;
  max_pages: number;
  current_pages: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  category_name: string;
  category_color: string;
};

const CREATE_CATEGORIES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL
  );
`;

const CREATE_BOOKS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    max_pages INTEGER NOT NULL CHECK(max_pages > 0),
    current_pages INTEGER NOT NULL DEFAULT 0 CHECK(current_pages >= 0),
    category_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`;

export interface BookRepository {
  init(): Promise<void>;
  getCategories(): Promise<Category[]>;
  createBook(input: CreateBookInput): Promise<BookWithProgress>;
  getBookById(id: string): Promise<BookWithProgress | undefined>;
  listBooks(filters?: BookFilters): Promise<BookWithProgress[]>;
  updateBook(id: string, payload: UpdateBookInput): Promise<BookWithProgress>;
  updateProgress(id: string, currentPages: number): Promise<BookWithProgress>;
  deleteBook(id: string): Promise<void>;
  getProgressSummary(): Promise<ProgressSummary>;
  getCategoryStats(): Promise<CategoryStat[]>;
}

function computeStatus(currentPages: number, maxPages: number): BookStatus {
  if (currentPages <= 0) {
    return 'unread';
  }
  if (currentPages >= maxPages) {
    return 'completed';
  }
  return 'reading';
}

function mapRowToBook(row: BookRow): BookWithProgress {
  const progress =
    row.max_pages > 0 ? Number(row.current_pages) / Number(row.max_pages) : 0;

  return {
    id: row.id,
    title: row.title,
    maxPages: row.max_pages,
    currentPages: row.current_pages,
    categoryId: row.category_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: {
      id: row.category_id,
      name: row.category_name,
      color: row.category_color,
    },
    progress: Number(progress),
    remainingPages: Math.max(row.max_pages - row.current_pages, 0),
    status: computeStatus(row.current_pages, row.max_pages),
  };
}

function nextIsoString(previous?: string): string {
  const now = Date.now();
  if (!previous) {
    return new Date(now).toISOString();
  }
  const previousTime = new Date(previous).getTime();
  if (Number.isNaN(previousTime)) {
    return new Date(now).toISOString();
  }
  if (previousTime >= now) {
    return new Date(previousTime + 1).toISOString();
  }
  return new Date(now).toISOString();
}

async function ensureCategoryExists(
  adapter: DatabaseAdapter,
  categoryId: number
) {
  const category = await adapter.get<{ id: number }>(
    'SELECT id FROM categories WHERE id = :categoryId',
    { ':categoryId': categoryId }
  );
  if (!category) {
    throw new Error('指定したカテゴリが存在しません');
  }
}

function validateTitle(title: string) {
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    throw new Error('タイトルは1文字以上100文字以下で入力してください');
  }
}

function validateMaxPages(value: number) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error('最大ページ数は1以上の整数である必要があります');
  }
}

function validateCurrentPages(current: number, max: number) {
  if (!Number.isInteger(current) || current < 0 || current > max) {
    throw new Error(
      '現在ページ数は0から最大ページ数の範囲である必要があります'
    );
  }
}

function buildFilterQuery(filters?: BookFilters) {
  const clauses: string[] = [];
  const params: SqlParams = {};

  if (filters?.categoryId) {
    clauses.push('b.category_id = :categoryId');
    params[':categoryId'] = filters.categoryId;
  }

  const keyword = filters?.searchKeyword?.trim();
  if (keyword) {
    clauses.push('LOWER(b.title) LIKE LOWER(:searchKeyword)');
    params[':searchKeyword'] = `%${keyword}%`;
  }

  if (filters?.status && filters.status !== 'all') {
    switch (filters.status) {
      case 'unread':
        clauses.push('b.current_pages = 0');
        params[':status_unread'] = 1;
        break;
      case 'reading':
        clauses.push(
          'b.current_pages > 0 AND b.current_pages < b.max_pages'
        );
        params[':status_reading'] = 1;
        break;
      case 'completed':
        clauses.push('b.current_pages = b.max_pages');
        params[':status_completed'] = 1;
        break;
      default:
        break;
    }
  }

  const whereClause =
    clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

  return { whereClause, params };
}

export function createBookRepository(adapter: DatabaseAdapter): BookRepository {
  return {
    async init() {
      await adapter.exec(CREATE_CATEGORIES_TABLE_SQL);
      await adapter.exec(CREATE_BOOKS_TABLE_SQL);
      for (const category of DEFAULT_CATEGORIES) {
        await adapter.run(
          `
            INSERT INTO categories (id, name, color)
            SELECT :id, :name, :color
            WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = :id);
          `,
          {
            ':id': category.id,
            ':name': category.name,
            ':color': category.color,
          }
        );
      }
    },

    async getCategories(): Promise<Category[]> {
      const rows = await adapter.all<{
        id: number;
        name: string;
        color: string;
      }>(
        'SELECT id, name, color FROM categories ORDER BY id ASC;'
      );
      return rows.map((row) => ({
        id: Number(row.id),
        name: String(row.name),
        color: String(row.color),
      }));
    },

    async createBook(input: CreateBookInput): Promise<BookWithProgress> {
      validateTitle(input.title);
      validateMaxPages(input.maxPages);
      await ensureCategoryExists(adapter, input.categoryId);

      const id = generateUuid();
      const now = nextIsoString();

      await adapter.run(
        `
          INSERT INTO books (
            id,
            title,
            max_pages,
            current_pages,
            category_id,
            created_at,
            updated_at
          )
          VALUES (
            :id,
            :title,
            :maxPages,
            0,
            :categoryId,
            :createdAt,
            :updatedAt
          );
        `,
        {
          ':id': id,
          ':title': input.title.trim(),
          ':maxPages': input.maxPages,
          ':categoryId': input.categoryId,
          ':createdAt': now,
          ':updatedAt': now,
        }
      );

      const created = await this.getBookById(id);
      if (!created) {
        throw new Error('書籍の作成に失敗しました');
      }
      return created;
    },

    async getBookById(id: string): Promise<BookWithProgress | undefined> {
      const row = await adapter.get<BookRow>(
        `
          SELECT
            b.id,
            b.title,
            b.max_pages,
            b.current_pages,
            b.category_id,
            b.created_at,
            b.updated_at,
            c.name AS category_name,
            c.color AS category_color
          FROM books b
          INNER JOIN categories c ON c.id = b.category_id
          WHERE b.id = :id
          LIMIT 1;
        `,
        { ':id': id }
      );

      if (!row) {
        return undefined;
      }
      return mapRowToBook(row);
    },

    async listBooks(filters?: BookFilters): Promise<BookWithProgress[]> {
      const { whereClause, params } = buildFilterQuery(filters);
      const rows = await adapter.all<BookRow>(
        `
          SELECT
            b.id,
            b.title,
            b.max_pages,
            b.current_pages,
            b.category_id,
            b.created_at,
            b.updated_at,
            c.name AS category_name,
            c.color AS category_color
          FROM books b
          INNER JOIN categories c ON c.id = b.category_id
          ${whereClause}
          ORDER BY b.updated_at DESC;
        `,
        params
      );

      return rows.map(mapRowToBook);
    },

    async updateBook(
      id: string,
      payload: UpdateBookInput
    ): Promise<BookWithProgress> {
      const existing = await adapter.get<{
        id: string;
        title: string;
        maxPages: number;
        currentPages: number;
        categoryId: number;
        createdAt: string;
        updatedAt: string;
      }>(
        `
          SELECT
            id,
            title,
            max_pages AS maxPages,
            current_pages AS currentPages,
            category_id AS categoryId,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM books
          WHERE id = :id
          LIMIT 1;
        `,
        { ':id': id }
      );

      if (!existing) {
        throw new Error('書籍が見つかりません');
      }

      if (payload.title !== undefined) {
        validateTitle(payload.title);
      }
      if (payload.maxPages !== undefined) {
        validateMaxPages(payload.maxPages);
        if (existing.currentPages > payload.maxPages) {
          throw new Error(
            '現在ページ数より小さい最大ページ数には変更できません'
          );
        }
      }
      if (payload.categoryId !== undefined) {
        await ensureCategoryExists(adapter, payload.categoryId);
      }

      const updates: string[] = [];
      const params: SqlParams = { ':id': id };

      if (payload.title !== undefined) {
        updates.push('title = :title');
        params[':title'] = payload.title.trim();
      }
      if (payload.maxPages !== undefined) {
        updates.push('max_pages = :maxPages');
        params[':maxPages'] = payload.maxPages;
      }
      if (payload.categoryId !== undefined) {
        updates.push('category_id = :categoryId');
        params[':categoryId'] = payload.categoryId;
      }

      if (updates.length === 0) {
        return (await this.getBookById(id)) as BookWithProgress;
      }

      const now = nextIsoString(existing.updatedAt);
      updates.push('updated_at = :updatedAt');
      params[':updatedAt'] = now;

      await adapter.run(
        `
          UPDATE books
          SET ${updates.join(', ')}
          WHERE id = :id;
        `,
        params
      );

      const updated = await this.getBookById(id);
      if (!updated) {
        throw new Error('書籍が更新後に取得できませんでした');
      }
      return updated;
    },

    async updateProgress(
      id: string,
      currentPages: number
    ): Promise<BookWithProgress> {
      const book = await adapter.get<{
        max_pages: number;
        current_pages: number;
      }>(
        `
          SELECT max_pages, current_pages
          FROM books
          WHERE id = :id
          LIMIT 1;
        `,
        { ':id': id }
      );

      if (!book) {
        throw new Error('書籍が見つかりません');
      }

      validateCurrentPages(currentPages, book.max_pages);

      const now = nextIsoString();
      await adapter.run(
        `
          UPDATE books
          SET current_pages = :currentPages,
              updated_at = :updatedAt
          WHERE id = :id;
        `,
        { ':currentPages': currentPages, ':updatedAt': now, ':id': id }
      );

      const updated = await this.getBookById(id);
      if (!updated) {
        throw new Error('書籍の進捗を更新できませんでした');
      }
      return updated;
    },

    async deleteBook(id: string): Promise<void> {
      await adapter.run('DELETE FROM books WHERE id = :id;', { ':id': id });
    },

    async getProgressSummary(): Promise<ProgressSummary> {
      const row = await adapter.get<{
        total: number;
        unread: number;
        reading: number;
        completed: number;
        total_pages: number;
      }>(
        `
          SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN current_pages = 0 THEN 1 ELSE 0 END) AS unread,
            SUM(
              CASE
                WHEN current_pages > 0 AND current_pages < max_pages THEN 1
                ELSE 0
              END
            ) AS reading,
            SUM(CASE WHEN current_pages = max_pages THEN 1 ELSE 0 END) AS completed,
            SUM(current_pages) AS total_pages
          FROM books;
        `
      );

      return {
        totalBooks: Number(row?.total ?? 0),
        unreadBooks: Number(row?.unread ?? 0),
        readingBooks: Number(row?.reading ?? 0),
        completedBooks: Number(row?.completed ?? 0),
        totalCompletedPages: Number(row?.total_pages ?? 0),
      };
    },

    async getCategoryStats(): Promise<CategoryStat[]> {
      const rows = await adapter.all<{
        category_id: number;
        category_name: string;
        book_count: number;
        completed_books: number;
      }>(`
        SELECT
          c.id AS category_id,
          c.name AS category_name,
          COUNT(b.id) AS book_count,
          SUM(
            CASE
              WHEN b.current_pages = b.max_pages AND b.max_pages > 0 THEN 1
              ELSE 0
            END
          ) AS completed_books
        FROM categories c
        LEFT JOIN books b ON b.category_id = c.id
        GROUP BY c.id, c.name
        ORDER BY c.id ASC;
      `);

      return rows.map((row) => ({
        categoryId: Number(row.category_id),
        categoryName: String(row.category_name),
        bookCount: Number(row.book_count ?? 0),
        completedBooks: Number(row.completed_books ?? 0),
      }));
    },
  };
}
