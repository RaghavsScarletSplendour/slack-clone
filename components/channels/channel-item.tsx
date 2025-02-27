import { Channel } from "@/types";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { LockIcon, Hash } from "lucide-react";

interface ChannelItemProps {
  channel: Channel;
  workspaceId: string;
}

export function ChannelItem({ channel, workspaceId }: ChannelItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive = pathname === `/workspaces/${workspaceId}/channels/${channel.id}`;
  
  const handleClick = () => {
    router.push(`/workspaces/${workspaceId}/channels/${channel.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left px-3 py-1.5 rounded-md flex items-center gap-x-2 group hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        isActive && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {channel.isPrivate ? (
        <LockIcon className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Hash className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={cn(
        "truncate text-sm font-medium text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
        isActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}>
        {channel.name}
      </span>
    </button>
  );
} 