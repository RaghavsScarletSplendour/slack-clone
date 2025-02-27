import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { channels } from "./channels";
import { relations } from "drizzle-orm";

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  channelId: uuid("channel_id")
    .notNull()
    .references(() => channels.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  isEdited: boolean("is_edited").default(false).notNull(),
  hasThread: boolean("has_thread").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one, many }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  profile: one(profiles, {
    fields: [messages.profileId],
    references: [profiles.id],
  }),
  reactions: many(messageReactions),
  threadMessages: many(threadMessages),
  fileAttachments: many(fileAttachments),
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert; 