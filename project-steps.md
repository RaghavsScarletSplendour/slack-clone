# Implementation Plan

## Project Setup and Configuration

- [x] Step 1: Install required dependencies
  - **Task**: Install Supabase client, Drizzle ORM, and other necessary packages
  - **Files**:
    - `package.json`: Update with new dependencies
  - **Step Dependencies**: None
  - **User Instructions**: 
    ```bash
    npm install @supabase/supabase-js drizzle-orm pg @types/pg
    npm install -D drizzle-kit
    npm install date-fns uuid @types/uuid
    ```

- [x] Step 2: Configure Supabase and database connection
  - **Task**: Set up Supabase connection utilities and configure environment variables
  - **Files**:
    - `.env.local`: Add Supabase URL and API key
    - `lib/supabase.ts`: Supabase client configuration
    - `db/db.ts`: Update database connection utility
    - `drizzle.config.ts`: Create Drizzle ORM configuration
  - **Step Dependencies**: Step 1
  - **User Instructions**: 
    - Create a new Supabase project at https://supabase.com
    - Copy the project URL and anonymous API key to `.env.local`:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

- [x] Step 3: Install and configure Shadcn UI components
  - **Task**: Set up essential UI components using Shadcn UI library
  - **Files**:
    - `components/ui/*.tsx`: Create basic UI components
  - **Step Dependencies**: None
  - **User Instructions**:
    ```bash
    npx shadcn@latest add button input dropdown-menu dialog avatar tooltip tabs textarea card sheet popover scroll-area separator skeleton command
    ```

## Database Schema

- [ ] Step 4: Create database schema for profiles
  - **Task**: Define database schema for user profiles using Drizzle ORM
  - **Files**:
    - `db/schema/profiles.ts`: Profiles table schema
    - `db/schema/index.ts`: Export schema definitions
  - **Step Dependencies**: Step 2
  - **User Instructions**: None

- [ ] Step 5: Create database schema for workspaces
  - **Task**: Define database schema for workspaces and workspace members
  - **Files**:
    - `db/schema/workspaces.ts`: Workspace table schema
    - `db/schema/workspace_members.ts`: Workspace members junction table
    - `db/schema/index.ts`: Update exports
  - **Step Dependencies**: Step 4
  - **User Instructions**: None

- [ ] Step 6: Create database schema for channels
  - **Task**: Define database schema for channels and channel members
  - **Files**:
    - `db/schema/channels.ts`: Channel table schema
    - `db/schema/channel_members.ts`: Channel members junction table
    - `db/schema/index.ts`: Update exports
  - **Step Dependencies**: Step 5
  - **User Instructions**: None

- [ ] Step 7: Create database schema for messages and threads
  - **Task**: Define database schema for messages, message reactions, and threads
  - **Files**:
    - `db/schema/messages.ts`: Message table schema
    - `db/schema/message_reactions.ts`: Message reactions table schema
    - `db/schema/thread_messages.ts`: Thread messages table schema
    - `db/schema/index.ts`: Update exports
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [ ] Step 8: Create database schema for file attachments
  - **Task**: Define database schema for file attachments
  - **Files**:
    - `db/schema/file_attachments.ts`: File attachments table schema
    - `db/schema/index.ts`: Update exports
  - **Step Dependencies**: Step 7
  - **User Instructions**: None

- [ ] Step 9: Generate and apply database migrations
  - **Task**: Generate migration SQL based on schema definitions and apply them to the database
  - **Files**:
    - `drizzle/migrations/*.sql`: Generated migration files
  - **Step Dependencies**: Steps 4-8
  - **User Instructions**: 
    ```bash
    npm run db:generate
    npm run db:migrate
    ```
    - Also set up storage in Supabase:
    ```sql
    -- Run this in Supabase SQL editor
    CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'attachments');
    
    CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'attachments');
    ```

- [ ] Step 10: Create seed data
  - **Task**: Create seed data for profiles, workspaces, channels, and messages
  - **Files**:
    - `db/seed.ts`: Seed script to populate database with initial data
    - `db/seed-data/profiles.ts`: Mock profile data
    - `db/seed-data/workspaces.ts`: Mock workspace data
    - `db/seed-data/channels.ts`: Mock channel data
    - `package.json`: Add seed script
  - **Step Dependencies**: Step 9
  - **User Instructions**: 
    ```bash
    npm run seed
    ```
    (After adding "seed": "tsx db/seed.ts" to package.json scripts)

## Mock User System

- [ ] Step 11: Implement profile selection system
  - **Task**: Create a simple profile selector to switch between different mock users
  - **Files**:
    - `lib/current-profile.ts`: Utility for getting/setting current profile
    - `hooks/use-current-profile.ts`: Hook for accessing current profile
    - `contexts/profile-context.tsx`: Context provider for profile data
    - `components/profile-switcher.tsx`: UI for switching between profiles
    - `types/index.ts`: Type definitions
  - **Step Dependencies**: Step 3, Step 10
  - **User Instructions**: None

- [ ] Step 12: Create workspace utilities
  - **Task**: Create utility functions for working with workspaces
  - **Files**:
    - `hooks/use-workspaces.ts`: Hook for working with workspaces
    - `lib/workspace.ts`: Workspace utility functions
    - `types/index.ts`: Update type definitions
  - **Step Dependencies**: Step 11
  - **User Instructions**: None

## Layout and Navigation

- [ ] Step 13: Create application layout structure
  - **Task**: Implement the basic application layout structure with sidebar container
  - **Files**:
    - `components/layout/main-layout.tsx`: Main application layout wrapper
    - `components/layout/sidebar-container.tsx`: Sidebar container component
    - `app/(main)/layout.tsx`: Main layout route component
  - **Step Dependencies**: Step 3, Step 11
  - **User Instructions**: None

- [ ] Step 14: Implement sidebar navigation
  - **Task**: Create the sidebar navigation components with workspace selection
  - **Files**:
    - `components/navigation/workspace-switcher.tsx`: Workspace selection dropdown
    - `components/navigation/sidebar-navigation.tsx`: Main sidebar navigation
    - `components/navigation/profile-dropdown.tsx`: Profile menu and settings dropdown
  - **Step Dependencies**: Step 12, Step 13
  - **User Instructions**: None

## Channel Features

- [ ] Step 15: Implement channel listing and navigation
  - **Task**: Create components for channel listing and navigation within a workspace
  - **Files**:
    - `hooks/use-channels.ts`: Hook for working with channels
    - `components/channels/channel-list.tsx`: Channel list component
    - `components/channels/channel-item.tsx`: Individual channel list item
    - `app/(main)/[workspaceId]/page.tsx`: Workspace home page
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

- [ ] Step 16: Implement channel creation
  - **Task**: Create dialog and form components for creating new channels
  - **Files**:
    - `components/channels/create-channel-dialog.tsx`: Dialog for creating channels
    - `components/channels/channel-form.tsx`: Form for channel details
    - `lib/actions/channel-actions.ts`: Functions for channel operations
  - **Step Dependencies**: Step 15
  - **User Instructions**: None

- [ ] Step 17: Implement channel detail view
  - **Task**: Create the channel detail page with header and content area
  - **Files**:
    - `components/channels/channel-header.tsx`: Channel header with details and actions
    - `app/(main)/[workspaceId]/channels/[channelId]/page.tsx`: Channel detail page
    - `components/channels/channel-details.tsx`: Component for showing channel details
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

## Messaging Features

- [ ] Step 18: Implement message list and display
  - **Task**: Create components for displaying messages in a channel
  - **Files**:
    - `hooks/use-messages.ts`: Hook for working with messages
    - `components/messages/message-list.tsx`: Message list component
    - `components/messages/message-item.tsx`: Individual message component
    - `components/messages/message-timestamp.tsx`: Message timestamp display
    - `components/messages/chat-container.tsx`: Main chat container component to organize the UI
  - **Step Dependencies**: Step 17
  - **User Instructions**: None

- [ ] Step 19: Implement message composer
  - **Task**: Create message input and sending functionality
  - **Files**:
    - `components/messages/message-composer.tsx`: Message input and send component
    - `components/messages/formatting-toolbar.tsx`: Text formatting toolbar
    - `lib/actions/message-actions.ts`: Functions for message operations
    - `hooks/use-message-composer.ts`: Hook for message composition
  - **Step Dependencies**: Step 18
  - **User Instructions**: None

- [ ] Step 20: Implement message threading
  - **Task**: Add support for message threads and replies
  - **Files**:
    - `components/messages/thread-button.tsx`: Button to open thread view
    - `components/messages/thread-view.tsx`: Thread view component
    - `components/messages/thread-reply-composer.tsx`: Reply input for threads
    - `hooks/use-thread.ts`: Hook for thread operations
  - **Step Dependencies**: Step 19
  - **User Instructions**: None

- [ ] Step 21: Implement rich text formatting
  - **Task**: Add rich text formatting support for messages
  - **Files**:
    - `components/messages/rich-text-editor.tsx`: Rich text editor component
    - `lib/utils/formatting.ts`: Text formatting utilities
    - `components/messages/formatted-text.tsx`: Component to display formatted text
  - **Step Dependencies**: Step 19
  - **User Instructions**: 
    ```bash
    npm install marked @types/marked
    ```

- [ ] Step 22: Implement code snippets
  - **Task**: Add support for code snippets in messages
  - **Files**:
    - `components/messages/code-snippet.tsx`: Code snippet display component
    - `components/messages/code-editor.tsx`: Code editor for creating snippets
    - `lib/utils/code-highlighting.ts`: Code syntax highlighting utility
  - **Step Dependencies**: Step 21
  - **User Instructions**: 
    ```bash
    npm install prismjs @types/prismjs
    ```

- [ ] Step 23: Implement emoji reactions
  - **Task**: Add emoji reaction support for messages
  - **Files**:
    - `components/messages/reaction-picker.tsx`: Emoji reaction picker
    - `components/messages/reaction-list.tsx`: Display for message reactions
    - `lib/actions/reaction-actions.ts`: Functions for reaction operations
    - `hooks/use-reactions.ts`: Hook for reaction operations
  - **Step Dependencies**: Step 18
  - **User Instructions**: None

## Direct Messaging

- [ ] Step 24: Implement direct message list
  - **Task**: Create components for listing direct message conversations
  - **Files**:
    - `hooks/use-direct-messages.ts`: Hook for DM operations
    - `components/direct-messages/dm-list.tsx`: DM conversation list
    - `components/direct-messages/dm-item.tsx`: Individual DM list item
    - `components/navigation/sidebar-section.tsx`: Sidebar section component for DMs
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

- [ ] Step 25: Implement direct message conversation view
  - **Task**: Create the DM conversation view with message display
  - **Files**:
    - `components/direct-messages/dm-header.tsx`: DM conversation header
    - `app/(main)/[workspaceId]/dm/[conversationId]/page.tsx`: DM conversation page
    - `lib/actions/dm-actions.ts`: Functions for DM operations
    - `components/direct-messages/dm-container.tsx`: DM chat container component
  - **Step Dependencies**: Step 24
  - **User Instructions**: None

- [ ] Step 26: Implement group DM creation
  - **Task**: Add support for creating group direct messages
  - **Files**:
    - `components/direct-messages/create-group-dm-dialog.tsx`: Dialog for creating group DMs
    - `components/direct-messages/user-picker.tsx`: Component for selecting users
    - `hooks/use-profile-search.ts`: Hook for searching profiles
  - **Step Dependencies**: Step 25
  - **User Instructions**: None

## File Sharing

- [ ] Step 27: Implement file upload
  - **Task**: Create file upload functionality for messages
  - **Files**:
    - `components/files/file-upload-button.tsx`: File upload button
    - `components/files/upload-progress.tsx`: Upload progress indicator
    - `lib/utils/file-upload.ts`: File upload utilities
    - `lib/actions/file-actions.ts`: Functions for file operations
  - **Step Dependencies**: Step 19
  - **User Instructions**: None

- [ ] Step 28: Implement file previews
  - **Task**: Add file preview components for different file types
  - **Files**:
    - `components/files/file-preview.tsx`: Generic file preview component
    - `components/files/image-preview.tsx`: Image preview component
    - `components/files/document-preview.tsx`: Document preview component
    - `lib/utils/file-type.ts`: File type detection utility
  - **Step Dependencies**: Step 27
  - **User Instructions**: None

## Notifications

- [ ] Step 29: Implement notification system
  - **Task**: Create notification context and components
  - **Files**:
    - `contexts/notification-context.tsx`: Notification context provider
    - `hooks/use-notifications.ts`: Hook for notifications
    - `components/notifications/notification-center.tsx`: Notification center UI
    - `components/notifications/notification-item.tsx`: Individual notification component
  - **Step Dependencies**: Step 18, Step 25
  - **User Instructions**: None

- [ ] Step 30: Implement desktop notifications
  - **Task**: Add browser desktop notification support
  - **Files**:
    - `lib/utils/desktop-notifications.ts`: Desktop notification utility
    - `hooks/use-desktop-notifications.ts`: Hook for desktop notifications
    - `components/settings/notification-preferences.tsx`: Notification settings UI
  - **Step Dependencies**: Step 29
  - **User Instructions**: None

## Search Functionality

- [ ] Step 31: Implement search components
  - **Task**: Create search UI components
  - **Files**:
    - `components/search/search-dialog.tsx`: Search dialog component
    - `components/search/search-input.tsx`: Search input component
    - `components/navigation/search-button.tsx`: Button to open search
    - `hooks/use-search.ts`: Hook for search operations
  - **Step Dependencies**: Step 18, Step 28
  - **User Instructions**: None

- [ ] Step 32: Implement message search
  - **Task**: Add functionality to search through messages
  - **Files**:
    - `components/search/message-search-results.tsx`: Message search results component
    - `lib/utils/search-messages.ts`: Message search utility
    - `lib/actions/search-actions.ts`: Search operation functions
  - **Step Dependencies**: Step 31
  - **User Instructions**: None

- [ ] Step 33: Implement file search
  - **Task**: Add functionality to search through files
  - **Files**:
    - `components/search/file-search-results.tsx`: File search results component
    - `lib/utils/search-files.ts`: File search utility
  - **Step Dependencies**: Step 32
  - **User Instructions**: None

## Mobile Responsiveness

- [ ] Step 34: Implement responsive sidebar
  - **Task**: Make the sidebar responsive for mobile devices
  - **Files**:
    - `components/layout/mobile-sidebar.tsx`: Mobile-specific sidebar component
    - `components/layout/sidebar-toggle.tsx`: Toggle for mobile sidebar
    - `hooks/use-sidebar.ts`: Hook for sidebar state management
    - `components/layout/main-layout.tsx`: Update to support mobile view
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

- [ ] Step 35: Implement responsive message views
  - **Task**: Make message views responsive for mobile devices
  - **Files**:
    - `components/messages/message-list.tsx`: Update for mobile responsiveness
    - `components/messages/message-item.tsx`: Update for mobile responsiveness
    - `components/channels/channel-header.tsx`: Update for mobile responsiveness
    - `components/direct-messages/dm-header.tsx`: Update for mobile responsiveness
  - **Step Dependencies**: Step 34
  - **User Instructions**: None

## Final Integration

- [ ] Step 36: Add error handling and loading states
  - **Task**: Implement error handling and loading states throughout the application
  - **Files**:
    - `components/shared/error-boundary.tsx`: Error boundary component
    - `components/shared/loading-spinner.tsx`: Loading spinner component
    - `hooks/use-async.ts`: Hook for async operations with loading/error states
  - **Step Dependencies**: All previous steps
  - **User Instructions**: None

- [ ] Step 37: Implement app entry point and routing
  - **Task**: Set up the main app entry point and routing structure
  - **Files**:
    - `app/page.tsx`: Update main entry page with redirects to workspace view
    - `app/profile-selector.tsx`: Simple profile selector
    - `middleware.ts`: Add routing middleware if needed
  - **Step Dependencies**: All previous steps
  - **User Instructions**: None