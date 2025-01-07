"use client";
import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions";
import { useFormState } from "react-dom";
import { validateRequest } from "@/lib/auth";
import { User } from "@prisma/client";
const Navbar = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [state, logoutAction] = useFormState(logout, null);

  const handleLogout = () => {
    // startTransition(() => {
    logoutAction();
    // });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">R5ive</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu.Root className="relative">
              <NavigationMenu.List className="flex space-x-8">
                <NavigationMenu.Item>
                  <NavigationMenu.Link
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    href="/events"
                  >
                    Events
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    href="/announcements"
                  >
                    Announcements
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    href="/invites"
                  >
                    Invites
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    href="/polls"
                  >
                    Polls
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>

          {/* Avatar Dropdown */}
          <div className="flex items-center">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="focus:outline-none">
                <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
                  <Avatar.Image
                    className="h-full w-full object-cover"
                    src="/api/placeholder/40/40"
                    alt="User avatar"
                  />
                  <Avatar.Fallback className="text-gray-500 text-sm font-medium">
                    {user.nickname}
                  </Avatar.Fallback>
                </Avatar.Root>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[200px] bg-white rounded-md shadow-lg p-1 z-50"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenu.Item>
                  <form action={logoutAction}>
                    <DropdownMenu.Item
                      className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      {/* <Button variant="ghost"> */}
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                      {/* </Button> */}
                    </DropdownMenu.Item>
                  </form>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/events"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Events
              </a>
              <a
                href="/announcements"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Announcements
              </a>
              <a
                href="/invites"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Invites
              </a>
              <a
                href="/polls"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Polls
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
