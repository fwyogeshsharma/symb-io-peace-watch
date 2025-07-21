import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { HealthMetricCard } from "@/components/ui/health-metric-card"
import { AlertBanner } from "@/components/ui/alert-banner"
import { HealthChart } from "@/components/charts/health-chart"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Pill,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone
} from "lucide-react"
import dashboardHero from "@/assets/dashboard-hero.jpg"
import elderlyHome from "@/assets/elderly-home.jpg"

export default function Dashboard() {
  const [userType] = useState<'patient' | 'caregiver'>('patient')
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected')
  const [notifications] = useState(2)

  // Sample data
  const healthMetrics = [
    {
      title: "Heart Rate",
      value: 72,
      unit: "BPM",
      description: "Within normal range",
      status: 'good' as const,
      icon: Heart,
      trend: 'stable' as const,
      lastUpdated: "2 min ago"
    },
    {
      title: "Blood Pressure",
      value: "118/76",
      unit: "mmHg",
      description: "Optimal range",
      status: 'excellent' as const,
      icon: Activity,
      trend: 'down' as const,
      lastUpdated: "5 min ago"
    },
    {
      title: "Temperature",
      value: 98.6,
      unit: "°F",
      description: "Normal body temperature",
      status: 'good' as const,
      icon: Thermometer,
      trend: 'stable' as const,
      lastUpdated: "10 min ago"
    },
    {
      title: "Hydration",
      value: 85,
      unit: "%",
      description: "Good hydration level",
      status: 'good' as const,
      icon: Droplets,
      trend: 'up' as const,
      lastUpdated: "1 hour ago"
    }
  ]

  const heartRateData = [
    { time: '6AM', value: 65, status: 'normal' as const },
    { time: '9AM', value: 68, status: 'normal' as const },
    { time: '12PM', value: 72, status: 'normal' as const },
    { time: '3PM', value: 75, status: 'normal' as const },
    { time: '6PM', value: 70, status: 'normal' as const },
    { time: '9PM', value: 67, status: 'normal' as const }
  ]

  const activityData = [
    { time: '6AM', value: 20 },
    { time: '9AM', value: 85 },
    { time: '12PM', value: 60 },
    { time: '3PM', value: 45 },
    { time: '6PM', value: 70 },
    { time: '9PM', value: 30 }
  ]

  const timelineEvents = [
    {
      id: '1',
      time: '2:30 PM',
      title: 'Medication Taken',
      description: 'Blood pressure medication taken as scheduled',
      type: 'medication' as const,
      status: 'normal' as const,
      location: 'Kitchen'
    },
    {
      id: '2',
      time: '1:15 PM',
      title: 'Activity Detected',
      description: 'Movement in living room for 15 minutes',
      type: 'activity' as const,
      status: 'normal' as const,
      location: 'Living Room'
    },
    {
      id: '3',
      time: '12:00 PM',
      title: 'Vitals Check',
      description: 'Heart rate: 72 BPM, Blood pressure: 118/76 mmHg',
      type: 'vitals' as const,
      status: 'normal' as const
    },
    {
      id: '4',
      time: '10:30 AM',
      title: 'Morning Routine',
      description: 'Movement detected in bedroom and bathroom',
      type: 'movement' as const,
      status: 'normal' as const,
      location: 'Bedroom'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName="Margaret Johnson"
        notifications={notifications}
        connectionStatus={connectionStatus}
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="h-64 bg-cover bg-center bg-gradient-to-r from-primary/20 to-primary/5"
            style={{ backgroundImage: `url(${dashboardHero})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
            <div className="relative h-full flex items-center justify-between p-8 text-white">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Good afternoon, Margaret!</h1>
                <p className="text-primary-foreground/90">
                  Your health is looking great today. All systems are monitoring normally.
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    All Clear
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src={elderlyHome} 
                  alt="Peaceful home environment" 
                  className="w-48 h-32 object-cover rounded-lg shadow-glow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner (conditional) */}
        {notifications > 0 && (
          <AlertBanner
            type="info"
            icon={Clock}
            title="Medication Reminder"
            description="Time to take your evening blood pressure medication"
            timestamp="Due in 30 minutes"
            actions={[
              { label: "Mark as Taken", onClick: () => console.log("Marked as taken") },
              { label: "Snooze 10min", onClick: () => console.log("Snoozed"), variant: "secondary" }
            ]}
          />
        )}

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric, index) => (
            <HealthMetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HealthChart
              title="Heart Rate Trend"
              description="Today's heart rate monitoring"
              data={heartRateData}
              type="area"
              color="hsl(var(--health-good))"
              unit=" BPM"
            />
            
            <HealthChart
              title="Daily Activity"
              description="Activity levels throughout the day"
              data={activityData}
              type="line"
              color="hsl(var(--primary))"
              unit=" steps"
            />
          </div>

          <div>
            <ActivityTimeline events={timelineEvents} />
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and emergency contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-12 bg-gradient-health hover:bg-gradient-to-r hover:from-health-good hover:to-health-excellent">
                Call Family
              </Button>
              <Button variant="outline" className="h-12">
                <Pill className="w-4 h-4 mr-2" />
                Medication Log
              </Button>
              <Button variant="outline" className="h-12 border-health-critical text-health-critical hover:bg-health-critical/10">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}