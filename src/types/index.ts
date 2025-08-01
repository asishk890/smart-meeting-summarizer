// Base User object with all properties
export interface User {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role: any;
  id: string;
  name: string;
  email: string;
  password: string; // The hashed password
  createdAt: string;
}

// User object without server-generated fields like id and createdAt.
// Useful for creating new users.
export type UnsavedUser = Omit<User, 'id' | 'createdAt'>;

// User object that is safe to send to the client (without the password).
export type PublicUser = Omit<User, 'password'>;


// Base Meeting object with all properties
export interface Meeting {
    id: string;
    userId: string;
    title: string;
    fileName: string;
    transcription: string;
    summary: string;
    
    // --- THIS IS THE FIX ---
    // Change `string[]` to `ActionItem[]` to allow storing the rich objects.
    actionItems: ActionItem[];
    // ----------------------
    
    createdAt: string;
}

// === THIS IS THE FIX ===
// Meeting object before it's saved to the "database".
// It doesn't have an `id` or `createdAt` yet.
export type UnsavedMeeting = Omit<Meeting, 'id' | 'createdAt'>;

export interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  deadline?: string | null; // Use `| null` as AI might return null
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}


// 2. Now, define the types for your User records
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}
