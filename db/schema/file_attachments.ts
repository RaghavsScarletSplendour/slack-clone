import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { threadMessages } from "./thread_messages";
import { relations } from "drizzle-orm";

export const fileAttachments = pgTable("file_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  messageId: uuid("message_id").references(() => messages.id, { onDelete: "cascade" }),
  threadMessageId: uuid("thread_message_id").references(() => threadMessages.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fileAttachmentsRelations = relations(fileAttachments, ({ one }) => ({
  message: one(messages, {
    fields: [fileAttachments.messageId],
    references: [messages.id],
    relationName: "messageAttachments",
  }),
  threadMessage: one(threadMessages, {
    fields: [fileAttachments.threadMessageId],
    references: [threadMessages.id],
    relationName: "threadMessageAttachments",
  }),
}));

export type FileAttachment = typeof fileAttachments.$inferSelect;
export type NewFileAttachment = typeof fileAttachments.$inferInsert; 