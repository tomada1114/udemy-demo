export interface PreferencesStorage {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export const FILTERS_STORAGE_KEY = 'book-progress/filters';
export const DAILY_GOAL_STORAGE_KEY = 'book-progress/daily-goal';
