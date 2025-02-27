import { NewChannel } from "../schema";

// Note: workspaceId and createdById will be populated during seeding
export const channelsData: Record<string, Omit<NewChannel, "workspaceId" | "createdById">[]> = {
  "Acme Corporation": [
    {
      name: "general",
      description: "General discussion for Acme Corporation",
      isPrivate: false,
    },
    {
      name: "random",
      description: "Random stuff and fun",
      isPrivate: false,
    },
    {
      name: "marketing",
      description: "Marketing team discussions",
      isPrivate: true,
    },
    {
      name: "engineering",
      description: "Engineering team discussions",
      isPrivate: true,
    },
  ],
  "Startup Team": [
    {
      name: "general",
      description: "General discussion for Startup Team",
      isPrivate: false,
    },
    {
      name: "ideas",
      description: "Share your startup ideas",
      isPrivate: false,
    },
    {
      name: "funding",
      description: "Funding opportunities and discussions",
      isPrivate: true,
    },
  ],
  "Project X": [
    {
      name: "general",
      description: "General discussion for Project X",
      isPrivate: false,
    },
    {
      name: "planning",
      description: "Project planning and roadmap",
      isPrivate: false,
    },
    {
      name: "secret",
      description: "Top secret discussions",
      isPrivate: true,
    },
  ],
}; 