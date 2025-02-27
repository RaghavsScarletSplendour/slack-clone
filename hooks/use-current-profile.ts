'use client';

import { useProfileContext } from '@/contexts/profile-context';
import { Profile } from '@/types';
import { useCallback } from 'react';

export function useCurrentProfile() {
  const { currentProfile, setCurrentProfile, isLoading } = useProfileContext();

  const switchProfile = useCallback((profile: Profile) => {
    setCurrentProfile(profile);
  }, [setCurrentProfile]);

  const clearProfile = useCallback(() => {
    setCurrentProfile(null);
  }, [setCurrentProfile]);

  return {
    profile: currentProfile,
    isLoading,
    switchProfile,
    clearProfile,
  };
} 