const API_BASE_URL = 'http://localhost:3001/api';

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, role })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    return data.id;
  },

  getUserById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/${id}`);
    return response.json();
  }
};

// Seniors API (placeholder - implement as needed)
export const seniorsApi = {
  getSeniorByUserId: async (userId: number) => {
    // Implement when backend route is added
    return null;
  },

  createSenior: async (data: any) => {
    // Implement when backend route is added
    return null;
  },

  updateSenior: async (seniorId: number, data: any) => {
    // Implement when backend route is added
  }
};

// Daily Routines API
export const routinesApi = {
  getRoutinesBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/routines/senior/${seniorId}`);
    return response.json();
  },

  createRoutine: async (data: any) => {
    // Implement when backend route is added
    return null;
  },

  updateRoutine: async (id: number, data: any) => {
    // Implement when backend route is added
  },

  deleteRoutine: async (id: number) => {
    // Implement when backend route is added
  }
};

// Medicines API
export const medicinesApi = {
  getMedicinesBySeniorId: async (seniorId: number) => {
    const response = await fetch(`${API_BASE_URL}/medicines/senior/${seniorId}`);
    return response.json();
  },

  createMedicine: async (data: any) => {
    // Implement when backend route is added
    return null;
  },

  updateMedicine: async (id: number, data: any) => {
    // Implement when backend route is added
  },

  deleteMedicine: async (id: number) => {
    // Implement when backend route is added
  }
};

// Dietary Needs API
export const dietaryApi = {
  getDietaryNeedsBySeniorId: (seniorId: number, date?: string) => {
    if (date) {
      return db.prepare('SELECT * FROM dietary_needs WHERE senior_id = ? AND date = ? ORDER BY meal_time').all(seniorId, date);
    }
    return db.prepare('SELECT * FROM dietary_needs WHERE senior_id = ? ORDER BY date DESC, meal_time').all(seniorId);
  },

  createDietaryEntry: (data: any) => {
    const result = db.prepare(`
      INSERT INTO dietary_needs (senior_id, meal_type, meal_time, description, calories, dietary_restrictions, notes, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.seniorId, data.mealType, data.mealTime, data.description,
      data.calories, data.dietaryRestrictions, data.notes, data.date
    );

    return result.lastInsertRowid;
  },

  updateDietaryEntry: (id: number, data: any) => {
    db.prepare(`
      UPDATE dietary_needs
      SET meal_type = ?, meal_time = ?, description = ?, calories = ?, dietary_restrictions = ?, notes = ?
      WHERE id = ?
    `).run(data.mealType, data.mealTime, data.description, data.calories, data.dietaryRestrictions, data.notes, id);
  }
};

// Health Markers API
export const healthMarkersApi = {
  getHealthMarkersBySeniorId: (seniorId: number, limit = 100) => {
    return db.prepare('SELECT * FROM health_markers WHERE senior_id = ? ORDER BY recorded_at DESC LIMIT ?').all(seniorId, limit);
  },

  createHealthMarker: (data: any) => {
    const result = db.prepare(`
      INSERT INTO health_markers (senior_id, marker_type, value, unit, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.seniorId, data.markerType, data.value, data.unit, data.notes);

    return result.lastInsertRowid;
  }
};

// Appointments API
export const appointmentsApi = {
  getAppointmentsBySeniorId: (seniorId: number) => {
    return db.prepare('SELECT * FROM appointments WHERE senior_id = ? AND status != "cancelled" ORDER BY appointment_date').all(seniorId);
  },

  createAppointment: (data: any) => {
    const result = db.prepare(`
      INSERT INTO appointments (senior_id, doctor_name, specialty, appointment_date, location, reason, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.seniorId, data.doctorName, data.specialty, data.appointmentDate,
      data.location, data.reason, data.notes
    );

    return result.lastInsertRowid;
  },

  updateAppointment: (id: number, data: any) => {
    db.prepare(`
      UPDATE appointments
      SET doctor_name = ?, specialty = ?, appointment_date = ?, location = ?, reason = ?, notes = ?, status = ?
      WHERE id = ?
    `).run(data.doctorName, data.specialty, data.appointmentDate, data.location, data.reason, data.notes, data.status, id);
  }
};

// Sensors API
export const sensorsApi = {
  getSensorsBySeniorId: (seniorId: number) => {
    return db.prepare('SELECT * FROM sensors WHERE senior_id = ? ORDER BY location').all(seniorId);
  },

  createSensor: (data: any) => {
    const result = db.prepare(`
      INSERT INTO sensors (senior_id, sensor_type, name, location, position_x, position_y, battery_level, is_third_party, provider_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.seniorId, data.sensorType, data.name, data.location, data.positionX,
      data.positionY, data.batteryLevel, data.isThirdParty, data.providerName
    );

    return result.lastInsertRowid;
  },

  updateSensorStatus: (id: number, status: string, batteryLevel?: number) => {
    if (batteryLevel !== undefined) {
      db.prepare('UPDATE sensors SET status = ?, battery_level = ?, last_activity = CURRENT_TIMESTAMP WHERE id = ?').run(status, batteryLevel, id);
    } else {
      db.prepare('UPDATE sensors SET status = ?, last_activity = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    }
  }
};

// Sensor Alerts API
export const sensorAlertsApi = {
  getAlertsBySeniorId: (seniorId: number, limit = 50) => {
    return db.prepare(`
      SELECT sa.*, s.name as sensor_name, s.location
      FROM sensor_alerts sa
      JOIN sensors s ON sa.sensor_id = s.id
      WHERE sa.senior_id = ?
      ORDER BY sa.created_at DESC
      LIMIT ?
    `).all(seniorId, limit);
  },

  createAlert: (data: any) => {
    const result = db.prepare(`
      INSERT INTO sensor_alerts (sensor_id, senior_id, alert_type, severity, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.sensorId, data.seniorId, data.alertType, data.severity, data.message);

    return result.lastInsertRowid;
  },

  acknowledgeAlert: (id: number) => {
    db.prepare('UPDATE sensor_alerts SET is_acknowledged = 1, acknowledged_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  }
};

// Service Providers API
export const serviceProvidersApi = {
  getAllProviders: () => {
    return db.prepare('SELECT * FROM service_providers WHERE is_active = 1 ORDER BY name').all();
  },

  getProvidersByType: (type: string) => {
    return db.prepare('SELECT * FROM service_providers WHERE type = ? AND is_active = 1 ORDER BY name').all(type);
  },

  createProvider: (data: any) => {
    const result = db.prepare(`
      INSERT INTO service_providers (name, type, service_type, phone, email, address, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(data.name, data.type, data.serviceType, data.phone, data.email, data.address, data.notes);

    return result.lastInsertRowid;
  }
};

// Provider Schedules API
export const providerSchedulesApi = {
  getSchedulesBySeniorId: (seniorId: number) => {
    return db.prepare(`
      SELECT ps.*, sp.name as provider_name, sp.service_type, sp.phone
      FROM provider_schedules ps
      JOIN service_providers sp ON ps.provider_id = sp.id
      WHERE ps.senior_id = ? AND ps.status != "cancelled"
      ORDER BY ps.schedule_date
    `).all(seniorId);
  },

  createSchedule: (data: any) => {
    const result = db.prepare(`
      INSERT INTO provider_schedules (provider_id, senior_id, schedule_date, duration_minutes, service_description, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(data.providerId, data.seniorId, data.scheduleDate, data.durationMinutes, data.serviceDescription, data.notes);

    return result.lastInsertRowid;
  },

  updateScheduleStatus: (id: number, status: string) => {
    db.prepare('UPDATE provider_schedules SET status = ? WHERE id = ?').run(status, id);
  }
};

// Hobbies API
export const hobbiesApi = {
  getHobbiesBySeniorId: (seniorId: number) => {
    return db.prepare('SELECT * FROM hobbies WHERE senior_id = ? ORDER BY favorite DESC, name').all(seniorId);
  },

  createHobby: (data: any) => {
    const result = db.prepare(`
      INSERT INTO hobbies (senior_id, name, description, category, frequency, location, location_address, location_lat, location_lng, favorite)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.seniorId, data.name, data.description, data.category, data.frequency,
      data.location, data.locationAddress, data.locationLat, data.locationLng, data.favorite
    );

    return result.lastInsertRowid;
  },

  updateHobby: (id: number, data: any) => {
    db.prepare(`
      UPDATE hobbies
      SET name = ?, description = ?, category = ?, frequency = ?, location = ?,
          location_address = ?, location_lat = ?, location_lng = ?, favorite = ?
      WHERE id = ?
    `).run(
      data.name, data.description, data.category, data.frequency, data.location,
      data.locationAddress, data.locationLat, data.locationLng, data.favorite, id
    );
  }
};

// Shopping API
export const shoppingApi = {
  getShoppingListBySeniorId: (seniorId: number) => {
    return db.prepare('SELECT * FROM shopping_items WHERE senior_id = ? AND is_purchased = 0 ORDER BY priority DESC, created_at').all(seniorId);
  },

  createShoppingItem: (data: any) => {
    const result = db.prepare(`
      INSERT INTO shopping_items (senior_id, item_name, category, quantity, unit, qr_code, priority, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.seniorId, data.itemName, data.category, data.quantity, data.unit,
      data.qrCode, data.priority, data.notes
    );

    return result.lastInsertRowid;
  },

  markAsPurchased: (id: number) => {
    db.prepare('UPDATE shopping_items SET is_purchased = 1 WHERE id = ?').run(id);
  }
};

// Caregiver Tips API
export const caregiverTipsApi = {
  getAllTips: () => {
    return db.prepare('SELECT * FROM caregiver_tips ORDER BY category, title').all();
  },

  getTipsByCategory: (category: string) => {
    return db.prepare('SELECT * FROM caregiver_tips WHERE category = ? ORDER BY title').all(category);
  },

  incrementHelpfulCount: (id: number) => {
    db.prepare('UPDATE caregiver_tips SET helpful_count = helpful_count + 1 WHERE id = ?').run(id);
  }
};

// Nice Reminders API
export const niceRemindersApi = {
  getRemindersBySeniorId: (seniorId: number) => {
    return db.prepare('SELECT * FROM nice_reminders WHERE senior_id = ? ORDER BY date DESC').all(seniorId);
  },

  createReminder: (data: any) => {
    const result = db.prepare(`
      INSERT INTO nice_reminders (senior_id, caregiver_id, reminder_text, reminder_type, date)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.seniorId, data.caregiverId, data.reminderText, data.reminderType, data.date);

    return result.lastInsertRowid;
  }
};

// Happy Notes API
export const happyNotesApi = {
  getTodayNote: () => {
    return db.prepare('SELECT * FROM happy_notes WHERE is_active = 1 ORDER BY date DESC LIMIT 1').get();
  },

  getAllNotes: () => {
    return db.prepare('SELECT * FROM happy_notes WHERE is_active = 1 ORDER BY date DESC').all();
  }
};
