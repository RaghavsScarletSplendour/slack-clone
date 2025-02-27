'use client';

import { useEffect, useState } from 'react';
import { useCurrentProfile } from '@/hooks/use-current-profile';
import { Profile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAllProfiles } from '@/lib/current-profile';

export function ProfileSwitcher() {
  const { profile, switchProfile } = useCurrentProfile();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      const allProfiles = await getAllProfiles();
      setProfiles(allProfiles);
      setIsLoading(false);
      
      // If no profile is selected and we have profiles, select the first one
      if (!profile && allProfiles.length > 0) {
        switchProfile(allProfiles[0]);
      }
    };

    loadProfiles();
  }, [profile, switchProfile]);

  if (isLoading) {
    return <div>Loading profiles...</div>;
  }

  if (profiles.length === 0) {
    return <div>No profiles available</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          {profile && (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.imageUrl} alt={profile.name} />
                <AvatarFallback>
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-[150px] truncate">{profile.name}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profiles.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => switchProfile(p)}
            className={`cursor-pointer ${p.id === profile?.id ? 'bg-accent' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={p.imageUrl} alt={p.name} />
                <AvatarFallback>
                  {p.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{p.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 