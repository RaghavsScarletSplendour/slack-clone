import { getChannelById } from "@/lib/actions/channel-actions";
import { ChannelHeader } from "@/components/channels/channel-header";
import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { channelMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ChannelPageProps {
  params: {
    workspaceId: string;
    channelId: string;
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  try {
    const channel = await getChannelById(params.channelId);
    
    // Verify the channel belongs to the current workspace
    if (channel.workspaceId !== params.workspaceId) {
      return redirect(`/workspaces/${params.workspaceId}`);
    }
    
    // Get member count
    const members = await db
      .select({ id: channelMembers.id })
      .from(channelMembers)
      .where(eq(channelMembers.channelId, params.channelId));
    
    const memberCount = members.length;
    
    return (
      <div className="flex flex-col h-full">
        <ChannelHeader channel={channel} memberCount={memberCount} />
        <div className="flex-1 p-4">
          {/* Message list will go here in step 18 */}
          <div className="flex items-center justify-center h-full text-muted-foreground">
            This is the beginning of the #{channel.name} channel
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[CHANNEL_PAGE]", error);
    return redirect(`/workspaces/${params.workspaceId}`);
  }
} 