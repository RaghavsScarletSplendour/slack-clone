import { useCallback, useEffect, useState } from "react";
import { db } from "@/db/db";
import { channels, channelMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { useCurrentProfile } from "./use-current-profile";
import { Channel } from "@/types";

export function useChannels(workspaceId: string) {
  const { profile } = useCurrentProfile();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = useCallback(async () => {
    if (!profile || !workspaceId) return;
    
    setIsLoading(true);
    try {
      // Get all channels where the current user is a member
      const result = await db
        .select({
          id: channels.id,
          name: channels.name,
          description: channels.description,
          isPrivate: channels.isPrivate,
          workspaceId: channels.workspaceId,
          createdAt: channels.createdAt,
        })
        .from(channels)
        .innerJoin(
          channelMembers,
          and(
            eq(channelMembers.channelId, channels.id),
            eq(channelMembers.profileId, profile.id)
          )
        )
        .where(eq(channels.workspaceId, workspaceId));

      setChannels(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [profile, workspaceId]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    channels,
    isLoading,
    error,
    refetch: fetchChannels,
  };
} 