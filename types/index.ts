// Profile types
export interface Profile {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  profileId: string;
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
  createdAt: Date;
  updatedAt: Date;
}

// Channel types
export interface Channel {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: Date;
  updatedAt: Date;
} 