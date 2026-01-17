import { DEFAULT_CATEGORIES } from '../constants/categories';
import { BookStatus, Category } from '../domain/types';
import { DatabaseAdapter, SqlParams } from './adapter';

type InternalBook = {
  id: string;
  title: string;
  max_pages: number;
  current_pages: number;
  category_id: number;
  created_at: string;
  updated_at: string;
};

function computeStatus(current: number, max: number): BookStatus {
  if (current <= 0) {
    return 'unread';
  }
  if (current >= max) {
    return 'completed';
  }
  return 'reading';
}

class InMemoryAdapter implements DatabaseAdapter {
  private categories = new Map<number, Category>(
    DEFAULT_CATEGORIES.map((category) => [category.id, { ...category }])
  );

  private books = new Map<string, InternalBook>();

  async exec(sql: string): Promise<void> {
    // CREATE TABLE statements are no-ops for the in-memory adapter.
    if (sql.trim().toUpperCase().startsWith('CREATE TABLE')) {
      return;
    }
    // Other exec statements are not expected in tests.
  }

  async run(sql: string, params: SqlParams = {}): Promise<void> {
    const normalized = sql.replace(/\s+/g, ' ').trim().toUpperCase();

    if (normalized.startsWith('INSERT INTO CATEGORIES')) {
      const id = Number(params[':id']);
      if (!this.categories.has(id)) {
        this.categories.set(id, {
          id,
          name: String(params[':name']),
          color: String(params[':color']),
        });
      }
      return;
    }

    if (normalized.startsWith('INSERT INTO BOOKS')) {
      const id = String(params[':id']);
      this.books.set(id, {
        id,
        title: String(params[':title']),
        max_pages: Number(params[':maxPages']),
        current_pages: 0,
        category_id: Number(params[':categoryId']),
        created_at: String(params[':createdAt']),
        updated_at: String(params[':updatedAt']),
      });
      return;
    }

    if (normalized.startsWith('UPDATE BOOKS')) {
      const id = String(params[':id']);
      const existing = this.books.get(id);
      if (!existing) {
        return;
      }
      if (params[':title'] !== undefined) {
        existing.title = String(params[':title']);
      }
      if (params[':maxPages'] !== undefined) {
        existing.max_pages = Number(params[':maxPages']);
        if (existing.current_pages > existing.max_pages) {
          existing.current_pages = existing.max_pages;
        }
      }
      if (params[':categoryId'] !== undefined) {
        existing.category_id = Number(params[':categoryId']);
      }
      if (params[':currentPages'] !== undefined) {
        existing.current_pages = Number(params[':currentPages']);
      }
      if (params[':updatedAt'] !== undefined) {
        existing.updated_at = String(params[':updatedAt']);
      }
      return;
    }

    if (normalized.startsWith('DELETE FROM BOOKS')) {
      const id = String(params[':id']);
      this.books.delete(id);
      return;
    }
  }

  async get<T extends object>(
    sql: string,
    params: SqlParams = {}
  ): Promise<T | undefined> {
    const normalized = sql.replace(/\s+/g, ' ').trim().toUpperCase();

    if (normalized.startsWith('SELECT ID FROM CATEGORIES')) {
      const id = Number(params[':categoryId']);
      const category = this.categories.get(id);
      if (!category) {
        return undefined;
      }
      return { id: category.id } as unknown as T;
    }

    if (
      normalized.startsWith('SELECT B.ID') &&
      normalized.includes('FROM BOOKS') &&
      normalized.includes('WHERE B.ID = :ID')
    ) {
      const id = String(params[':id']);
      const book = this.books.get(id);
      if (!book) {
        return undefined;
      }
      const category = this.categories.get(book.category_id);
      if (!category) {
        return undefined;
      }
      return {
        id: book.id,
        title: book.title,
        max_pages: book.max_pages,
        current_pages: book.current_pages,
        category_id: book.category_id,
        created_at: book.created_at,
        updated_at: book.updated_at,
        category_name: category.name,
        category_color: category.color,
      } as unknown as T;
    }

    if (normalized.startsWith('SELECT MAX_PAGES, CURRENT_PAGES FROM BOOKS')) {
      const id = String(params[':id']);
      const book = this.books.get(id);
      if (!book) {
        return undefined;
      }
      return {
        max_pages: book.max_pages,
        current_pages: book.current_pages,
      } as unknown as T;
    }

    if (normalized.startsWith('SELECT COUNT(*) AS TOTAL')) {
      let total = 0;
      let unread = 0;
      let reading = 0;
      let completed = 0;
      let totalCompletedPages = 0;

      for (const book of this.books.values()) {
        total += 1;
        const status = computeStatus(book.current_pages, book.max_pages);
        totalCompletedPages += book.current_pages;
        if (status === 'unread') {
          unread += 1;
        } else if (status === 'reading') {
          reading += 1;
        } else if (status === 'completed') {
          completed += 1;
        }
      }

      return {
        total,
        unread,
        reading,
        completed,
        total_pages: totalCompletedPages,
      } as unknown as T;
    }

    if (
      normalized.startsWith('SELECT ID, TITLE, MAX_PAGES AS MAXPAGES') &&
      normalized.includes('FROM BOOKS')
    ) {
      const id = String(params[':id']);
      const book = this.books.get(id);
      if (!book) {
        return undefined;
      }
      return {
        id: book.id,
        title: book.title,
        maxPages: book.max_pages,
        currentPages: book.current_pages,
        categoryId: book.category_id,
        createdAt: book.created_at,
        updatedAt: book.updated_at,
      } as unknown as T;
    }

    return undefined;
  }

  async all<T extends object>(
    sql: string,
    params: SqlParams = {}
  ): Promise<T[]> {
    const normalized = sql.replace(/\s+/g, ' ').trim().toUpperCase();

    if (normalized.startsWith('SELECT ID, NAME, COLOR FROM CATEGORIES')) {
      return Array.from(this.categories.values()).map(
        (category) => ({ ...category }) as unknown as T
      );
    }

    if (
      normalized.startsWith('SELECT B.ID') &&
      normalized.includes('FROM BOOKS') &&
      normalized.includes('INNER JOIN CATEGORIES')
    ) {
      let books = Array.from(this.books.values());

      if (params[':categoryId'] !== undefined) {
        const categoryId = Number(params[':categoryId']);
        books = books.filter((book) => book.category_id === categoryId);
      }

      if (params[':searchKeyword']) {
        const keyword = String(params[':searchKeyword']).replace(/%/g, '');
        const lower = keyword.toLowerCase();
        books = books.filter((book) =>
          book.title.toLowerCase().includes(lower)
        );
      }

      if (
        params[':status_unread'] ||
        params[':status_reading'] ||
        params[':status_completed']
      ) {
        books = books.filter((book) => {
          const status = computeStatus(book.current_pages, book.max_pages);
          if (status === 'unread' && params[':status_unread']) {
            return true;
          }
          if (status === 'reading' && params[':status_reading']) {
            return true;
          }
          if (status === 'completed' && params[':status_completed']) {
            return true;
          }
          return !(
            params[':status_unread'] ||
            params[':status_reading'] ||
            params[':status_completed']
          );
        });
      }

      books = books.sort((a, b) =>
        b.updated_at.localeCompare(a.updated_at)
      );

      return books
        .map((book) => {
          const category = this.categories.get(book.category_id);
          if (!category) {
            return undefined;
          }
          return {
            id: book.id,
            title: book.title,
            max_pages: book.max_pages,
            current_pages: book.current_pages,
            category_id: book.category_id,
            created_at: book.created_at,
            updated_at: book.updated_at,
            category_name: category.name,
            category_color: category.color,
          } as unknown as T;
        })
        .filter(Boolean) as T[];
    }

    if (
      normalized.startsWith('SELECT C.ID AS CATEGORY_ID') &&
      normalized.includes('LEFT JOIN BOOKS')
    ) {
      const results: T[] = [];
      for (const category of this.categories.values()) {
        let bookCount = 0;
        let completedBooks = 0;

        for (const book of this.books.values()) {
          if (book.category_id !== category.id) {
            continue;
          }
          bookCount += 1;
          if (computeStatus(book.current_pages, book.max_pages) === 'completed') {
            completedBooks += 1;
          }
        }

        results.push({
          category_id: category.id,
          category_name: category.name,
          book_count: bookCount,
          completed_books: completedBooks,
        } as unknown as T);
      }
      return results;
    }

    return [];
  }
}

export async function createSqlJsAdapter(): Promise<DatabaseAdapter> {
  return new InMemoryAdapter();
}
