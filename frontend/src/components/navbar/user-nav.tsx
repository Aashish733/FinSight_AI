import { LogOut } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export function UserNav({
  userName,
  profilePicture,
  onLogout,
}: {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative !bg-transparent h-8 w-8 rounded-full !gap-0"
        >
          <Avatar className="h-10 w-10 !cursor-pointer ">
            <AvatarImage
              src={profilePicture || ""}
              className="!cursor-pointer "
            />
            <AvatarFallback
              className="border border-border font-semibold"
            >
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <span className="font-semibold">{userName}</span>
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Free Trial (2 days left)</span>
           </DropdownMenuLabel>
           <DropdownMenuSeparator />
           <DropdownMenuGroup>
          <DropdownMenuItem 
          onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2 text-rose-500" />
            <span className="text-rose-500 font-medium">Log out</span>
          </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }