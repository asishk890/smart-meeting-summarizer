'use client'

import { LogOut } from "lucide-react"
// --- THE FIX: Import the correct, high-level hook ---
import { useRequireAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"

export function UserNav() {
  // --- Use the hook that provides the clean, flattened data ---
  // This now works perfectly because useRequireAuth returns the user property at the top level.
  const { user, logout } = useRequireAuth();

  // We no longer need the `if (!user) return null` check because the useRequireAuth
  // hook guarantees that if we get this far, the user exists (or a redirect is happening).
  // It is good practice to keep it for robustness, especially during hot-reloads.
  if (!user) {
    // You can render a small loading skeleton here for a split second during re-renders if needed
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
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
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}