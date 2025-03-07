"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { User } from "payload"

export function Navbar({ user }: { user: User }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm bg-background/75 supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:justify-start gap-4">
          <Link href="/" className="font-bold shrink-0">NYC Running Hub</Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/run-clubs" className="text-lg">Run Clubs</Link>
                <Link href="/events" className="text-lg">Events</Link>
                <Link href="/stores" className="text-lg">Stores</Link>
                <Link href="/stories" className="text-lg">Community Stories</Link>
                <Link href="/join-us" className="text-lg">Join Us</Link>
                {!user && (
                  <>
                    <Link href="/login" className="text-lg">Sign In</Link>
                    <Button asChild className="w-full">
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex mx-auto">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Run Clubs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px]">
                    <li><Link href="/run-clubs">Browse All Clubs</Link></li>
                    <li><Link href="/run-clubs/manhattan">Manhattan Clubs</Link></li>
                    <li><Link href="/run-clubs/brooklyn">Brooklyn Clubs</Link></li>
                    <li><Link href="/run-clubs/map">Club Map</Link></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px]">
                    <li><Link href="/events">Browse Events</Link></li>
                    <li><Link href="/events/races">Races</Link></li>
                    <li><Link href="/events/group-runs">Group Runs</Link></li>
                    <li><Link href="/events/create">Create Event</Link></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/stores" legacyBehavior passHref>
                  <NavigationMenuLink>Stores</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/stories" legacyBehavior passHref>
                  <NavigationMenuLink>Community Stories</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/join-us" legacyBehavior passHref>
                  <NavigationMenuLink>Join Us</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Account Section */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {user ? (
              <Button asChild variant="ghost">
                <Link href="/account">Account</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
