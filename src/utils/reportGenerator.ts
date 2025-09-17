import { format, subDays, addDays } from "date-fns"

export interface PatientData {
  id: string
  name: string
  age: number
  relation: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
}

export interface HealthMetrics {
  heartRate: number[]
  bloodPressure: { systolic: number; diastolic: number }[]
  steps: number[]
  weight: number[]
  temperature: number[]
  sleepHours: number[]
  medicationAdherence: number
}

export interface ReportData {
  patient: PatientData
  metrics: HealthMetrics
  period: { start: string; end: string }
  insights: string[]
  recommendations: string[]
  alerts: Array<{
    type: 'critical' | 'warning' | 'info'
    message: string
    timestamp: string
  }>
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    adherence: number
    lastTaken: string
  }>
  activities: Array<{
    date: string
    type: string
    duration: number
    intensity: 'low' | 'moderate' | 'high'
  }>
}

// Generate random health data based on patient status
export const generateHealthMetrics = (patient: PatientData, days: number = 30): HealthMetrics => {
  const baseMetrics = {
    excellent: { hr: 65, steps: 2500, temp: 98.2, sleep: 8.5 },
    good: { hr: 72, steps: 2000, temp: 98.4, sleep: 8.0 },
    warning: { hr: 78, steps: 1500, temp: 98.7, sleep: 7.0 },
    critical: { hr: 85, steps: 800, temp: 99.2, sleep: 6.0 }
  }

  const base = baseMetrics[patient.status]

  const generateTimeSeries = (baseValue: number, variance: number, trend: number = 0) => {
    return Array.from({ length: days }, (_, i) => {
      const trendValue = baseValue + (trend * i / days)
      const randomVariance = (Math.random() - 0.5) * variance
      return Math.max(0, Math.round((trendValue + randomVariance) * 10) / 10)
    })
  }

  return {
    heartRate: generateTimeSeries(base.hr, 15),
    bloodPressure: Array.from({ length: days }, () => ({
      systolic: Math.round(110 + Math.random() * 40 + (patient.status === 'critical' ? 20 : 0)),
      diastolic: Math.round(70 + Math.random() * 20 + (patient.status === 'critical' ? 10 : 0))
    })),
    steps: generateTimeSeries(base.steps, 500, patient.status === 'excellent' ? 100 : -50),
    weight: generateTimeSeries(135 + (patient.age - 75) * 2, 3),
    temperature: generateTimeSeries(base.temp, 1),
    sleepHours: generateTimeSeries(base.sleep, 2),
    medicationAdherence: Math.max(50, 100 - (patient.status === 'critical' ? 30 : patient.status === 'warning' ? 15 : 5))
  }
}

// Generate AI insights based on health data
export const generateInsights = (patient: PatientData, metrics: HealthMetrics): string[] => {
  const insights: string[] = []

  const avgHeartRate = metrics.heartRate.reduce((a, b) => a + b, 0) / metrics.heartRate.length
  const avgSteps = metrics.steps.reduce((a, b) => a + b, 0) / metrics.steps.length
  const avgSleep = metrics.sleepHours.reduce((a, b) => a + b, 0) / metrics.sleepHours.length

  // Heart rate analysis
  if (avgHeartRate > 85) {
    insights.push(`${patient.name}'s average heart rate of ${Math.round(avgHeartRate)} BPM is elevated and should be monitored closely.`)
  } else if (avgHeartRate < 60) {
    insights.push(`${patient.name} shows excellent cardiovascular fitness with a resting heart rate of ${Math.round(avgHeartRate)} BPM.`)
  }

  // Activity analysis
  if (avgSteps < 1000) {
    insights.push(`Low daily activity detected (${Math.round(avgSteps)} steps/day). Increased mobility recommended.`)
  } else if (avgSteps > 2000) {
    insights.push(`Excellent activity levels maintained with ${Math.round(avgSteps)} steps per day on average.`)
  }

  // Sleep analysis
  if (avgSleep < 6.5) {
    insights.push(`Sleep quality is concerning with only ${avgSleep.toFixed(1)} hours per night. Sleep hygiene improvements needed.`)
  } else if (avgSleep > 8) {
    insights.push(`Healthy sleep patterns observed with ${avgSleep.toFixed(1)} hours of rest nightly.`)
  }

  // Medication adherence
  if (metrics.medicationAdherence < 70) {
    insights.push(`Medication adherence at ${metrics.medicationAdherence}% requires immediate attention and intervention.`)
  } else if (metrics.medicationAdherence > 90) {
    insights.push(`Excellent medication compliance at ${metrics.medicationAdherence}% - continue current routine.`)
  }

  // Trend analysis
  const recentSteps = metrics.steps.slice(-7).reduce((a, b) => a + b, 0) / 7
  const earlierSteps = metrics.steps.slice(0, 7).reduce((a, b) => a + b, 0) / 7

  if (recentSteps > earlierSteps * 1.1) {
    insights.push(`Positive trend: Activity levels have increased by ${Math.round(((recentSteps - earlierSteps) / earlierSteps) * 100)}% over the past week.`)
  } else if (recentSteps < earlierSteps * 0.9) {
    insights.push(`Concerning trend: Activity levels have decreased by ${Math.round(((earlierSteps - recentSteps) / earlierSteps) * 100)}% recently.`)
  }

  return insights
}

// Generate recommendations based on patient status and metrics
export const generateRecommendations = (patient: PatientData, metrics: HealthMetrics): string[] => {
  const recommendations: string[] = []

  switch (patient.status) {
    case 'critical':
      recommendations.push('Immediate medical attention required - contact primary physician today')
      recommendations.push('Increase monitoring frequency to every 2 hours during waking hours')
      recommendations.push('Review and adjust medication regimen with healthcare provider')
      recommendations.push('Consider emergency response plan activation if symptoms worsen')
      break

    case 'warning':
      recommendations.push('Schedule check-up with primary care physician within 1-2 weeks')
      recommendations.push('Monitor vital signs twice daily and log any concerning changes')
      recommendations.push('Review medication timing and adherence strategies')
      recommendations.push('Implement gentle exercise routine as tolerated')
      break

    case 'good':
      recommendations.push('Continue current health maintenance routine')
      recommendations.push('Gradually increase physical activity by 10% weekly')
      recommendations.push('Maintain regular sleep schedule and medication timing')
      recommendations.push('Schedule routine follow-up in 3 months')
      break

    case 'excellent':
      recommendations.push('Maintain excellent health habits - you\'re doing great!')
      recommendations.push('Consider increasing activity goals to maintain progression')
      recommendations.push('Share your successful strategies with other family members')
      recommendations.push('Continue preventive care schedule')
      break
  }

  // Add specific recommendations based on metrics
  const avgSteps = metrics.steps.reduce((a, b) => a + b, 0) / metrics.steps.length
  if (avgSteps < 1500) {
    recommendations.push('Aim for 10-minute walks after meals to increase daily activity')
  }

  if (metrics.medicationAdherence < 85) {
    recommendations.push('Consider pill reminder apps or automated dispensers for better adherence')
  }

  return recommendations
}

// Generate alerts based on health patterns
export const generateAlerts = (patient: PatientData, metrics: HealthMetrics): Array<{
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}> => {
  const alerts = []
  const now = new Date()

  // Check for concerning patterns
  const recentHR = metrics.heartRate.slice(-3)
  const highHR = recentHR.filter(hr => hr > 100).length

  if (highHR >= 2) {
    alerts.push({
      type: 'critical' as const,
      message: 'Elevated heart rate detected in recent readings - consider immediate evaluation',
      timestamp: format(subDays(now, Math.floor(Math.random() * 3)), 'PPP p')
    })
  }

  // Blood pressure alerts
  const recentBP = metrics.bloodPressure.slice(-5)
  const highBP = recentBP.filter(bp => bp.systolic > 140 || bp.diastolic > 90).length

  if (highBP >= 3) {
    alerts.push({
      type: 'warning' as const,
      message: 'Blood pressure readings consistently elevated - monitor closely',
      timestamp: format(subDays(now, Math.floor(Math.random() * 2)), 'PPP p')
    })
  }

  // Activity alerts
  const recentSteps = metrics.steps.slice(-7)
  const lowActivity = recentSteps.filter(steps => steps < 500).length

  if (lowActivity >= 3) {
    alerts.push({
      type: 'info' as const,
      message: 'Activity levels below recommended minimum for several days',
      timestamp: format(subDays(now, 1), 'PPP p')
    })
  }

  return alerts
}

// Generate medication data
export const generateMedications = (patient: PatientData): Array<{
  name: string
  dosage: string
  frequency: string
  adherence: number
  lastTaken: string
}> => {
  const commonMeds = {
    critical: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Warfarin', dosage: '5mg', frequency: 'Once daily' },
      { name: 'Insulin', dosage: '20 units', frequency: 'Before meals' }
    ],
    warning: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' }
    ],
    good: [
      { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily' },
      { name: 'Calcium', dosage: '600mg', frequency: 'Twice daily' }
    ],
    excellent: [
      { name: 'Multivitamin', dosage: '1 tablet', frequency: 'Once daily' }
    ]
  }

  const meds = commonMeds[patient.status]

  return meds.map(med => ({
    ...med,
    adherence: Math.max(60, Math.random() * 40 + 60 + (patient.status === 'excellent' ? 20 : 0)),
    lastTaken: format(subDays(new Date(), Math.floor(Math.random() * 2)), 'PPP p')
  }))
}

// Generate activity data
export const generateActivities = (metrics: HealthMetrics): Array<{
  date: string
  type: string
  duration: number
  intensity: 'low' | 'moderate' | 'high'
}> => {
  const activities = ['Walking', 'Light Exercise', 'Physical Therapy', 'Household Tasks', 'Gardening', 'Stretching']
  const intensities: Array<'low' | 'moderate' | 'high'> = ['low', 'moderate', 'high']

  return Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), i), 'PPP'),
    type: activities[Math.floor(Math.random() * activities.length)],
    duration: Math.round(15 + Math.random() * 45),
    intensity: intensities[Math.floor(Math.random() * intensities.length)]
  }))
}

// Main report generation function
export const generatePatientReport = (patient: PatientData, days: number = 30): ReportData => {
  const metrics = generateHealthMetrics(patient, days)
  const insights = generateInsights(patient, metrics)
  const recommendations = generateRecommendations(patient, metrics)
  const alerts = generateAlerts(patient, metrics)
  const medications = generateMedications(patient)
  const activities = generateActivities(metrics)

  return {
    patient,
    metrics,
    period: {
      start: format(subDays(new Date(), days), 'PPP'),
      end: format(new Date(), 'PPP')
    },
    insights,
    recommendations,
    alerts,
    medications,
    activities
  }
}

// Generate monthly family report
export interface FamilyReportData {
  period: { start: string; end: string }
  familyMembers: PatientData[]
  overallMetrics: {
    averageHealthScore: number
    totalAlerts: number
    medicationAdherence: number
    emergencyIncidents: number
    satisfactionScore: number
  }
  trends: {
    healthImprovement: number
    activityIncrease: number
    medicationImprovement: number
  }
  insights: string[]
  recommendations: string[]
}

export const generateFamilyReport = (familyMembers: PatientData[]): FamilyReportData => {
  const healthScores = {
    excellent: 95,
    good: 85,
    warning: 70,
    critical: 55
  }

  const avgHealthScore = familyMembers.reduce((sum, member) =>
    sum + healthScores[member.status], 0) / familyMembers.length

  const insights = [
    `Family health overview shows ${familyMembers.filter(m => m.status === 'excellent' || m.status === 'good').length} of ${familyMembers.length} members in good health.`,
    `Most concerning member requires immediate attention and increased monitoring.`,
    `Overall family medication adherence has improved by 12% this month.`,
    `Physical activity levels vary significantly across family members - consider group activities.`,
    `Emergency response times have improved to an average of 47 seconds.`
  ]

  const recommendations = [
    'Schedule family health meeting to discuss individual care plans',
    'Implement shared activity goals to encourage mutual support',
    'Review medication management strategies for improved adherence',
    'Consider additional monitoring devices for high-risk family members',
    'Maintain excellent communication with healthcare providers'
  ]

  return {
    period: {
      start: format(subDays(new Date(), 30), 'PPP'),
      end: format(new Date(), 'PPP')
    },
    familyMembers,
    overallMetrics: {
      averageHealthScore: Math.round(avgHealthScore),
      totalAlerts: 23,
      medicationAdherence: 87,
      emergencyIncidents: 2,
      satisfactionScore: 9.4
    },
    trends: {
      healthImprovement: 23,
      activityIncrease: 15,
      medicationImprovement: 12
    },
    insights,
    recommendations
  }
}