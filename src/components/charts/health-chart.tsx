import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { cn } from "@/lib/utils"

interface HealthChartProps {
  title: string
  description?: string
  data: Array<{
    time: string
    value: number
    status?: 'normal' | 'warning' | 'critical'
  }>
  type?: 'line' | 'area'
  color?: string
  unit?: string
  className?: string
}

export function HealthChart({
  title,
  description,
  data,
  type = 'line',
  color = 'hsl(var(--primary))',
  unit = '',
  className
}: HealthChartProps) {
  const formatTooltipValue = (value: number) => {
    return `${value}${unit}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-card p-3 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {formatTooltipValue(payload[0].value)}
          </p>
          {data.status && (
            <p className={cn(
              "text-xs mt-1",
              data.status === 'normal' && "text-health-good",
              data.status === 'warning' && "text-health-warning",
              data.status === 'critical' && "text-health-critical"
            )}>
              Status: {data.status}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#healthGradient)"
                />
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: color }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}