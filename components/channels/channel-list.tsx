import { useChannels } from "@/hooks/use-channels";
import { ChannelItem } from "./channel-item";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CreateChannelDialog } from "./create-channel-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelListProps {
  workspaceId: string;
}

export function ChannelList({ workspaceId }: ChannelListProps) {
  const { channels, isLoading } = useChannels(workspaceId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-xs font-semibold text-muted-foreground">CHANNELS</h3>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 mx-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between px-3 mb-1">
        <h3 className="text-xs font-semibold text-muted-foreground">CHANNELS</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-[2px]">
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} workspaceId={workspaceId} />
        ))}
      </div>
      <CreateChannelDialog 
        workspaceId={workspaceId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
} 