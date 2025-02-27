import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { channels } from "./channels";
import { relations } from "drizzle-orm";

export const channelMembers = pgTable(
  "channel_members",
  {
    channelId: uuid("channel_id")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.channelId, t.profileId] }),
  })
);

export const channelMembersRelations = relations(channelMembers, ({ one }) => ({
  channel: one(channels, {
    fields: [channelMembers.channelId],
    references: [channels.id],
  }),
  profile: one(profiles, {
    fields: [channelMembers.profileId],
    references: [profiles.id],
  }),
}));

export type ChannelMember = typeof channelMembers.$inferSelect;
export type NewChannelMember = typeof channelMembers.$inferInsert; 