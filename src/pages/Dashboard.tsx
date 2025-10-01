import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { HealthMetricCard } from "@/components/ui/health-metric-card"
import { AlertBanner } from "@/components/ui/alert-banner"
import { HealthChart } from "@/components/charts/health-chart"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { MultiPatientChart } from "@/components/charts/multi-patient-chart"
import { LiveMonitoringGrid } from "@/components/charts/live-monitoring-grid"
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
  Smartphone,
  Shield,
  Users,
  Send,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  FileText
} from "lucide-react"
import dashboardHero from "@/assets/dashboard-hero.jpg"
import elderlyHome from "@/assets/elderly-home.jpg"

export default function Dashboard() {
  const [userType] = useState<'patient' | 'caregiver'>('patient')
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected')
  const [notifications] = useState(2)

  // Alert notification state
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Function to handle medication actions
  const handleMedicationTaken = () => {
    setNotificationMessage("✅ Medication marked as taken. Caregiver has been notified.")
    setShowNotificationPopup(true)
    toast.success("Medication recorded successfully!", {
      description: "Your caregiver and healthcare team have been notified.",
      duration: 4000
    })

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowNotificationPopup(false)
    }, 3000)
  }

  const handleSnoozeReminder = () => {
    setNotificationMessage("⏰ Reminder snoozed for 10 minutes. We'll remind you again soon.")
    setShowNotificationPopup(true)
    toast.info("Reminder snoozed", {
      description: "You'll receive another reminder in 10 minutes.",
      duration: 3000
    })

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowNotificationPopup(false)
    }, 3000)
  }

  // Live heart rate data for multiple patients
  const [liveHeartRateData, setLiveHeartRateData] = useState([
    {
      id: 'margaret',
      name: 'Margaret Johnson',
      avatar: 'MJ',
      photo: '/images (2).jfif',
      color: '#3b82f6', // blue-500
      currentRate: 72,
      data: [65, 68, 72, 75, 70, 67, 72, 74, 71, 73, 75, 72]
    },
    {
      id: 'robert',
      name: 'Robert Johnson Sr.',
      avatar: 'RJ',
      photo: '/images.jfif',
      color: '#60a5fa', // blue-400
      currentRate: 78,
      data: [78, 82, 85, 79, 88, 84, 86, 89, 83, 87, 85, 78]
    },
    {
      id: 'dorothy',
      name: 'Dorothy Williams',
      avatar: 'DW',
      photo: '/images (1).jfif',
      color: '#93c5fd', // blue-300
      currentRate: 68,
      data: [68, 70, 67, 69, 71, 68, 70, 69, 67, 70, 68, 68]
    },
    {
      id: 'frank',
      name: 'Frank Rodriguez',
      avatar: 'FR',
      photo: '/download.jpg',
      color: '#bfdbfe', // blue-200
      currentRate: 65,
      data: [65, 89, 92, 67, 95, 88, 91, 94, 69, 87, 85, 65]
    }
  ])

  // Real-time updates for heart rate data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveHeartRateData(prev => prev.map(patient => {
        const newRate = patient.id === 'margaret' ? 70 + Math.random() * 8 :
                       patient.id === 'robert' ? 75 + Math.random() * 15 :
                       patient.id === 'dorothy' ? 66 + Math.random() * 6 :
                       patient.id === 'frank' ? 60 + Math.random() * 35 : 70

        return {
          ...patient,
          currentRate: Math.round(newRate),
          data: [...patient.data.slice(1), Math.round(newRate)]
        }
      }))
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

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
              { label: "Mark as Taken", onClick: handleMedicationTaken },
              { label: "Snooze 10min", onClick: handleSnoozeReminder, variant: "secondary" }
            ]}
          />
        )}

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric, index) => (
            <HealthMetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Interactive Multi-Patient Analytics */}
        <MultiPatientChart />

        {/* Live Patient Monitoring Grid */}
        <LiveMonitoringGrid />

        {/* Individual Patient Charts and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Live Heart Rate Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-health-critical" />
                  Live Heart Rate Monitoring
                  <Badge variant="outline" className="bg-primary/10 text-primary animate-pulse">
                    Live Data
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time heart rate tracking for all monitored patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Values Display */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {liveHeartRateData.map((patient) => (
                      <div key={patient.id} className="text-center p-3 border border-border/50 rounded-lg">
                        <div className="flex flex-col items-center gap-2 mb-2">
                          <img
                            src={patient.photo}
                            alt={patient.name}
                            className="w-12 h-12 rounded-full object-cover border-2"
                            style={{ borderColor: patient.color }}
                          />
                          <span className="text-xs font-medium">{patient.name.split(' ')[0]}</span>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: patient.color }}>
                          {patient.currentRate}
                        </p>
                        <p className="text-xs text-muted-foreground">BPM</p>
                      </div>
                    ))}
                  </div>

                  {/* Live Chart */}
                  <div className="h-64 relative">
                    <svg className="w-full h-full" viewBox="0 0 800 200">
                      {/* Grid lines */}
                      {Array.from({ length: 5 }, (_, i) => (
                        <line
                          key={`grid-${i}`}
                          x1="0"
                          y1={40 + i * 30}
                          x2="800"
                          y2={40 + i * 30}
                          stroke="hsl(var(--border))"
                          strokeWidth="0.5"
                          opacity="0.3"
                        />
                      ))}

                      {/* Y-axis labels */}
                      {Array.from({ length: 5 }, (_, i) => (
                        <text
                          key={`y-label-${i}`}
                          x="10"
                          y={45 + i * 30}
                          fontSize="10"
                          fill="hsl(var(--muted-foreground))"
                          textAnchor="start"
                        >
                          {120 - i * 20}
                        </text>
                      ))}

                      {/* Patient heart rate lines */}
                      {liveHeartRateData.map((patient, patientIndex) => {
                        const points = patient.data.map((value, index) => {
                          const x = 50 + (index * (750 / 11))
                          const y = 160 - ((value - 40) / 80) * 120
                          return `${x},${Math.max(40, Math.min(160, y))}`
                        }).join(' ')

                        // Check if patient has critical heart rate (>100 or <60)
                        const isCritical = patient.currentRate > 100 || patient.currentRate < 60
                        const lineColor = isCritical ? '#EF4444' : patient.color // red for critical

                        return (
                          <g key={patient.id}>
                            {/* Line path */}
                            <polyline
                              points={points}
                              fill="none"
                              stroke={lineColor}
                              strokeWidth="2"
                              className="transition-all duration-300"
                              style={{ opacity: 0.8 }}
                            />

                            {/* Data points */}
                            {patient.data.map((value, index) => {
                              const x = 50 + (index * (750 / 11))
                              const y = 160 - ((value - 40) / 80) * 120
                              const isLatest = index === patient.data.length - 1
                              const isPointCritical = value > 100 || value < 60

                              return (
                                <circle
                                  key={`${patient.id}-point-${index}`}
                                  cx={x}
                                  cy={Math.max(40, Math.min(160, y))}
                                  r={isLatest ? "4" : "2"}
                                  fill={isPointCritical ? '#EF4444' : patient.color}
                                  className={`transition-all duration-300 ${isLatest ? 'animate-pulse' : ''}`}
                                  style={{ opacity: isLatest ? 1 : 0.7 }}
                                >
                                  <title>{`${patient.name}: ${value} BPM at ${index < 6 ? `${6-index}h ago` : `${index-6}h ago`}`}</title>
                                </circle>
                              )
                            })}

                            {/* Patient label on the right */}
                            <text
                              x="760"
                              y={160 - ((patient.currentRate - 40) / 80) * 120}
                              fontSize="10"
                              fill={lineColor}
                              textAnchor="start"
                              className="font-medium"
                            >
                              {patient.avatar} - {patient.currentRate}
                            </text>
                          </g>
                        )
                      })}

                      {/* X-axis labels */}
                      {Array.from({ length: 12 }, (_, timeIndex) => (
                        <text
                          key={`x-label-${timeIndex}`}
                          x={50 + (timeIndex * (750 / 11))}
                          y="185"
                          fontSize="10"
                          fill="hsl(var(--muted-foreground))"
                          textAnchor="middle"
                        >
                          {timeIndex < 6 ? `${6-timeIndex}h` : `${timeIndex-6}h`}
                        </text>
                      ))}
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    {liveHeartRateData.map((patient) => (
                      <div key={patient.id} className="flex items-center gap-2">
                        <img
                          src={patient.photo}
                          alt={patient.name}
                          className="w-6 h-6 rounded-full object-cover border"
                          style={{ borderColor: patient.color }}
                        />
                        <span className="text-sm font-medium">{patient.name}</span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: patient.color,
                            color: patient.color
                          }}
                        >
                          {patient.currentRate} BPM
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Alert Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Alert Status</h4>
                      {liveHeartRateData.map((patient) => {
                        const isAbnormal = patient.currentRate > 100 || patient.currentRate < 60
                        const isCritical = patient.currentRate > 120 || patient.currentRate < 50

                        return (
                          <div key={patient.id} className="flex items-center justify-between text-xs">
                            <span>{patient.name}</span>
                            <Badge variant={isCritical ? "destructive" : isAbnormal ? "default" : "outline"}>
                              {isCritical ? "Critical" : isAbnormal ? "Warning" : "Normal"}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Live Updates</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-health-good animate-pulse" />
                          <span>Data refreshing every 3 seconds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-health-good" />
                          <span>All devices connected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-primary" />
                          <span>HIPAA compliant monitoring</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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

        {/* Feature Showcase - Navigation to Advanced Features */}
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              SymbIOT Platform Features
            </CardTitle>
            <CardDescription>
              Explore our comprehensive healthcare monitoring ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Button
                variant="outline"
                className="h-16 flex-col gap-2"
                onClick={() => window.location.href = '/analytics'}
              >
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-sm">AI Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-2"
                onClick={() => window.location.href = '/family-dashboard'}
              >
                <Users className="w-6 h-6 text-health-good" />
                <span className="text-sm">Family Dashboard</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-2 border-primary/50 hover:border-primary"
                onClick={() => window.location.href = '/geofencing'}
              >
                <MapPin className="w-6 h-6 text-primary" />
                <span className="text-sm font-semibold">Geofencing</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-2"
                onClick={() => window.location.href = '/emergency'}
              >
                <AlertTriangle className="w-6 h-6 text-health-critical" />
                <span className="text-sm">Emergency Center</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col gap-2"
                onClick={() => window.location.href = '/provider-portal'}
              >
                <Shield className="w-6 h-6 text-success" />
                <span className="text-sm">Provider Portal</span>
              </Button>
            </div>
          </CardContent>
        </Card>

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

      {/* Notification Popup Modal */}
      <Dialog open={showNotificationPopup} onOpenChange={setShowNotificationPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-health-good" />
              Action Completed
            </DialogTitle>
            <DialogDescription>
              Your action has been recorded and relevant parties have been notified.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <p className="text-sm font-medium text-center p-4 bg-health-good/10 rounded-lg border border-health-good/20">
                {notificationMessage}
              </p>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-3 w-3" />
                  <span>Notifications sent to:</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>Family Members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>Healthcare Team</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>Care Coordinator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setShowNotificationPopup(false)} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}