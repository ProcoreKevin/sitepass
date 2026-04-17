"use client"

import { MapPin, Info, Plus, MoreVertical, CloudRain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ProjectHeader() {
  return (
    <div className="border-b bg-background-primary">
      {/* Main Header Row */}
      <div className="flex items-start justify-between gap-4 px-6 py-4">
        {/* Left Section */}
        <div className="flex gap-4">
          {/* Project Thumbnail */}
          <img
            src="/modern-apartment-building.png"
            alt="Project thumbnail"
            className="h-20 w-20 rounded object-cover"
          />

          {/* Project Info */}
          <div className="flex flex-col gap-2">
            {/* Project Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-fit gap-2 px-0 py-0 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  COURSE OF CONSTRUCTION
                  <svg
                    data-icon
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="opacity-50"
                    aria-hidden
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Course of Construction</DropdownMenuItem>
                <DropdownMenuItem>Pre-Construction</DropdownMenuItem>
                <DropdownMenuItem>Post-Construction</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Project Name */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">003SW - Monarch Apartments</h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {/* Address */}
            <a
              href="https://maps.google.com/?q=9227+East+Forest+Street,+Austin,+TX+73301"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-link hover:text-link-hover hover:underline transition-colors"
            >
              <MapPin className="h-4 w-4" />
              9227 East Forest Street, Austin, TX 73301
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Create
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Row - Weather, Links, Team */}
      <div className="flex items-center justify-between border-t px-6 py-3">
        {/* Left - Weather and Links */}
        <div className="flex items-center gap-6">
          {/* Weather Widget */}
          <div className="flex items-center gap-2 text-sm">
            <CloudRain className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">87°F</span>
            <span className="text-muted-foreground">91° | 64°</span>
          </div>

          {/* Links Button */}
          <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            Links
          </Button>
        </div>

        {/* Right - Team */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            Team
          </Button>

          {/* Team Avatars */}
          <div className="flex items-center -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-background-primary">
              <AvatarFallback className="bg-blue-500 text-xs text-white">AB</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background-primary">
              <AvatarImage src="/diverse-group.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background-primary">
              <AvatarImage src="/diverse-group.png" />
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background-primary">
              <AvatarFallback className="bg-asphalt-600 text-xs text-white">SS</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background-primary">
              <AvatarImage src="/diverse-group.png" />
              <AvatarFallback>TL</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background-primary">
              <AvatarFallback className="bg-asphalt-400 text-xs text-white">+10</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
