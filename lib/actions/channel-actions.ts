import { db } from "@/db/db";
import { channels, channelMembers } from "@/db/schema";
import { getCurrentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

interface CreateChannelParams {
  name: string;
  description: string;
  isPrivate: boolean;
  workspaceId: string;
}

export async function createChannel({
  name,
  description,
  isPrivate,
  workspaceId,
}: CreateChannelParams): Promise<string> {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    throw new Error("Unauthorized");
  }
  
  // Check if channel with the same name already exists in the workspace
  const existingChannel = await db.query.channels.findFirst({
    where: and(
      eq(channels.name, name),
      eq(channels.workspaceId, workspaceId)
    ),
  });
  
  if (existingChannel) {
    throw new Error("A channel with this name already exists in the workspace");
  }
  
  const channelId = uuidv4();
  
  // Create the channel
  await db.insert(channels).values({
    id: channelId,
    name,
    description,
    isPrivate,
    workspaceId,
    createdAt: new Date(),
  });
  
  // Add the creator as a member
  await db.insert(channelMembers).values({
    id: uuidv4(),
    channelId,
    profileId: profile.id,
    role: "ADMIN", // Creator is an admin
    createdAt: new Date(),
  });
  
  return channelId;
}

export async function getChannelById(channelId: string) {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    throw new Error("Unauthorized");
  }
  
  const channel = await db.query.channels.findFirst({
    where: eq(channels.id, channelId),
  });
  
  if (!channel) {
    throw new Error("Channel not found");
  }
  
  // Check if user is a member of the channel
  const membership = await db.query.channelMembers.findFirst({
    where: and(
      eq(channelMembers.channelId, channelId),
      eq(channelMembers.profileId, profile.id)
    ),
  });
  
  if (!membership && channel.isPrivate) {
    throw new Error("You don't have access to this channel");
  }
  
  return channel;
} 