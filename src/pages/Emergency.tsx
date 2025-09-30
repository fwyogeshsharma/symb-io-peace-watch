import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  Heart,
  Activity,
  Zap,
  Shield,
  Users,
  Ambulance,
  Hospital,
  PhoneCall,
  MessageSquare,
  Navigation,
  Timer,
  CheckCircle,
  XCircle,
  Siren,
  ArrowLeft,
  Video,
  Mic,
  Volume2
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Emergency() {
  const navigate = useNavigate()
  const [userType] = useState<'caregiver'>('caregiver')
  const [connectionStatus] = useState<'connected'>('connected')
  const [notifications] = useState(8)

  // Emergency state
  const [activeEmergency, setActiveEmergency] = useState(true)
  const [emergencyStartTime] = useState(new Date(Date.now() - 127000)) // 2 min 7 sec ago
  const [responseTime, setResponseTime] = useState(127)

  // Current emergency details
  const currentEmergency = {
    id: 'EMG-2024-0847',
    patient: {
      name: 'Robert Johnson Sr.',
      age: 82,
      location: 'Kitchen',
      address: '1247 Oak Street, Springfield, IL 62704',
      medicalConditions: ['Heart Disease', 'Arthritis', 'Hypertension'],
      medications: ['Warfarin 5mg', 'Atorvastatin 40mg', 'Lisinopril 10mg'],
      allergies: ['Penicillin', 'Shellfish'],
      bloodType: 'A+',
      avatar: 'RJ',
      photo: '/images.jfif'
    },
    trigger: {
      type: 'Fall Detection',
      device: 'Smart Pendant',
      confidence: 94,
      vitalSigns: {
        heartRate: 112,
        bloodPressure: '165/95',
        bodyPosition: 'Horizontal (Floor)',
        movement: 'None detected',
        consciousness: 'Responsive'
      }
    },
    coordinates: {
      lat: 39.7817,
      lng: -89.6501,
      accuracy: '±3m'
    }
  }

  // Emergency contacts
  const emergencyContacts = [
    {
      id: 1,
      name: 'Sarah Johnson (Daughter)',
      relationship: 'Primary Contact',
      phone: '+1 (555) 123-4567',
      status: 'contacted',
      responseTime: '45 seconds',
      location: 'En route (ETA: 12 min)'
    },
    {
      id: 2,
      name: 'Dr. Martinez (Cardiologist)',
      relationship: 'Primary Physician',
      phone: '+1 (555) 987-6543',
      status: 'contacted',
      responseTime: '78 seconds',
      location: 'Springfield Medical Center'
    },
    {
      id: 3,
      name: 'Emergency Services',
      relationship: '911 Dispatch',
      phone: '911',
      status: 'dispatched',
      responseTime: '23 seconds',
      location: 'Ambulance dispatched (ETA: 6 min)'
    },
    {
      id: 4,
      name: 'Michael Johnson (Son)',
      relationship: 'Secondary Contact',
      phone: '+1 (555) 456-7890',
      status: 'notified',
      responseTime: '67 seconds',
      location: 'Chicago, IL (Traveling)'
    }
  ]

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted': return 'bg-health-good text-white'
      case 'dispatched': return 'bg-primary text-white'
      case 'notified': return 'bg-warning text-white'
      case 'pending': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName="Emergency Response Center"
        notifications={notifications}
        connectionStatus={connectionStatus}
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* Emergency Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/family-dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Siren className="h-8 w-8 text-health-critical animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-health-critical rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-health-critical">EMERGENCY ACTIVE</h1>
                <p className="text-muted-foreground">
                  Emergency ID: {currentEmergency.id} • Duration: {formatTime(responseTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="animate-pulse text-sm px-3 py-1">
              PRIORITY 1 - FALL DETECTED
            </Badge>
            <Button size="lg" className="bg-health-critical hover:bg-health-critical/90 text-white">
              <Ambulance className="h-5 w-5 mr-2" />
              Contact 911
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information & Status */}
          <div className="lg:col-span-2 space-y-6">

            {/* Patient Details */}
            <Card className="shadow-card border-l-4 border-l-health-critical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-health-critical" />
                  Patient Information
                  <Badge variant="destructive">Critical</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentEmergency.patient.photo}
                        alt={currentEmergency.patient.name}
                        className="h-16 w-16 rounded-full object-cover border-4 border-health-critical animate-pulse"
                      />
                      <div>
                        <h3 className="text-xl font-bold">{currentEmergency.patient.name}</h3>
                        <p className="text-muted-foreground">Age {currentEmergency.patient.age}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-health-critical" />
                          <span className="font-medium">{currentEmergency.patient.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Current Location</h4>
                      <p className="text-sm">{currentEmergency.patient.address}</p>
                      <p className="text-xs text-muted-foreground">
                        GPS: {currentEmergency.coordinates.lat}, {currentEmergency.coordinates.lng}
                        (Accuracy: {currentEmergency.coordinates.accuracy})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Medical Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Blood Type:</strong> {currentEmergency.patient.bloodType}</p>
                        <p><strong>Conditions:</strong> {currentEmergency.patient.medicalConditions.join(', ')}</p>
                        <p><strong>Allergies:</strong> {currentEmergency.patient.allergies.join(', ')}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Current Medications</h4>
                      <ul className="text-sm space-y-1">
                        {currentEmergency.patient.medications.map((med, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            {med}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Details */}
            <Card className="shadow-card border-l-4 border-l-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Emergency Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Trigger Event</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{currentEmergency.trigger.type}</Badge>
                          <span className="text-sm">Confidence: {currentEmergency.trigger.confidence}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Detected by: {currentEmergency.trigger.device}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Time: {emergencyStartTime.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Response Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Fall detected</span>
                          <span className="text-muted-foreground">00:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Family notified</span>
                          <span className="text-muted-foreground">00:23</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Emergency services contacted</span>
                          <span className="text-muted-foreground">00:45</span>
                        </div>
                        <div className="flex justify-between text-health-good">
                          <span>First responder en route</span>
                          <span>01:12</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Current Vital Signs</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-health-critical" />
                            <span className="text-sm">Heart Rate</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-health-critical">{currentEmergency.trigger.vitalSigns.heartRate} BPM</span>
                            <p className="text-xs text-muted-foreground">Elevated</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-warning" />
                            <span className="text-sm">Blood Pressure</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-warning">{currentEmergency.trigger.vitalSigns.bloodPressure} mmHg</span>
                            <p className="text-xs text-muted-foreground">High</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-health-critical" />
                            <span className="text-sm">Position</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-health-critical">{currentEmergency.trigger.vitalSigns.bodyPosition}</span>
                            <p className="text-xs text-muted-foreground">Fall detected</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Movement</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-muted-foreground">{currentEmergency.trigger.vitalSigns.movement}</span>
                            <p className="text-xs text-muted-foreground">Monitoring</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Communication */}
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Live Communication
                  <Badge variant="outline" className="bg-health-good/10 text-health-good">
                    Connected
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Two-way communication with patient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-l-4 border-l-health-good bg-health-good/5">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Patient is responsive and conscious</p>
                          <p className="text-sm">Last communication: 30 seconds ago</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-health-good hover:bg-health-good/90">
                            <Mic className="h-3 w-3 mr-1" />
                            Speak
                          </Button>
                          <Button size="sm" variant="outline">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Listen
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                    <Button variant="outline" className="w-full">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Voice Call
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Response Sidebar */}
          <div className="space-y-6">

            {/* Response Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-health-critical" />
                  Response Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-health-critical">{formatTime(responseTime)}</div>
                  <p className="text-sm text-muted-foreground">Emergency Duration</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Services</span>
                    <Badge className="bg-health-good text-white">Dispatched</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Family Contacted</span>
                    <Badge className="bg-health-good text-white">En Route</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medical Team</span>
                    <Badge className="bg-primary text-white">Notified</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Next Actions</p>
                  <ul className="text-xs space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-health-good" />
                      Maintain patient communication
                    </li>
                    <li className="flex items-center gap-2">
                      <Timer className="h-3 w-3 text-warning" />
                      Wait for first responder arrival
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-primary" />
                      Coordinate with family
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="space-y-2 p-3 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                      </div>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-medium">{contact.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium">{contact.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Text
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-health-critical hover:bg-health-critical/90 text-white">
                  <Ambulance className="h-4 w-4 mr-2" />
                  Call 911 Again
                </Button>

                <Button variant="outline" className="w-full">
                  <Hospital className="h-4 w-4 mr-2" />
                  Contact Hospital
                </Button>

                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Share Location
                </Button>

                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Notify All Family
                </Button>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full text-health-good border-health-good hover:bg-health-good/10"
                  onClick={() => setActiveEmergency(false)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Emergency Resolved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Resolution */}
        {!activeEmergency && (
          <Card className="shadow-card border-l-4 border-l-health-good">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-health-good" />
                Emergency Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Response Time</p>
                  <p className="text-2xl font-bold text-health-good">{formatTime(responseTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient Status</p>
                  <p className="text-2xl font-bold text-health-good">Stable</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Follow-up Required</p>
                  <p className="text-2xl font-bold text-warning">Yes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}