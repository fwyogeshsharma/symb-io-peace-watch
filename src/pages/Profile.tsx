import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Users,
  Shield,
  Edit,
  Save,
  ArrowLeft,
  Camera,
  FileText,
  AlertTriangle
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()
  const [userType] = useState<'patient' | 'caregiver'>('patient')
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected')
  const [notifications] = useState(2)
  const [isEditing, setIsEditing] = useState(false)

  // Profile data state
  const [profile, setProfile] = useState({
    // Personal Information
    firstName: "Margaret",
    lastName: "Johnson",
    email: "margaret.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1945-08-15",
    address: "123 Maple Street, Springfield, IL 62701",

    // Medical Information
    bloodType: "O+",
    height: "5'4\"",
    weight: "135 lbs",
    allergies: "Penicillin, Shellfish",
    medicalConditions: "Hypertension, Type 2 Diabetes",
    medications: "Metformin 500mg twice daily, Lisinopril 10mg once daily",
    emergencyContact: "Robert Johnson (Son) - +1 (555) 987-6543",
    primaryDoctor: "Dr. Sarah Mitchell - Springfield Medical Center",

    // Healthcare Provider Info (if caregiver)
    licenseNumber: "",
    specialization: "",
    yearsExperience: ""
  })

  const updateProfile = (key: string, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', profile)
    setIsEditing(false)
    // Show success toast
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal and medical information
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateProfile('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateProfile('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => updateProfile('address', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-health-good" />
                  Medical Information
                </CardTitle>
                <CardDescription>
                  Important health information for monitoring and emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select
                      value={profile.bloodType}
                      onValueChange={(value) => updateProfile('bloodType', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={profile.height}
                      onChange={(e) => updateProfile('height', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={profile.weight}
                      onChange={(e) => updateProfile('weight', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={profile.allergies}
                    onChange={(e) => updateProfile('allergies', e.target.value)}
                    disabled={!isEditing}
                    placeholder="List any known allergies..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea
                    id="medicalConditions"
                    value={profile.medicalConditions}
                    onChange={(e) => updateProfile('medicalConditions', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Current medical conditions..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={profile.medications}
                    onChange={(e) => updateProfile('medications', e.target.value)}
                    disabled={!isEditing}
                    placeholder="List current medications with dosages..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-health-critical" />
                  Emergency Information
                </CardTitle>
                <CardDescription>
                  Critical contact information for emergencies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={profile.emergencyContact}
                    onChange={(e) => updateProfile('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Name and phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryDoctor">Primary Healthcare Provider</Label>
                  <Input
                    id="primaryDoctor"
                    value={profile.primaryDoctor}
                    onChange={(e) => updateProfile('primaryDoctor', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Doctor name and facility"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt={`${profile.firstName} ${profile.lastName}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <Badge variant="outline">{calculateAge(profile.dateOfBirth)} years</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {userType === 'patient' ? 'Patient' : 'Caregiver'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Blood Type</span>
                  <Badge variant="outline" className="bg-health-good/10 text-health-good border-health-good/20">
                    {profile.bloodType}
                  </Badge>
                </div>

                <Separator />

                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Medical Records
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/reports')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Health Reports
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login</span>
                    <span>Today, 2:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile Updated</span>
                    <span>3 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settings Changed</span>
                    <span>1 week ago</span>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" className="w-full" onClick={() => navigate('/settings')}>
                  <Shield className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-gradient-health hover:bg-gradient-to-r hover:from-health-good hover:to-health-excellent">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}