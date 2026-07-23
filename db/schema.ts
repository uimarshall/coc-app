import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Better-Auth required tables
// These tables are used by Better-Auth to manage users, sessions, and OAuth.
// Do NOT rename or remove columns — Better-Auth depends on these exact names.
// @see https://www.better-auth.com/docs/installation#database-setup
// ---------------------------------------------------------------------------

/** Stores registered users. */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  // Whether this user has admin / CMS access
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/** Stores active login sessions. */
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/** Stores OAuth / social login accounts linked to a user. */
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

/** Stores email verification and password-reset tokens. */
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ---------------------------------------------------------------------------
// Church application tables
// ---------------------------------------------------------------------------

/** Stores sermon recordings, notes, and media. */
export const sermons = pgTable("sermons", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  /** Name of the preacher / speaker */
  preacher: text("preacher").notNull(),
  /** Date the sermon was delivered */
  date: timestamp("date").notNull(),
  /** YouTube / Vimeo embed URL */
  videoUrl: text("video_url"),
  /** Direct link to audio file (mp3, etc.) */
  audioUrl: text("audio_url"),
  /** Thumbnail / cover image URL */
  imageUrl: text("image_url"),
  /** Bible passage reference, e.g. "John 3:16" */
  scriptureReference: text("scripture_reference"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Stores church events (services, outreach, meetings, etc.). */
export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  /** End time — optional for single-day events */
  endDate: timestamp("end_date"),
  location: text("location"),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Stores short announcements shown on the home page. */
export const announcements = pgTable("announcements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  /** Date after which the announcement is no longer shown */
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TypeScript types inferred from the schema (useful for type-safe queries)
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Sermon = typeof sermons.$inferSelect;
export type NewSermon = typeof sermons.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
