import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VideoCallModal } from "@/components/video/video-call-modal"
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  MapPin,
  Wifi,
  Battery,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  Volume2,
  Video
} from "lucide-react"

interface LivePatientData {
  id: string
  name: string
  avatar: string
  photo: string
  location: string
  lastSeen: string
  vitals: {
    heartRate: number
    bloodPressure: [number, number]
    temperature: number
    oxygenSat: number
    activity: number
  }
  trends: {
    heartRate: 'up' | 'down' | 'stable'
    bloodPressure: 'up' | 'down' | 'stable'
    temperature: 'up' | 'down' | 'stable'
  }
  devices: {
    smartWatch: { connected: boolean, battery: number }
    bloodPressureMonitor: { connected: boolean, battery: number }
    pillDispenser: { connected: boolean, battery: number }
  }
  alerts: Array<{
    type: 'critical' | 'warning' | 'info'
    message: string
    time: string
  }>
  riskScore: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
}

export function LiveMonitoringGrid() {
  const [isLive, setIsLive] = useState(true)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string
    name: string
    avatar: string
    age: number
    location: string
    status: 'excellent' | 'good' | 'warning' | 'critical'
  } | null>(null)
  const [patients, setPatients] = useState<LivePatientData[]>([
    {
      id: 'margaret',
      name: 'Margaret Johnson',
      avatar: 'MJ',
      photo: '/images (2).jfif',
      location: 'Living Room',
      lastSeen: 'Active now',
      vitals: {
        heartRate: 72,
        bloodPressure: [118, 76],
        temperature: 98.4,
        oxygenSat: 98,
        activity: 1847
      },
      trends: {
        heartRate: 'stable',
        bloodPressure: 'down',
        temperature: 'stable'
      },
      devices: {
        smartWatch: { connected: true, battery: 87 },
        bloodPressureMonitor: { connected: true, battery: 92 },
        pillDispenser: { connected: true, battery: 78 }
      },
      alerts: [],
      riskScore: 15,
      status: 'good'
    },
    {
      id: 'robert',
      name: 'Robert Chen',
      avatar: 'RC',
      photo: '/images.jfif',
      location: 'Garden',
      lastSeen: '5 min ago',
      vitals: {
        heartRate: 89,
        bloodPressure: [142, 89],
        temperature: 98.7,
        oxygenSat: 96,
        activity: 892
      },
      trends: {
        heartRate: 'up',
        bloodPressure: 'up',
        temperature: 'stable'
      },
      devices: {
        smartWatch: { connected: true, battery: 65 },
        bloodPressureMonitor: { connected: true, battery: 43 },
        pillDispenser: { connected: false, battery: 15 }
      },
      alerts: [
        { type: 'critical', message: 'Elevated heart rate detected', time: '2 min ago' },
        { type: 'warning', message: 'Missed morning medication', time: '1 hour ago' }
      ],
      riskScore: 75,
      status: 'warning'
    },
    {
      id: 'dorothy',
      name: 'Dorothy Williams',
      avatar: 'DW',
      photo: '/images (1).jfif',
      location: 'Bedroom',
      lastSeen: '1 min ago',
      vitals: {
        heartRate: 68,
        bloodPressure: [115, 72],
        temperature: 98.2,
        oxygenSat: 99,
        activity: 2341
      },
      trends: {
        heartRate: 'stable',
        bloodPressure: 'stable',
        temperature: 'stable'
      },
      devices: {
        smartWatch: { connected: true, battery: 91 },
        bloodPressureMonitor: { connected: true, battery: 88 },
        pillDispenser: { connected: true, battery: 95 }
      },
      alerts: [],
      riskScore: 8,
      status: 'excellent'
    },
    {
      id: 'frank',
      name: 'Frank Rodriguez',
      avatar: 'FR',
      photo: '/download.jpg',
      location: 'Kitchen',
      lastSeen: 'Active now',
      vitals: {
        heartRate: 95,
        bloodPressure: [158, 95],
        temperature: 99.1,
        oxygenSat: 94,
        activity: 456
      },
      trends: {
        heartRate: 'up',
        bloodPressure: 'up',
        temperature: 'up'
      },
      devices: {
        smartWatch: { connected: true, battery: 45 },
        bloodPressureMonitor: { connected: true, battery: 72 },
        pillDispenser: { connected: true, battery: 23 }
      },
      alerts: [
        { type: 'critical', message: 'High blood pressure alert', time: '5 min ago' },
        { type: 'critical', message: 'Elevated temperature detected', time: '8 min ago' },
        { type: 'warning', message: 'Low activity level', time: '15 min ago' }
      ],
      riskScore: 92,
      status: 'critical'
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setPatients(prev => prev.map(patient => {
        const variation = patient.status === 'critical' ? 0.8 :
                         patient.status === 'warning' ? 0.5 : 0.3

        return {
          ...patient,
          vitals: {
            ...patient.vitals,
            heartRate: Math.max(50, Math.min(120,
              patient.vitals.heartRate + (Math.random() - 0.5) * variation * 10
            )),
            temperature: Math.max(97.0, Math.min(101.0,
              patient.vitals.temperature + (Math.random() - 0.5) * variation * 0.5
            )),
            oxygenSat: Math.max(90, Math.min(100,
              patient.vitals.oxygenSat + (Math.random() - 0.5) * variation * 2
            )),
            activity: Math.max(0,
              patient.vitals.activity + Math.floor((Math.random() - 0.3) * 50)
            )
          },
          lastSeen: patient.id === 'margaret' || patient.id === 'frank' ? 'Active now' :
                   `${Math.floor(Math.random() * 10) + 1} min ago`
        }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-health-excellent bg-health-excellent/5'
      case 'good': return 'border-health-good bg-health-good/5'
      case 'warning': return 'border-warning bg-warning/5'
      case 'critical': return 'border-health-critical bg-health-critical/5'
      default: return 'border-border bg-muted/5'
    }
  }

  const getVitalStatus = (vital: string, value: number | [number, number], patient: LivePatientData) => {
    switch (vital) {
      case 'heartRate':
        return (value as number) > 90 || (value as number) < 60 ? 'warning' : 'normal'
      case 'bloodPressure':
        const [sys, dia] = value as [number, number]
        return sys > 140 || dia > 90 ? 'critical' : sys > 130 || dia > 80 ? 'warning' : 'normal'
      case 'temperature':
        return (value as number) > 99.0 ? 'warning' : (value as number) < 97.5 ? 'warning' : 'normal'
      case 'oxygenSat':
        return (value as number) < 95 ? 'critical' : (value as number) < 97 ? 'warning' : 'normal'
      default:
        return 'normal'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-health-critical" />
      case 'down': return <TrendingDown className="h-3 w-3 text-health-good" />
      case 'stable': return <Activity className="h-3 w-3 text-primary" />
      default: return <Activity className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getVitalColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-health-critical'
      case 'warning': return 'text-warning'
      case 'normal': return 'text-health-good'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Monitoring Header */}
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Live Patient Monitoring
                {isLive && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-health-good animate-pulse" />
                    <Badge variant="outline" className="bg-health-good/10 text-health-good animate-pulse">
                      Live Feed
                    </Badge>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Real-time vital signs and activity monitoring across all patients
              </CardDescription>
            </div>
            <Button
              variant={isLive ? "default" : "outline"}
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? "Pause Live Feed" : "Start Live Feed"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Active Patients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-health-critical">{patients.reduce((acc, p) => acc + p.alerts.length, 0)}</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-health-good">
                {patients.filter(p => Object.values(p.devices).every(d => d.connected)).length}
              </p>
              <p className="text-sm text-muted-foreground">Fully Connected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {Math.round(patients.reduce((acc, p) => acc + (100 - p.riskScore), 0) / patients.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Safety Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <Card key={patient.id} className={`shadow-card border-2 ${getStatusColor(patient.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={patient.photo}
                    alt={patient.name}
                    className="h-12 w-12 rounded-full object-cover border-2"
                    style={{
                      borderColor: patient.status === 'critical' ? 'hsl(var(--health-critical))' :
                                  patient.status === 'warning' ? 'hsl(var(--warning))' :
                                  patient.status === 'excellent' ? 'hsl(var(--health-excellent))' :
                                  'hsl(var(--health-good))'
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{patient.location}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{patient.lastSeen}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(patient.status).replace('bg-', 'text-').replace('/5', '')}>
                    {patient.status.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Risk: {patient.riskScore}%
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Vital Signs Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Heart className={`h-4 w-4 ${getVitalColor(getVitalStatus('heartRate', patient.vitals.heartRate, patient))}`} />
                      <span className="text-sm font-medium">Heart Rate</span>
                    </div>
                    {getTrendIcon(patient.trends.heartRate)}
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getVitalColor(getVitalStatus('heartRate', patient.vitals.heartRate, patient))}`}>
                      {Math.round(patient.vitals.heartRate)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">BPM</span>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Activity className={`h-4 w-4 ${getVitalColor(getVitalStatus('bloodPressure', patient.vitals.bloodPressure, patient))}`} />
                      <span className="text-sm font-medium">Blood Pressure</span>
                    </div>
                    {getTrendIcon(patient.trends.bloodPressure)}
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getVitalColor(getVitalStatus('bloodPressure', patient.vitals.bloodPressure, patient))}`}>
                      {Math.round(patient.vitals.bloodPressure[0])}/{Math.round(patient.vitals.bloodPressure[1])}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">mmHg</span>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Thermometer className={`h-4 w-4 ${getVitalColor(getVitalStatus('temperature', patient.vitals.temperature, patient))}`} />
                      <span className="text-sm font-medium">Temperature</span>
                    </div>
                    {getTrendIcon(patient.trends.temperature)}
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getVitalColor(getVitalStatus('temperature', patient.vitals.temperature, patient))}`}>
                      {patient.vitals.temperature.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">°F</span>
                  </div>
                </div>

                {/* Oxygen Saturation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Droplets className={`h-4 w-4 ${getVitalColor(getVitalStatus('oxygenSat', patient.vitals.oxygenSat, patient))}`} />
                      <span className="text-sm font-medium">Oxygen Sat</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getVitalColor(getVitalStatus('oxygenSat', patient.vitals.oxygenSat, patient))}`}>
                      {Math.round(patient.vitals.oxygenSat)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">%</span>
                  </div>
                </div>
              </div>

              {/* Activity Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Daily Activity</span>
                  <span className="text-sm font-bold">{patient.vitals.activity} steps</span>
                </div>
                <Progress
                  value={(patient.vitals.activity / (patient.status === 'excellent' ? 3000 : 2500)) * 100}
                  className="h-2"
                />
              </div>

              {/* Device Status */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Device Status</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${patient.devices.smartWatch.connected ? 'bg-health-good' : 'bg-health-critical'}`} />
                    <span>Watch</span>
                    <Battery className="h-3 w-3" />
                    <span>{patient.devices.smartWatch.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${patient.devices.bloodPressureMonitor.connected ? 'bg-health-good' : 'bg-health-critical'}`} />
                    <span>BP Mon</span>
                    <Battery className="h-3 w-3" />
                    <span>{patient.devices.bloodPressureMonitor.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${patient.devices.pillDispenser.connected ? 'bg-health-good' : 'bg-health-critical'}`} />
                    <span>Pills</span>
                    <Battery className="h-3 w-3" />
                    <span>{patient.devices.pillDispenser.battery}%</span>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {patient.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-health-critical">Active Alerts</h4>
                  <div className="space-y-1">
                    {patient.alerts.slice(0, 2).map((alert, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <AlertTriangle className={`h-3 w-3 ${
                          alert.type === 'critical' ? 'text-health-critical' :
                          alert.type === 'warning' ? 'text-warning' : 'text-primary'
                        }`} />
                        <span className="flex-1">{alert.message}</span>
                        <span className="text-muted-foreground">{alert.time}</span>
                      </div>
                    ))}
                    {patient.alerts.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{patient.alerts.length - 2} more alerts
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedPatient({
                      id: patient.id,
                      name: patient.name,
                      avatar: patient.avatar,
                      age: patient.id === 'margaret' ? 78 : patient.id === 'robert' ? 82 : patient.id === 'dorothy' ? 75 : 84,
                      location: patient.location,
                      status: patient.status
                    })
                    setShowVideoCall(true)
                  }}
                >
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Call Modal */}
      {selectedPatient && (
        <VideoCallModal
          isOpen={showVideoCall}
          onClose={() => {
            setShowVideoCall(false)
            setSelectedPatient(null)
          }}
          patient={selectedPatient}
        />
      )}
    </div>
  )
}