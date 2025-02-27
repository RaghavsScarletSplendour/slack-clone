import { Channel } from "@/types";
import { format } from "date-fns";
import { Hash, LockIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ChannelDetailsProps {
  channel: Channel;
}

export function ChannelDetails({ channel }: ChannelDetailsProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-x-2 mb-6">
        {channel.isPrivate ? (
          <LockIcon className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Hash className="h-6 w-6 text-muted-foreground" />
        )}
        <h2 className="text-xl font-bold">{channel.name}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">About</h3>
          <p className="text-sm">
            {channel.description || "No description provided"}
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Channel Type</h3>
          <p className="text-sm flex items-center gap-x-2">
            {channel.isPrivate ? (
              <>
                <LockIcon className="h-4 w-4" />
                Private Channel
              </>
            ) : (
              <>
                <Hash className="h-4 w-4" />
                Public Channel
              </>
            )}
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Created</h3>
          <p className="text-sm">
            {format(new Date(channel.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
} 