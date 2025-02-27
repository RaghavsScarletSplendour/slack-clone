'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '@/types';

interface ProfileContextType {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the current profile from localStorage on initial render
    const storedProfile = localStorage.getItem('currentProfile');
    if (storedProfile) {
      try {
        setCurrentProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error('Failed to parse stored profile:', error);
        localStorage.removeItem('currentProfile');
      }
    }
    setIsLoading(false);
  }, []);

  // Update localStorage when the current profile changes
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    } else {
      localStorage.removeItem('currentProfile');
    }
  }, [currentProfile]);

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
} 