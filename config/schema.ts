import { pgTable, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique()
});

export const scans = pgTable("scans", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    analysis: text("analysis").notNull(),
    userEmail: varchar("user_email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});