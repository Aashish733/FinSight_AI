import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    {
      href: PROTECTED_ROUTES.OVERVIEW,
      label: "Overview",
    },
    {
      href: PROTECTED_ROUTES.TRANSACTIONS,
      label: "Transactions",
    },
    {
      href: PROTECTED_ROUTES.REPORTS,
      label: "Reports",
    },
    {
      href: PROTECTED_ROUTES.SETTINGS,
      label: "Settings",
    },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full px-4 lg:px-14 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300",
          pathname === PROTECTED_ROUTES.OVERVIEW && "py-0"
        )}
      >
        <div className="w-full flex h-16 max-w-[var(--max-width)] items-center mx-auto">
          <div className="w-full flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden !cursor-pointer
                 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              <Logo />
            </div>

            {/* Navigation*/}
            <nav className="hidden md:flex items-center gap-x-1 overflow-x-auto">
              {routes?.map((route) => (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    `w-full lg:w-auto font-medium px-4 py-2
                     text-muted-foreground hover:text-foreground hover:bg-transparent
                     transition-colors rounded-md text-sm
                     `,
                    pathname === route.href && "text-foreground bg-accent/50"
                  )}
                  asChild
                >
                  <NavLink to={route.href}>
                    {route.label}
                  </NavLink>
                </Button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="bg-background border-r border-border">
                <div className="pt-8 px-2 pb-4 border-b border-border mb-4">
                   <Logo />
                </div>
                <nav className="flex flex-col gap-y-1">
                  {routes?.map((route) => (
                    <Button
                      key={route.href}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        `w-full font-medium py-2.5
                       hover:bg-accent hover:text-accent-foreground
                       transition-colors justify-start`,
                        pathname === route.href && "bg-accent text-accent-foreground"
                      )}
                      asChild
                    >
                      <NavLink to={route.href}>
                        {route.label}
                      </NavLink>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* {} */}
            {/* Right side - User actions */}
            <div className="flex items-center space-x-4">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;
