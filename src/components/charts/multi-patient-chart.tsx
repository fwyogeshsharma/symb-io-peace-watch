import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  Clock,
  Target,
  Zap
} from "lucide-react"

interface PatientData {
  id: string
  name: string
  age: number
  avatar: string
  photo: string
  healthScore: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  vitals: {
    heartRate: number[]
    bloodPressure: Array<[number, number]>
    activity: number[]
    temperature: number[]
    glucose?: number[]
  }
  trends: {
    heartRate: 'up' | 'down' | 'stable'
    bloodPressure: 'up' | 'down' | 'stable'
    activity: 'up' | 'down' | 'stable'
  }
  alerts: number
  medicationAdherence: number
}

interface MultiPatientChartProps {
  initialData?: PatientData[]
  showData?: boolean
}

export function MultiPatientChart({ initialData = [], showData = false }: MultiPatientChartProps) {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMetric, setSelectedMetric] = useState('heartRate')
  const [liveUpdate, setLiveUpdate] = useState(true)

  // Multi-patient data - use empty array if showData is false or use provided initialData
  const [patientsData, setPatientsData] = useState<PatientData[]>(showData && initialData.length > 0 ? initialData : [])

  // Real-time data simulation
  useEffect(() => {
    if (!liveUpdate) return

    const interval = setInterval(() => {
      setPatientsData(prev => prev.map(patient => ({
        ...patient,
        vitals: {
          ...patient.vitals,
          heartRate: [
            ...patient.vitals.heartRate.slice(1),
            patient.status === 'critical' ? 65 + Math.random() * 30 :
            patient.status === 'warning' ? 75 + Math.random() * 15 :
            68 + Math.random() * 8
          ],
          activity: [
            ...patient.vitals.activity.slice(1),
            patient.status === 'excellent' ? 2000 + Math.random() * 1200 :
            patient.status === 'critical' ? 300 + Math.random() * 400 :
            800 + Math.random() * 1500
          ],
          temperature: [
            ...patient.vitals.temperature.slice(1),
            patient.status === 'critical' ? 99.0 + Math.random() * 0.5 :
            98.2 + Math.random() * 0.6
          ]
        }
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [liveUpdate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent border-health-excellent bg-health-excellent/10'
      case 'good': return 'text-health-good border-health-good bg-health-good/10'
      case 'warning': return 'text-warning border-warning bg-warning/10'
      case 'critical': return 'text-health-critical border-health-critical bg-health-critical/10'
      default: return 'text-muted-foreground border-border bg-muted/10'
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

  const getCurrentValue = (patient: PatientData, metric: string) => {
    const vitals = patient.vitals
    switch (metric) {
      case 'heartRate':
        return Math.round(vitals.heartRate[vitals.heartRate.length - 1])
      case 'activity':
        return Math.round(vitals.activity[vitals.activity.length - 1])
      case 'temperature':
        return vitals.temperature[vitals.temperature.length - 1].toFixed(1)
      case 'bloodPressure':
        const bp = vitals.bloodPressure[vitals.bloodPressure.length - 1]
        return `${Math.round(bp[0])}/${Math.round(bp[1])}`
      default:
        return 0
    }
  }

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'heartRate': return 'BPM'
      case 'activity': return 'steps'
      case 'temperature': return '°F'
      case 'bloodPressure': return 'mmHg'
      default: return ''
    }
  }

  // Calculate platform-wide statistics
  const platformStats = {
    totalPatients: patientsData.length,
    averageHealthScore: Math.round(patientsData.reduce((acc, p) => acc + p.healthScore, 0) / patientsData.length),
    totalAlerts: patientsData.reduce((acc, p) => acc + p.alerts, 0),
    averageAdherence: Math.round(patientsData.reduce((acc, p) => acc + p.medicationAdherence, 0) / patientsData.length),
    statusDistribution: {
      excellent: patientsData.filter(p => p.status === 'excellent').length,
      good: patientsData.filter(p => p.status === 'good').length,
      warning: patientsData.filter(p => p.status === 'warning').length,
      critical: patientsData.filter(p => p.status === 'critical').length
    }
  }

  // Show empty state if no data
  if (!showData || patientsData.length === 0) {
    return (
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Multi-Patient Health Analytics
          </CardTitle>
          <CardDescription>
            Real-time monitoring across your entire patient portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No Patient Data Available</p>
            <p className="text-sm text-muted-foreground mb-6">
              Generate sample data to see live multi-patient analytics and monitoring.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Multi-Patient Health Analytics
                {liveUpdate && (
                  <Badge variant="outline" className="bg-primary/10 text-primary animate-pulse">
                    Live Data
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Real-time monitoring across your entire patient portfolio
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={liveUpdate ? "default" : "outline"}
                size="sm"
                onClick={() => setLiveUpdate(!liveUpdate)}
              >
                {liveUpdate ? "Live" : "Paused"}
              </Button>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="6h">6h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7d</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold text-primary">{platformStats.totalPatients}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Avg Health Score</p>
              <p className="text-2xl font-bold text-health-good">{platformStats.averageHealthScore}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold text-health-critical">{platformStats.totalAlerts}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Medication Adherence</p>
              <p className="text-2xl font-bold text-success">{platformStats.averageAdherence}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Critical Patients</p>
              <p className="text-2xl font-bold text-health-critical">{platformStats.statusDistribution.critical}</p>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="bg-health-excellent/10 border border-health-excellent/20 rounded-lg p-3 text-center">
              <p className="text-health-excellent font-bold text-lg">{platformStats.statusDistribution.excellent}</p>
              <p className="text-xs text-muted-foreground">Excellent</p>
            </div>
            <div className="bg-health-good/10 border border-health-good/20 rounded-lg p-3 text-center">
              <p className="text-health-good font-bold text-lg">{platformStats.statusDistribution.good}</p>
              <p className="text-xs text-muted-foreground">Good</p>
            </div>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
              <p className="text-warning font-bold text-lg">{platformStats.statusDistribution.warning}</p>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
            <div className="bg-health-critical/10 border border-health-critical/20 rounded-lg p-3 text-center">
              <p className="text-health-critical font-bold text-lg">{platformStats.statusDistribution.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Charts */}
      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">Patient Comparison</TabsTrigger>
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alert Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Real-Time Patient Comparison
                </CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heartRate">Heart Rate</SelectItem>
                    <SelectItem value="activity">Daily Activity</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {patientsData.map((patient) => (
                  <Card key={patient.id} className={`border-2 ${getStatusColor(patient.status)}`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={patient.photo}
                              alt={patient.name}
                              className="w-10 h-10 rounded-full object-cover border-2"
                              style={{ borderColor: patient.status === 'critical' ? 'hsl(var(--health-critical))' :
                                                    patient.status === 'warning' ? 'hsl(var(--warning))' :
                                                    patient.status === 'excellent' ? 'hsl(var(--health-excellent))' :
                                                    'hsl(var(--health-good))' }}
                            />
                            <div>
                              <p className="font-medium text-sm">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">Age {patient.age}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {getCurrentValue(patient, selectedMetric)} {getMetricUnit(selectedMetric)}
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {getTrendIcon(patient.trends[selectedMetric as keyof typeof patient.trends])}
                            <span className="text-xs text-muted-foreground">
                              {patient.trends[selectedMetric as keyof typeof patient.trends]}
                            </span>
                          </div>
                        </div>

                        {/* Mini sparkline chart */}
                        <div className="h-16 relative">
                          <div className="flex items-end justify-between h-full gap-1">
                            {patient.vitals[selectedMetric as keyof typeof patient.vitals]?.slice(-8).map((value: any, index: number) => {
                              const height = selectedMetric === 'heartRate' ?
                                ((Array.isArray(value) ? value[0] : value) - 60) / 40 * 100 :
                                selectedMetric === 'activity' ?
                                (Array.isArray(value) ? value[0] : value) / 3500 * 100 :
                                selectedMetric === 'temperature' ?
                                ((Array.isArray(value) ? value[0] : value) - 98) / 2 * 100 :
                                50

                              return (
                                <div
                                  key={index}
                                  className={`flex-1 rounded-t ${
                                    patient.status === 'critical' ? 'bg-health-critical/60' :
                                    patient.status === 'warning' ? 'bg-warning/60' :
                                    patient.status === 'excellent' ? 'bg-health-excellent/60' :
                                    'bg-health-good/60'
                                  }`}
                                  style={{ height: `${Math.max(10, Math.min(100, height))}%` }}
                                  title={`${Array.isArray(value) ? value[0] : value} ${getMetricUnit(selectedMetric)}`}
                                />
                              )
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Health Score</span>
                            <span className="font-semibold">{patient.healthScore}%</span>
                          </div>
                          <Progress value={patient.healthScore} className="h-1.5" />

                          <div className="flex justify-between text-xs">
                            <span>Alerts</span>
                            <span className={`font-semibold ${patient.alerts > 0 ? 'text-health-critical' : 'text-health-good'}`}>
                              {patient.alerts}
                            </span>
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

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-health-critical" />
                  Combined Heart Rate Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-muted-foreground">
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                  </div>

                  {/* Chart area */}
                  <div className="absolute left-8 right-0 top-0 bottom-8 flex items-end justify-between gap-1">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <div className="relative flex items-end justify-center gap-0.5 h-48 w-full">
                          {patientsData.map((patient, patientIndex) => {
                            const value = patient.vitals.heartRate[i] || 0
                            const height = ((value - 50) / 60) * 100
                            const blueShades = [
                              'bg-[#3b82f6]', // blue-500
                              'bg-[#60a5fa]', // blue-400
                              'bg-[#93c5fd]', // blue-300
                              'bg-[#bfdbfe]'  // blue-200
                            ]
                            return (
                              <div
                                key={patientIndex}
                                className={`rounded-t transition-all hover:opacity-80 ${blueShades[patientIndex % blueShades.length]}`}
                                style={{
                                  height: `${Math.max(10, height)}%`,
                                  width: '18%'
                                }}
                                title={`${patient.name}: ${value} BPM`}
                              />
                            )
                          })}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {i === 0 ? 'Now' : `-${i}h`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* X-axis line */}
                  <div className="absolute left-8 right-0 bottom-6 h-px bg-border"></div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {patientsData.map((patient, index) => {
                    const blueShades = [
                      'bg-[#3b82f6]', // blue-500
                      'bg-[#60a5fa]', // blue-400
                      'bg-[#93c5fd]', // blue-300
                      'bg-[#bfdbfe]'  // blue-200
                    ]
                    return (
                      <div key={patient.id} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${blueShades[index % blueShades.length]}`} />
                        <span className="text-xs">{patient.name}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Activity Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientsData.map((patient) => {
                    const currentActivity = patient.vitals.activity[patient.vitals.activity.length - 1]
                    const goalActivity = patient.status === 'excellent' ? 3000 :
                                      patient.status === 'good' ? 2500 :
                                      patient.status === 'warning' ? 1500 : 1000
                    const percentage = (currentActivity / goalActivity) * 100

                    return (
                      <div key={patient.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={patient.photo}
                              alt={patient.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium">{patient.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold">{Math.round(currentActivity)}</span>
                            <span className="text-xs text-muted-foreground ml-1">/ {goalActivity} steps</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={Math.min(100, percentage)} className="flex-1 h-2" />
                          <span className="text-xs font-semibold w-12">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-health-critical" />
                  Active Alerts Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientsData.filter(p => p.alerts > 0).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.photo}
                          alt={patient.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">Age {patient.age}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1">
                          {patient.alerts} alerts
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Status: {patient.status}
                        </p>
                      </div>
                    </div>
                  ))}

                  {patientsData.filter(p => p.alerts === 0).length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-health-good font-medium mb-2">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        No Active Alerts ({patientsData.filter(p => p.alerts === 0).length} patients)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {patientsData.filter(p => p.alerts === 0).map((patient) => (
                          <Badge key={patient.id} variant="outline" className="bg-health-good/10 text-health-good text-xs">
                            {patient.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Medication Adherence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientsData.sort((a, b) => b.medicationAdherence - a.medicationAdherence).map((patient) => (
                    <div key={patient.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={patient.photo}
                            alt={patient.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium">{patient.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${
                          patient.medicationAdherence >= 90 ? 'text-health-good' :
                          patient.medicationAdherence >= 80 ? 'text-warning' :
                          'text-health-critical'
                        }`}>
                          {patient.medicationAdherence}%
                        </span>
                      </div>
                      <Progress
                        value={patient.medicationAdherence}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm">Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Data Accuracy</span>
                    <span className="text-sm font-bold text-success">99.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">System Uptime</span>
                    <span className="text-sm font-bold text-health-good">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Response Time</span>
                    <span className="text-sm font-bold text-primary">0.8s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Device Connectivity</span>
                    <span className="text-sm font-bold text-health-good">98.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm">Health Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Hospitalizations Prevented</span>
                    <span className="text-sm font-bold text-success">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Emergency Visits Avoided</span>
                    <span className="text-sm font-bold text-health-good">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Early Interventions</span>
                    <span className="text-sm font-bold text-primary">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Quality of Life Score</span>
                    <span className="text-sm font-bold text-health-excellent">9.2/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm">Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Annual Savings</span>
                    <span className="text-sm font-bold text-success">$284K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Per Patient</span>
                    <span className="text-sm font-bold text-health-good">$71K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">ROI</span>
                    <span className="text-sm font-bold text-primary">340%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Family Satisfaction</span>
                    <span className="text-sm font-bold text-health-excellent">96.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}