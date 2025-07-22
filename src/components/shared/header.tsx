'use client';

import Link from 'next/link';
// ... other imports for UI components
import { useRequireAuth } from '@/hooks/use-auth'; // <-- IMPORT THE CORRECT HOOK
// import { UserNav } from './user-nav'; // Assuming you have a user dropdown
import { Button } from '@/components/ui/button';

export function Header() {
  // --- THIS IS THE FIX ---
  // Call the specialized hook designed for protected components.
  // It handles all the logic and doesn't require arguments.
  const { user, isLoading } = useRequireAuth(); 

  // It's good practice to handle the loading state
  if (isLoading || !user) {
    // Render a skeleton or nothing while auth state is loading
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-end">
            {/* You can show a skeleton loader for the user button */}
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        </div>
      </header>
    );
  }

  // Once loaded, display the header with user info
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                {/* Your logo here */}
                <span className="font-bold">Dashboard</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
            {/* The user object is guaranteed to exist here now */}
            <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}

// Example UserNav component
function UserNav({ user }: { user: { name?: string, email: string } }) {
    // Your user dropdown menu logic would go here
    return <Button>{user.name || user.email}</Button>;
}