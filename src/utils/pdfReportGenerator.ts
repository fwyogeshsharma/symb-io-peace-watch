import { ReportData, FamilyReportData } from './reportGenerator'

// Simple PDF generation using HTML canvas and download
export const generatePDFReport = (reportData: ReportData, reportType: string): void => {
  const { patient, metrics, period, insights, recommendations, alerts, medications, activities } = reportData

  // Create HTML content for the report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${reportType} Report - ${patient.name}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 2.5em;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        .section {
          margin-bottom: 30px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .section h2 {
          color: #667eea;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        .metric-card {
          background: white;
          padding: 15px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        .metric-value {
          font-size: 2em;
          font-weight: bold;
          color: #667eea;
        }
        .metric-label {
          color: #666;
          font-size: 0.9em;
        }
        .alert {
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          border-left: 4px solid;
        }
        .alert-critical {
          background-color: #fef2f2;
          border-color: #ef4444;
          color: #991b1b;
        }
        .alert-warning {
          background-color: #fffbeb;
          border-color: #f59e0b;
          color: #92400e;
        }
        .alert-info {
          background-color: #eff6ff;
          border-color: #3b82f6;
          color: #1e40af;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8em;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-excellent {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-good {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        .status-warning {
          background-color: #fef3c7;
          color: #92400e;
        }
        .status-critical {
          background-color: #fecaca;
          color: #991b1b;
        }
        .medication-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        .medication-table th,
        .medication-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .medication-table th {
          background-color: #667eea;
          color: white;
        }
        ul li {
          margin-bottom: 8px;
        }
        .chart-placeholder {
          background: #f1f5f9;
          height: 200px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-style: italic;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportType} Report</h1>
        <p><strong>${patient.name}</strong> • ${patient.relation}, Age ${patient.age}</p>
        <p>Report Period: ${period.start} - ${period.end}</p>
        <p>Status: <span class="status-badge status-${patient.status}">${patient.status}</span></p>
      </div>

      <div class="section">
        <h2>📊 Health Metrics Overview</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${Math.round(metrics.heartRate.reduce((a, b) => a + b, 0) / metrics.heartRate.length)}</div>
            <div class="metric-label">Avg Heart Rate (BPM)</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${Math.round(metrics.steps.reduce((a, b) => a + b, 0) / metrics.steps.length).toLocaleString()}</div>
            <div class="metric-label">Avg Daily Steps</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${(metrics.sleepHours.reduce((a, b) => a + b, 0) / metrics.sleepHours.length).toFixed(1)}</div>
            <div class="metric-label">Avg Sleep Hours</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${metrics.medicationAdherence}%</div>
            <div class="metric-label">Medication Adherence</div>
          </div>
        </div>
      </div>

      ${alerts.length > 0 ? `
      <div class="section">
        <h2>⚠️ Active Alerts</h2>
        ${alerts.map(alert => `
          <div class="alert alert-${alert.type}">
            <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
            <br><small>Timestamp: ${alert.timestamp}</small>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="section">
        <h2>💊 Current Medications</h2>
        <table class="medication-table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Adherence</th>
              <th>Last Taken</th>
            </tr>
          </thead>
          <tbody>
            ${medications.map(med => `
              <tr>
                <td><strong>${med.name}</strong></td>
                <td>${med.dosage}</td>
                <td>${med.frequency}</td>
                <td>${Math.round(med.adherence)}%</td>
                <td>${med.lastTaken}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>🧠 AI Health Insights</h2>
        <ul>
          ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>📋 Recommendations</h2>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>🏃‍♀️ Recent Activities</h2>
        <div class="metrics-grid">
          ${activities.slice(0, 6).map(activity => `
            <div class="metric-card">
              <div style="font-weight: bold; color: #667eea;">${activity.type}</div>
              <div style="font-size: 0.9em; color: #666;">${activity.date}</div>
              <div style="font-size: 0.8em; margin-top: 5px;">
                ${activity.duration} min • ${activity.intensity} intensity
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h2>📈 Health Trends</h2>
        <div class="chart-placeholder">
          Detailed health trend charts would be displayed here
          <br>
          (Heart Rate, Blood Pressure, Activity Levels over time)
        </div>
      </div>

      <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #666;">
        <p><strong>SymbIOT Health Monitoring System</strong></p>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>This report is confidential and intended for medical use only.</p>
      </div>
    </body>
    </html>
  `

  // Create a new window and write the content
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then trigger download
    setTimeout(() => {
      printWindow.print()
      // Note: In a real app, you'd use a proper PDF library like jsPDF or puppeteer
    }, 1000)
  }
}

export const generateFamilyPDFReport = (familyData: FamilyReportData): void => {
  const { period, familyMembers, overallMetrics, trends, insights, recommendations } = familyData

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Family Health Report - ${period.start} to ${period.end}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 3em;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 1.2em;
        }
        .section {
          margin-bottom: 30px;
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .section h2 {
          color: #667eea;
          margin-top: 0;
          font-size: 1.8em;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 25px 0;
        }
        .metric-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }
        .metric-value {
          font-size: 2.5em;
          font-weight: bold;
          color: #667eea;
        }
        .metric-label {
          color: #666;
          font-size: 1em;
          margin-top: 5px;
        }
        .trend-positive {
          color: #10b981;
        }
        .trend-negative {
          color: #ef4444;
        }
        .family-member-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .member-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .member-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2em;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8em;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-excellent {
          background-color: #dcfce7;
          color: #166534;
        }
        .status-good {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        .status-warning {
          background-color: #fef3c7;
          color: #92400e;
        }
        .status-critical {
          background-color: #fecaca;
          color: #991b1b;
        }
        ul li {
          margin-bottom: 10px;
        }
        .highlight-box {
          background: linear-gradient(135deg, #f0f4ff 0%, #e0f2fe 100%);
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #e2e8f0;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Family Health Report</h1>
        <p>Comprehensive Health Analysis</p>
        <p>Report Period: ${period.start} - ${period.end}</p>
      </div>

      <div class="section">
        <h2>📊 Family Health Overview</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${overallMetrics.averageHealthScore}%</div>
            <div class="metric-label">Average Health Score</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${overallMetrics.medicationAdherence}%</div>
            <div class="metric-label">Medication Adherence</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${overallMetrics.totalAlerts}</div>
            <div class="metric-label">Total Alerts This Month</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${overallMetrics.satisfactionScore}/10</div>
            <div class="metric-label">Family Satisfaction</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>📈 Health Trends</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value trend-positive">+${trends.healthImprovement}%</div>
            <div class="metric-label">Overall Health Improvement</div>
          </div>
          <div class="metric-card">
            <div class="metric-value trend-positive">+${trends.activityIncrease}%</div>
            <div class="metric-label">Activity Level Increase</div>
          </div>
          <div class="metric-card">
            <div class="metric-value trend-positive">+${trends.medicationImprovement}%</div>
            <div class="metric-label">Medication Adherence Improvement</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${overallMetrics.emergencyIncidents}</div>
            <div class="metric-label">Emergency Incidents</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>👨‍👩‍👧‍👦 Family Members Status</h2>
        <div class="family-member-grid">
          ${familyMembers.map(member => `
            <div class="member-card">
              <div class="member-header">
                <div class="avatar">${member.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <h3 style="margin: 0;">${member.name}</h3>
                  <p style="margin: 5px 0; color: #666;">${member.relation}, ${member.age} years</p>
                  <span class="status-badge status-${member.status}">${member.status}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h2>🧠 AI Family Health Insights</h2>
        <ul>
          ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>📋 Family Care Recommendations</h2>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div class="highlight-box">
        <h3 style="margin-top: 0; color: #667eea;">🎯 Key Action Items</h3>
        <ul>
          <li><strong>High Priority:</strong> Address critical health status members immediately</li>
          <li><strong>Medium Priority:</strong> Improve medication adherence across the family</li>
          <li><strong>Ongoing:</strong> Maintain excellent health habits for stable members</li>
          <li><strong>Prevention:</strong> Regular health check-ups and preventive care</li>
        </ul>
      </div>

      <div style="margin-top: 40px; padding: 25px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #666;">
        <p><strong>SymbIOT Health Monitoring System - Family Report</strong></p>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>This confidential report contains sensitive health information for medical use only.</p>
        <p>For questions about this report, contact your care coordinator.</p>
      </div>
    </body>
    </html>
  `

  // Create a new window and write the content
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then trigger download
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }
}

// Simple JSON export function
export const exportReportAsJSON = (reportData: ReportData | FamilyReportData, filename: string): void => {
  const dataStr = JSON.stringify(reportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// CSV export for metrics
export const exportMetricsAsCSV = (reportData: ReportData, filename: string): void => {
  const { metrics, period } = reportData
  const days = metrics.heartRate.length

  let csvContent = "Date,Heart Rate (BPM),Systolic BP,Diastolic BP,Steps,Weight (lbs),Temperature (F),Sleep Hours\n"

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const dateStr = date.toISOString().split('T')[0]

    csvContent += `${dateStr},${metrics.heartRate[i]},${metrics.bloodPressure[i].systolic},${metrics.bloodPressure[i].diastolic},${metrics.steps[i]},${metrics.weight[i]},${metrics.temperature[i]},${metrics.sleepHours[i]}\n`
  }

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}