export type BookStatus = 'unread' | 'reading' | 'completed';

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Book {
  id: string;
  title: string;
  maxPages: number;
  currentPages: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookWithCategory extends Book {
  category: Category;
}

export interface BookWithProgress extends BookWithCategory {
  progress: number; // 0.0 - 1.0
  remainingPages: number;
  status: BookStatus;
}

export interface CreateBookInput {
  title: string;
  maxPages: number;
  categoryId: number;
}

export interface UpdateBookInput {
  title?: string;
  maxPages?: number;
  categoryId?: number;
}

export interface BookFilters {
  status?: BookStatus | 'all';
  categoryId?: number;
  searchKeyword?: string;
}

export interface ProgressSummary {
  totalBooks: number;
  unreadBooks: number;
  readingBooks: number;
  completedBooks: number;
  totalCompletedPages: number;
}

export interface CategoryStat {
  categoryId: number;
  categoryName: string;
  bookCount: number;
  completedBooks: number;
}
