export type SqlParams = Record<string, string | number | null>;

export interface DatabaseAdapter {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: SqlParams): Promise<void>;
  get<T extends object>(sql: string, params?: SqlParams): Promise<T | undefined>;
  all<T extends object>(sql: string, params?: SqlParams): Promise<T[]>;
  close?(): Promise<void>;
}
