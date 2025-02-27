import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { messages } from "./messages";
import { relations } from "drizzle-orm";

export const threadMessages = pgTable("thread_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  parentMessageId: uuid("parent_message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  isEdited: boolean("is_edited").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const threadMessagesRelations = relations(threadMessages, ({ one, many }) => ({
  parentMessage: one(messages, {
    fields: [threadMessages.parentMessageId],
    references: [messages.id],
  }),
  profile: one(profiles, {
    fields: [threadMessages.profileId],
    references: [profiles.id],
  }),
  fileAttachments: many(fileAttachments),
}));

export type ThreadMessage = typeof threadMessages.$inferSelect;
export type NewThreadMessage = typeof threadMessages.$inferInsert; 