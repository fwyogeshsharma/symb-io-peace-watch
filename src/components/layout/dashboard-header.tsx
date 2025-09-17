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
import { Bell, Settings, User, LogOut, Shield, Heart, Video, Phone } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationCenter, useNotifications } from "@/components/notifications/notification-center"
import { VideoCallModal } from "@/components/video/video-call-modal"

interface DashboardHeaderProps {
  userType: 'patient' | 'caregiver'
  userName: string
  notifications?: number
  connectionStatus: 'connected' | 'disconnected' | 'syncing'
}

export function DashboardHeader({ userType, userName, notifications = 0, connectionStatus }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState({
    id: 'margaret',
    name: 'Margaret Johnson',
    avatar: 'MJ',
    age: 78,
    location: 'Living Room',
    status: 'good' as const
  })

  const {
    notifications: notificationList,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationAction
  } = useNotifications()

  // Override the notifications count with actual notifications
  const actualNotificationCount = notificationList.filter(n => !n.isRead).length

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

          {/* Video Call Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowVideoCall(true)}
            title="Start Video Call"
          >
            <Video className="h-4 w-4" />
          </Button>

          {/* Emergency Call Button */}
          <Button
            variant="outline"
            size="icon"
            className="text-health-critical hover:bg-health-critical/10"
            onClick={() => {
              addNotification({
                type: 'critical',
                title: 'Emergency Call Initiated',
                message: 'Emergency services contacted. Response team dispatched.',
                patient: selectedPatient,
                isRead: false,
                isActionable: true,
                actions: [
                  { label: 'Cancel Call', type: 'destructive', onClick: () => console.log('Emergency call cancelled') },
                  { label: 'Update Status', type: 'secondary', onClick: () => console.log('Status updated') }
                ],
                priority: 'high',
                category: 'emergency'
              })
            }}
            title="Emergency Call"
          >
            <Phone className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-4 w-4" />
            {actualNotificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
              >
                {actualNotificationCount > 9 ? '9+' : actualNotificationCount}
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
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
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

      {/* Notification Center Modal */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notificationList}
        onNotificationAction={handleNotificationAction}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteNotification={deleteNotification}
      />

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        patient={selectedPatient}
      />
    </header>
  )
}