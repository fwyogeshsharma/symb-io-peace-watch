import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Pill,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Battery,
  Wifi,
  ShoppingCart,
  Plus,
  Zap,
  Home,
  User,
  Settings,
  Eye,
  Bell,
  Shield,
  Video,
  Download,
  FileText,
  BarChart3,
  Brain,
  Footprints,
  Weight,
  Wind
} from 'lucide-react'

interface PatientDetailDashboardProps {
  patientId: number
  patientName: string
  isOpen: boolean
  onClose: () => void
}

export function PatientDetailDashboard({ patientId, patientName, isOpen, onClose }: PatientDetailDashboardProps) {
  const [patient, setPatient] = useState<any>(null)
  const [medicines, setMedicines] = useState<any[]>([])
  const [latestVitals, setLatestVitals] = useState<any[]>([])
  const [iotDevices, setIotDevices] = useState<any[]>([])
  const [todayActivities, setTodayActivities] = useState<any[]>([])
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([])
  const [aiInsights, setAiInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Live heart rate data
  const [liveHeartRate, setLiveHeartRate] = useState(72)

  // Suggested devices that patient doesn't have
  const allAvailableDevices = [
    { id: 1, name: 'Apple Watch Series 9', type: 'smartwatch', price: '$399', image: '/Applewatch.jfif', features: ['Heart Rate', 'ECG', 'Blood Oxygen', 'Fall Detection'] },
    { id: 2, name: 'Fitbit Charge 6', type: 'fitness_tracker', price: '$159', image: '/fitbit.png', features: ['Heart Rate', 'Sleep Tracking', 'Stress Management'] },
    { id: 3, name: 'Garmin Venu 3', type: 'smartwatch', price: '$449', image: '/garmin.jfif', features: ['Advanced Health Metrics', 'GPS', 'Sleep Coach'] },
    { id: 4, name: 'Omron Blood Pressure Monitor', type: 'blood_pressure', price: '$79', image: '/Applewatch.jfif', features: ['Accurate BP Reading', 'Irregular Heartbeat Detection'] },
    { id: 5, name: 'Smart Pill Dispenser', type: 'medication', price: '$199', image: '/one_nce.svg', features: ['Automated Reminders', 'Compliance Tracking', 'Family Alerts'] },
    { id: 6, name: 'Withings Body Smart Scale', type: 'scale', price: '$99', image: '/Applewatch.jfif', features: ['Weight', 'BMI', 'Body Composition', 'Heart Rate'] },
    { id: 7, name: 'Owlet Smart Sock', type: 'oxygen_monitor', price: '$299', image: '/Applewatch.jfif', features: ['Continuous SpO2', 'Heart Rate', 'Sleep Quality'] },
    { id: 8, name: 'iHealth Air Pulse Oximeter', type: 'pulse_oximeter', price: '$49', image: '/Applewatch.jfif', features: ['Blood Oxygen', 'Pulse Rate', 'Bluetooth Sync'] }
  ]

  useEffect(() => {
    if (isOpen && patientId) {
      loadPatientData()
    }
  }, [isOpen, patientId])

  // Live heart rate simulation
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setLiveHeartRate(prev => {
        const variation = Math.random() * 6 - 3
        return Math.round(Math.max(60, Math.min(90, prev + variation)))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isOpen])

  const loadPatientData = async () => {
    setLoading(true)
    try {
      // Import API client dynamically
      const { medicinesApi, vitalsApi, iotDevicesApi, activityApi, emergencyAlertsApi, aiInsightsApi } = await import('@/lib/api-client')

      // Load all patient data
      const [medsData, vitalsData, devicesData, activitiesData, alertsData, insightsData] = await Promise.all([
        medicinesApi.getMedicinesBySeniorId(patientId),
        vitalsApi.getLatestVitals(patientId),
        iotDevicesApi.getDevicesBySeniorId(patientId),
        activityApi.getTodayActivities(patientId),
        emergencyAlertsApi.getAlertsBySeniorId(patientId),
        aiInsightsApi.getInsightsBySeniorId(patientId)
      ])

      setMedicines(medsData)
      setLatestVitals(vitalsData)
      setIotDevices(devicesData)
      setTodayActivities(activitiesData)
      setEmergencyAlerts(alertsData)
      setAiInsights(insightsData)
    } catch (error) {
      console.error('Error loading patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get vital value
  const getVitalValue = (type: string) => {
    const vital = latestVitals.find(v => v.vital_type === type)
    return vital || null
  }

  // Helper function to format vital display
  const formatVital = (type: string) => {
    const vital = getVitalValue(type)
    if (!vital) return { value: '--', status: 'normal', unit: '' }

    let status = 'normal'
    if (vital.is_anomaly) status = 'warning'

    switch (type) {
      case 'blood_pressure':
        return { value: `${vital.systolic}/${vital.diastolic}`, status, unit: 'mmHg' }
      case 'heart_rate':
        return { value: vital.value, status, unit: 'BPM' }
      case 'glucose':
        return { value: vital.value, status, unit: 'mg/dL' }
      case 'weight':
        return { value: vital.value, status, unit: 'kg' }
      case 'spo2':
        return { value: vital.value, status, unit: '%' }
      case 'steps':
        return { value: vital.value, status, unit: 'steps' }
      case 'temperature':
        return { value: vital.value, status, unit: '°F' }
      default:
        return { value: vital.value, status, unit: vital.unit || '' }
    }
  }

  // Get suggested devices (devices not currently owned)
  const suggestedDevices = allAvailableDevices.filter(device => {
    return !iotDevices.some(owned =>
      owned.device_type.toLowerCase().includes(device.type.toLowerCase())
    )
  })

  const getVitalStatusColor = (status: string) => {
    return status === 'warning' ? 'text-orange-600 border-orange-300' : 'text-health-good border-health-good'
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <span>{patientName}'s Health Dashboard</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-health-good/10 text-health-good">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Monitoring Active
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary animate-pulse">
                    <Wifi className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Complete health monitoring dashboard with medications, vitals, and connected devices
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 animate-spin opacity-50" />
              <p className="text-muted-foreground">Loading patient data...</p>
            </div>
          ) : (
            <>
              {/* Quick Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-health-critical">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="text-2xl font-bold text-health-critical">{liveHeartRate}</p>
                        <p className="text-xs text-muted-foreground">BPM (Live)</p>
                      </div>
                      <Heart className="h-8 w-8 text-health-critical animate-pulse" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="text-2xl font-bold">{formatVital('blood_pressure').value}</p>
                        <p className="text-xs text-muted-foreground">{formatVital('blood_pressure').unit}</p>
                      </div>
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-health-good">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Devices</p>
                        <p className="text-2xl font-bold text-health-good">{iotDevices.filter(d => d.status === 'active').length}/{iotDevices.length}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <Wifi className="h-8 w-8 text-health-good" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Alerts</p>
                        <p className="text-2xl font-bold text-orange-500">{emergencyAlerts.filter(a => !a.acknowledged_at).length}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="vitals">Vitals</TabsTrigger>
                  <TabsTrigger value="devices">IoT Devices</TabsTrigger>
                  <TabsTrigger value="suggested">Suggested</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Live Vital Signs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Live Vital Signs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['heart_rate', 'blood_pressure', 'temperature', 'spo2', 'glucose', 'weight'].map((vitalType) => {
                          const vital = formatVital(vitalType)
                          const icons = {
                            heart_rate: Heart,
                            blood_pressure: Activity,
                            temperature: Thermometer,
                            spo2: Wind,
                            glucose: Droplets,
                            weight: Weight
                          }
                          const Icon = icons[vitalType as keyof typeof icons]

                          return (
                            <Card key={vitalType} className={`border ${getVitalStatusColor(vital.status)}`}>
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm font-medium capitalize">
                                    {vitalType.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-2xl font-bold">{vital.value}</p>
                                <p className="text-xs text-muted-foreground">{vital.unit}</p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Today's Activities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Today's Activities ({todayActivities.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {todayActivities.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {todayActivities.slice(0, 5).map((activity, index) => (
                            <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Activity className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium capitalize">
                                  {activity.activity_type.replace(/_/g, ' ')}
                                </p>
                                {activity.location && (
                                  <p className="text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3 inline mr-1" />
                                    {activity.location}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.recorded_at).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No activities recorded today</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  {aiInsights.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          AI Health Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiInsights.slice(0, 3).map((insight) => (
                            <div key={insight.id} className="flex items-start gap-2 p-3 rounded-lg border border-blue-200 bg-blue-50/30">
                              <Brain className="h-4 w-4 text-primary mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{insight.title}</p>
                                <p className="text-xs text-muted-foreground">{insight.description}</p>
                              </div>
                              {insight.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">HIGH</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Medications Tab */}
                <TabsContent value="medications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-primary" />
                          Current Medications ({medicines.length})
                        </CardTitle>
                        <Badge variant="outline">Patient Added</Badge>
                      </div>
                      <CardDescription>
                        Medications added by the patient to their personal health profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {medicines.length > 0 ? (
                        <div className="space-y-3">
                          {medicines.map((medicine) => (
                            <Card key={medicine.id} className="border-l-4 border-l-primary">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                      <Pill className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{medicine.name}</h4>
                                      <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                                      <p className="text-sm text-muted-foreground">{medicine.frequency}</p>
                                      {medicine.instructions && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">{medicine.instructions}</p>
                                      )}
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {medicine.time}
                                        </Badge>
                                        {medicine.with_food && (
                                          <Badge variant="outline" className="text-xs">With Food</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className={medicine.is_active ? 'bg-health-good' : 'bg-muted'}>
                                    {medicine.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Pill className="h-12 w-12 mx-auto mb-4 opacity-30" />
                          <p className="text-muted-foreground">No medications added yet</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Patient can add their medications from their dashboard
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Vitals Tab */}
                <TabsContent value="vitals" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Complete Vital Signs History
                      </CardTitle>
                      <CardDescription>
                        All recorded health metrics and vital signs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {latestVitals.length > 0 ? (
                          latestVitals.map((vital) => (
                            <Card key={vital.id} className="border">
                              <CardContent className="pt-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium capitalize">
                                      {vital.vital_type.replace(/_/g, ' ')}
                                    </span>
                                    {vital.is_anomaly && (
                                      <Badge variant="destructive" className="text-xs">Anomaly</Badge>
                                    )}
                                  </div>
                                  <p className="text-3xl font-bold">
                                    {vital.vital_type === 'blood_pressure'
                                      ? `${vital.systolic}/${vital.diastolic}`
                                      : vital.value}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {vital.unit || ''}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Recorded: {new Date(vital.recorded_at).toLocaleString()}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-12">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p className="text-muted-foreground">No vital signs data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* IoT Devices Tab */}
                <TabsContent value="devices" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-primary" />
                        Connected IoT Devices ({iotDevices.length})
                      </CardTitle>
                      <CardDescription>
                        All devices connected to patient's health monitoring system
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {iotDevices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {iotDevices.map((device) => (
                            <Card key={device.id} className={`border-2 ${
                              device.status === 'active' ? 'border-health-good bg-health-good/5' :
                              device.status === 'error' ? 'border-health-critical bg-health-critical/5' :
                              'border-gray-300 bg-gray-50'
                            }`}>
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{device.device_name}</h4>
                                      <p className="text-sm text-muted-foreground capitalize">
                                        {device.device_type.replace(/_/g, ' ')}
                                      </p>
                                    </div>
                                    <Badge className={
                                      device.status === 'active' ? 'bg-health-good' :
                                      device.status === 'error' ? 'bg-health-critical' :
                                      'bg-gray-500'
                                    }>
                                      {device.status}
                                    </Badge>
                                  </div>

                                  {device.location && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      <span>{device.location}</span>
                                    </div>
                                  )}

                                  {device.battery_level !== null && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Battery</span>
                                        <span className={`font-medium ${
                                          device.battery_level < 20 ? 'text-health-critical' :
                                          device.battery_level < 50 ? 'text-orange-600' :
                                          'text-health-good'
                                        }`}>
                                          {device.battery_level}%
                                        </span>
                                      </div>
                                      <Progress value={device.battery_level} className="h-2" />
                                    </div>
                                  )}

                                  {device.last_sync && (
                                    <p className="text-xs text-muted-foreground">
                                      Last sync: {new Date(device.last_sync).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Wifi className="h-12 w-12 mx-auto mb-4 opacity-30" />
                          <p className="text-muted-foreground">No IoT devices connected</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Check the Suggested tab for device recommendations
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Suggested Devices Tab */}
                <TabsContent value="suggested" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Suggested Devices ({suggestedDevices.length})
                      </CardTitle>
                      <CardDescription>
                        Recommended IoT devices to enhance health monitoring
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {suggestedDevices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {suggestedDevices.map((device) => (
                            <Card key={device.id} className="border-2 border-primary/20 hover:border-primary/50 transition-all">
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <img
                                      src={device.image}
                                      alt={device.name}
                                      className={`w-16 h-16 rounded ${device.image.endsWith('.svg') ? 'object-contain p-2' : device.image.includes('garmin') ? 'object-contain scale-75' : device.image.endsWith('.png') ? 'object-contain' : 'object-cover'}`}
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-semibold">{device.name}</h4>
                                      <p className="text-sm text-primary font-medium">{device.price}</p>
                                      <Badge variant="outline" className="text-xs mt-1 capitalize">
                                        {device.type.replace(/_/g, ' ')}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <p className="text-xs font-medium">Key Features:</p>
                                    <ul className="space-y-1">
                                      {device.features.map((feature, idx) => (
                                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                          <CheckCircle className="h-3 w-3 text-health-good" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <Button size="sm" className="w-full">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Recommend to Patient
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-health-good opacity-50" />
                          <p className="text-lg font-medium text-health-good">All Set!</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Patient has all recommended device types
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Quick Actions Footer */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Start Video Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Patient
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
