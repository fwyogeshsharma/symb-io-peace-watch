import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface HealthMetricCardProps {
  title: string
  value: string | number
  unit?: string
  description?: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
  icon: LucideIcon
  trend?: 'up' | 'down' | 'stable'
  lastUpdated?: string
  className?: string
}

const statusConfig = {
  excellent: {
    badge: 'bg-health-excellent text-white',
    icon: 'text-health-excellent',
    bg: 'bg-gradient-to-br from-health-excellent/5 to-health-excellent/10'
  },
  good: {
    badge: 'bg-health-good text-white',
    icon: 'text-health-good',
    bg: 'bg-gradient-to-br from-health-good/5 to-health-good/10'
  },
  warning: {
    badge: 'bg-health-warning text-white',
    icon: 'text-health-warning',
    bg: 'bg-gradient-to-br from-health-warning/5 to-health-warning/10'
  },
  critical: {
    badge: 'bg-health-critical text-white',
    icon: 'text-health-critical',
    bg: 'bg-gradient-to-br from-health-critical/5 to-health-critical/10'
  }
}

export function HealthMetricCard({
  title,
  value,
  unit,
  description,
  status,
  icon: Icon,
  trend,
  lastUpdated,
  className
}: HealthMetricCardProps) {
  const config = statusConfig[status]

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-card hover:shadow-glow transition-all duration-300",
      config.bg,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn("text-xs", config.badge)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <Icon className={cn("h-4 w-4", config.icon)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          {unit && (
            <div className="text-sm text-muted-foreground">
              {unit}
            </div>
          )}
        </div>
        
        {description && (
          <CardDescription className="mt-1 text-xs">
            {description}
          </CardDescription>
        )}
        
        <div className="flex items-center justify-between mt-3">
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              trend === 'up' && "text-success",
              trend === 'down' && "text-destructive",
              trend === 'stable' && "text-muted-foreground"
            )}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'stable' && '→'}
              <span className="capitalize">{trend}</span>
            </div>
          )}
          
          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              {lastUpdated}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}