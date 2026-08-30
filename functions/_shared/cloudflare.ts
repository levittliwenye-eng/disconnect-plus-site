export type D1RunResult = {
  success: boolean;
  error?: string;
};

export type D1Result<T> = {
  results?: T[];
  success: boolean;
  error?: string;
};

export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>(columnName?: string) => Promise<T | null>;
  all: <T = unknown>() => Promise<D1Result<T>>;
  run: () => Promise<D1RunResult>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

export type Env = {
  DB?: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
};

export type PagesContext<Params = Record<string, string | string[]>> = {
  request: Request;
  env: Env;
  params: Params;
  next: () => Promise<Response>;
};
