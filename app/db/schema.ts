import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactsTable = sqliteTable("contacts", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phone_number: text({ length: 20 }).notNull().unique(),
  email: text({ length: 255 }).notNull().unique(),
  address: text({ length: 255 }),

  is_favorite: int({ mode: "boolean" })
    .$default(() => false)
    .notNull(),

  created_at: int({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => sql`(unixepoch())`),
});
