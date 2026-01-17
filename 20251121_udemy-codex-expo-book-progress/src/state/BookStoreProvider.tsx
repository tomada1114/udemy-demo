import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { createBookRepository } from '../database/bookRepository';
import { createSQLiteAdapter } from '../database/sqliteAdapter';
import { createBookStore, BookStore, BookStoreState } from './bookStore';
import { PreferencesStorage } from '../storage/preferencesStorage';

class AsyncStoragePreferences implements PreferencesStorage {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn('[PreferencesStorage] JSON parse error', error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

const BookStoreContext = createContext<BookStore | null>(null);

async function createDefaultStore(): Promise<BookStore> {
  const adapter = await createSQLiteAdapter();
  const repository = createBookRepository(adapter);
  await repository.init();

  const preferencesStorage = new AsyncStoragePreferences();

  const store = createBookStore({
    repository,
    preferencesStorage,
  });

  return store;
}

async function initializeStore(store: BookStore) {
  try {
    await store.initialize();
  } catch (error) {
    // 初期化は画面内でエラーハンドリングされるため、ここでは握りつぶさずにログのみ
    console.warn('[BookStoreProvider] Failed to initialize store', error);
  }
}

export function BookStoreProvider({
  children,
  value,
}: PropsWithChildren<{ value?: BookStore }>) {
  const valueRef = useRef<BookStore | null>(value ?? null);
  const [store, setStore] = useState<BookStore | null>(() => valueRef.current);

  useEffect(() => {
    if (value) {
      valueRef.current = value;
      setStore(value);
      return;
    }

    let mounted = true;
    createDefaultStore().then((created) => {
      if (!mounted) {
        return;
      }
      valueRef.current = created;
      setStore(created);
    });

    return () => {
      mounted = false;
    };
  }, [value]);

  useEffect(() => {
    if (!store) {
      return;
    }
    initializeStore(store);
  }, [store]);

  const contextValue = useMemo(() => store, [store]);

  if (!contextValue) {
    return null;
  }

  return (
    <BookStoreContext.Provider value={contextValue}>
      {children}
    </BookStoreContext.Provider>
  );
}

export function useBookStore(): BookStore {
  const store = useContext(BookStoreContext);
  if (!store) {
    throw new Error('useBookStore must be used within BookStoreProvider');
  }
  return store;
}

export function useBookStoreState(): BookStoreState;
export function useBookStoreState<T>(
  selector: (state: BookStoreState) => T
): T;
export function useBookStoreState<T>(
  selector?: (state: BookStoreState) => T
): BookStoreState | T {
  const store = useBookStore();
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  return selector ? selector(state) : state;
}

export function useBookFilters() {
  return useBookStoreState((state) => state.filters);
}
