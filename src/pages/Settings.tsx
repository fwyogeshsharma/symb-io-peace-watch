import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Heart,
  Shield,
  Smartphone,
  Moon,
  Volume2,
  AlertTriangle,
  Clock,
  Users,
  Lock,
  Save,
  ArrowLeft
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const navigate = useNavigate()
  const [userType] = useState<'patient' | 'caregiver'>('patient')
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected')
  const [notifications] = useState(2)

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    heartRateAlerts: true,
    medicationReminders: true,
    activityAlerts: false,
    emergencyAlerts: true,

    // Alert thresholds
    heartRateMin: 60,
    heartRateMax: 100,

    // Preferences
    theme: 'light',
    soundVolume: [75],
    vibrationEnabled: true,

    // Privacy
    shareDataWithFamily: true,
    shareDataWithDoctor: true,
    anonymousUsage: false,

    // Emergency contacts
    emergencyContactsEnabled: true,
    quickAccessEmergency: true
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings)
    // Show success toast
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <DashboardHeader
        userType={userType}
        userName="Margaret Johnson"
        notifications={notifications}
        connectionStatus={connectionStatus}
      />

      <main className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Customize your SymbIOT experience and monitoring preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">

            {/* Health Monitoring */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-health-good" />
                  Health Monitoring
                </CardTitle>
                <CardDescription>
                  Configure your health monitoring alerts and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Heart Rate Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        Get notified when heart rate is outside normal range
                      </div>
                    </div>
                    <Switch
                      checked={settings.heartRateAlerts}
                      onCheckedChange={(checked) => updateSetting('heartRateAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Medication Reminders</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive alerts for scheduled medications
                      </div>
                    </div>
                    <Switch
                      checked={settings.medicationReminders}
                      onCheckedChange={(checked) => updateSetting('medicationReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Activity Alerts</Label>
                      <div className="text-sm text-muted-foreground">
                        Notifications for prolonged inactivity
                      </div>
                    </div>
                    <Switch
                      checked={settings.activityAlerts}
                      onCheckedChange={(checked) => updateSetting('activityAlerts', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Heart Rate Thresholds</Label>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Minimum (BPM)</span>
                        <Badge variant="outline">{settings.heartRateMin}</Badge>
                      </div>
                      <Slider
                        value={[settings.heartRateMin]}
                        onValueChange={(value) => updateSetting('heartRateMin', value[0])}
                        max={80}
                        min={40}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Maximum (BPM)</span>
                        <Badge variant="outline">{settings.heartRateMax}</Badge>
                      </div>
                      <Slider
                        value={[settings.heartRateMax]}
                        onValueChange={(value) => updateSetting('heartRateMax', value[0])}
                        max={150}
                        min={80}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications & Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications & Alerts
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Critical health alerts that require immediate attention
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">Always On</Badge>
                    <Switch
                      checked={settings.emergencyAlerts}
                      onCheckedChange={(checked) => updateSetting('emergencyAlerts', checked)}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vibration</Label>
                    <div className="text-sm text-muted-foreground">
                      Phone vibration for alerts
                    </div>
                  </div>
                  <Switch
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(checked) => updateSetting('vibrationEnabled', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Sound Volume</Label>
                    <Badge variant="outline">{settings.soundVolume[0]}%</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={settings.soundVolume}
                      onValueChange={(value) => updateSetting('soundVolume', value)}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data Sharing */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Privacy & Data Sharing
                </CardTitle>
                <CardDescription>
                  Control who can access your health data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share with Family</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow family members to view your health data
                    </div>
                  </div>
                  <Switch
                    checked={settings.shareDataWithFamily}
                    onCheckedChange={(checked) => updateSetting('shareDataWithFamily', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share with Healthcare Provider</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow your doctor to access health metrics
                    </div>
                  </div>
                  <Switch
                    checked={settings.shareDataWithDoctor}
                    onCheckedChange={(checked) => updateSetting('shareDataWithDoctor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymous Usage Data</Label>
                    <div className="text-sm text-muted-foreground">
                      Help improve SymbIOT with anonymous usage data
                    </div>
                  </div>
                  <Switch
                    checked={settings.anonymousUsage}
                    onCheckedChange={(checked) => updateSetting('anonymousUsage', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Emergency Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Emergency Contacts</Label>
                    <div className="text-xs text-muted-foreground">
                      Enable emergency contact notifications
                    </div>
                  </div>
                  <Switch
                    checked={settings.emergencyContactsEnabled}
                    onCheckedChange={(checked) => updateSetting('emergencyContactsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Quick Access</Label>
                    <div className="text-xs text-muted-foreground">
                      Show emergency button on dashboard
                    </div>
                  </div>
                  <Switch
                    checked={settings.quickAccessEmergency}
                    onCheckedChange={(checked) => updateSetting('quickAccessEmergency', checked)}
                  />
                </div>

                <Separator />

                <Button variant="outline" className="w-full text-health-critical border-health-critical hover:bg-health-critical/10">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Contacts
                </Button>
              </CardContent>
            </Card>

            {/* Device Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-success" />
                  Device Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Connection</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Connected
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Battery</span>
                  <Badge variant="outline">85%</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Sync</span>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>

                <Separator />

                <Button variant="outline" className="w-full">
                  Device Management
                </Button>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-gradient-health hover:bg-gradient-to-r hover:from-health-good hover:to-health-excellent">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  )
}