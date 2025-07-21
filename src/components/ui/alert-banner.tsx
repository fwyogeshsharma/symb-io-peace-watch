import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon, X } from "lucide-react"

interface AlertBannerProps {
  title: string
  description: string
  type: 'critical' | 'warning' | 'info'
  icon: LucideIcon
  timestamp?: string
  onDismiss?: () => void
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'secondary' | 'destructive'
  }>
  className?: string
}

const typeConfig = {
  critical: {
    container: 'border-health-critical bg-gradient-alert text-white shadow-alert',
    badge: 'bg-white/20 text-white border-white/30',
    icon: 'text-white',
    button: 'text-white border-white/30 hover:bg-white/10'
  },
  warning: {
    container: 'border-health-warning bg-gradient-to-r from-warning/10 to-warning/5 text-foreground',
    badge: 'bg-warning text-warning-foreground',
    icon: 'text-warning',
    button: 'text-foreground'
  },
  info: {
    container: 'border-primary bg-gradient-primary text-white',
    badge: 'bg-white/20 text-white border-white/30',
    icon: 'text-white',
    button: 'text-white border-white/30 hover:bg-white/10'
  }
}

export function AlertBanner({
  title,
  description,
  type,
  icon: Icon,
  timestamp,
  onDismiss,
  actions,
  className
}: AlertBannerProps) {
  const config = typeConfig[type]

  return (
    <Alert className={cn(
      "relative border-l-4 animate-in slide-in-from-top-2 duration-300",
      config.container,
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.icon)} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertTitle className="text-sm font-semibold">
              {title}
            </AlertTitle>
            <Badge variant="outline" className={cn("text-xs", config.badge)}>
              {type.toUpperCase()}
            </Badge>
          </div>
          
          <AlertDescription className="text-sm opacity-90">
            {description}
          </AlertDescription>
          
          {timestamp && (
            <div className="text-xs opacity-75 mt-1">
              {timestamp}
            </div>
          )}
          
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                  className={cn(
                    "text-xs h-8",
                    type === 'critical' && config.button,
                    type === 'info' && config.button
                  )}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className={cn(
              "h-6 w-6 flex-shrink-0",
              config.icon,
              type === 'critical' && "hover:bg-white/10",
              type === 'info' && "hover:bg-white/10"
            )}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  )
}