// src/components/shared/user-nav.tsx
'use client'

import Link from 'next/link';
import { User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

import { useAuthContext } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Import your existing User type
import { type User as UserType } from '@/types/auth'; 

function getUserInitials(name?: string, email?: string): string {
  if (name) {
    const nameParts = name.split(' ');
    return nameParts.map(part => part[0]).join('').toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'U';
}

interface UserNavProps {
  user: UserType | null;
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuthContext();

  if (!user) {
    return null;
  }

  const handleLogout = (event: Event) => {
    event.preventDefault();
    logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            {/* 
              --- THE FIX IS HERE ---
              We now use user.avatar to match your User type.
            */}
            <AvatarImage src={user.avatar ?? ''} alt={`@${user.name}`} />
            <AvatarFallback>{getUserInitials(user.name, user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}