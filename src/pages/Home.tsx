import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart,
  Calendar,
  Bell,
  Users,
  User,
  Lightbulb,
  Smile,
  Activity,
  Pill,
  UtensilsCrossed,
  Stethoscope,
  ClipboardList,
  MessageSquare,
  Shield,
  Home as HomeIcon,
  CheckCircle,
  AlertTriangle,
  ThermometerSun,
  DoorOpen,
  Phone,
  Clock,
  MapPin,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Droplets,
  Weight,
  Footprints,
  Brain,
  Zap,
  Wind,
  Database
} from 'lucide-react';
import {
  happyNotesApi,
  routinesApi,
  medicinesApi,
  sensorAlertsApi,
  serviceProvidersApi,
  caregiverTipsApi,
  authApi,
  relationshipsApi,
  iotDevicesApi,
  vitalsApi,
  activityApi,
  emergencyAlertsApi,
  aiInsightsApi,
  sampleDataApi,
  dashboardApi
} from '@/lib/api-client';
import { MultiPatientChart } from '@/components/charts/multi-patient-chart';
import { LiveMonitoringGrid } from '@/components/charts/live-monitoring-grid';
import { PatientDetailDashboard } from '@/components/dashboard/patient-detail-dashboard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Home() {
  const { user } = useAuth();
  const [happyNote, setHappyNote] = useState<any>(null);
  const [routines, setRoutines] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [sensorAlerts, setSensorAlerts] = useState<any[]>([]);
  const [serviceProviders, setServiceProviders] = useState<any[]>([]);
  const [caregiverTips, setCaregiverTips] = useState<any[]>([]);
  const [seniors, setSeniors] = useState<any[]>([]);
  const [selectedSeniorId, setSelectedSeniorId] = useState<number | null>(null);
  const [availablePatients, setAvailablePatients] = useState<any[]>([]);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<{ id: number; name: string } | null>(null);

  // IoT Data State
  const [iotDevices, setIotDevices] = useState<any[]>([]);
  const [latestVitals, setLatestVitals] = useState<any[]>([]);
  const [todayActivities, setTodayActivities] = useState<any[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isGeneratingData, setIsGeneratingData] = useState(false);

  useEffect(() => {
    // Load data
    const loadData = async () => {
      try {
        // Load happy note
        const note = await happyNotesApi.getTodayNote();
        setHappyNote(note);

        // If caregiver, load approved patients only
        if (user?.role === 'caregiver' || user?.role === 'provider') {
          const approvedPatients = await relationshipsApi.getCaregiverPatients(user.id);
          setSeniors(approvedPatients);
          // Set first patient as selected by default
          if (approvedPatients.length > 0) {
            setSelectedSeniorId(approvedPatients[0].id);
          }
        } else if (user?.role === 'senior') {
          // For seniors, use their own ID and load pending requests
          setSelectedSeniorId(user.id);
          const requests = await relationshipsApi.getPatientRequests(user.id);
          setPendingRequests(requests);
        }

        // Load service providers
        const providers = await serviceProvidersApi.getAllProviders();
        setServiceProviders(providers);

        // Load caregiver tips
        const tips = await caregiverTipsApi.getAllTips();
        setCaregiverTips(tips);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user]);

  // Load patient-specific data when selectedSeniorId changes
  useEffect(() => {
    const loadPatientData = async () => {
      if (!selectedSeniorId) return;

      try {
        // Load daily routines
        const todayRoutines = await routinesApi.getRoutinesBySeniorId(selectedSeniorId);
        setRoutines(todayRoutines);

        // Load medicines
        const meds = await medicinesApi.getMedicinesBySeniorId(selectedSeniorId);
        setMedicines(meds);

        // Load sensor alerts
        const alerts = await sensorAlertsApi.getAlertsBySeniorId(selectedSeniorId, 5);
        setSensorAlerts(alerts);

        // Load IoT devices
        const devices = await iotDevicesApi.getDevicesBySeniorId(selectedSeniorId);
        setIotDevices(devices);

        // Load latest vitals
        const vitals = await vitalsApi.getLatestVitals(selectedSeniorId);
        setLatestVitals(vitals);

        // Load today's activities
        const activities = await activityApi.getTodayActivities(selectedSeniorId);
        setTodayActivities(activities);

        // Load emergency alerts
        const emergencyData = await emergencyAlertsApi.getAlertsBySeniorId(selectedSeniorId);
        setEmergencyAlerts(emergencyData);

        // Load AI insights
        const insights = await aiInsightsApi.getInsightsBySeniorId(selectedSeniorId);
        setAiInsights(insights);
      } catch (error) {
        console.error('Error loading patient data:', error);
      }
    };

    loadPatientData();
  }, [selectedSeniorId]);

  // Load available patients when browsing
  const loadAvailablePatients = async () => {
    if (!user?.id) return;
    try {
      const patients = await relationshipsApi.getAvailablePatients(user.id);
      setAvailablePatients(patients);
      setShowBrowseModal(true);
    } catch (error) {
      console.error('Error loading available patients:', error);
      toast.error('Failed to load patients');
    }
  };

  // Request access to a patient
  const handleRequestAccess = async (patientId: number) => {
    if (!user?.id) return;
    try {
      await relationshipsApi.requestAccess(user.id, patientId);
      toast.success('Access request sent! Waiting for patient approval.');
      // Refresh available patients
      const patients = await relationshipsApi.getAvailablePatients(user.id);
      setAvailablePatients(patients);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    }
  };

  // Approve or reject a request (for patients)
  const handleRespondToRequest = async (relationshipId: number, status: 'approved' | 'rejected') => {
    if (!user?.id) return;
    try {
      await relationshipsApi.respondToRequest(relationshipId, user.id, status);
      toast.success(`Request ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      // Refresh pending requests
      const requests = await relationshipsApi.getPatientRequests(user.id);
      setPendingRequests(requests);
    } catch (error: any) {
      toast.error(error.message || 'Failed to respond to request');
    }
  };

  // Generate sample IoT data
  const handleGenerateSampleData = async () => {
    if (!selectedSeniorId) {
      toast.error('Please select a patient first');
      return;
    }
    setIsGeneratingData(true);
    try {
      await sampleDataApi.generateSampleData(selectedSeniorId);
      toast.success('Sample IoT data generated successfully! Refreshing dashboard...');

      // Reload all patient data
      const devices = await iotDevicesApi.getDevicesBySeniorId(selectedSeniorId);
      setIotDevices(devices);

      const vitals = await vitalsApi.getLatestVitals(selectedSeniorId);
      setLatestVitals(vitals);

      const activities = await activityApi.getTodayActivities(selectedSeniorId);
      setTodayActivities(activities);

      const emergencyData = await emergencyAlertsApi.getAlertsBySeniorId(selectedSeniorId);
      setEmergencyAlerts(emergencyData);

      const insights = await aiInsightsApi.getInsightsBySeniorId(selectedSeniorId);
      setAiInsights(insights);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate sample data');
    } finally {
      setIsGeneratingData(false);
    }
  };

  // Acknowledge emergency alert
  const handleAcknowledgeAlert = async (alertId: number) => {
    if (!user?.id) return;
    try {
      await emergencyAlertsApi.acknowledgeAlert(alertId, user.id);
      toast.success('Alert acknowledged');

      // Refresh emergency alerts
      if (selectedSeniorId) {
        const emergencyData = await emergencyAlertsApi.getAlertsBySeniorId(selectedSeniorId);
        setEmergencyAlerts(emergencyData);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to acknowledge alert');
    }
  };

  // Helper function to get vital value
  const getVitalValue = (type: string) => {
    const vital = latestVitals.find(v => v.vital_type === type);
    return vital || null;
  };

  // Helper function to format vital display
  const formatVital = (type: string) => {
    const vital = getVitalValue(type);
    if (!vital) return { value: '--', status: 'normal' };

    let status = 'normal';
    if (vital.is_anomaly) status = 'warning';

    switch (type) {
      case 'blood_pressure':
        return { value: `${vital.systolic}/${vital.diastolic}`, status, unit: 'mmHg' };
      case 'heart_rate':
        return { value: vital.value, status, unit: 'BPM' };
      case 'glucose':
        return { value: vital.value, status, unit: 'mg/dL' };
      case 'weight':
        return { value: vital.value, status, unit: 'kg' };
      case 'spo2':
        return { value: vital.value, status, unit: '%' };
      case 'steps':
        return { value: vital.value, status, unit: 'steps' };
      default:
        return { value: vital.value, status, unit: vital.unit };
    }
  };

  // Mock sensor status for visualization
  const sensorStatus = {
    allSystemsGo: sensorAlerts.filter(a => a.severity === 'critical').length === 0,
    totalSensors: iotDevices.length || 8,
    activeSensors: iotDevices.filter(d => d.status === 'active').length || 8,
    batteryWarnings: iotDevices.filter(d => d.battery_level && d.battery_level < 20).length || 1
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={user?.role === 'senior' ? 'patient' : 'caregiver'}
        userName={user?.full_name || 'User'}
        notifications={sensorAlerts.length}
        connectionStatus="connected"
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="h-64 bg-gradient-to-r from-primary/80 to-primary/60 relative">
            <div className="relative h-full flex items-center justify-between p-8 text-white">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.full_name || 'User'}!
                </h1>
                <p className="text-white/90 text-lg">
                  {emergencyAlerts.filter(a => !a.acknowledged_at).length === 0
                    ? "Your health is looking great today. All systems monitoring normally."
                    : `You have ${emergencyAlerts.filter(a => !a.acknowledged_at).length} alert(s) that need attention.`}
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {emergencyAlerts.filter(a => !a.acknowledged_at).length === 0 ? 'All Clear' : `${emergencyAlerts.filter(a => !a.acknowledged_at).length} Alerts`}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Database className="w-3 h-3 mr-1" />
                    {iotDevices.filter(d => d.status === 'active').length}/{iotDevices.length} Devices Active
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Activity className="w-3 h-3 mr-1" />
                    {todayActivities.length} Activities Today
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Happy Note of the Day */}
        <Card className="shadow-glow border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-6 w-6 text-primary" />
              Happy Note of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic text-muted-foreground">
              "{happyNote?.note_text || 'Every day is a gift. Embrace it with joy and gratitude!'}"
            </p>
            {happyNote?.author && (
              <p className="text-sm text-muted-foreground mt-2">- {happyNote.author}</p>
            )}
          </CardContent>
        </Card>


        {/* Emergency Alerts */}
        {emergencyAlerts.filter(a => !a.acknowledged_at).length > 0 && (
          <Card className="shadow-card border-l-4 border-l-red-500 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Zap className="h-6 w-6" />
                Emergency Alerts ({emergencyAlerts.filter(a => !a.acknowledged_at).length})
              </CardTitle>
              <CardDescription>Critical alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyAlerts
                  .filter(a => !a.acknowledged_at)
                  .map((alert) => (
                    <Card key={alert.id} className={`border-2 ${
                      alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                      alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                      'border-yellow-500 bg-yellow-50'
                    }`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              alert.severity === 'critical' ? 'bg-red-500' :
                              alert.severity === 'high' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }`}>
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="destructive" className="uppercase">
                                  {alert.alert_type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="uppercase">
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="font-medium text-gray-900">{alert.description}</p>
                              {alert.location && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {alert.location}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(alert.triggered_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="ml-3"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient List for Caregivers */}
        {(user?.role === 'caregiver' || user?.role === 'provider') && (
          <Card className="shadow-card border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    My Patients
                  </CardTitle>
                  <CardDescription>Select a patient to view their details</CardDescription>
                </div>
                <Button onClick={loadAvailablePatients} variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Browse Patients
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {seniors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seniors.map((senior) => (
                    <Card
                      key={senior.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedSeniorId === senior.id
                          ? 'border-2 border-primary bg-primary/5'
                          : 'border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedSeniorId(senior.id)
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{senior.full_name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{senior.email}</p>
                          </div>
                          {selectedSeniorId === senior.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-1 text-sm">
                            {senior.address && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{senior.address}</span>
                              </div>
                            )}
                            {senior.emergency_contact && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{senior.emergency_contact}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPatientDetail({ id: senior.id, name: senior.full_name })
                              setShowPatientDetail(true)
                            }}
                          >
                            <User className="h-3 w-3 mr-2" />
                            View Full Dashboard
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">You don't have any patients yet</p>
                  <Button onClick={loadAvailablePatients}>
                    <Users className="h-4 w-4 mr-2" />
                    Browse Available Patients
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pending Requests for Patients */}
        {user?.role === 'senior' && pendingRequests.length > 0 && (
          <Card className="shadow-card border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-orange-500" />
                Caregiver Access Requests ({pendingRequests.length})
              </CardTitle>
              <CardDescription>Review and approve or reject caregiver requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="border-orange-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">{request.full_name}</p>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Requested: {new Date(request.requested_at).toLocaleDateString()}
                            </p>
                            {request.notes && (
                              <p className="text-sm text-muted-foreground mt-1 italic">"{request.notes}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleRespondToRequest(request.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRespondToRequest(request.id, 'rejected')}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Monitoring Components for Caregivers */}
        {(user?.role === 'caregiver' || user?.role === 'provider') && selectedSeniorId && (
          <>
            {/* Multi-Patient Analytics */}
            <MultiPatientChart
              showData={latestVitals.length > 0 || todayActivities.length > 0}
            />

            {/* Live Monitoring Grid */}
            <LiveMonitoringGrid
              showData={latestVitals.length > 0 || todayActivities.length > 0}
            />
          </>
        )}

        {/* Browse Patients Modal */}
        <Dialog open={showBrowseModal} onOpenChange={setShowBrowseModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Browse Available Patients</DialogTitle>
              <DialogDescription>
                Request access to patients you want to care for. Patients must approve your request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {availablePatients.map((patient) => (
                <Card key={patient.id} className="relative">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary flex-shrink-0">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{patient.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                        {patient.address && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{patient.address}</span>
                          </div>
                        )}
                        <div className="mt-3">
                          {!patient.relationship_status ? (
                            <Button
                              size="sm"
                              onClick={() => handleRequestAccess(patient.id)}
                              className="w-full"
                            >
                              Request Access
                            </Button>
                          ) : patient.relationship_status === 'pending' ? (
                            <Badge variant="outline" className="w-full justify-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Approval
                            </Badge>
                          ) : patient.relationship_status === 'approved' ? (
                            <Badge className="w-full justify-center bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : patient.relationship_status === 'rejected' ? (
                            <Badge variant="destructive" className="w-full justify-center">
                              Rejected
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Daily Activities & Sensor Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Activities Planned */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Daily Activities Planned
                </CardTitle>
                <CardDescription>Today's schedule and tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="routines" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="routines">
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Routines
                    </TabsTrigger>
                    <TabsTrigger value="medicines">
                      <Pill className="h-4 w-4 mr-1" />
                      Medicines
                    </TabsTrigger>
                    <TabsTrigger value="dietary">
                      <UtensilsCrossed className="h-4 w-4 mr-1" />
                      Diet
                    </TabsTrigger>
                    <TabsTrigger value="health">
                      <Activity className="h-4 w-4 mr-1" />
                      Health
                    </TabsTrigger>
                    <TabsTrigger value="appointments">
                      <Stethoscope className="h-4 w-4 mr-1" />
                      Doctors
                    </TabsTrigger>
                  </TabsList>

                  {/* Daily Routines */}
                  <TabsContent value="routines" className="space-y-3">
                    {routines.length > 0 ? (
                      routines.map((routine) => (
                        <div key={routine.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className={`h-5 w-5 ${routine.is_completed ? 'text-health-good' : 'text-muted-foreground'}`} />
                            <div>
                              <p className="font-medium">{routine.title}</p>
                              <p className="text-sm text-muted-foreground">{routine.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{routine.time}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No routines scheduled for today</p>
                    )}
                    <Button variant="outline" className="w-full">+ Add Daily Routine</Button>
                  </TabsContent>

                  {/* Medicines */}
                  <TabsContent value="medicines" className="space-y-3">
                    {medicines.length > 0 ? (
                      medicines.map((medicine) => (
                        <div key={medicine.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Pill className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{medicine.name}</p>
                              <p className="text-sm text-muted-foreground">{medicine.dosage} - {medicine.frequency}</p>
                              <p className="text-xs text-muted-foreground">{medicine.instructions}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{medicine.time}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No medicines scheduled</p>
                    )}
                    <Button variant="outline" className="w-full">+ Add Medicine</Button>
                  </TabsContent>

                  {/* Dietary Needs */}
                  <TabsContent value="dietary" className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                        <Card key={meal}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{meal}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground">Click to plan</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Shopping List (QR Codes)
                    </Button>
                  </TabsContent>

                  {/* Health Markers */}
                  <TabsContent value="health" className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Blood Pressure */}
                      <Card className={formatVital('blood_pressure').status === 'warning' ? 'border-orange-500' : ''}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Blood Pressure
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatVital('blood_pressure').value}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatVital('blood_pressure').unit || 'mmHg'}
                            {formatVital('blood_pressure').status === 'warning' && ' ⚠️'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Heart Rate */}
                      <Card className={formatVital('heart_rate').status === 'warning' ? 'border-orange-500' : ''}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Heart className="h-4 w-4 text-health-critical" />
                            Heart Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatVital('heart_rate').value}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatVital('heart_rate').unit || 'BPM'}
                            {formatVital('heart_rate').status === 'warning' && ' ⚠️'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Blood Glucose */}
                      <Card className={formatVital('glucose').status === 'warning' ? 'border-orange-500' : ''}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            Blood Glucose
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatVital('glucose').value}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatVital('glucose').unit || 'mg/dL'}
                            {formatVital('glucose').status === 'warning' && ' ⚠️'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Weight */}
                      <Card className={formatVital('weight').status === 'warning' ? 'border-orange-500' : ''}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Weight className="h-4 w-4 text-green-500" />
                            Weight
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatVital('weight').value}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatVital('weight').unit || 'kg'}
                            {formatVital('weight').status === 'warning' && ' ⚠️'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* SpO2 */}
                      <Card className={formatVital('spo2').status === 'warning' ? 'border-orange-500' : ''}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Wind className="h-4 w-4 text-cyan-500" />
                            SpO2
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatVital('spo2').value}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatVital('spo2').unit || '%'}
                            {formatVital('spo2').status === 'warning' && ' ⚠️'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Steps */}
                      <Card className={formatVital('steps').status === 'warning' ? 'border-orange-500' : ''}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Footprints className="h-4 w-4 text-purple-500" />
                            Steps Today
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatVital('steps').value}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatVital('steps').unit || 'steps'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      {latestVitals.length > 0 ? (
                        <p>Last updated: {new Date(latestVitals[0]?.recorded_at).toLocaleString()}</p>
                      ) : (
                        <p>No vitals data available. Generate sample data to populate.</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Doctor Appointments */}
                  <TabsContent value="appointments" className="space-y-3">
                    <div className="text-center py-8 text-muted-foreground">
                      <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming appointments</p>
                    </div>
                    <Button variant="outline" className="w-full">+ Schedule Appointment</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Activity Timeline - Today's Activities */}
            {todayActivities.length > 0 && (
              <Card className="shadow-card border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    Today's Activity Timeline ({todayActivities.length} activities)
                  </CardTitle>
                  <CardDescription>Real-time activity tracking from IoT sensors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {todayActivities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                            {activity.activity_type === 'woke_up' && <Activity className="h-4 w-4 text-purple-600" />}
                            {activity.activity_type === 'bathroom_visit' && <DoorOpen className="h-4 w-4 text-purple-600" />}
                            {activity.activity_type === 'medication_taken' && <Pill className="h-4 w-4 text-purple-600" />}
                            {activity.activity_type === 'meal_consumed' && <UtensilsCrossed className="h-4 w-4 text-purple-600" />}
                            {(activity.activity_type === 'door_opened' || activity.activity_type === 'door_closed') && <DoorOpen className="h-4 w-4 text-purple-600" />}
                            {(activity.activity_type === 'left_home' || activity.activity_type === 'returned_home') && <HomeIcon className="h-4 w-4 text-purple-600" />}
                            {activity.activity_type === 'walking' && <Footprints className="h-4 w-4 text-purple-600" />}
                            {activity.activity_type === 'sitting' && <User className="h-4 w-4 text-purple-600" />}
                            {activity.activity_type === 'sleeping' && <Clock className="h-4 w-4 text-purple-600" />}
                            {!['woke_up', 'bathroom_visit', 'medication_taken', 'meal_consumed', 'door_opened', 'door_closed', 'left_home', 'returned_home', 'walking', 'sitting', 'sleeping'].includes(activity.activity_type) && <Activity className="h-4 w-4 text-purple-600" />}
                          </div>
                          {index < todayActivities.length - 1 && (
                            <div className="w-0.5 h-12 bg-purple-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm capitalize">
                              {activity.activity_type.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.recorded_at).toLocaleTimeString()}
                            </p>
                          </div>
                          {activity.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {activity.location}
                            </p>
                          )}
                          {activity.duration_minutes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Duration: {activity.duration_minutes} minutes
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* IoT Devices Status */}
            {iotDevices.length > 0 && (
              <Card className="shadow-card border-l-4 border-l-cyan-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-cyan-500" />
                    IoT Devices ({iotDevices.length} devices)
                  </CardTitle>
                  <CardDescription>Connected devices and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {iotDevices.map((device) => (
                      <Card key={device.id} className={`${
                        device.status === 'active' ? 'border-green-200 bg-green-50/30' :
                        device.status === 'error' ? 'border-red-200 bg-red-50/30' :
                        'border-gray-200 bg-gray-50/30'
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{device.device_name}</p>
                                <Badge variant="outline" className={`text-xs ${
                                  device.status === 'active' ? 'bg-green-100 text-green-700' :
                                  device.status === 'error' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {device.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground capitalize">
                                {device.device_type.replace(/_/g, ' ')}
                              </p>
                              {device.location && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {device.location}
                                </p>
                              )}
                              {device.battery_level !== null && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Battery</span>
                                    <span className={`font-medium ${
                                      device.battery_level < 20 ? 'text-red-600' :
                                      device.battery_level < 50 ? 'text-orange-600' :
                                      'text-green-600'
                                    }`}>
                                      {device.battery_level}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                                    <div
                                      className={`h-full rounded-full ${
                                        device.battery_level < 20 ? 'bg-red-500' :
                                        device.battery_level < 50 ? 'bg-orange-500' :
                                        'bg-green-500'
                                      }`}
                                      style={{ width: `${device.battery_level}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              {device.last_sync && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Last sync: {new Date(device.last_sync).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sensor Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Sensor Alerts & System Status
                </CardTitle>
                <CardDescription>Real-time monitoring and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Status Banner */}
                <div className={`p-4 rounded-lg ${sensorStatus.allSystemsGo ? 'bg-health-good/10 border border-health-good/20' : 'bg-health-warning/10 border border-health-warning/20'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${sensorStatus.allSystemsGo ? 'bg-health-good' : 'bg-health-warning'}`}>
                        {sensorStatus.allSystemsGo ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <AlertTriangle className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {sensorStatus.allSystemsGo ? 'All Systems Go!' : 'Attention Required'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sensorStatus.activeSensors}/{sensorStatus.totalSensors} sensors active
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Diagram</Button>
                  </div>
                </div>

                {/* House Diagram Preview */}
                <div className="border rounded-lg p-4 bg-card">
                  <h4 className="font-semibold mb-3">House Sensor Map</h4>
                  <div className="relative bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-health-good animate-pulse"></div>
                        <span>Living Room Motion</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-health-good animate-pulse"></div>
                        <span>Bedroom Temp</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-health-warning"></div>
                        <span>Front Door</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-health-good animate-pulse"></div>
                        <span>Bathroom Fall</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Interactive sensor map</p>
                  </div>
                </div>

                {/* Recent Alerts */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Alerts</h4>
                  {sensorAlerts.length > 0 ? (
                    <div className="space-y-2">
                      {sensorAlerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className={`h-4 w-4 ${alert.severity === 'critical' ? 'text-health-critical' : alert.severity === 'warning' ? 'text-health-warning' : 'text-primary'}`} />
                            <div>
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-muted-foreground">{alert.sensor_name} - {alert.location}</p>
                            </div>
                          </div>
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'outline'}>
                            {alert.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No recent alerts</p>
                  )}
                </div>

                {/* AI Insights */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Insights & Recommendations ({aiInsights.length})
                  </h4>
                  {aiInsights.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {aiInsights
                        .sort((a, b) => {
                          const priorityOrder = { high: 0, medium: 1, low: 2 };
                          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
                        })
                        .slice(0, 5)
                        .map((insight) => (
                          <div key={insight.id} className={`flex items-start gap-2 p-3 rounded-lg border ${
                            insight.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                            insight.priority === 'medium' ? 'bg-blue-50 border-blue-200' :
                            'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex-shrink-0 mt-0.5">
                              {insight.insight_type === 'health_trend' && <TrendingUp className="h-4 w-4 text-primary" />}
                              {insight.insight_type === 'behavior_change' && <Activity className="h-4 w-4 text-primary" />}
                              {insight.insight_type === 'recommendation' && <Lightbulb className="h-4 w-4 text-primary" />}
                              {insight.insight_type === 'prediction' && <Brain className="h-4 w-4 text-primary" />}
                              {insight.insight_type === 'risk_assessment' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                              {insight.insight_type === 'anomaly' && <Zap className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm">{insight.title}</p>
                                {insight.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs">HIGH</Badge>
                                )}
                                {insight.action_required && (
                                  <Badge variant="outline" className="text-xs">Action Required</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{insight.description}</p>
                              {insight.confidence_score && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Confidence: {Math.round(insight.confidence_score * 100)}%
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No AI insights available yet</p>
                      <p className="text-xs mt-1">Generate sample data to see AI-powered insights</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Service Providers, Key Senior Data, Tips */}
          <div className="space-y-6">
            {/* Service Providers */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Service Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs defaultValue="regular" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="regular">Regular</TabsTrigger>
                    <TabsTrigger value="occasional">Occasional</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency</TabsTrigger>
                  </TabsList>

                  <TabsContent value="regular" className="space-y-2">
                    {serviceProviders.filter(p => p.type === 'regular').map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{provider.name}</p>
                            <p className="text-xs text-muted-foreground">{provider.service_type}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="occasional" className="space-y-2">
                    {serviceProviders.filter(p => p.type === 'occasional').map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{provider.name}</p>
                            <p className="text-xs text-muted-foreground">{provider.service_type}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="emergency" className="space-y-2">
                    {serviceProviders.filter(p => p.type === 'emergency').map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-2 border rounded border-health-critical/20 bg-health-critical/5">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-health-critical" />
                          <div>
                            <p className="text-sm font-medium">{provider.name}</p>
                            <p className="text-xs text-muted-foreground">{provider.phone}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
                <Button variant="outline" className="w-full">+ Add Provider</Button>
              </CardContent>
            </Card>

            {/* Key Senior Data */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile & Data
                </CardTitle>
                <CardDescription>Patient information and data management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Generate Sample Data Button */}
                {selectedSeniorId && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">IoT Demo Data</h4>
                        <p className="text-xs text-muted-foreground">
                          Generate 7 days of sample data
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleGenerateSampleData}
                      disabled={isGeneratingData}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      size="sm"
                    >
                      {isGeneratingData ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generating Data...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Sample Data
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="border-t pt-3 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Pill className="h-4 w-4 mr-2" />
                    Medicines ({medicines.length})
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Dietary Intake
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorite Hobbies
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Activity Locations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    IoT Devices ({iotDevices.length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips and Tricks */}
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Tips to Make Your Senior Happy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {caregiverTips.slice(0, 3).map((tip) => (
                  <div key={tip.id} className="p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-start gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Tips</Button>
              </CardContent>
            </Card>

            {/* Nice Reminders */}
            <Card className="shadow-card bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Nice Things to Remember
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 bg-card rounded border">
                  <p className="text-sm italic">"Remember to smile and share a kind word today!"</p>
                </div>
                <div className="p-3 bg-card rounded border">
                  <p className="text-sm italic">"Your patience and care make all the difference."</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Patient Detail Dashboard Modal */}
      {selectedPatientDetail && (
        <PatientDetailDashboard
          patientId={selectedPatientDetail.id}
          patientName={selectedPatientDetail.name}
          isOpen={showPatientDetail}
          onClose={() => {
            setShowPatientDetail(false)
            setSelectedPatientDetail(null)
          }}
        />
      )}
    </div>
  );
}
