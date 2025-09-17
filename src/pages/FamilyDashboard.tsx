import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { NotificationCenter, useNotifications } from "@/components/notifications/notification-center"
import { VideoCallModal } from "@/components/video/video-call-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Video,
  Bell,
  Shield,
  Thermometer,
  Battery,
  Wifi,
  Home,
  Users,
  TrendingUp,
  ArrowLeft,
  Mail,
  Star
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function FamilyDashboard() {
  const navigate = useNavigate()
  const [userType] = useState<'caregiver'>('caregiver')
  const [connectionStatus] = useState<'connected'>('connected')
  const [notifications] = useState(5)

  // Notification Center state
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const {
    notifications: alertNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationAction
  } = useNotifications()

  // Video Call state
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [selectedPatientForCall, setSelectedPatientForCall] = useState<any>(null)

  // Functions for handling video calls and alerts
  const handleVideoCall = (patient?: any) => {
    if (patient) {
      setSelectedPatientForCall(patient)
    } else {
      // Default to first patient if no specific patient selected
      setSelectedPatientForCall(familyMembers[0])
    }
    setIsVideoCallOpen(true)
  }

  const handleAlertsClick = () => {
    setIsNotificationCenterOpen(true)
  }

  const unreadAlertsCount = alertNotifications.filter(n => !n.isRead).length

  // Family members (patients being monitored)
  const familyMembers = [
    {
      id: 'mom',
      name: 'Margaret Johnson',
      relation: 'Mother',
      age: 78,
      location: 'Living Room',
      avatar: 'MJ',
      status: 'good',
      lastActive: '2 minutes ago',
      healthScore: 87,
      todayStats: {
        heartRate: 72,
        bloodPressure: '118/76',
        steps: 1847,
        medicationsTaken: 3,
        medicationsTotal: 3,
        sleepHours: 8.2,
        temperature: 98.4
      },
      alerts: [
        { type: 'info', message: 'Medication reminder: Evening blood pressure pill due in 30 minutes', time: '30 min' }
      ],
      devices: [
        { name: 'Smart Watch', status: 'connected', battery: 87 },
        { name: 'Pill Dispenser', status: 'connected', battery: 92 },
        { name: 'Sleep Monitor', status: 'connected', battery: 78 }
      ]
    },
    {
      id: 'dad',
      name: 'Robert Johnson Sr.',
      relation: 'Father',
      age: 82,
      location: 'Garden',
      avatar: 'RJ',
      status: 'warning',
      lastActive: '15 minutes ago',
      healthScore: 73,
      todayStats: {
        heartRate: 78,
        bloodPressure: '142/89',
        steps: 892,
        medicationsTaken: 2,
        medicationsTotal: 4,
        sleepHours: 6.8,
        temperature: 98.7
      },
      alerts: [
        { type: 'warning', message: 'Blood pressure elevated: 142/89 mmHg', time: '15 min' },
        { type: 'critical', message: 'Missed morning medication - Warfarin', time: '2 hours' }
      ],
      devices: [
        { name: 'BP Monitor', status: 'connected', battery: 65 },
        { name: 'Fall Detector', status: 'connected', battery: 43 },
        { name: 'GPS Tracker', status: 'connected', battery: 72 }
      ]
    },
    {
      id: 'grandma',
      name: 'Dorothy Williams',
      relation: 'Grandmother',
      age: 75,
      location: 'Bedroom',
      avatar: 'DW',
      status: 'excellent',
      lastActive: '5 minutes ago',
      healthScore: 94,
      todayStats: {
        heartRate: 68,
        bloodPressure: '115/72',
        steps: 2341,
        medicationsTaken: 2,
        medicationsTotal: 2,
        sleepHours: 9.1,
        temperature: 98.2
      },
      alerts: [],
      devices: [
        { name: 'Health Band', status: 'connected', battery: 91 },
        { name: 'Smart Scale', status: 'connected', battery: 88 },
        { name: 'Air Quality Monitor', status: 'connected', battery: 95 }
      ]
    },
    {
      id: 'uncle',
      name: 'Frank Rodriguez',
      relation: 'Uncle',
      age: 84,
      location: 'Living Room',
      avatar: 'FR',
      status: 'critical',
      lastActive: '25 minutes ago',
      healthScore: 65,
      todayStats: {
        heartRate: 65,
        bloodPressure: '158/95',
        steps: 456,
        medicationsTaken: 2,
        medicationsTotal: 5,
        sleepHours: 5.8,
        temperature: 99.1
      },
      alerts: [
        { type: 'critical', message: 'Irregular heart rhythm detected - Contact physician immediately', time: '25 min' },
        { type: 'critical', message: 'Missed 3 medications today - Diabetes management critical', time: '3 hours' },
        { type: 'warning', message: 'Elevated temperature: 99.1°F', time: '1 hour' }
      ],
      devices: [
        { name: 'Heart Monitor', status: 'connected', battery: 34 },
        { name: 'Glucose Monitor', status: 'disconnected', battery: 12 },
        { name: 'Fall Detector', status: 'connected', battery: 67 }
      ]
    }
  ]

  // Real-time updates simulation
  const [liveUpdates, setLiveUpdates] = useState({
    totalSteps: 5536,
    averageHeartRate: 71,
    medicationAdherence: 80,
    activeAlerts: 6
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdates(prev => ({
        totalSteps: prev.totalSteps + Math.floor(Math.random() * 10),
        averageHeartRate: 70 + Math.floor(Math.random() * 8),
        medicationAdherence: 80 + Math.floor(Math.random() * 15),
        activeAlerts: Math.max(1, prev.activeAlerts + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0))
      }))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent border-health-excellent/20 bg-health-excellent/10'
      case 'good': return 'text-health-good border-health-good/20 bg-health-good/10'
      case 'warning': return 'text-warning border-warning/20 bg-warning/10'
      case 'critical': return 'text-health-critical border-health-critical/20 bg-health-critical/10'
      default: return 'text-muted-foreground border-border bg-muted/10'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-health-critical bg-health-critical/5'
      case 'warning': return 'border-l-warning bg-warning/5'
      case 'info': return 'border-l-primary bg-primary/5'
      default: return 'border-l-muted bg-muted/5'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName="Sarah Johnson"
        notifications={notifications}
        connectionStatus={connectionStatus}
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Family Care Center</h1>
              <p className="text-muted-foreground">
                Real-time monitoring for your loved ones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="relative" onClick={handleAlertsClick}>
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              {unreadAlertsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadAlertsCount}
                </Badge>
              )}
            </Button>
            <Button className="bg-gradient-health" onClick={() => handleVideoCall()}>
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Button>
          </div>
        </div>

        {/* Family Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Family Members</p>
                  <p className="text-2xl font-bold text-primary">{familyMembers.length}</p>
                  <p className="text-xs text-health-good">All monitored 24/7</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-health-good">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Combined Steps</p>
                  <p className="text-2xl font-bold text-health-good">{liveUpdates.totalSteps.toLocaleString()}</p>
                  <p className="text-xs text-health-good">Today's total</p>
                </div>
                <Activity className="h-8 w-8 text-health-good" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health Score</p>
                  <p className="text-2xl font-bold text-success">{Math.round((87 + 73 + 94 + 65) / 4)}%</p>
                  <p className="text-xs text-success">+3% this week</p>
                </div>
                <Heart className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-warning">{liveUpdates.activeAlerts}</p>
                  <p className="text-xs text-health-critical">4 critical</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts Section */}
        <Card className="shadow-card border-l-4 border-l-health-critical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-health-critical" />
              Priority Alerts
              <Badge variant="destructive" className="text-xs">
                Immediate Attention
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-l-4 border-l-health-critical bg-health-critical/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Robert Johnson Sr. - Missed Critical Medication</p>
                    <p className="text-sm">Warfarin (blood thinner) not taken as scheduled. Contact immediately.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">
                      <Phone className="h-3 w-3 mr-1" />
                      Call Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-4 border-l-warning bg-warning/5">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Robert Johnson Sr. - Elevated Blood Pressure</p>
                    <p className="text-sm">Reading: 142/89 mmHg (15 minutes ago). Monitor closely.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Trends
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-4 border-l-health-critical bg-health-critical/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Frank Rodriguez - Irregular Heart Rhythm</p>
                    <p className="text-sm">Detected 25 minutes ago. Patient unresponsive to calls. Immediate medical attention required.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">
                      <Phone className="h-3 w-3 mr-1" />
                      Emergency Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Paramedics
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Alert className="border-l-4 border-l-health-critical bg-health-critical/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Frank Rodriguez - Critical Medication Missed</p>
                    <p className="text-sm">Diabetes medications not taken for 3 hours. Blood sugar management critical.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">
                      <Phone className="h-3 w-3 mr-1" />
                      Call Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Check Glucose
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Individual Family Member Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {familyMembers.map((member) => (
            <Card key={member.id} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder-${member.id}.jpg`} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.relation}, {member.age}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(member.status)}>
                    {member.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Location & Last Active */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{member.lastActive}</span>
                  </div>
                </div>

                {/* Health Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Health Score</span>
                    <span className="text-sm font-bold">{member.healthScore}%</span>
                  </div>
                  <Progress value={member.healthScore} className="h-2" />
                </div>

                {/* Today's Vital Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-health-critical" />
                      <span>{member.todayStats.heartRate} BPM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-primary" />
                      <span>{member.todayStats.bloodPressure}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-health-good" />
                      <span>{member.todayStats.steps.toLocaleString()} steps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-warning" />
                      <span>{member.todayStats.temperature}°F</span>
                    </div>
                  </div>
                </div>

                {/* Medication Status */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Pill className="h-3 w-3" />
                      Medications Today
                    </span>
                    <span className="text-sm">
                      {member.todayStats.medicationsTaken}/{member.todayStats.medicationsTotal}
                    </span>
                  </div>
                  <Progress
                    value={(member.todayStats.medicationsTaken / member.todayStats.medicationsTotal) * 100}
                    className="h-1.5"
                  />
                </div>

                {/* Device Status */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Connected Devices</p>
                  <div className="grid grid-cols-1 gap-1">
                    {member.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${device.status === 'connected' ? 'bg-health-good' : 'bg-health-critical'}`} />
                          <span>{device.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Battery className="h-3 w-3" />
                          <span className={device.battery < 50 ? 'text-health-critical' : 'text-muted-foreground'}>
                            {device.battery}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerts for this member */}
                {member.alerts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-warning">Active Alerts</p>
                    {member.alerts.map((alert, index) => (
                      <Alert key={index} className={`border-l-4 ${getAlertColor(alert.type)} p-2`}>
                        <AlertDescription className="text-xs">
                          <div className="flex justify-between items-start">
                            <span>{alert.message}</span>
                            <span className="text-muted-foreground whitespace-nowrap ml-2">{alert.time}</span>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleVideoCall(member)}>
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Family Communication Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Family Messages
              </CardTitle>
              <CardDescription>
                Recent communications and care coordination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  from: 'Dr. Martinez',
                  time: '2 hours ago',
                  message: 'Robert\'s blood pressure readings are concerning. Please ensure he takes his evening medication.',
                  priority: 'high'
                },
                {
                  from: 'Margaret Johnson',
                  time: '4 hours ago',
                  message: 'Feeling much better today! Took my morning walk and all medications on time.',
                  priority: 'low'
                },
                {
                  from: 'Care Coordinator',
                  time: '1 day ago',
                  message: 'Weekly health report ready for review. Dorothy\'s activity levels have improved significantly.',
                  priority: 'medium'
                }
              ].map((msg, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{msg.from}</span>
                    <div className="flex items-center gap-2">
                      {msg.priority === 'high' && <Badge variant="destructive" className="text-xs">High</Badge>}
                      {msg.priority === 'medium' && <Badge variant="outline" className="text-xs">Medium</Badge>}
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                View All Messages
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Care Schedule
              </CardTitle>
              <CardDescription>
                Upcoming appointments and care activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  time: 'Today 6:00 PM',
                  title: 'Evening Medication Reminder',
                  person: 'Margaret Johnson',
                  type: 'medication'
                },
                {
                  time: 'Tomorrow 10:00 AM',
                  title: 'Cardiology Appointment',
                  person: 'Robert Johnson Sr.',
                  type: 'appointment'
                },
                {
                  time: 'Tomorrow 2:00 PM',
                  title: 'Physical Therapy Session',
                  person: 'Dorothy Chen',
                  type: 'therapy'
                },
                {
                  time: 'Friday 9:00 AM',
                  title: 'Weekly Health Check-in',
                  person: 'All Family Members',
                  type: 'checkup'
                }
              ].map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border border-border/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'medication' ? 'bg-primary' :
                    event.type === 'appointment' ? 'bg-health-critical' :
                    event.type === 'therapy' ? 'bg-health-good' :
                    'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.person}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Family Satisfaction & Feedback */}
        <Card className="shadow-card border-l-4 border-l-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-success" />
              Family Satisfaction & Impact
            </CardTitle>
            <CardDescription>
              Your feedback helps us provide better care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Peace of Mind Score</p>
                <p className="text-3xl font-bold text-success">9.4/10</p>
                <p className="text-xs text-success">Family satisfaction rating</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Emergency Response Time</p>
                <p className="text-3xl font-bold text-primary">47 sec</p>
                <p className="text-xs text-muted-foreground">Average alert to family notification</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Health Improvements</p>
                <p className="text-3xl font-bold text-health-good">+23%</p>
                <p className="text-xs text-health-good">Overall health metrics since enrollment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={alertNotifications}
        onNotificationAction={handleNotificationAction}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDeleteNotification={deleteNotification}
      />

      {selectedPatientForCall && (
        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={() => {
            setIsVideoCallOpen(false)
            setSelectedPatientForCall(null)
          }}
          patient={{
            id: selectedPatientForCall.id,
            name: selectedPatientForCall.name,
            avatar: selectedPatientForCall.avatar,
            age: selectedPatientForCall.age,
            location: selectedPatientForCall.location,
            status: selectedPatientForCall.status
          }}
        />
      )}
    </div>
  )
}