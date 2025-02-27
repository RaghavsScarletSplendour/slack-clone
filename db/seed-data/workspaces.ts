import { NewWorkspace } from "../schema";

// Note: createdById will be populated during seeding
export const workspacesData: Omit<NewWorkspace, "createdById">[] = [
  {
    name: "Acme Corporation",
    imageUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=acme",
  },
  {
    name: "Startup Team",
    imageUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=startup",
  },
  {
    name: "Project X",
    imageUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=projectx",
  },
]; 