import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Share2,
  ArrowLeft,
  Wifi,
  Battery,
  Shield
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Analytics() {
  const navigate = useNavigate()
  const [userType] = useState<'caregiver'>('caregiver')
  const [connectionStatus] = useState<'connected'>('connected')
  const [notifications] = useState(3)
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedPatient, setSelectedPatient] = useState('all')

  // Real-world patient data
  const patients = [
    {
      id: 'margaret',
      name: 'Margaret Johnson',
      age: 78,
      condition: 'Hypertension, Diabetes',
      riskLevel: 'low',
      avatar: 'MJ',
      photo: '/images (2).jfif'
    },
    {
      id: 'robert',
      name: 'Robert Chen',
      age: 82,
      condition: 'Heart Disease, Arthritis',
      riskLevel: 'medium',
      avatar: 'RC',
      photo: '/images.jfif'
    },
    {
      id: 'dorothy',
      name: 'Dorothy Williams',
      age: 75,
      condition: 'COPD, Osteoporosis',
      riskLevel: 'high',
      avatar: 'DW',
      photo: '/images (1).jfif'
    },
    {
      id: 'frank',
      name: 'Frank Rodriguez',
      age: 84,
      condition: 'Alzheimer\'s, Diabetes',
      riskLevel: 'high',
      avatar: 'FR',
      photo: '/download.jpg'
    }
  ]

  // AI-powered health insights
  const healthInsights = [
    {
      type: 'critical',
      title: 'Irregular Heart Rhythm Detected',
      patient: 'Robert Chen',
      description: 'AFib episodes detected 3x this week. Recommend cardiology consultation.',
      confidence: 94,
      timestamp: '2 hours ago',
      action: 'Contact Dr. Martinez immediately'
    },
    {
      type: 'warning',
      title: 'Sleep Pattern Deterioration',
      patient: 'Dorothy Williams',
      description: 'Sleep quality decreased 23% over past 2 weeks. Possible pain correlation.',
      confidence: 87,
      timestamp: '6 hours ago',
      action: 'Schedule pain management review'
    },
    {
      type: 'positive',
      title: 'Medication Adherence Improved',
      patient: 'Margaret Johnson',
      description: 'Blood pressure medications taken on schedule 97% of time this month.',
      confidence: 98,
      timestamp: '1 day ago',
      action: 'Continue current protocol'
    },
    {
      type: 'predictive',
      title: 'Fall Risk Increasing',
      patient: 'Frank Rodriguez',
      description: 'Gait analysis shows 31% increased fall risk. Balance training recommended.',
      confidence: 78,
      timestamp: '3 hours ago',
      action: 'Arrange physical therapy evaluation'
    }
  ]

  // Comprehensive health metrics
  const healthMetrics = {
    totalPatients: 4,
    activeAlerts: 7,
    deviceConnectivity: 98.7,
    avgHealthScore: 73,
    emergencyEvents: 2,
    medicationAdherence: 91.2,
    familySatisfaction: 96.8,
    costSavings: 847500 // Annual healthcare cost savings
  }

  // Real-time monitoring data
  const [liveData, setLiveData] = useState({
    heartRates: [72, 74, 71, 73, 75, 74, 72],
    bloodPressure: [[118, 76], [122, 78], [116, 74], [120, 77]],
    activity: [1240, 2100, 1890, 2340, 1650, 2890, 2150],
    temperature: [98.4, 98.6, 98.5, 98.7, 98.3, 98.6],
    sleepQuality: [78, 82, 75, 88, 73, 85, 90]
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        heartRates: [...prev.heartRates.slice(1), 70 + Math.random() * 10],
        bloodPressure: [...prev.bloodPressure.slice(1), [115 + Math.random() * 10, 70 + Math.random() * 10]],
        activity: [...prev.activity.slice(1), 1000 + Math.random() * 2000],
        temperature: [...prev.temperature.slice(1), 98.2 + Math.random() * 0.8],
        sleepQuality: [...prev.sleepQuality.slice(1), 70 + Math.random() * 25]
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const riskColors = {
    low: 'text-health-good border-health-good/20 bg-health-good/10',
    medium: 'text-warning border-warning/20 bg-warning/10',
    high: 'text-health-critical border-health-critical/20 bg-health-critical/10'
  }

  const insightColors = {
    critical: 'border-l-health-critical bg-health-critical/5',
    warning: 'border-l-warning bg-warning/5',
    positive: 'border-l-health-good bg-health-good/5',
    predictive: 'border-l-primary bg-primary/5'
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName="Dr. Sarah Mitchell"
        notifications={notifications}
        connectionStatus={connectionStatus}
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* Header with Controls */}
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
              <h1 className="text-3xl font-bold text-foreground">Healthcare Analytics</h1>
              <p className="text-muted-foreground">
                AI-powered insights across your patient portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients (4)</SelectItem>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">3 Months</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-primary">{healthMetrics.totalPatients}</p>
                  <p className="text-xs text-health-good">+2 this month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-health-good">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health Score</p>
                  <p className="text-2xl font-bold text-health-good">{healthMetrics.avgHealthScore}%</p>
                  <p className="text-xs text-health-good">+5.2% improvement</p>
                </div>
                <Heart className="h-8 w-8 text-health-good" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-warning">{healthMetrics.activeAlerts}</p>
                  <p className="text-xs text-health-critical">3 critical</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-2xl font-bold text-success">${(healthMetrics.costSavings / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-success">Annual projection</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Health Insights */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Health Insights
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Real-time
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Machine learning predictions and pattern analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthInsights.map((insight, index) => (
                  <Alert key={index} className={`border-l-4 ${insightColors[insight.type as keyof typeof insightColors]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>{insight.patient}:</strong> {insight.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-primary font-medium">
                            Action: {insight.action}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {insight.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Patient Risk Assessment */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-warning" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>
                  Current patient risk levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.photo}
                          alt={patient.name}
                          className="w-10 h-10 rounded-full object-cover border-2"
                          style={{
                            borderColor: patient.riskLevel === 'high' ? 'hsl(var(--health-critical))' :
                                        patient.riskLevel === 'medium' ? 'hsl(var(--warning))' :
                                        'hsl(var(--health-good))'
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">Age {patient.age}</p>
                        </div>
                      </div>
                      <Badge className={riskColors[patient.riskLevel as keyof typeof riskColors]}>
                        {patient.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{patient.condition}</p>
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="vitals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="medication">Medications</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="devices">IoT Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-health-critical" />
                    Heart Rate Trends
                    <div className="w-2 h-2 rounded-full bg-health-good animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Average</span>
                      <span className="font-bold text-lg">{Math.round(liveData.heartRates[liveData.heartRates.length - 1])} BPM</span>
                    </div>
                    <div className="h-32 flex items-end space-x-1">
                      {liveData.heartRates.map((rate, index) => (
                        <div
                          key={index}
                          className="bg-health-good/20 rounded-t flex-1"
                          style={{ height: `${(rate - 60) * 2}%` }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-muted-foreground">Min</p>
                        <p className="font-semibold">62 BPM</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Avg</p>
                        <p className="font-semibold">73 BPM</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Max</p>
                        <p className="font-semibold">85 BPM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Blood Pressure Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Latest Reading</span>
                      <span className="font-bold text-lg">
                        {Math.round(liveData.bloodPressure[liveData.bloodPressure.length - 1][0])}/
                        {Math.round(liveData.bloodPressure[liveData.bloodPressure.length - 1][1])} mmHg
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Systolic Trend</span>
                        <TrendingDown className="h-4 w-4 text-health-good" />
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Diastolic Trend</span>
                        <TrendingUp className="h-4 w-4 text-warning" />
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Blood pressure within normal range for 7 consecutive days
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Daily Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(liveData.activity[liveData.activity.length - 1])}</div>
                  <p className="text-xs text-muted-foreground">Goal: 2,500 steps</p>
                  <Progress value={(liveData.activity[liveData.activity.length - 1] / 2500) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Sleep Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(liveData.sleepQuality[liveData.sleepQuality.length - 1])}%</div>
                  <p className="text-xs text-muted-foreground">8.2 hours avg</p>
                  <Badge variant="outline" className="mt-2 bg-health-good/10 text-health-good">
                    Excellent
                  </Badge>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Fall Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">23%</div>
                  <p className="text-xs text-muted-foreground">Moderate risk</p>
                  <Badge variant="outline" className="mt-2 bg-warning/10 text-warning">
                    Monitor
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medication" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Medication Adherence</CardTitle>
                <CardDescription>Smart dispenser tracking across all patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Margaret Johnson</p>
                    <div className="flex items-center gap-2">
                      <Progress value={97} className="flex-1" />
                      <span className="text-sm font-bold">97%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Metformin, Lisinopril</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Robert Chen</p>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="flex-1" />
                      <span className="text-sm font-bold">89%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Warfarin, Atorvastatin</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Dorothy Williams</p>
                    <div className="flex items-center gap-2">
                      <Progress value={84} className="flex-1" />
                      <span className="text-sm font-bold">84%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Albuterol, Calcium</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Frank Rodriguez</p>
                    <div className="flex items-center gap-2">
                      <Progress value={76} className="flex-1" />
                      <span className="text-sm font-bold text-health-critical">76%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Donepezil, Insulin</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Home Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72°F</div>
                  <p className="text-xs text-health-good">Optimal range</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Living Room</span>
                      <span>71°F</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Bedroom</span>
                      <span>73°F</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Kitchen</span>
                      <span>74°F</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Air Quality Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-health-good">23</div>
                  <p className="text-xs text-health-good">Good quality</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>PM2.5</span>
                      <span className="text-health-good">12 μg/m³</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Humidity</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>CO₂</span>
                      <span>420 ppm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-health-good">Secure</div>
                  <p className="text-xs text-muted-foreground">All sensors active</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Front Door</span>
                      <CheckCircle className="h-3 w-3 text-health-good" />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Windows</span>
                      <CheckCircle className="h-3 w-3 text-health-good" />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Motion Sensors</span>
                      <CheckCircle className="h-3 w-3 text-health-good" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  IoT Device Network
                  <Badge variant="outline" className="bg-health-good/10 text-health-good">
                    98.7% Uptime
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time connectivity and device health monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Heart Rate Monitor', patient: 'Margaret J.', status: 'connected', battery: 87, signal: 'strong' },
                    { name: 'Blood Pressure Cuff', patient: 'Robert C.', status: 'connected', battery: 92, signal: 'strong' },
                    { name: 'Smart Pill Dispenser', patient: 'Dorothy W.', status: 'connected', battery: 78, signal: 'medium' },
                    { name: 'Fall Detection Pendant', patient: 'Frank R.', status: 'connected', battery: 45, signal: 'strong' },
                    { name: 'Sleep Sensor', patient: 'Margaret J.', status: 'connected', battery: 91, signal: 'strong' },
                    { name: 'Motion Detector', patient: 'Robert C.', status: 'connected', battery: 67, signal: 'strong' }
                  ].map((device, index) => (
                    <Card key={index} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{device.name}</h4>
                            <Badge variant="outline" className="bg-health-good/10 text-health-good text-xs">
                              {device.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{device.patient}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <Battery className="h-3 w-3" />
                                Battery
                              </span>
                              <span className={device.battery < 50 ? 'text-health-critical' : 'text-health-good'}>
                                {device.battery}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <Wifi className="h-3 w-3" />
                                Signal
                              </span>
                              <span>{device.signal}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ROI and Business Metrics */}
        <Card className="shadow-card border-l-4 border-l-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              Business Impact & ROI
            </CardTitle>
            <CardDescription>
              Quantified healthcare outcomes and cost savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Emergency Visits Prevented</p>
                <p className="text-3xl font-bold text-success">23</p>
                <p className="text-xs text-success">$147,000 saved</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Medication Adherence</p>
                <p className="text-3xl font-bold text-primary">91.2%</p>
                <p className="text-xs text-health-good">+12% improvement</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Family Satisfaction</p>
                <p className="text-3xl font-bold text-health-good">96.8%</p>
                <p className="text-xs text-health-good">Net Promoter Score: 84</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Data Accuracy</p>
                <p className="text-3xl font-bold text-primary">99.4%</p>
                <p className="text-xs text-muted-foreground">vs manual tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}