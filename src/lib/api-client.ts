const API_BASE_URL = 'http://localhost:3001/api';

// Helper to get session token from sessionStorage
const getSessionToken = () => {
  return sessionStorage.getItem('peace_watch_session_token');
};

// Helper to create headers with auth token
const getHeaders = (includeAuth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = getSessionToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  register: async (email: string, password: string, fullName: string, role: 'senior' | 'caregiver' | 'provider') => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, fullName, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  logout: async (sessionToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }

    return response.json();
  },

  validateSession: async (sessionToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Session validation failed');
    }

    return response.json();
  },

  getUserById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/${id}`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  getAllSeniors: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/seniors`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Routines API
export const routinesApi = {
  getRoutinesBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/routines/senior/${seniorId}`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Medicines API
export const medicinesApi = {
  getMedicinesBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/medicines/senior/${seniorId}`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Sensor Alerts API
export const sensorAlertsApi = {
  getAlertsBySeniorId: async (seniorId: number, limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/sensor-alerts/senior/${seniorId}?limit=${limit}`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Service Providers API
export const serviceProvidersApi = {
  getAllProviders: async () => {
    const response = await fetch(`${API_BASE_URL}/service-providers`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Caregiver Tips API
export const caregiverTipsApi = {
  getAllTips: async () => {
    const response = await fetch(`${API_BASE_URL}/caregiver-tips`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Happy Notes API
export const happyNotesApi = {
  getTodayNote: async () => {
    const response = await fetch(`${API_BASE_URL}/happy-notes/today`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// IoT Devices API
export const iotDevicesApi = {
  getDevicesBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/iot-devices/senior/${seniorId}`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  addDevice: async (deviceData: any) => {
    const response = await fetch(`${API_BASE_URL}/iot-devices`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(deviceData)
    });
    return response.json();
  }
};

// Vitals API
export const vitalsApi = {
  getVitalsBySeniorId: async (seniorId: number, type?: string, limit?: number) => {
    let url = `${API_BASE_URL}/vitals/senior/${seniorId}?`;
    if (type) url += `type=${type}&`;
    if (limit) url += `limit=${limit}`;
    const response = await fetch(url, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  getLatestVitals: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/vitals/senior/${seniorId}/latest`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Activity Log API
export const activityApi = {
  getActivitiesBySeniorId: async (seniorId: number, limit?: number) => {
    const response = await fetch(`${API_BASE_URL}/activity/senior/${seniorId}?limit=${limit || 50}`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  getTodayActivities: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/activity/senior/${seniorId}/today`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Emergency Alerts API
export const emergencyAlertsApi = {
  getAlertsBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/emergency-alerts/senior/${seniorId}`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  acknowledgeAlert: async (alertId: number, userId: number) => {
    const response = await fetch(`${API_BASE_URL}/emergency-alerts/${alertId}/acknowledge`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ userId })
    });
    return response.json();
  }
};

// AI Insights API
export const aiInsightsApi = {
  getInsightsBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/ai-insights/senior/${seniorId}`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Sample Data API
export const sampleDataApi = {
  generateSampleData: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/sample-data/generate/${seniorId}`, {
      method: 'POST',
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Dashboard API
export const dashboardApi = {
  getSummary: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary/${seniorId}`, {
      headers: getHeaders(true)
    });
    return response.json();
  }
};

// Relationships API
export const relationshipsApi = {
  // Get approved patients for a caregiver
  getCaregiverPatients: async (caregiverId: number) => {
    const response = await fetch(`${API_BASE_URL}/relationships/caregiver/${caregiverId}/patients`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  // Get all available patients with relationship status
  getAvailablePatients: async (caregiverId: number) => {
    const response = await fetch(`${API_BASE_URL}/relationships/caregiver/${caregiverId}/available-patients`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  // Request access to a patient
  requestAccess: async (caregiverId: number, patientId: number, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/relationships/request`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ caregiverId, patientId, notes })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send request');
    }

    return response.json();
  },

  // Get pending requests for a patient
  getPatientRequests: async (patientId: number) => {
    const response = await fetch(`${API_BASE_URL}/relationships/patient/${patientId}/requests`, {
      headers: getHeaders(true)
    });
    return response.json();
  },

  // Respond to a caregiver request (approve/reject)
  respondToRequest: async (relationshipId: number, patientId: number, status: 'approved' | 'rejected') => {
    const response = await fetch(`${API_BASE_URL}/relationships/${relationshipId}/respond`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ patientId, status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to respond to request');
    }

    return response.json();
  },

  // Remove a relationship
  removeRelationship: async (relationshipId: number, userId: number) => {
    const response = await fetch(`${API_BASE_URL}/relationships/${relationshipId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove relationship');
    }

    return response.json();
  }
};
