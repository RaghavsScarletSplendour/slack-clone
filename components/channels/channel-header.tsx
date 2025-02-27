import { Channel } from "@/types";
import { Hash, LockIcon, Users, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { ChannelDetails } from "./channel-details";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ChannelHeaderProps {
  channel: Channel;
  memberCount: number;
}

export function ChannelHeader({ channel, memberCount }: ChannelHeaderProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="h-12 border-b flex items-center justify-between px-3 bg-background">
      <div className="flex items-center gap-x-2">
        <div className="flex items-center">
          {channel.isPrivate ? (
            <LockIcon className="h-4 w-4 text-muted-foreground mr-2" />
          ) : (
            <Hash className="h-4 w-4 text-muted-foreground mr-2" />
          )}
          <h1 className="font-semibold text-md">
            {channel.name}
          </h1>
        </div>
        {channel.description && (
          <>
            <span className="text-zinc-400">|</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden md:block">
              {channel.description}
            </p>
          </>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{memberCount} members</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowDetails(true)}
              >
                <InfoIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Channel details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="right" className="w-80 sm:w-96">
          <ChannelDetails channel={channel} />
        </SheetContent>
      </Sheet>
    </div>
  );
} 