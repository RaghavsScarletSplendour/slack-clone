import { redirect } from "next/navigation";
import { db } from "@/db/db";
import { channels, channelMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentProfile } from "@/lib/current-profile";

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    return redirect("/");
  }

  // Find the first channel the user is a member of
  const userChannels = await db
    .select({
      id: channels.id,
    })
    .from(channels)
    .innerJoin(
      channelMembers,
      and(
        eq(channelMembers.channelId, channels.id),
        eq(channelMembers.profileId, profile.id)
      )
    )
    .where(eq(channels.workspaceId, params.workspaceId))
    .limit(1);

  if (userChannels.length > 0) {
    // Redirect to the first channel
    return redirect(`/workspaces/${params.workspaceId}/channels/${userChannels[0].id}`);
  }

  // If no channels found, show a welcome page
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Welcome to your workspace!</h1>
      <p className="text-muted-foreground mb-6">
        You don&apos;t have any channels yet. Create one to get started.
      </p>
    </div>
  );
} 