import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

import * as schema from "./schema";
import { profilesData } from "./seed-data/profiles";
import { workspacesData } from "./seed-data/workspaces";
import { channelsData } from "./seed-data/channels";

dotenv.config({ path: ".env.local" });

const runSeed = async () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  // Extract database URL from Supabase URL
  const dbUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hostname = dbUrl.hostname;
  const database = hostname.split(".")[0];

  const connectionString = `postgres://postgres:${
    process.env.SUPABASE_SERVICE_ROLE_KEY
  }@${hostname}:5432/${database}?sslmode=require`;

  const sql = postgres(connectionString);
  const db = drizzle(sql, { schema });

  console.log("Starting database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.delete(schema.fileAttachments);
  await db.delete(schema.threadMessages);
  await db.delete(schema.messageReactions);
  await db.delete(schema.messages);
  await db.delete(schema.channelMembers);
  await db.delete(schema.channels);
  await db.delete(schema.workspaceMembers);
  await db.delete(schema.workspaces);
  await db.delete(schema.profiles);

  // Insert profiles
  console.log("Inserting profiles...");
  const insertedProfiles = await db.insert(schema.profiles).values(profilesData).returning();
  console.log(`Inserted ${insertedProfiles.length} profiles`);

  // Create a map of profile names to IDs for easier reference
  const profileMap = insertedProfiles.reduce((acc, profile) => {
    acc[profile.name] = profile.id;
    return acc;
  }, {} as Record<string, string>);

  // Insert workspaces
  console.log("Inserting workspaces...");
  const workspacesWithCreator = workspacesData.map((workspace, index) => ({
    ...workspace,
    createdById: insertedProfiles[index % insertedProfiles.length].id,
  }));

  const insertedWorkspaces = await db.insert(schema.workspaces).values(workspacesWithCreator).returning();
  console.log(`Inserted ${insertedWorkspaces.length} workspaces`);

  // Create a map of workspace names to IDs for easier reference
  const workspaceMap = insertedWorkspaces.reduce((acc, workspace) => {
    acc[workspace.name] = workspace.id;
    return acc;
  }, {} as Record<string, string>);

  // Add all profiles as members of all workspaces
  console.log("Adding workspace members...");
  const workspaceMemberships = [];
  for (const workspace of insertedWorkspaces) {
    for (const profile of insertedProfiles) {
      workspaceMemberships.push({
        workspaceId: workspace.id,
        profileId: profile.id,
      });
    }
  }

  await db.insert(schema.workspaceMembers).values(workspaceMemberships);
  console.log(`Added ${workspaceMemberships.length} workspace memberships`);

  // Insert channels for each workspace
  console.log("Inserting channels...");
  const allChannels = [];
  for (const workspace of insertedWorkspaces) {
    const workspaceChannels = channelsData[workspace.name] || [];
    const channelsWithWorkspace = workspaceChannels.map((channel) => ({
      ...channel,
      workspaceId: workspace.id,
      createdById: workspace.createdById,
    }));
    allChannels.push(...channelsWithWorkspace);
  }

  const insertedChannels = await db.insert(schema.channels).values(allChannels).returning();
  console.log(`Inserted ${insertedChannels.length} channels`);

  // Add all profiles as members of all non-private channels
  console.log("Adding channel members...");
  const channelMemberships = [];
  for (const channel of insertedChannels) {
    for (const profile of insertedProfiles) {
      // Add all users to non-private channels, but only the first 3 users to private channels
      if (!channel.isPrivate || profilesData.indexOf(profilesData.find(p => p.name === profile.name)!) < 3) {
        channelMemberships.push({
          channelId: channel.id,
          profileId: profile.id,
        });
      }
    }
  }

  await db.insert(schema.channelMembers).values(channelMemberships);
  console.log(`Added ${channelMemberships.length} channel memberships`);

  // Insert some sample messages
  console.log("Inserting sample messages...");
  const sampleMessages = [
    "Hello everyone! Welcome to the channel.",
    "I'm excited to start working on this project.",
    "Has anyone seen the latest updates?",
    "Just checking in. How's everyone doing?",
    "Let's schedule a meeting for next week.",
    "I've shared some documents in the shared drive.",
    "Any thoughts on the new design?",
    "Don't forget about the deadline on Friday!",
    "Great work on the presentation yesterday.",
    "Who's handling the client meeting tomorrow?",
  ];

  const messages = [];
  for (const channel of insertedChannels) {
    // Add 5-10 random messages to each channel
    const messageCount = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < messageCount; i++) {
      const randomProfileIndex = Math.floor(Math.random() * insertedProfiles.length);
      const randomMessageIndex = Math.floor(Math.random() * sampleMessages.length);
      
      messages.push({
        id: uuidv4(),
        content: sampleMessages[randomMessageIndex],
        channelId: channel.id,
        profileId: insertedProfiles[randomProfileIndex].id,
        hasThread: i % 3 === 0, // Every third message has a thread
      });
    }
  }

  const insertedMessages = await db.insert(schema.messages).values(messages).returning();
  console.log(`Inserted ${insertedMessages.length} messages`);

  // Add thread messages to some messages
  console.log("Adding thread messages...");
  const threadMessages = [];
  const messagesWithThreads = insertedMessages.filter(msg => msg.hasThread);
  
  for (const message of messagesWithThreads) {
    // Add 2-4 replies to each thread
    const replyCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < replyCount; i++) {
      const randomProfileIndex = Math.floor(Math.random() * insertedProfiles.length);
      
      threadMessages.push({
        id: uuidv4(),
        content: `Reply ${i + 1} to the message: "${message.content.substring(0, 20)}..."`,
        parentMessageId: message.id,
        profileId: insertedProfiles[randomProfileIndex].id,
      });
    }
  }

  await db.insert(schema.threadMessages).values(threadMessages);
  console.log(`Added ${threadMessages.length} thread messages`);

  // Add some reactions to messages
  console.log("Adding message reactions...");
  const emojis = ["👍", "❤️", "😂", "🎉", "🚀", "👏", "🔥"];
  const reactions = [];
  
  for (const message of insertedMessages) {
    // Add 0-3 random reactions to each message
    const reactionCount = Math.floor(Math.random() * 4);
    const usedEmojis = new Set();
    
    for (let i = 0; i < reactionCount; i++) {
      const randomProfileIndex = Math.floor(Math.random() * insertedProfiles.length);
      let randomEmojiIndex;
      let emoji;
      
      // Ensure we don't add the same emoji from the same user
      do {
        randomEmojiIndex = Math.floor(Math.random() * emojis.length);
        emoji = emojis[randomEmojiIndex];
      } while (usedEmojis.has(`${insertedProfiles[randomProfileIndex].id}-${emoji}`));
      
      usedEmojis.add(`${insertedProfiles[randomProfileIndex].id}-${emoji}`);
      
      reactions.push({
        messageId: message.id,
        profileId: insertedProfiles[randomProfileIndex].id,
        emoji,
      });
    }
  }

  await db.insert(schema.messageReactions).values(reactions);
  console.log(`Added ${reactions.length} message reactions`);

  console.log("Database seeding completed successfully!");
  process.exit(0);
};

runSeed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
}); 