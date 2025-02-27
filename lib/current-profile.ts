import { db } from '@/db/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Profile } from '@/types';

// Get a profile by ID
export async function getProfileById(profileId: string): Promise<Profile | null> {
  try {
    const result = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
    });
    
    return result || null;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
}

// Get all available profiles (for the profile switcher)
export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const result = await db.query.profiles.findMany({
      orderBy: profiles.name,
    });
    
    return result;
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return [];
  }
} 