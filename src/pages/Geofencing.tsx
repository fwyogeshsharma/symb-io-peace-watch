import { useState, useEffect, useRef } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Bell,
  Shield,
  Users,
  Navigation,
  AlertTriangle,
  Clock,
  PhoneCall,
  Radio,
  Watch,
  CheckCircle,
  XCircle,
  Settings,
  ArrowLeft
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Geofencing() {
  const navigate = useNavigate()
  const [userType] = useState<'caregiver'>('caregiver')
  const [connectionStatus] = useState<'connected'>('connected')
  const [notifications] = useState(5)
  const mapRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const mapInstances = useRef<{ [key: string]: google.maps.Map | null }>({})

  // Patient geofencing data
  const patients = [
    {
      id: 'margaret',
      name: 'Margaret Johnson',
      age: 78,
      photo: '/images (2).jfif',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Maple Street, Springfield, IL',
        lastUpdate: '2 min ago'
      },
      geofence: {
        radius: 500, // meters
        center: { lat: 40.7128, lng: -74.0060 },
        status: 'inside',
        enabled: true
      },
      device: {
        type: 'Apple Watch Series 9',
        battery: 87,
        signal: 'strong',
        connected: true
      },
      alerts: [],
      sosContacts: [
        { name: 'Sarah Johnson', relation: 'Daughter', phone: '+1 (555) 123-4567' },
        { name: 'Dr. Martinez', relation: 'Physician', phone: '+1 (555) 987-6543' }
      ],
      assignedNurse: { name: 'Nurse Williams', phone: '+1 (555) 456-7890' }
    },
    {
      id: 'robert',
      name: 'Robert Johnson Sr.',
      age: 82,
      photo: '/images.jfif',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: '456 Oak Avenue, Springfield, IL',
        lastUpdate: '1 min ago'
      },
      geofence: {
        radius: 300,
        center: { lat: 34.0500, lng: -118.2500 },
        status: 'outside',
        enabled: true
      },
      device: {
        type: 'Garmin Watch',
        battery: 65,
        signal: 'medium',
        connected: true
      },
      alerts: [
        { type: 'critical', message: 'Robert Johnson Sr. has left the geofenced area - Immediate action required', time: '1 min ago' }
      ],
      sosContacts: [
        { name: 'Michael Johnson', relation: 'Son', phone: '+1 (555) 234-5678' },
        { name: 'Dr. Smith', relation: 'Physician', phone: '+1 (555) 876-5432' }
      ],
      assignedNurse: { name: 'Nurse Davis', phone: '+1 (555) 567-8901' }
    },
    {
      id: 'dorothy',
      name: 'Dorothy Williams',
      age: 75,
      photo: '/images (1).jfif',
      location: {
        lat: 41.8781,
        lng: -87.6298,
        address: '789 Pine Road, Springfield, IL',
        lastUpdate: 'Active now'
      },
      geofence: {
        radius: 400,
        center: { lat: 41.8781, lng: -87.6298 },
        status: 'inside',
        enabled: true
      },
      device: {
        type: 'Fitbit Watch',
        battery: 91,
        signal: 'strong',
        connected: true
      },
      alerts: [],
      sosContacts: [
        { name: 'James Williams', relation: 'Husband', phone: '+1 (555) 345-6789' },
        { name: 'Dr. Brown', relation: 'Physician', phone: '+1 (555) 765-4321' }
      ],
      assignedNurse: { name: 'Nurse Johnson', phone: '+1 (555) 678-9012' }
    },
    {
      id: 'frank',
      name: 'Frank Rodriguez',
      age: 84,
      photo: '/download.jpg',
      location: {
        lat: 29.7604,
        lng: -95.3698,
        address: '321 Elm Street, Springfield, IL',
        lastUpdate: '30 sec ago'
      },
      geofence: {
        radius: 250,
        center: { lat: 29.7604, lng: -95.3698 },
        status: 'inside',
        enabled: true
      },
      device: {
        type: 'Apple Watch Series 8',
        battery: 34,
        signal: 'weak',
        connected: true
      },
      alerts: [
        { type: 'warning', message: 'Low device battery', time: '15 min ago' }
      ],
      sosContacts: [
        { name: 'Maria Rodriguez', relation: 'Daughter', phone: '+1 (555) 456-7890' },
        { name: 'Dr. Garcia', relation: 'Physician', phone: '+1 (555) 654-3210' }
      ],
      assignedNurse: { name: 'Nurse Anderson', phone: '+1 (555) 789-0123' }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inside': return 'bg-health-good text-white'
      case 'outside': return 'bg-health-critical text-white'
      case 'approaching': return 'bg-warning text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'strong': return <Radio className="h-4 w-4 text-health-good" />
      case 'medium': return <Radio className="h-4 w-4 text-warning" />
      case 'weak': return <Radio className="h-4 w-4 text-health-critical" />
      default: return <Radio className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Initialize Google Maps for each patient
  useEffect(() => {
    patients.forEach((patient) => {
      const mapElement = mapRefs.current[patient.id]
      if (mapElement && !mapInstances.current[patient.id]) {
        // Create map instance
        const map = new google.maps.Map(mapElement, {
          center: patient.location,
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        // Add patient location marker
        new google.maps.Marker({
          position: patient.location,
          map: map,
          title: patient.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: patient.geofence.status === 'outside' ? '#EF4444' : '#10B981',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          }
        })

        // Draw geofence circle
        new google.maps.Circle({
          strokeColor: patient.geofence.status === 'outside' ? '#EF4444' : '#10B981',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: patient.geofence.status === 'outside' ? '#EF4444' : '#10B981',
          fillOpacity: 0.15,
          map: map,
          center: patient.geofence.center,
          radius: patient.geofence.radius
        })

        mapInstances.current[patient.id] = map
      }
    })
  }, [patients])

  // Simulate alert notifications
  const handleSOSAlert = (patient: typeof patients[0]) => {
    console.log(`Alerting SOS contacts for ${patient.name}:`, patient.sosContacts)
    console.log(`Alerting assigned nurse:`, patient.assignedNurse)
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName="Geofencing Monitor"
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
              <h1 className="text-3xl font-bold text-foreground">Geofencing Monitoring</h1>
              <p className="text-muted-foreground">
                Real-time location tracking and boundary alerts via Apple Watch
              </p>
            </div>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure Zones
          </Button>
        </div>

        {/* Active Alerts Summary */}
        {patients.some(p => p.alerts.length > 0) && (
          <Alert className="border-l-4 border-l-health-critical bg-health-critical/5">
            <AlertTriangle className="h-5 w-5 text-health-critical" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-health-critical">
                    {patients.filter(p => p.alerts.length > 0).length} Active Alert(s)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Immediate attention required for patients outside geofenced areas
                  </p>
                </div>
                <Button variant="destructive">
                  View All Alerts
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Patient Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patients.map((patient) => (
            <Card key={patient.id} className={`shadow-card ${patient.geofence.status === 'outside' ? 'border-l-4 border-l-health-critical' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.photo}
                      alt={patient.name}
                      className="h-12 w-12 rounded-full object-cover border-2"
                      style={{
                        borderColor: patient.geofence.status === 'outside' ? 'hsl(var(--health-critical))' :
                                    'hsl(var(--health-good))'
                      }}
                    />
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">Age {patient.age}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(patient.geofence.status)}>
                    {patient.geofence.status === 'inside' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {patient.geofence.status === 'outside' && <XCircle className="h-3 w-3 mr-1" />}
                    {patient.geofence.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Google Map */}
                <div className="relative h-48 bg-muted rounded-lg overflow-hidden border-2 border-border">
                  <div
                    ref={(el) => mapRefs.current[patient.id] = el}
                    className="w-full h-full"
                  />

                  {/* Geofence Indicator */}
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full p-2 border">
                    <Navigation className="h-4 w-4 text-primary" />
                  </div>

                  {/* Geofence Radius Badge */}
                  <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 border">
                    <p className="text-xs font-medium">
                      Zone: {patient.geofence.radius}m radius
                    </p>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Current Location</p>
                    <p className="text-sm font-medium">
                      {patient.location.address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Coordinates</p>
                      <p className="font-mono text-xs">
                        {patient.location.lat.toFixed(4)}, {patient.location.lng.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Last Update</p>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <p className="text-xs">{patient.location.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Device Information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          patient.id === 'margaret' ? '/Applewatch.jfif' :
                          patient.id === 'robert' ? '/garmin.jfif' :
                          patient.id === 'dorothy' ? '/fitbit.png' :
                          '/Applewatch.jfif'
                        }
                        alt={patient.device.type}
                        className={`w-8 h-8 rounded ${patient.id === 'dorothy' ? 'object-contain' : patient.id === 'robert' ? 'object-contain scale-75' : 'object-cover'}`}
                      />
                      <div>
                        <p className="text-sm font-medium">{patient.device.type}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${patient.device.connected ? 'bg-health-good' : 'bg-health-critical'}`} />
                          <span>{patient.device.connected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getSignalIcon(patient.device.signal)}
                      <Badge variant="outline" className={patient.device.battery < 50 ? 'text-health-critical' : ''}>
                        {patient.device.battery}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {patient.alerts.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-health-critical animate-pulse" />
                        <p className="text-sm font-semibold text-health-critical">Active Alerts</p>
                      </div>
                      {patient.alerts.map((alert, index) => (
                        <Alert key={index} variant="destructive" className="py-3 border-l-4 border-l-health-critical">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 animate-pulse" />
                            <div className="flex-1 space-y-1">
                              <AlertDescription className="text-sm font-medium leading-relaxed">
                                {alert.message}
                              </AlertDescription>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{alert.time}</span>
                              </div>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </>
                )}

                {/* Emergency Contacts */}
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Emergency Contacts</p>
                    {patient.geofence.status === 'outside' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSOSAlert(patient)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Alert All
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-primary" />
                        <span className="font-medium">{patient.assignedNurse.name}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <PhoneCall className="h-3 w-3" />
                      </Button>
                    </div>

                    {patient.sosContacts.slice(0, 2).map((contact, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-muted-foreground ml-1">({contact.relation})</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <PhoneCall className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    Track Live
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit Zone
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Geofencing Statistics</CardTitle>
            <CardDescription>Overview of all monitored patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-health-good/10 rounded-lg">
                <p className="text-2xl font-bold text-health-good">
                  {patients.filter(p => p.geofence.status === 'inside').length}
                </p>
                <p className="text-sm text-muted-foreground">Inside Zone</p>
              </div>
              <div className="text-center p-4 bg-health-critical/10 rounded-lg">
                <p className="text-2xl font-bold text-health-critical">
                  {patients.filter(p => p.geofence.status === 'outside').length}
                </p>
                <p className="text-sm text-muted-foreground">Outside Zone</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {patients.filter(p => p.device.connected).length}/{patients.length}
                </p>
                <p className="text-sm text-muted-foreground">Devices Online</p>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <p className="text-2xl font-bold text-warning">
                  {patients.reduce((sum, p) => sum + p.alerts.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
