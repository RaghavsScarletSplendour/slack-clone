import { db } from '@/db/db';
import { workspaces, workspaceMembers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Workspace, WorkspaceMember } from '@/types';

// Get a workspace by ID
export async function getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
  try {
    const result = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });
    
    return result || null;
  } catch (error) {
    console.error('Failed to fetch workspace:', error);
    return null;
  }
}

// Get all workspaces for a profile
export async function getWorkspacesForProfile(profileId: string): Promise<Workspace[]> {
  try {
    // Find all workspace memberships for the profile
    const memberships = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.profileId, profileId),
    });
    
    // If no memberships, return empty array
    if (memberships.length === 0) {
      return [];
    }
    
    // Get the workspace IDs from the memberships
    const workspaceIds = memberships.map(m => m.workspaceId);
    
    // Fetch the workspaces
    const result = await db.query.workspaces.findMany({
      where: (workspace) => workspace.id.in(workspaceIds),
      orderBy: workspaces.name,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to fetch workspaces for profile:', error);
    return [];
  }
}

// Check if a profile is a member of a workspace
export async function isWorkspaceMember(profileId: string, workspaceId: string): Promise<boolean> {
  try {
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.profileId, profileId),
        eq(workspaceMembers.workspaceId, workspaceId)
      ),
    });
    
    return !!membership;
  } catch (error) {
    console.error('Failed to check workspace membership:', error);
    return false;
  }
}

// Get a profile's role in a workspace
export async function getWorkspaceRole(profileId: string, workspaceId: string): Promise<'ADMIN' | 'MEMBER' | 'GUEST' | null> {
  try {
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.profileId, profileId),
        eq(workspaceMembers.workspaceId, workspaceId)
      ),
    });
    
    return membership?.role || null;
  } catch (error) {
    console.error('Failed to get workspace role:', error);
    return null;
  }
}

// Create a new workspace
export async function createWorkspace(name: string, ownerId: string, imageUrl?: string): Promise<Workspace | null> {
  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Create the workspace
      const [workspace] = await tx.insert(workspaces).values({
        name,
        imageUrl,
        ownerId,
      }).returning();
      
      if (!workspace) {
        throw new Error('Failed to create workspace');
      }
      
      // Add the owner as an admin member
      await tx.insert(workspaceMembers).values({
        workspaceId: workspace.id,
        profileId: ownerId,
        role: 'ADMIN',
      });
      
      return workspace;
    });
  } catch (error) {
    console.error('Failed to create workspace:', error);
    return null;
  }
} 