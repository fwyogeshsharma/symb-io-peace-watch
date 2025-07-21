import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, User, LogOut, Shield, Heart } from "lucide-react"
import { useState } from "react"

interface DashboardHeaderProps {
  userType: 'patient' | 'caregiver'
  userName: string
  notifications?: number
  connectionStatus: 'connected' | 'disconnected' | 'syncing'
}

export function DashboardHeader({ userType, userName, notifications = 0, connectionStatus }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const statusConfig = {
    connected: { color: 'bg-success', label: 'All systems online' },
    disconnected: { color: 'bg-health-critical', label: 'Connection lost' },
    syncing: { color: 'bg-warning', label: 'Syncing data...' }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">SymbIOT</h1>
              <p className="text-xs text-muted-foreground">Peace of Mind</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-6">
            <div className={`w-2 h-2 rounded-full ${statusConfig[connectionStatus].color}`} />
            <span className="text-sm text-muted-foreground">
              {statusConfig[connectionStatus].label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User Type Badge */}
          <Badge variant="outline" className="text-xs">
            {userType === 'patient' ? (
              <><User className="w-3 h-3 mr-1" /> Patient</>
            ) : (
              <><Shield className="w-3 h-3 mr-1" /> Caregiver</>
            )}
          </Badge>

          {/* Notifications */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notifications > 9 ? '9+' : notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userType === 'patient' ? 'Patient Account' : 'Caregiver Account'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}