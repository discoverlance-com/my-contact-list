import "dotenv/config";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { ilike as _ilike, sql } from "drizzle-orm";

// You can specify any property from the libsql connection options
export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema,
});

export function ilike(
  column: Parameters<typeof _ilike>[0],
  value: Parameters<typeof _ilike>[1]
) {
  // like(column, `%${value}%`)
  return sql`${column} LIKE ${value} COLLATE NOCASE`;
}
