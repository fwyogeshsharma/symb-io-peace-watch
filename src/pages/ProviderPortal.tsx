import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Stethoscope,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Heart,
  Activity,
  Pill,
  Brain,
  Eye,
  Download,
  Share2,
  Video,
  Phone,
  MessageSquare,
  Star,
  Award,
  Target,
  Zap,
  ArrowLeft,
  ChevronRight,
  Plus,
  Search,
  Filter
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ProviderPortal() {
  const navigate = useNavigate()
  const [userType] = useState<'caregiver'>('caregiver')
  const [connectionStatus] = useState<'connected'>('connected')
  const [notifications] = useState(6)
  const [selectedPatient, setSelectedPatient] = useState('margaret')

  // Provider information
  const providerInfo = {
    name: 'Dr. Sarah Mitchell',
    specialty: 'Geriatric Medicine',
    license: 'MD-IL-2019847',
    facility: 'Springfield Medical Center',
    experience: '12 years',
    certifications: ['Board Certified Geriatrician', 'Telehealth Certified', 'SymbIOT Platform Certified']
  }

  // Patient portfolio
  const patients = [
    {
      id: 'margaret',
      name: 'Margaret Johnson',
      age: 78,
      mrn: 'MRN-4789512',
      diagnosis: ['Hypertension', 'Type 2 Diabetes'],
      riskLevel: 'low',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      adherence: 97,
      healthScore: 87,
      alerts: 0,
      avatar: 'MJ',
      photo: '/images (2).jfif',
      recentMetrics: {
        heartRate: { current: 72, trend: 'stable', range: [68, 76] },
        bloodPressure: { current: '118/76', trend: 'improving', systolic: [115, 122], diastolic: [74, 78] },
        glucose: { current: 142, trend: 'stable', range: [138, 148] },
        weight: { current: 135, trend: 'stable', change: -0.5 },
        activity: { daily: 1847, weekly: 12890, goal: 14000 }
      }
    },
    {
      id: 'robert',
      name: 'Robert Johnson Sr.',
      age: 82,
      mrn: 'MRN-4789513',
      diagnosis: ['Heart Disease', 'Hypertension'],
      riskLevel: 'high',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-02-01',
      adherence: 89,
      healthScore: 73,
      alerts: 3,
      avatar: 'RJ',
      photo: '/images.jfif',
      recentMetrics: {
        heartRate: { current: 78, trend: 'concerning', range: [75, 85] },
        bloodPressure: { current: '142/89', trend: 'worsening', systolic: [138, 145], diastolic: [86, 92] },
        activity: { daily: 892, weekly: 6244, goal: 7000 },
        weight: { current: 168, trend: 'increasing', change: +2.3 }
      }
    },
    {
      id: 'dorothy',
      name: 'Dorothy Williams',
      age: 75,
      mrn: 'MRN-4789514',
      diagnosis: ['COPD', 'Osteoporosis'],
      riskLevel: 'medium',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-20',
      adherence: 92,
      healthScore: 94,
      alerts: 0,
      avatar: 'DW',
      photo: '/images (1).jfif',
      recentMetrics: {
        heartRate: { current: 68, trend: 'stable', range: [65, 72] },
        bloodPressure: { current: '115/72', trend: 'stable', systolic: [112, 118], diastolic: [70, 74] },
        oxygen: { current: 96, trend: 'stable', range: [94, 98] },
        activity: { daily: 2341, weekly: 16387, goal: 14000 }
      }
    },
    {
      id: 'frank',
      name: 'Frank Rodriguez',
      age: 84,
      mrn: 'MRN-4789515',
      diagnosis: ['Diabetes Type 2', 'Arrhythmia', 'Fall Risk'],
      riskLevel: 'critical',
      lastVisit: '2024-01-05',
      nextAppointment: '2024-01-25',
      adherence: 76,
      healthScore: 65,
      alerts: 5,
      avatar: 'FR',
      photo: '/download.jpg',
      recentMetrics: {
        heartRate: { current: 65, trend: 'concerning', range: [60, 100] },
        bloodPressure: { current: '158/95', trend: 'worsening', systolic: [155, 162], diastolic: [93, 98] },
        glucose: { current: 198, trend: 'concerning', range: [180, 220] },
        weight: { current: 142, trend: 'decreasing', change: -3.2 },
        activity: { daily: 456, weekly: 3192, goal: 5000 }
      }
    }
  ]

  const currentPatient = patients.find(p => p.id === selectedPatient) || patients[0]

  // Clinical insights
  const clinicalInsights = [
    {
      priority: 'critical',
      title: 'Critical Arrhythmia Pattern',
      patient: 'Frank Rodriguez',
      description: 'Irregular heart rhythm episodes with HR dropping to 45 BPM during episodes. Multiple medication non-adherence events.',
      recommendation: 'Immediate cardiology consultation and consider pacemaker evaluation. Urgent medication adherence intervention.',
      confidence: 96,
      evidenceBased: true
    },
    {
      priority: 'high',
      title: 'Hypertensive Crisis Risk',
      patient: 'Robert Johnson Sr.',
      description: 'Blood pressure trending upward with readings consistently above 140/90. Medication adherence suboptimal.',
      recommendation: 'Adjust antihypertensive regimen and implement enhanced monitoring protocol',
      confidence: 91,
      evidenceBased: true
    },
    {
      priority: 'medium',
      title: 'Medication Timing Optimization',
      patient: 'Margaret Johnson',
      description: 'Blood glucose peaks suggest optimal metformin timing would be 30 minutes before largest meal.',
      recommendation: 'Adjust metformin administration to 30 min before dinner',
      confidence: 84,
      evidenceBased: true
    },
    {
      priority: 'low',
      title: 'Activity Performance Excellence',
      patient: 'Dorothy Williams',
      description: 'Consistently exceeding activity goals with improved respiratory function. Outstanding compliance.',
      recommendation: 'Continue current regimen and consider reducing rescue medication frequency',
      confidence: 89,
      evidenceBased: true
    }
  ]

  // Healthcare outcomes
  const outcomes = {
    hospitalizations: { prevented: 15, reduction: 67 },
    emergencyVisits: { prevented: 23, reduction: 58 },
    medicationAdherence: { average: 90.3, improvement: 23 },
    patientSatisfaction: { score: 9.2, nps: 84 },
    costSavings: { annual: 284750, perPatient: 71187 }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-health-good border-health-good/20 bg-health-good/10'
      case 'medium': return 'text-warning border-warning/20 bg-warning/10'
      case 'high': return 'text-health-critical border-health-critical/20 bg-health-critical/10'
      default: return 'text-muted-foreground border-border bg-muted/10'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-health-critical bg-health-critical/5'
      case 'medium': return 'border-l-warning bg-warning/5'
      case 'low': return 'border-l-health-good bg-health-good/5'
      default: return 'border-l-muted bg-muted/5'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-3 w-3 text-health-good" />
      case 'worsening': case 'concerning': return <TrendingDown className="h-3 w-3 text-health-critical" />
      case 'stable': return <Activity className="h-3 w-3 text-muted-foreground" />
      default: return <Activity className="h-3 w-3 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName={providerInfo.name}
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
              <h1 className="text-3xl font-bold text-foreground">Provider Portal</h1>
              <p className="text-muted-foreground">
                Clinical dashboard for {providerInfo.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.diagnosis.join(', ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <Button className="bg-gradient-health">
              <Video className="h-4 w-4 mr-2" />
              Telehealth
            </Button>
          </div>
        </div>

        {/* Provider Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                  <p className="text-2xl font-bold text-primary">{patients.length}</p>
                  <p className="text-xs text-health-good">+2 this month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-health-critical">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                  <p className="text-2xl font-bold text-health-critical">{patients.reduce((acc, p) => acc + p.alerts, 0)}</p>
                  <p className="text-xs text-warning">3 high priority</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-health-critical" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-health-good">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Adherence</p>
                  <p className="text-2xl font-bold text-health-good">{Math.round(patients.reduce((acc, p) => acc + p.adherence, 0) / patients.length)}%</p>
                  <p className="text-xs text-health-good">+7% vs baseline</p>
                </div>
                <Target className="h-8 w-8 text-health-good" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cost Savings</p>
                  <p className="text-2xl font-bold text-success">${(outcomes.costSavings.annual / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-success">Annual projection</p>
                </div>
                <Award className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Clinical Insights
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Evidence-Based
              </Badge>
            </CardTitle>
            <CardDescription>
              Machine learning recommendations based on continuous monitoring data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clinicalInsights.map((insight, index) => (
              <Alert key={index} className={`border-l-4 ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getRiskColor(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                      {insight.evidenceBased && (
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                          Evidence-Based
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>{insight.patient}:</strong> {insight.description}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      Recommendation: {insight.recommendation}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Implement
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* Patient Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Summary */}
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Patient Summary: {currentPatient.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={currentPatient.photo}
                            alt={currentPatient.name}
                            className="h-16 w-16 rounded-full object-cover border-2"
                            style={{
                              borderColor: currentPatient.riskLevel === 'critical' ? 'hsl(var(--health-critical))' :
                                          currentPatient.riskLevel === 'high' ? 'hsl(var(--warning))' :
                                          currentPatient.riskLevel === 'medium' ? 'hsl(var(--primary))' :
                                          'hsl(var(--health-good))'
                            }}
                          />
                          <div>
                            <h3 className="text-xl font-bold">{currentPatient.name}</h3>
                            <p className="text-muted-foreground">Age {currentPatient.age} • MRN: {currentPatient.mrn}</p>
                            <Badge className={getRiskColor(currentPatient.riskLevel)}>
                              {currentPatient.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Primary Diagnoses</h4>
                          <div className="flex flex-wrap gap-1">
                            {currentPatient.diagnosis.map((diagnosis, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {diagnosis}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Health Score</h4>
                          <div className="flex items-center gap-3">
                            <Progress value={currentPatient.healthScore} className="flex-1" />
                            <span className="font-bold text-lg">{currentPatient.healthScore}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Last Visit</p>
                            <p className="font-semibold">{new Date(currentPatient.lastVisit).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Next Appointment</p>
                            <p className="font-semibold">{new Date(currentPatient.nextAppointment).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Medication Adherence</p>
                            <p className="font-semibold text-health-good">{currentPatient.adherence}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Active Alerts</p>
                            <p className={`font-semibold ${currentPatient.alerts > 0 ? 'text-health-critical' : 'text-health-good'}`}>
                              {currentPatient.alerts}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Recent Metrics</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Heart className="h-3 w-3 text-health-critical" />
                                <span>Heart Rate</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{currentPatient.recentMetrics.heartRate.current} BPM</span>
                                {getTrendIcon(currentPatient.recentMetrics.heartRate.trend)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-primary" />
                                <span>Blood Pressure</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{currentPatient.recentMetrics.bloodPressure.current} mmHg</span>
                                {getTrendIcon(currentPatient.recentMetrics.bloodPressure.trend)}
                              </div>
                            </div>

                            {currentPatient.recentMetrics.glucose && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-warning" />
                                  <span>Glucose</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{currentPatient.recentMetrics.glucose.current} mg/dL</span>
                                  {getTrendIcon(currentPatient.recentMetrics.glucose.trend)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex gap-3">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Video className="h-4 w-4 mr-2" />
                        Start Telehealth
                      </Button>
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Chart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Alerts */}
              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentPatient.alerts > 0 ? (
                      <>
                        <Alert className="border-l-4 border-l-health-critical bg-health-critical/5">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-semibold text-sm">Irregular Heart Rhythm</p>
                            <p className="text-xs text-muted-foreground">Detected 2 hours ago</p>
                          </AlertDescription>
                        </Alert>
                        <Alert className="border-l-4 border-l-warning bg-warning/5">
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            <p className="font-semibold text-sm">Medication Delay</p>
                            <p className="text-xs text-muted-foreground">Morning dose taken 2 hours late</p>
                          </AlertDescription>
                        </Alert>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="h-8 w-8 text-health-good mx-auto mb-2" />
                        <p className="text-sm text-health-good font-medium">No active alerts</p>
                        <p className="text-xs text-muted-foreground">All systems normal</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Care
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Next Appointment</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(currentPatient.nextAppointment).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lab Work Due</span>
                        <Badge variant="outline" className="text-xs">2 weeks</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medication Review</span>
                        <Badge variant="outline" className="text-xs">1 month</Badge>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Care Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Heart Rate Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{currentPatient.recentMetrics.heartRate.current} BPM</span>
                      {getTrendIcon(currentPatient.recentMetrics.heartRate.trend)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Normal Range</span>
                        <span>{currentPatient.recentMetrics.heartRate.range[0]}-{currentPatient.recentMetrics.heartRate.range[1]} BPM</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last 24h: Normal rhythm • No irregularities detected
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Blood Pressure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{currentPatient.recentMetrics.bloodPressure.current}</span>
                      {getTrendIcon(currentPatient.recentMetrics.bloodPressure.trend)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Systolic</span>
                        <span>{currentPatient.recentMetrics.bloodPressure.systolic?.[0]}-{currentPatient.recentMetrics.bloodPressure.systolic?.[1]} mmHg</span>
                      </div>
                      <Progress value={68} className="h-2" />
                      <div className="flex justify-between text-xs">
                        <span>Diastolic</span>
                        <span>{currentPatient.recentMetrics.bloodPressure.diastolic?.[0]}-{currentPatient.recentMetrics.bloodPressure.diastolic?.[1]} mmHg</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {currentPatient.recentMetrics.glucose && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-sm">Blood Glucose</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{currentPatient.recentMetrics.glucose.current} mg/dL</span>
                        {getTrendIcon(currentPatient.recentMetrics.glucose.trend)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Target Range</span>
                          <span>{currentPatient.recentMetrics.glucose.range[0]}-{currentPatient.recentMetrics.glucose.range[1]} mg/dL</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Post-meal reading • Within target range
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Medication Management
                </CardTitle>
                <CardDescription>
                  Smart dispenser tracking and adherence monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Metformin 500mg', schedule: 'Twice daily', adherence: 98, lastTaken: '2 hours ago', status: 'on-track' },
                      { name: 'Lisinopril 10mg', schedule: 'Once daily', adherence: 95, lastTaken: '8 hours ago', status: 'on-track' },
                      { name: 'Aspirin 81mg', schedule: 'Once daily', adherence: 97, lastTaken: '8 hours ago', status: 'on-track' }
                    ].map((med, index) => (
                      <Card key={index} className="border border-border/50">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-sm">{med.name}</h4>
                                <p className="text-xs text-muted-foreground">{med.schedule}</p>
                              </div>
                              <Badge variant="outline" className="bg-health-good/10 text-health-good">
                                {med.adherence}%
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Adherence</span>
                                <span>{med.adherence}%</span>
                              </div>
                              <Progress value={med.adherence} className="h-1.5" />
                            </div>
                            <p className="text-xs text-muted-foreground">Last taken: {med.lastTaken}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Prescription Management</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Prescription
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Modify Existing Prescription
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Generate Prescription Report
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Smart Dispenser Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Device Connection</span>
                          <Badge variant="outline" className="bg-health-good/10 text-health-good">Connected</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery Level</span>
                          <span>87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Refill Due</span>
                          <span>5 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compliance Score</span>
                          <span className="font-semibold text-health-good">A+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care-plan" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Personalized Care Plan
                </CardTitle>
                <CardDescription>
                  Evidence-based care protocols tailored to patient needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Treatment Goals</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">HbA1c &lt; 7.0%</p>
                            <p className="text-xs text-muted-foreground">Current: 6.8%</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-health-good" />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">BP &lt; 130/80 mmHg</p>
                            <p className="text-xs text-muted-foreground">Current: 118/76</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-health-good" />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Daily Activity &gt; 2000 steps</p>
                            <p className="text-xs text-muted-foreground">Average: 1847</p>
                          </div>
                          <Clock className="h-5 w-5 text-warning" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Interventions</h4>
                      <div className="space-y-3">
                        <div className="p-3 border border-border/50 rounded-lg">
                          <p className="font-medium text-sm">Medication Optimization</p>
                          <p className="text-xs text-muted-foreground">Metformin timing adjusted based on glucose patterns</p>
                          <Badge variant="outline" className="mt-2 text-xs bg-health-good/10 text-health-good">
                            Implemented
                          </Badge>
                        </div>
                        <div className="p-3 border border-border/50 rounded-lg">
                          <p className="font-medium text-sm">Activity Encouragement</p>
                          <p className="text-xs text-muted-foreground">Gentle reminders and family support for daily walks</p>
                          <Badge variant="outline" className="mt-2 text-xs bg-primary/10 text-primary">
                            In Progress
                          </Badge>
                        </div>
                        <div className="p-3 border border-border/50 rounded-lg">
                          <p className="font-medium text-sm">Dietary Counseling</p>
                          <p className="text-xs text-muted-foreground">Nutrition education with family involvement</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Planned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Care Team Coordination</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { role: 'Primary Care', name: 'Dr. Sarah Mitchell', lastContact: '2 days ago' },
                        { role: 'Endocrinologist', name: 'Dr. James Park', lastContact: '1 week ago' },
                        { role: 'Care Coordinator', name: 'Lisa Johnson RN', lastContact: '1 day ago' }
                      ].map((member, index) => (
                        <Card key={index} className="border border-border/50">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div>
                                <p className="font-medium text-sm">{member.role}</p>
                                <p className="text-xs text-muted-foreground">{member.name}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Last contact</span>
                                <span className="text-xs">{member.lastContact}</span>
                              </div>
                              <Button size="sm" variant="outline" className="w-full">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Patient Communications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        type: 'message',
                        from: 'Margaret Johnson',
                        time: '2 hours ago',
                        content: 'Feeling great today! Blood sugar was 128 this morning after breakfast.',
                        priority: 'normal'
                      },
                      {
                        type: 'alert',
                        from: 'SymbIOT System',
                        time: '1 day ago',
                        content: 'Medication adherence excellent this week - 97% compliance rate.',
                        priority: 'info'
                      },
                      {
                        type: 'family',
                        from: 'Sarah Johnson (Daughter)',
                        time: '2 days ago',
                        content: 'Mom seems more energetic lately. Thank you for the medication adjustment.',
                        priority: 'normal'
                      }
                    ].map((comm, index) => (
                      <div key={index} className="p-3 border border-border/50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{comm.from}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                            <span className="text-xs text-muted-foreground">{comm.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{comm.content}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="new-message">Send Message</Label>
                    <Textarea id="new-message" placeholder="Type your message to patient or family..." />
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Appointment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        date: '2024-01-15',
                        type: 'In-Person',
                        duration: '45 min',
                        notes: 'Routine follow-up. Discussed medication timing optimization.',
                        outcome: 'Stable'
                      },
                      {
                        date: '2023-12-20',
                        type: 'Telehealth',
                        duration: '30 min',
                        notes: 'Review of glucose logs. Patient compliance excellent.',
                        outcome: 'Improved'
                      },
                      {
                        date: '2023-11-15',
                        type: 'In-Person',
                        duration: '60 min',
                        notes: 'Comprehensive annual exam. Lab work ordered.',
                        outcome: 'Stable'
                      }
                    ].map((appointment, index) => (
                      <div key={index} className="p-3 border border-border/50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{appointment.type}</Badge>
                            <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{appointment.notes}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className={`text-xs ${
                            appointment.outcome === 'Improved' ? 'bg-health-good/10 text-health-good' :
                            appointment.outcome === 'Stable' ? 'bg-primary/10 text-primary' : ''
                          }`}>
                            {appointment.outcome}
                          </Badge>
                          <Button size="sm" variant="ghost" className="text-xs">
                            View Details
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-success" />
                  Clinical Outcomes & ROI
                </CardTitle>
                <CardDescription>
                  Measurable health improvements and cost savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Hospitalizations Prevented</p>
                    <p className="text-3xl font-bold text-success">{outcomes.hospitalizations.prevented}</p>
                    <p className="text-xs text-success">{outcomes.hospitalizations.reduction}% reduction</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Emergency Visits Avoided</p>
                    <p className="text-3xl font-bold text-health-good">{outcomes.emergencyVisits.prevented}</p>
                    <p className="text-xs text-health-good">{outcomes.emergencyVisits.reduction}% reduction</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Medication Adherence</p>
                    <p className="text-3xl font-bold text-primary">{outcomes.medicationAdherence.average}%</p>
                    <p className="text-xs text-health-good">+{outcomes.medicationAdherence.improvement}% improvement</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                    <p className="text-3xl font-bold text-health-good">{outcomes.patientSatisfaction.score}/10</p>
                    <p className="text-xs text-health-good">NPS: {outcomes.patientSatisfaction.nps}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Annual Cost Savings</p>
                    <p className="text-3xl font-bold text-success">${(outcomes.costSavings.annual / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-success">${(outcomes.costSavings.perPatient / 1000).toFixed(0)}K per patient</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}