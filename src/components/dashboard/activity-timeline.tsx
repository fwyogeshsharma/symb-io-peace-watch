import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, MapPin, Activity, Pill, Heart, Zap } from "lucide-react"

interface TimelineEvent {
  id: string
  time: string
  title: string
  description: string
  type: 'movement' | 'medication' | 'vitals' | 'activity' | 'alert'
  status: 'normal' | 'warning' | 'attention'
  location?: string
}

interface ActivityTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const eventConfig = {
  movement: { icon: MapPin, color: 'text-primary', bg: 'bg-primary/10' },
  medication: { icon: Pill, color: 'text-accent', bg: 'bg-accent/10' },
  vitals: { icon: Heart, color: 'text-health-good', bg: 'bg-health-good/10' },
  activity: { icon: Activity, color: 'text-health-excellent', bg: 'bg-health-excellent/10' },
  alert: { icon: Zap, color: 'text-health-warning', bg: 'bg-health-warning/10' }
}

const statusConfig = {
  normal: { badge: 'bg-health-good/20 text-health-good border-health-good/30' },
  warning: { badge: 'bg-health-warning/20 text-health-warning border-health-warning/30' },
  attention: { badge: 'bg-primary/20 text-primary border-primary/30' }
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Today's activity and health monitoring updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {events.map((event, index) => {
            const config = eventConfig[event.type]
            const statusStyle = statusConfig[event.status]
            const Icon = config.icon
            
            return (
              <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-b-0 last:pb-0">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-1",
                  config.bg
                )}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {event.title}
                    </h4>
                    <Badge variant="outline" className={cn("text-xs", statusStyle.badge)}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{event.time}</span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}