"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, Users, UserCheck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-foreground">Hackathon Admin</h1>
              <nav className="hidden md:flex space-x-4">
                <Link
                  href="/admin/teams"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/admin/teams" 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Users className="inline-block w-4 h-4 mr-2" />
                  All Teams
                </Link>
                <Link
                  href="/admin/selected-teams"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/admin/selected-teams"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <UserCheck className="inline-block w-4 h-4 mr-2" />
                  Selected Teams
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-card border-b border-border">
        <div className="px-4 py-2 space-y-1">
          <Link
            href="/admin/teams"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/admin/teams" 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Users className="inline-block w-4 h-4 mr-2" />
            All Teams
          </Link>
          <Link
            href="/admin/selected-teams"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/admin/selected-teams" 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <UserCheck className="inline-block w-4 h-4 mr-2" />
            Selected Teams
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
