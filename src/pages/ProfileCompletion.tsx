import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  User,
  Heart,
  Home,
  Phone,
  Calendar,
  AlertTriangle,
  Shield,
  Pill,
  Activity,
  Users,
  MapPin,
  Mail,
  CheckCircle,
  FileText,
  Stethoscope
} from 'lucide-react'

export default function ProfileCompletion() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentTab, setCurrentTab] = useState('personal')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: user?.full_name || '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    alternatePhone: '',
    email: user?.email || '',

    // Address Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',

    // Medical Information
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    primaryPhysician: '',
    physicianPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',

    // Lifestyle Information
    livingArrangement: '',
    mobilityLevel: '',
    dietaryRestrictions: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseFrequency: '',

    // Care Preferences (for seniors)
    preferredCaregiverGender: '',
    languagePreference: '',
    specialRequirements: '',
    hobbiesInterests: '',

    // Professional Information (for caregivers)
    yearsOfExperience: '',
    certifications: '',
    specializations: '',
    availability: '',
    preferredPatientType: '',
    professionalBio: ''
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter(value => value !== '').length
    return (filledFields / totalFields) * 100
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user?.id,
          ...formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      toast.success('Profile completed successfully!', {
        description: 'Your information has been saved.'
      })

      // Redirect to home page
      navigate('/home')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gradient-dashboard p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-primary" />
                  Complete Your Profile
                </CardTitle>
                <CardDescription>
                  Help us provide you with the best care experience by completing your profile
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {user?.role === 'senior' ? 'Patient' : 'Caregiver'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Form Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Heart className="h-4 w-4 mr-2" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="emergency">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Shield className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic information about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateField('phoneNumber', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => updateField('alternatePhone', e.target.value)}
                      placeholder="(555) 987-6543"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="New York"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="NY"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      placeholder="10001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Information Tab */}
          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Health Information
                </CardTitle>
                <CardDescription>Your medical history and current health status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={formData.bloodType} onValueChange={(value) => updateField('bloodType', value)}>
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder="Select blood type" />
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
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      placeholder="170"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      placeholder="70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobilityLevel">Mobility Level</Label>
                    <Select value={formData.mobilityLevel} onValueChange={(value) => updateField('mobilityLevel', value)}>
                      <SelectTrigger id="mobilityLevel">
                        <SelectValue placeholder="Select mobility level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully-mobile">Fully Mobile</SelectItem>
                        <SelectItem value="assisted">Needs Assistance</SelectItem>
                        <SelectItem value="wheelchair">Wheelchair User</SelectItem>
                        <SelectItem value="bedridden">Bedridden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => updateField('allergies', e.target.value)}
                    placeholder="List any allergies (medications, food, environmental, etc.)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                  <Textarea
                    id="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={(e) => updateField('chronicConditions', e.target.value)}
                    placeholder="List any chronic conditions (diabetes, hypertension, etc.)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => updateField('currentMedications', e.target.value)}
                    placeholder="List all current medications with dosage"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Healthcare Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhysician">Primary Physician</Label>
                    <Input
                      id="primaryPhysician"
                      value={formData.primaryPhysician}
                      onChange={(e) => updateField('primaryPhysician', e.target.value)}
                      placeholder="Dr. Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="physicianPhone">Physician Phone</Label>
                    <Input
                      id="physicianPhone"
                      type="tel"
                      value={formData.physicianPhone}
                      onChange={(e) => updateField('physicianPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => updateField('insuranceProvider', e.target.value)}
                      placeholder="Blue Cross Blue Shield"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => updateField('insurancePolicyNumber', e.target.value)}
                      placeholder="ABC123456"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contact Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-health-critical" />
                  Emergency Contact Information
                </CardTitle>
                <CardDescription>
                  Who should we contact in case of an emergency?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name *</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField('emergencyContactName', e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                    <Select
                      value={formData.emergencyContactRelation}
                      onValueChange={(value) => updateField('emergencyContactRelation', value)}
                    >
                      <SelectTrigger id="emergencyContactRelation">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactEmail">Email</Label>
                    <Input
                      id="emergencyContactEmail"
                      type="email"
                      value={formData.emergencyContactEmail}
                      onChange={(e) => updateField('emergencyContactEmail', e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            {user?.role === 'senior' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Care Preferences
                  </CardTitle>
                  <CardDescription>Your preferences for care and daily living</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="livingArrangement">Living Arrangement</Label>
                      <Select
                        value={formData.livingArrangement}
                        onValueChange={(value) => updateField('livingArrangement', value)}
                      >
                        <SelectTrigger id="livingArrangement">
                          <SelectValue placeholder="Select arrangement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alone">Live Alone</SelectItem>
                          <SelectItem value="with-family">With Family</SelectItem>
                          <SelectItem value="assisted-living">Assisted Living</SelectItem>
                          <SelectItem value="nursing-home">Nursing Home</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languagePreference">Language Preference</Label>
                      <Input
                        id="languagePreference"
                        value={formData.languagePreference}
                        onChange={(e) => updateField('languagePreference', e.target.value)}
                        placeholder="English, Spanish, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                      <Input
                        id="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={(e) => updateField('dietaryRestrictions', e.target.value)}
                        placeholder="Vegetarian, Low sodium, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                      <Select
                        value={formData.exerciseFrequency}
                        onValueChange={(value) => updateField('exerciseFrequency', value)}
                      >
                        <SelectTrigger id="exerciseFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Few times a week</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hobbiesInterests">Hobbies & Interests</Label>
                    <Textarea
                      id="hobbiesInterests"
                      value={formData.hobbiesInterests}
                      onChange={(e) => updateField('hobbiesInterests', e.target.value)}
                      placeholder="Reading, gardening, watching movies, etc."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={(e) => updateField('specialRequirements', e.target.value)}
                      placeholder="Any special care requirements or preferences"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {user?.role === 'caregiver' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>Your caregiving experience and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        value={formData.yearsOfExperience}
                        onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                        placeholder="5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => updateField('availability', value)}
                      >
                        <SelectTrigger id="availability">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="weekends">Weekends Only</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications & Licenses</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => updateField('certifications', e.target.value)}
                      placeholder="CNA, CPR, First Aid, etc."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations</Label>
                    <Textarea
                      id="specializations"
                      value={formData.specializations}
                      onChange={(e) => updateField('specializations', e.target.value)}
                      placeholder="Dementia care, diabetes management, etc."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalBio">Professional Bio</Label>
                    <Textarea
                      id="professionalBio"
                      value={formData.professionalBio}
                      onChange={(e) => updateField('professionalBio', e.target.value)}
                      placeholder="Tell us about your caregiving philosophy and experience"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/home')}
                disabled={isSubmitting}
              >
                Skip for Now
              </Button>

              <div className="flex items-center gap-3">
                {currentTab !== 'personal' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const tabs = ['personal', 'medical', 'emergency', 'preferences']
                      const currentIndex = tabs.indexOf(currentTab)
                      if (currentIndex > 0) {
                        setCurrentTab(tabs[currentIndex - 1])
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Previous
                  </Button>
                )}

                {currentTab !== 'preferences' ? (
                  <Button
                    onClick={() => {
                      const tabs = ['personal', 'medical', 'emergency', 'preferences']
                      const currentIndex = tabs.indexOf(currentTab)
                      if (currentIndex < tabs.length - 1) {
                        setCurrentTab(tabs[currentIndex + 1])
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
