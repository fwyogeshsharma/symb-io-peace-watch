import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Bell,
  AlertTriangle,
  Heart,
  Pill,
  Activity,
  Phone,
  MessageSquare,
  CheckCircle,
  X,
  Clock,
  Calendar,
  Users,
  Stethoscope,
  Home,
  Zap,
  Settings,
  Volume2,
  BellOff,
  Filter,
  MoreHorizontal
} from "lucide-react"

interface Notification {
  id: string
  type: 'critical' | 'warning' | 'info' | 'medication' | 'appointment' | 'family' | 'system'
  title: string
  message: string
  patient?: {
    id: string
    name: string
    avatar: string
  }
  timestamp: Date
  isRead: boolean
  isActionable: boolean
  actions?: Array<{
    label: string
    type: 'primary' | 'secondary' | 'destructive'
    onClick: () => void
  }>
  priority: 'high' | 'medium' | 'low'
  category: 'health' | 'medication' | 'activity' | 'device' | 'appointment' | 'emergency'
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onNotificationAction: (notificationId: string, action: string) => void
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (notificationId: string) => void
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onNotificationAction,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('timestamp')
  const [playSound, setPlaySound] = useState(true)
  const [autoMarkRead, setAutoMarkRead] = useState(true)

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'all') return true
      if (filter === 'unread') return !notification.isRead
      if (filter === 'critical') return notification.type === 'critical'
      if (filter === 'today') {
        const today = new Date()
        return notification.timestamp.toDateString() === today.toDateString()
      }
      return notification.category === filter
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') return b.timestamp.getTime() - a.timestamp.getTime()
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-health-critical" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'medication': return <Pill className="h-4 w-4 text-primary" />
      case 'appointment': return <Calendar className="h-4 w-4 text-success" />
      case 'family': return <Users className="h-4 w-4 text-health-good" />
      case 'system': return <Settings className="h-4 w-4 text-muted-foreground" />
      default: return <Bell className="h-4 w-4 text-primary" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-health-critical bg-health-critical/5'
      case 'warning': return 'border-l-warning bg-warning/5'
      case 'medication': return 'border-l-primary bg-primary/5'
      case 'appointment': return 'border-l-success bg-success/5'
      case 'family': return 'border-l-health-good bg-health-good/5'
      case 'system': return 'border-l-muted bg-muted/5'
      default: return 'border-l-primary bg-primary/5'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>
      case 'medium': return <Badge variant="default" className="text-xs">Medium</Badge>
      case 'low': return <Badge variant="outline" className="text-xs">Low</Badge>
      default: return null
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.isRead).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Center
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} unread
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Manage alerts, medications, appointments, and system notifications
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all" onClick={() => setFilter('all')}>
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="critical" onClick={() => setFilter('critical')}>
                  Critical ({criticalCount})
                </TabsTrigger>
                <TabsTrigger value="health" onClick={() => setFilter('health')}>
                  Health
                </TabsTrigger>
                <TabsTrigger value="medication" onClick={() => setFilter('medication')}>
                  Medication
                </TabsTrigger>
                <TabsTrigger value="appointment" onClick={() => setFilter('appointment')}>
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="unread" onClick={() => setFilter('unread')}>
                  Unread ({unreadCount})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="flex-1 mt-4 mx-6 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`border-l-4 ${getTypeColor(notification.type)} ${
                        !notification.isRead ? 'bg-accent/5' : ''
                      } transition-all hover:shadow-md`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(notification.type)}
                          </div>

                          {notification.patient && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={`/placeholder-${notification.patient.id}.jpg`} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {notification.patient.avatar}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                {getPriorityBadge(notification.priority)}
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => onDeleteNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.patient && (
                                <span className="font-medium text-foreground">
                                  {notification.patient.name}:{' '}
                                </span>
                              )}
                              {notification.message}
                            </p>

                            {notification.isActionable && notification.actions && (
                              <div className="flex gap-2 flex-wrap">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={
                                      action.type === 'primary' ? 'default' :
                                      action.type === 'destructive' ? 'destructive' : 'outline'
                                    }
                                    onClick={() => {
                                      action.onClick()
                                      onNotificationAction(notification.id, action.label)
                                      if (!notification.isRead) {
                                        onMarkAsRead(notification.id)
                                      }
                                    }}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}

                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-6 text-xs"
                                onClick={() => onMarkAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Critical Tab */}
            <TabsContent value="critical" className="flex-1 mt-4 mx-6 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.filter(n => n.type === 'critical').map((notification) => (
                  <Alert key={notification.id} className="border-l-4 border-l-health-critical bg-health-critical/5">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{notification.title}</p>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {notification.actions && (
                          <div className="flex gap-2">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={action.type === 'primary' ? 'destructive' : 'outline'}
                                onClick={action.onClick}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>

            {/* Health Tab */}
            <TabsContent value="health" className="flex-1 mt-4 mx-6 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.filter(n => n.category === 'health').map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-l-4 ${getTypeColor(notification.type)} ${
                      !notification.isRead ? 'bg-accent/5' : ''
                    } transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        {notification.patient && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {notification.patient.avatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {getPriorityBadge(notification.priority)}
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.patient && (
                              <span className="font-medium text-foreground">
                                {notification.patient.name}:{' '}
                              </span>
                            )}
                            {notification.message}
                          </p>
                          {notification.isActionable && notification.actions && (
                            <div className="flex gap-2 flex-wrap">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={
                                    action.type === 'primary' ? 'default' :
                                    action.type === 'destructive' ? 'destructive' : 'outline'
                                  }
                                  onClick={() => {
                                    action.onClick()
                                    onNotificationAction(notification.id, action.label)
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Medication Tab */}
            <TabsContent value="medication" className="flex-1 mt-4 mx-6 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.filter(n => n.category === 'medication').map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-l-4 ${getTypeColor(notification.type)} ${
                      !notification.isRead ? 'bg-accent/5' : ''
                    } transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Pill className="h-4 w-4 text-primary mt-1" />
                        {notification.patient && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {notification.patient.avatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {getPriorityBadge(notification.priority)}
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.patient && (
                              <span className="font-medium text-foreground">
                                {notification.patient.name}:{' '}
                              </span>
                            )}
                            {notification.message}
                          </p>
                          {notification.isActionable && notification.actions && (
                            <div className="flex gap-2 flex-wrap">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={
                                    action.type === 'primary' ? 'default' :
                                    action.type === 'destructive' ? 'destructive' : 'outline'
                                  }
                                  onClick={() => {
                                    action.onClick()
                                    onNotificationAction(notification.id, action.label)
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointment" className="flex-1 mt-4 mx-6 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.filter(n => n.category === 'appointment').map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-l-4 ${getTypeColor(notification.type)} ${
                      !notification.isRead ? 'bg-accent/5' : ''
                    } transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-success mt-1" />
                        {notification.patient && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {notification.patient.avatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {getPriorityBadge(notification.priority)}
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.patient && (
                              <span className="font-medium text-foreground">
                                {notification.patient.name}:{' '}
                              </span>
                            )}
                            {notification.message}
                          </p>
                          {notification.isActionable && notification.actions && (
                            <div className="flex gap-2 flex-wrap">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={
                                    action.type === 'primary' ? 'default' :
                                    action.type === 'destructive' ? 'destructive' : 'outline'
                                  }
                                  onClick={() => {
                                    action.onClick()
                                    onNotificationAction(notification.id, action.label)
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Unread Tab */}
            <TabsContent value="unread" className="flex-1 mt-4 mx-6 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.filter(n => !n.isRead).map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-l-4 ${getTypeColor(notification.type)} bg-accent/10 transition-all hover:shadow-md`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        {notification.patient && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {notification.patient.avatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              {getPriorityBadge(notification.priority)}
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onMarkAsRead(notification.id)}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.patient && (
                              <span className="font-medium text-foreground">
                                {notification.patient.name}:{' '}
                              </span>
                            )}
                            {notification.message}
                          </p>
                          {notification.isActionable && notification.actions && (
                            <div className="flex gap-2 flex-wrap">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={
                                    action.type === 'primary' ? 'default' :
                                    action.type === 'destructive' ? 'destructive' : 'outline'
                                  }
                                  onClick={() => {
                                    action.onClick()
                                    onNotificationAction(notification.id, action.label)
                                    if (!notification.isRead) {
                                      onMarkAsRead(notification.id)
                                    }
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredNotifications.filter(n => !n.isRead).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-health-good opacity-50" />
                    <p className="text-muted-foreground">All notifications read!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer with notification settings */}
        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Sound alerts:</span>
                <Button
                  variant={playSound ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlaySound(!playSound)}
                >
                  {playSound ? "On" : "Off"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Auto-mark read:</span>
                <Button
                  variant={autoMarkRead ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoMarkRead(!autoMarkRead)}
                >
                  {autoMarkRead ? "On" : "Off"}
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    // CRITICAL NOTIFICATIONS
    {
      id: '1',
      type: 'critical',
      title: 'Critical Heart Rate Alert',
      message: 'Heart rate exceeded 120 BPM for more than 5 minutes. Immediate attention required.',
      patient: { id: 'robert', name: 'Robert Johnson Sr.', avatar: 'RJ' },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Call Patient', type: 'primary', onClick: () => console.log('Calling patient') },
        { label: 'Contact Emergency', type: 'destructive', onClick: () => console.log('Calling 911') },
        { label: 'View Details', type: 'secondary', onClick: () => console.log('View details') }
      ],
      priority: 'high',
      category: 'health'
    },
    {
      id: '7',
      type: 'critical',
      title: 'Fall Detection Alert',
      message: 'Possible fall detected in kitchen area. Patient is responsive.',
      patient: { id: 'frank', name: 'Frank Rodriguez', avatar: 'FR' },
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Call Emergency', type: 'destructive', onClick: () => console.log('Calling 911') },
        { label: 'Video Call Patient', type: 'primary', onClick: () => console.log('Starting video call') },
        { label: 'Call Family', type: 'secondary', onClick: () => console.log('Calling family') },
        { label: 'False Alarm', type: 'secondary', onClick: () => console.log('Marked as false alarm') }
      ],
      priority: 'high',
      category: 'emergency'
    },
    {
      id: '15',
      type: 'critical',
      title: 'Blood Pressure Crisis',
      message: 'Blood pressure reading 180/110 mmHg. Immediate medical attention required.',
      patient: { id: 'frank', name: 'Frank Rodriguez', avatar: 'FR' },
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Call 911', type: 'destructive', onClick: () => console.log('Calling 911') },
        { label: 'Contact Doctor', type: 'primary', onClick: () => console.log('Calling doctor') },
        { label: 'Notify Family', type: 'secondary', onClick: () => console.log('Notifying family') }
      ],
      priority: 'high',
      category: 'health'
    },

    // HEALTH NOTIFICATIONS
    {
      id: '6',
      type: 'info',
      title: 'Health Score Improvement',
      message: 'Weekly health score improved by 8 points. Great progress!',
      patient: { id: 'dorothy', name: 'Dorothy Williams', avatar: 'DW' },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: false,
      isActionable: false,
      priority: 'low',
      category: 'health'
    },
    {
      id: '8',
      type: 'warning',
      title: 'Irregular Sleep Pattern',
      message: 'Sleep duration below 6 hours for 3 consecutive nights. Consider consultation.',
      patient: { id: 'robert', name: 'Robert Johnson Sr.', avatar: 'RJ' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      isActionable: true,
      actions: [
        { label: 'Schedule Consultation', type: 'primary', onClick: () => console.log('Scheduling') },
        { label: 'View Sleep Data', type: 'secondary', onClick: () => console.log('Viewing sleep data') }
      ],
      priority: 'medium',
      category: 'health'
    },
    {
      id: '9',
      type: 'info',
      title: 'Activity Goal Achieved',
      message: 'Margaret completed 2,500 steps today - exceeding her daily goal!',
      patient: { id: 'margaret', name: 'Margaret Johnson', avatar: 'MJ' },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      isActionable: false,
      priority: 'low',
      category: 'health'
    },
    {
      id: '16',
      type: 'warning',
      title: 'Weight Fluctuation',
      message: 'Weight increased by 4 lbs in 2 days. Monitor fluid retention.',
      patient: { id: 'margaret', name: 'Margaret Johnson', avatar: 'MJ' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Contact Nurse', type: 'primary', onClick: () => console.log('Contacting nurse') },
        { label: 'Review Diet', type: 'secondary', onClick: () => console.log('Reviewing diet') }
      ],
      priority: 'medium',
      category: 'health'
    },

    // MEDICATION NOTIFICATIONS
    {
      id: '2',
      type: 'medication',
      title: 'Medication Missed',
      message: 'Morning blood pressure medication not taken as scheduled.',
      patient: { id: 'margaret', name: 'Margaret Johnson', avatar: 'MJ' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Send Reminder', type: 'primary', onClick: () => console.log('Reminder sent') },
        { label: 'Call Patient', type: 'secondary', onClick: () => console.log('Calling patient') },
        { label: 'Mark as Taken', type: 'secondary', onClick: () => console.log('Marked as taken') }
      ],
      priority: 'medium',
      category: 'medication'
    },
    {
      id: '10',
      type: 'medication',
      title: 'Prescription Refill Due',
      message: 'Insulin prescription expires in 3 days. Refill needed.',
      patient: { id: 'frank', name: 'Frank Rodriguez', avatar: 'FR' },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Order Refill', type: 'primary', onClick: () => console.log('Ordering refill') },
        { label: 'Contact Pharmacy', type: 'secondary', onClick: () => console.log('Contacting pharmacy') }
      ],
      priority: 'medium',
      category: 'medication'
    },
    {
      id: '11',
      type: 'medication',
      title: 'Medication Taken Successfully',
      message: 'Evening medications taken on time. Excellent adherence!',
      patient: { id: 'dorothy', name: 'Dorothy Williams', avatar: 'DW' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      isActionable: false,
      priority: 'low',
      category: 'medication'
    },
    {
      id: '17',
      type: 'medication',
      title: 'Dosage Adjustment Needed',
      message: 'Blood pressure medication may need adjustment based on recent readings.',
      patient: { id: 'robert', name: 'Robert Johnson Sr.', avatar: 'RJ' },
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Schedule Review', type: 'primary', onClick: () => console.log('Scheduling review') },
        { label: 'Contact Doctor', type: 'secondary', onClick: () => console.log('Contacting doctor') }
      ],
      priority: 'medium',
      category: 'medication'
    },

    // APPOINTMENT NOTIFICATIONS
    {
      id: '3',
      type: 'appointment',
      title: 'Upcoming Appointment Reminder',
      message: 'Cardiology appointment with Dr. Martinez tomorrow at 10:00 AM.',
      patient: { id: 'robert', name: 'Robert Johnson Sr.', avatar: 'RJ' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      isActionable: true,
      actions: [
        { label: 'Confirm', type: 'primary', onClick: () => console.log('Appointment confirmed') },
        { label: 'Reschedule', type: 'secondary', onClick: () => console.log('Rescheduling') }
      ],
      priority: 'medium',
      category: 'appointment'
    },
    {
      id: '12',
      type: 'appointment',
      title: 'Lab Results Available',
      message: 'Blood work results from last week are ready for review.',
      patient: { id: 'margaret', name: 'Margaret Johnson', avatar: 'MJ' },
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'View Results', type: 'primary', onClick: () => console.log('Viewing results') },
        { label: 'Schedule Follow-up', type: 'secondary', onClick: () => console.log('Scheduling follow-up') }
      ],
      priority: 'medium',
      category: 'appointment'
    },
    {
      id: '13',
      type: 'appointment',
      title: 'Physical Therapy Session',
      message: 'Reminder: Physical therapy session today at 2:00 PM.',
      patient: { id: 'dorothy', name: 'Dorothy Williams', avatar: 'DW' },
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Confirm Attendance', type: 'primary', onClick: () => console.log('Confirmed') },
        { label: 'Reschedule', type: 'secondary', onClick: () => console.log('Rescheduling') }
      ],
      priority: 'medium',
      category: 'appointment'
    },
    {
      id: '18',
      type: 'appointment',
      title: 'Annual Wellness Exam Due',
      message: 'Annual wellness exam is due. Please schedule within 30 days.',
      patient: { id: 'frank', name: 'Frank Rodriguez', avatar: 'FR' },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: true,
      isActionable: true,
      actions: [
        { label: 'Schedule Exam', type: 'primary', onClick: () => console.log('Scheduling exam') },
        { label: 'View Guidelines', type: 'secondary', onClick: () => console.log('Viewing guidelines') }
      ],
      priority: 'low',
      category: 'appointment'
    },

    // FAMILY/CAREGIVER NOTIFICATIONS
    {
      id: '4',
      type: 'family',
      title: 'Family Member Check-in',
      message: 'Sarah Johnson (daughter) requested health update for Margaret.',
      patient: { id: 'margaret', name: 'Margaret Johnson', avatar: 'MJ' },
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: true,
      isActionable: true,
      actions: [
        { label: 'Share Report', type: 'primary', onClick: () => console.log('Report shared') },
        { label: 'Call Family', type: 'secondary', onClick: () => console.log('Calling family') }
      ],
      priority: 'low',
      category: 'health'
    },
    {
      id: '14',
      type: 'family',
      title: 'Weekly Health Summary',
      message: 'Weekly health summary ready for family review.',
      patient: { id: 'dorothy', name: 'Dorothy Williams', avatar: 'DW' },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Send Summary', type: 'primary', onClick: () => console.log('Sending summary') },
        { label: 'Schedule Call', type: 'secondary', onClick: () => console.log('Scheduling call') }
      ],
      priority: 'low',
      category: 'health'
    },

    // SYSTEM/DEVICE NOTIFICATIONS
    {
      id: '5',
      type: 'system',
      title: 'Device Battery Low',
      message: 'Smart watch battery at 15%. Please remind patient to charge device.',
      patient: { id: 'frank', name: 'Frank Rodriguez', avatar: 'FR' },
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: false,
      isActionable: true,
      actions: [
        { label: 'Send Charging Reminder', type: 'primary', onClick: () => console.log('Reminder sent') },
        { label: 'Call Patient', type: 'secondary', onClick: () => console.log('Calling patient') }
      ],
      priority: 'low',
      category: 'device'
    },
    {
      id: '19',
      type: 'system',
      title: 'System Update Available',
      message: 'New SymbIOT system update available with improved health monitoring.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      isActionable: true,
      actions: [
        { label: 'Install Update', type: 'primary', onClick: () => console.log('Installing update') },
        { label: 'View Changes', type: 'secondary', onClick: () => console.log('Viewing changes') }
      ],
      priority: 'low',
      category: 'device'
    },
    {
      id: '20',
      type: 'system',
      title: 'Device Connectivity Restored',
      message: 'All monitoring devices are now connected and functioning normally.',
      patient: { id: 'margaret', name: 'Margaret Johnson', avatar: 'MJ' },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      isActionable: false,
      priority: 'low',
      category: 'device'
    }
  ])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const handleNotificationAction = (notificationId: string, action: string) => {
    console.log(`Action "${action}" performed on notification ${notificationId}`)
    // Here you would typically handle the specific action
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationAction
  }
}