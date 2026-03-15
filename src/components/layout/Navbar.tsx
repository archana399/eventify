"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Search, Compass, Menu, User, PlusCircle, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Eventify
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Why Eventify
              </Link>
              <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Explore Themes
              </Link>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden lg:flex items-center mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search wedding, birthday, floral..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-muted/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  /* ---- Logged-in Navigation ---- */
                  <div className="hidden md:flex items-center gap-3">
                    <Link href="/create" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" />
                      Upload
                    </Link>
                    <Link href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  /* ---- Guest Navigation ---- */
                  <div className="hidden md:flex items-center gap-3">
                    <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
                      Register
                    </Link>
                    <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
                      Login
                    </Link>
                  </div>
                )}
              </>
            )}
            
            <button className="md:hidden p-2 text-foreground">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
