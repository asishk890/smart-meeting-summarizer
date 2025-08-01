'use client';

import Link from 'next/link';
import { useRequireAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

// --> CHANGE 1: Import UI components for the dropdown menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export function Header() {
  // --> CHANGE 2: Get the 'logout' function from the hook
  const { user, isLoading, logout } = useRequireAuth();

  // Loading state remains the same
  if (isLoading || !user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-end">
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
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
                <span className="font-bold">Dashboard</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* --> CHANGE 3: Pass the user and the logout function to UserNav */}
          <UserNav user={user} onLogout={logout} />
        </div>
      </div>
    </header>
  );
}


// --> CHANGE 4: Update the UserNav component to be a dropdown with a Logout button
type UserNavProps = {
  user: { name?: string, email: string };
  onLogout: () => void; // Expect a function to be passed for logging out
};

function UserNav({ user, onLogout }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
             <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}