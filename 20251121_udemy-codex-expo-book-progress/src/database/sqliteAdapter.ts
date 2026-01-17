import { DatabaseAdapter, SqlParams } from './adapter';

type SQLiteModule = typeof import('expo-sqlite');
type SQLiteBindParams = import('expo-sqlite').SQLiteBindParams;

function toSQLiteParams(params?: SqlParams): SQLiteBindParams | undefined {
  if (!params) {
    return undefined;
  }
  return params as SQLiteBindParams;
}

export async function createSQLiteAdapter(
  dbName = 'book-progress.db'
): Promise<DatabaseAdapter> {
  const SQLite: SQLiteModule = await import('expo-sqlite');
  const db = await SQLite.openDatabaseAsync(dbName);

  return {
    async exec(sql: string) {
      await db.execAsync(sql);
    },
    async run(sql: string, params?: SqlParams) {
      const bindParams = toSQLiteParams(params);
      if (bindParams) {
        await db.runAsync(sql, bindParams);
      } else {
        await db.runAsync(sql);
      }
    },
    async get<T extends object>(
      sql: string,
      params?: SqlParams
    ): Promise<T | undefined> {
      const bindParams = toSQLiteParams(params);
      const result = bindParams
        ? await db.getFirstAsync(sql, bindParams)
        : await db.getFirstAsync(sql);
      return (result ?? undefined) as T | undefined;
    },
    async all<T extends object>(
      sql: string,
      params?: SqlParams
    ): Promise<T[]> {
      const bindParams = toSQLiteParams(params);
      return (bindParams
        ? await db.getAllAsync(sql, bindParams)
        : await db.getAllAsync(sql)) as T[];
    },
    async close() {
      await db.closeAsync();
    },
  };
}
