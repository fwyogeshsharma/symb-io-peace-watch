import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar as CalendarIcon,
  TrendingUp,
  Heart,
  Activity,
  Pill,
  Clock,
  BarChart3,
  PieChart,
  FileBarChart,
  Filter,
  Share,
  Printer,
  Mail,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Sparkles,
  Database
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { generatePatientReport, generateFamilyReport, PatientData } from "@/utils/reportGenerator"
import { generatePDFReport, generateFamilyPDFReport, exportReportAsJSON, exportMetricsAsCSV } from "@/utils/pdfReportGenerator"

export default function Reports() {
  const navigate = useNavigate()
  const [userType] = useState<'caregiver'>('caregiver')
  const [connectionStatus] = useState<'connected'>('connected')
  const [notifications] = useState(3)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedPatient, setSelectedPatient] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("comprehensive")
  const [dateRange, setDateRange] = useState<string>("month")

  // Family members data
  const familyMembers = [
    {
      id: 'mom',
      name: 'Margaret Johnson',
      relation: 'Mother',
      age: 78,
      avatar: 'MJ',
      status: 'good',
      recentReports: 8
    },
    {
      id: 'dad',
      name: 'Robert Johnson Sr.',
      relation: 'Father',
      age: 82,
      avatar: 'RJ',
      status: 'warning',
      recentReports: 12
    },
    {
      id: 'grandma',
      name: 'Dorothy Williams',
      relation: 'Grandmother',
      age: 75,
      avatar: 'DW',
      status: 'excellent',
      recentReports: 6
    },
    {
      id: 'uncle',
      name: 'Frank Rodriguez',
      relation: 'Uncle',
      age: 84,
      avatar: 'FR',
      status: 'critical',
      recentReports: 15
    }
  ]

  // Available reports data
  const availableReports = [
    {
      id: 'health-summary',
      title: 'Health Summary Report',
      description: 'Comprehensive overview of vital signs, medications, and overall health status',
      type: 'individual',
      lastGenerated: '2 hours ago',
      fileSize: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 'medication-compliance',
      title: 'Medication Compliance Report',
      description: 'Detailed analysis of medication adherence and missed doses',
      type: 'individual',
      lastGenerated: '4 hours ago',
      fileSize: '1.8 MB',
      format: 'PDF'
    },
    {
      id: 'activity-trends',
      title: 'Activity & Mobility Trends',
      description: 'Physical activity patterns, step counts, and mobility analysis',
      type: 'individual',
      lastGenerated: '6 hours ago',
      fileSize: '3.2 MB',
      format: 'PDF'
    },
    {
      id: 'emergency-incidents',
      title: 'Emergency Incidents Log',
      description: 'Record of all emergency alerts, responses, and outcomes',
      type: 'individual',
      lastGenerated: '1 day ago',
      fileSize: '1.5 MB',
      format: 'PDF'
    }
  ]

  const monthlyReports = [
    {
      id: 'monthly-analysis',
      title: 'Monthly Health Analysis',
      description: 'Comprehensive monthly health trends and patterns for all family members',
      period: 'November 2024',
      lastGenerated: '3 days ago',
      fileSize: '8.7 MB',
      format: 'PDF',
      metrics: {
        totalAlerts: 23,
        averageHealthScore: 79,
        medicationAdherence: 87,
        emergencyIncidents: 2
      }
    },
    {
      id: 'care-coordination',
      title: 'Care Coordination Summary',
      description: 'Provider communications, appointments, and care plan updates',
      period: 'November 2024',
      lastGenerated: '5 days ago',
      fileSize: '4.3 MB',
      format: 'PDF',
      metrics: {
        appointments: 8,
        providerMessages: 15,
        careUpdates: 6,
        familyMeetings: 2
      }
    },
    {
      id: 'family-wellness',
      title: 'Family Wellness Overview',
      description: 'Overall family health trends, satisfaction scores, and recommendations',
      period: 'November 2024',
      lastGenerated: '1 week ago',
      fileSize: '6.1 MB',
      format: 'PDF',
      metrics: {
        satisfactionScore: 9.4,
        healthImprovement: 23,
        deviceUptime: 98.5,
        responseTime: 47
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-health-excellent border-health-excellent/20 bg-health-excellent/10'
      case 'good': return 'text-health-good border-health-good/20 bg-health-good/10'
      case 'warning': return 'text-warning border-warning/20 bg-warning/10'
      case 'critical': return 'text-health-critical border-health-critical/20 bg-health-critical/10'
      default: return 'text-muted-foreground border-border bg-muted/10'
    }
  }

  const handleDownloadReport = (reportId: string, patientId?: string, format: 'pdf' | 'json' | 'csv' = 'pdf') => {
    if (patientId && patientId !== 'all') {
      // Generate individual patient report
      const patient = familyMembers.find(m => m.id === patientId)
      if (patient) {
        const patientData: PatientData = {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          relation: patient.relation,
          status: patient.status
        }

        const reportData = generatePatientReport(patientData, 30)
        const fileName = `${reportId}_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`

        switch (format) {
          case 'pdf':
            generatePDFReport(reportData, reportId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))
            break
          case 'json':
            exportReportAsJSON(reportData, fileName)
            break
          case 'csv':
            exportMetricsAsCSV(reportData, fileName)
            break
        }
      }
    } else {
      // Generate family report
      const familyData = generateFamilyReport(familyMembers.map(m => ({
        id: m.id,
        name: m.name,
        age: m.age,
        relation: m.relation,
        status: m.status
      })))

      const fileName = `Family_Report_${new Date().toISOString().split('T')[0]}`

      switch (format) {
        case 'pdf':
          generateFamilyPDFReport(familyData)
          break
        case 'json':
          exportReportAsJSON(familyData, fileName)
          break
      }
    }
  }

  const handleGenerateNewReport = () => {
    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : dateRange === 'quarter' ? 90 : dateRange === 'year' ? 365 : 30

    if (selectedPatient === 'all') {
      // Generate family report
      const familyData = generateFamilyReport(familyMembers.map(m => ({
        id: m.id,
        name: m.name,
        age: m.age,
        relation: m.relation,
        status: m.status
      })))
      generateFamilyPDFReport(familyData)
    } else {
      // Generate individual report
      const patient = familyMembers.find(m => m.id === selectedPatient)
      if (patient) {
        const patientData: PatientData = {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          relation: patient.relation,
          status: patient.status
        }

        const reportData = generatePatientReport(patientData, days)
        generatePDFReport(reportData, reportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))
      }
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
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Reports</h1>
              <p className="text-muted-foreground">
                Generate and download comprehensive health reports for your family
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Reports
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Reports
            </Button>
            <Button className="bg-gradient-health">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-primary">41</p>
                  <p className="text-xs text-health-good">This month</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-health-good">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Auto-Generated</p>
                  <p className="text-2xl font-bold text-health-good">28</p>
                  <p className="text-xs text-muted-foreground">Scheduled reports</p>
                </div>
                <RefreshCw className="h-8 w-8 text-health-good" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Custom Reports</p>
                  <p className="text-2xl font-bold text-warning">13</p>
                  <p className="text-xs text-muted-foreground">User requested</p>
                </div>
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shared Reports</p>
                  <p className="text-2xl font-bold text-success">7</p>
                  <p className="text-xs text-success">With healthcare providers</p>
                </div>
                <Share className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="individual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="individual">Individual Reports</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
          </TabsList>

          {/* Individual Reports Tab */}
          <TabsContent value="individual" className="space-y-6">
            {/* Family Members Selection */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Select Family Member
                </CardTitle>
                <CardDescription>
                  Choose a family member to view their individual health reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {familyMembers.map((member) => (
                    <Card
                      key={member.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPatient === member.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedPatient(member.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder-${member.id}.jpg`} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{member.name}</h3>
                            <p className="text-xs text-muted-foreground">{member.relation}, {member.age}</p>
                            <Badge className={`text-xs mt-1 ${getStatusColor(member.status)}`}>
                              {member.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Reports</span>
                          <span className="font-semibold">{member.recentReports}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Health Insights */}
            {selectedPatient !== "all" && (
              <Card className="shadow-card border-l-4 border-l-success">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-success" />
                    AI Health Insights
                    <Badge variant="outline" className="ml-2">
                      {familyMembers.find(m => m.id === selectedPatient)?.name}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    AI-generated health analysis and recommendations for the selected patient
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const patient = familyMembers.find(m => m.id === selectedPatient)
                    if (patient) {
                      const patientData: PatientData = {
                        id: patient.id,
                        name: patient.name,
                        age: patient.age,
                        relation: patient.relation,
                        status: patient.status
                      }
                      const reportData = generatePatientReport(patientData, 7)

                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-primary/5 p-4 rounded-lg">
                              <h4 className="font-semibold text-primary mb-2">Health Score</h4>
                              <div className="text-2xl font-bold">
                                {patient.status === 'excellent' ? '95%' :
                                 patient.status === 'good' ? '85%' :
                                 patient.status === 'warning' ? '70%' : '55%'}
                              </div>
                              <p className="text-xs text-muted-foreground">Overall health rating</p>
                            </div>
                            <div className="bg-health-good/5 p-4 rounded-lg">
                              <h4 className="font-semibold text-health-good mb-2">Activity Level</h4>
                              <div className="text-2xl font-bold">
                                {Math.round(reportData.metrics.steps.reduce((a, b) => a + b, 0) / reportData.metrics.steps.length).toLocaleString()}
                              </div>
                              <p className="text-xs text-muted-foreground">Avg daily steps</p>
                            </div>
                            <div className="bg-warning/5 p-4 rounded-lg">
                              <h4 className="font-semibold text-warning mb-2">Medication Adherence</h4>
                              <div className="text-2xl font-bold">{reportData.metrics.medicationAdherence}%</div>
                              <p className="text-xs text-muted-foreground">Compliance rate</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold">Key Insights:</h4>
                            <ul className="space-y-2">
                              {reportData.insights.slice(0, 3).map((insight, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDownloadReport('ai-analysis', selectedPatient, 'pdf')}
                              className="bg-gradient-health"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Download AI Report
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReport('ai-analysis', selectedPatient, 'json')}
                            >
                              <Database className="h-3 w-3 mr-1" />
                              Export Data
                            </Button>
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Available Reports */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="h-5 w-5 text-primary" />
                  Available Reports
                  {selectedPatient !== "all" && (
                    <Badge variant="outline" className="ml-2">
                      {familyMembers.find(m => m.id === selectedPatient)?.name}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Individual health reports for the selected family member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableReports.map((report) => (
                    <div key={report.id} className="border border-border/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{report.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {report.format}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last generated: {report.lastGenerated}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Size: {report.fileSize}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Printer className="h-3 w-3 mr-1" />
                            Print
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleDownloadReport(report.id, selectedPatient, 'pdf')}
                              className="bg-gradient-health"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReport(report.id, selectedPatient, 'json')}
                            >
                              <Database className="h-3 w-3 mr-1" />
                              JSON
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReport(report.id, selectedPatient, 'csv')}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              CSV
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Analysis Tab */}
          <TabsContent value="monthly" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Monthly Analysis Reports
                </CardTitle>
                <CardDescription>
                  Comprehensive monthly health analysis and family wellness reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyReports.map((report) => (
                    <div key={report.id} className="border border-border/50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {report.period}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.format}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {report.description}
                          </p>

                          {/* Report Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {Object.entries(report.metrics).map(([key, value]) => (
                              <div key={key} className="text-center p-3 bg-muted/20 rounded-lg">
                                <p className="text-2xl font-bold text-primary">{value}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Generated: {report.lastGenerated}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Size: {report.fileSize}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate New Report Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Generate Custom Report
                </CardTitle>
                <CardDescription>
                  Create a custom health report with specific parameters and date ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Report Configuration */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Patient</label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a family member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Family Members</SelectItem>
                          {familyMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.relation})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comprehensive">Comprehensive Health Report</SelectItem>
                          <SelectItem value="medication">Medication Compliance</SelectItem>
                          <SelectItem value="activity">Activity & Mobility</SelectItem>
                          <SelectItem value="vitals">Vital Signs Analysis</SelectItem>
                          <SelectItem value="emergency">Emergency Incidents</SelectItem>
                          <SelectItem value="care">Care Coordination</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="quarter">Last 3 Months</SelectItem>
                          <SelectItem value="year">Last Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {dateRange === "custom" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Custom Date Range</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>

                  {/* Report Preview */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Report Preview</h3>
                    <div className="border border-border/50 rounded-lg p-4 bg-muted/20">
                      <h4 className="font-medium mb-2">
                        {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedPatient === "all" ? "All Family Members" :
                         familyMembers.find(m => m.id === selectedPatient)?.name || "Selected Patient"}
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Date Range:</span>
                          <span className="font-medium">{dateRange === "custom" ? format(selectedDate, "PPP") : dateRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Report Type:</span>
                          <span className="font-medium capitalize">{reportType.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Size:</span>
                          <span className="font-medium">2.1 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span className="font-medium">PDF</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-health"
                      onClick={handleGenerateNewReport}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
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