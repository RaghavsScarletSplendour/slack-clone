'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCurrentProfile } from '@/hooks/use-current-profile';
import { Workspace } from '@/types';
import { getWorkspacesForProfile, createWorkspace } from '@/lib/workspace';

export function useWorkspaces() {
  const { profile } = useCurrentProfile();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workspaces for the current profile
  const fetchWorkspaces = useCallback(async () => {
    if (!profile) {
      setWorkspaces([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userWorkspaces = await getWorkspacesForProfile(profile.id);
      setWorkspaces(userWorkspaces);
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      setError('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Create a new workspace
  const addWorkspace = useCallback(async (name: string, imageUrl?: string) => {
    if (!profile) {
      setError('You must be logged in to create a workspace');
      return null;
    }

    try {
      setError(null);
      const newWorkspace = await createWorkspace(name, profile.id, imageUrl);
      
      if (newWorkspace) {
        setWorkspaces(prev => [...prev, newWorkspace]);
      }
      
      return newWorkspace;
    } catch (err) {
      console.error('Error creating workspace:', err);
      setError('Failed to create workspace');
      return null;
    }
  }, [profile]);

  // Load workspaces when the profile changes
  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return {
    workspaces,
    isLoading,
    error,
    fetchWorkspaces,
    addWorkspace,
  };
} 