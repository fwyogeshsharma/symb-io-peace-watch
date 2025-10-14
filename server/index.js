import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database('peace-watch.db');

// Initialize database schema
const initializeDatabase = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT CHECK(role IN ('senior', 'caregiver', 'provider')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seniors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS seniors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      photo TEXT,
      date_of_birth DATE,
      address TEXT,
      emergency_contact TEXT,
      emergency_phone TEXT,
      medical_conditions TEXT,
      allergies TEXT,
      insurance_info TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Daily routines
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_routines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      time TEXT NOT NULL,
      days_of_week TEXT NOT NULL,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Medicines
  db.exec(`
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      time TEXT NOT NULL,
      instructions TEXT,
      prescribing_doctor TEXT,
      start_date DATE,
      end_date DATE,
      is_active BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Dietary needs
  db.exec(`
    CREATE TABLE IF NOT EXISTS dietary_needs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      meal_type TEXT CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
      meal_time TEXT NOT NULL,
      description TEXT,
      calories INTEGER,
      dietary_restrictions TEXT,
      notes TEXT,
      date DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Health markers
  db.exec(`
    CREATE TABLE IF NOT EXISTS health_markers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      marker_type TEXT CHECK(marker_type IN ('heart_rate', 'blood_pressure', 'temperature', 'weight', 'glucose', 'oxygen')) NOT NULL,
      value TEXT NOT NULL,
      unit TEXT NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Appointments
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      doctor_name TEXT NOT NULL,
      specialty TEXT,
      appointment_date DATETIME NOT NULL,
      location TEXT,
      reason TEXT,
      notes TEXT,
      status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
      reminder_sent BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Sensors
  db.exec(`
    CREATE TABLE IF NOT EXISTS sensors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      sensor_type TEXT CHECK(sensor_type IN ('motion', 'door', 'temperature', 'fall', 'bed', 'smart_watch', 'pendant')) NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      position_x REAL,
      position_y REAL,
      status TEXT CHECK(status IN ('active', 'inactive', 'warning', 'critical')) DEFAULT 'active',
      battery_level INTEGER,
      last_activity DATETIME,
      is_third_party BOOLEAN DEFAULT FALSE,
      provider_name TEXT,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Sensor alerts
  db.exec(`
    CREATE TABLE IF NOT EXISTS sensor_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id INTEGER NOT NULL,
      senior_id INTEGER NOT NULL,
      alert_type TEXT CHECK(alert_type IN ('motion_detected', 'no_motion', 'door_open', 'fall_detected', 'temperature', 'battery_low', 'offline')) NOT NULL,
      severity TEXT CHECK(severity IN ('info', 'warning', 'critical')) NOT NULL,
      message TEXT NOT NULL,
      is_acknowledged BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      acknowledged_at DATETIME,
      FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Service providers
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('regular', 'occasional', 'emergency')) NOT NULL,
      service_type TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      notes TEXT,
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

  // Provider schedules
  db.exec(`
    CREATE TABLE IF NOT EXISTS provider_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_id INTEGER NOT NULL,
      senior_id INTEGER NOT NULL,
      schedule_date DATETIME NOT NULL,
      duration_minutes INTEGER,
      service_description TEXT,
      status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
      reminder_sent BOOLEAN DEFAULT FALSE,
      notes TEXT,
      FOREIGN KEY (provider_id) REFERENCES service_providers(id) ON DELETE CASCADE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Hobbies
  db.exec(`
    CREATE TABLE IF NOT EXISTS hobbies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      frequency TEXT,
      location TEXT,
      location_address TEXT,
      location_lat REAL,
      location_lng REAL,
      favorite BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Shopping items
  db.exec(`
    CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT,
      quantity TEXT,
      unit TEXT,
      qr_code TEXT,
      is_purchased BOOLEAN DEFAULT FALSE,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Caregiver tips
  db.exec(`
    CREATE TABLE IF NOT EXISTS caregiver_tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      helpful_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Nice reminders
  db.exec(`
    CREATE TABLE IF NOT EXISTS nice_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      caregiver_id INTEGER,
      reminder_text TEXT NOT NULL,
      reminder_type TEXT CHECK(reminder_type IN ('note', 'encouragement', 'memory', 'gratitude')) NOT NULL,
      date DATE DEFAULT CURRENT_DATE,
      is_displayed BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
      FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Happy notes
  db.exec(`
    CREATE TABLE IF NOT EXISTS happy_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_text TEXT NOT NULL,
      author TEXT,
      date DATE DEFAULT CURRENT_DATE,
      is_active BOOLEAN DEFAULT TRUE
    );
  `);

  // Caregiver-Patient Relationships
  db.exec(`
    CREATE TABLE IF NOT EXISTS caregiver_patient_relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caregiver_id INTEGER NOT NULL,
      patient_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'removed')) DEFAULT 'pending',
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      responded_at DATETIME,
      notes TEXT,
      FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(caregiver_id, patient_id)
    );
  `);

  // IoT Device Registry
  db.exec(`
    CREATE TABLE IF NOT EXISTS iot_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      device_type TEXT CHECK(device_type IN ('blood_pressure', 'glucose_monitor', 'smart_scale', 'heart_rate_monitor',
                                              'door_sensor', 'bed_sensor', 'motion_sensor', 'temperature_sensor',
                                              'pill_dispenser', 'smart_plug', 'panic_button', 'gps_tracker',
                                              'smart_camera', 'voice_assistant', 'wearable_tag')) NOT NULL,
      device_name TEXT NOT NULL,
      device_brand TEXT,
      device_model TEXT,
      api_endpoint TEXT,
      api_key TEXT,
      api_config TEXT,
      location TEXT,
      status TEXT CHECK(status IN ('active', 'inactive', 'error', 'maintenance')) DEFAULT 'active',
      last_sync DATETIME,
      battery_level INTEGER,
      firmware_version TEXT,
      installed_date DATE DEFAULT CURRENT_DATE,
      notes TEXT,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // Vitals Data (Time-series health data)
  db.exec(`
    CREATE TABLE IF NOT EXISTS vitals_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      device_id INTEGER,
      vital_type TEXT CHECK(vital_type IN ('blood_pressure', 'glucose', 'weight', 'heart_rate',
                                           'spo2', 'temperature', 'bmi', 'steps', 'sleep')) NOT NULL,
      value TEXT NOT NULL,
      systolic INTEGER,
      diastolic INTEGER,
      unit TEXT NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      is_anomaly BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES iot_devices(id) ON DELETE SET NULL
    );
  `);

  // Activity Log (Timeline of daily activities)
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      activity_type TEXT CHECK(activity_type IN ('woke_up', 'bathroom_visit', 'medication_taken', 'meal_consumed',
                                                  'door_opened', 'door_closed', 'left_home', 'returned_home',
                                                  'fall_detected', 'panic_pressed', 'exercise', 'social_call',
                                                  'tv_watching', 'sleeping', 'walking', 'sitting')) NOT NULL,
      location TEXT,
      device_id INTEGER,
      duration_minutes INTEGER,
      metadata TEXT,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES iot_devices(id) ON DELETE SET NULL
    );
  `);

  // Environment Data
  db.exec(`
    CREATE TABLE IF NOT EXISTS environment_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      device_id INTEGER,
      sensor_type TEXT CHECK(sensor_type IN ('temperature', 'humidity', 'light', 'air_quality', 'noise')) NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      location TEXT,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_alert BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES iot_devices(id) ON DELETE SET NULL
    );
  `);

  // Medication Adherence Log
  db.exec(`
    CREATE TABLE IF NOT EXISTS medication_adherence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      medicine_id INTEGER NOT NULL,
      device_id INTEGER,
      scheduled_time DATETIME NOT NULL,
      taken_time DATETIME,
      status TEXT CHECK(status IN ('taken', 'missed', 'delayed', 'pending')) DEFAULT 'pending',
      notes TEXT,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
      FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES iot_devices(id) ON DELETE SET NULL
    );
  `);

  // Emergency Alerts
  db.exec(`
    CREATE TABLE IF NOT EXISTS emergency_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      alert_type TEXT CHECK(alert_type IN ('fall', 'panic', 'no_activity', 'abnormal_vitals',
                                           'wandering', 'left_home', 'emergency_call')) NOT NULL,
      severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      device_id INTEGER,
      triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      acknowledged_at DATETIME,
      acknowledged_by INTEGER,
      resolved_at DATETIME,
      response_notes TEXT,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
      FOREIGN KEY (device_id) REFERENCES iot_devices(id) ON DELETE SET NULL,
      FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // AI Insights & Predictions
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senior_id INTEGER NOT NULL,
      insight_type TEXT CHECK(insight_type IN ('health_trend', 'behavior_change', 'risk_assessment',
                                                'recommendation', 'prediction', 'anomaly')) NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      confidence_score REAL,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      action_required BOOLEAN DEFAULT FALSE,
      metadata TEXT,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      is_read BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE
    );
  `);

  // User Sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create index for faster session lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_session_token ON user_sessions(session_token);
    CREATE INDEX IF NOT EXISTS idx_session_expires ON user_sessions(expires_at);
  `);

  console.log('Database initialized successfully!');
};

// Seed initial data
const seedDatabase = () => {
  const hasUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();

  if (hasUsers.count === 0) {
    const hashedPassword = bcrypt.hashSync('demo123', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, full_name, role)
      VALUES (?, ?, ?, ?)
    `);

    const seniorId = insertUser.run('senior@demo.com', hashedPassword, 'Margaret Johnson', 'senior').lastInsertRowid;
    insertUser.run('caregiver@demo.com', hashedPassword, 'Sarah Johnson', 'caregiver');
    insertUser.run('provider@demo.com', hashedPassword, 'Dr. Smith', 'provider');

    // Create senior profile
    db.prepare(`
      INSERT INTO seniors (user_id, date_of_birth, address, emergency_contact, emergency_phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(seniorId, '1945-03-15', '123 Main St, Springfield', 'Sarah Johnson', '555-0123');

    // Add demo medicines
    db.prepare(`
      INSERT INTO medicines (senior_id, name, dosage, frequency, time, instructions)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(1, 'Lisinopril', '10mg', 'Daily', '08:00', 'Take with water');

    db.prepare(`
      INSERT INTO medicines (senior_id, name, dosage, frequency, time, instructions)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(1, 'Metformin', '500mg', 'Twice daily', '08:00,20:00', 'Take with meals');

    // Add demo sensors
    const sensors = [
      { type: 'motion', name: 'Living Room Motion', location: 'Living Room', x: 50, y: 30 },
      { type: 'door', name: 'Front Door Sensor', location: 'Entrance', x: 30, y: 80 },
      { type: 'temperature', name: 'Bedroom Temp', location: 'Bedroom', x: 70, y: 20 },
      { type: 'fall', name: 'Bathroom Fall Detector', location: 'Bathroom', x: 80, y: 50 },
      { type: 'bed', name: 'Bed Sensor', location: 'Bedroom', x: 75, y: 15 },
    ];

    sensors.forEach(sensor => {
      db.prepare(`
        INSERT INTO sensors (senior_id, sensor_type, name, location, position_x, position_y, battery_level, last_activity)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(1, sensor.type, sensor.name, sensor.location, sensor.x, sensor.y, 85 + Math.floor(Math.random() * 15));
    });

    // Add service providers
    db.prepare(`
      INSERT INTO service_providers (name, type, service_type, phone, email)
      VALUES (?, ?, ?, ?, ?)
    `).run('Home Health Nurse', 'regular', 'Healthcare', '555-0001', 'nurse@health.com');

    db.prepare(`
      INSERT INTO service_providers (name, type, service_type, phone, email)
      VALUES (?, ?, ?, ?, ?)
    `).run('Meal Delivery Service', 'regular', 'Food', '555-0002', 'meals@delivery.com');

    db.prepare(`
      INSERT INTO service_providers (name, type, service_type, phone, email)
      VALUES (?, ?, ?, ?, ?)
    `).run('Emergency Services', 'emergency', 'Emergency', '911', 'emergency@911.gov');

    // Add happy note
    db.prepare(`
      INSERT INTO happy_notes (note_text, author)
      VALUES (?, ?)
    `).run('Every day is a gift. Embrace it with joy and gratitude!', 'Peace Watch Team');

    // Add caregiver tips
    const tips = [
      { category: 'Communication', title: 'Active Listening', description: 'Take time to truly listen to your senior. Make eye contact, minimize distractions, and show genuine interest in what they have to say.' },
      { category: 'Health', title: 'Medication Management', description: 'Use a pill organizer and set daily reminders. Keep an updated list of all medications and their purposes.' },
      { category: 'Activities', title: 'Stay Engaged', description: 'Encourage activities they enjoy. Even simple activities like folding laundry or watering plants can provide purpose and joy.' },
      { category: 'Safety', title: 'Fall Prevention', description: 'Remove tripping hazards, ensure good lighting, install grab bars, and encourage the use of mobility aids when needed.' },
    ];

    tips.forEach(tip => {
      db.prepare(`
        INSERT INTO caregiver_tips (category, title, description)
        VALUES (?, ?, ?)
      `).run(tip.category, tip.title, tip.description);
    });

    console.log('Demo data seeded successfully!');
  }
};

// Initialize database
initializeDatabase();
seedDatabase();

// ===== SESSION HELPER FUNCTIONS =====
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const createSession = (userId, ipAddress = null, userAgent = null) => {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

  db.prepare(`
    INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, sessionToken, expiresAt.toISOString(), ipAddress, userAgent);

  return sessionToken;
};

const validateSession = (sessionToken) => {
  if (!sessionToken) return null;

  const session = db.prepare(`
    SELECT s.*, u.id, u.email, u.full_name, u.role, u.created_at
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = ? AND s.expires_at > datetime('now')
  `).get(sessionToken);

  if (session) {
    // Update last activity
    db.prepare(`
      UPDATE user_sessions
      SET last_activity = CURRENT_TIMESTAMP
      WHERE session_token = ?
    `).run(sessionToken);
  }

  return session;
};

const cleanupExpiredSessions = () => {
  db.prepare(`
    DELETE FROM user_sessions
    WHERE expires_at < datetime('now')
  `).run();
};

// Cleanup expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

// Session validation middleware
const requireAuth = (req, res, next) => {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');
  const session = validateSession(sessionToken);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or expired session' });
  }

  req.user = {
    id: session.id,
    email: session.email,
    full_name: session.full_name,
    role: session.role,
    created_at: session.created_at
  };

  next();
};

// ===== AUTH ROUTES =====
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create session token
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const sessionToken = createSession(user.id, ipAddress, userAgent);

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      sessionToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = db.prepare(`
      INSERT INTO users (email, password, full_name, role)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, fullName, role);

    const userId = result.lastInsertRowid;

    // Create session token
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const sessionToken = createSession(userId, ipAddress, userAgent);

    // Get the newly created user
    const user = db.prepare('SELECT id, email, full_name, role, created_at FROM users WHERE id = ?').get(userId);

    res.json({
      ...user,
      sessionToken
    });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');

    if (sessionToken) {
      db.prepare('DELETE FROM user_sessions WHERE session_token = ?').run(sessionToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate session and return user data
app.get('/api/auth/validate', (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    const session = validateSession(sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    res.json({
      id: session.id,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      created_at: session.created_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/user/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, full_name, role, created_at FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/seniors', (req, res) => {
  try {
    const seniors = db.prepare(`
      SELECT u.id, u.email, u.full_name, u.role, u.created_at,
             s.date_of_birth, s.address, s.emergency_contact, s.emergency_phone
      FROM users u
      LEFT JOIN seniors s ON u.id = s.user_id
      WHERE u.role = 'senior'
      ORDER BY u.full_name
    `).all();
    res.json(seniors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CAREGIVER-PATIENT RELATIONSHIP ROUTES =====

// Get all patients for a caregiver (only approved relationships)
app.get('/api/relationships/caregiver/:caregiverId/patients', (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT u.id, u.email, u.full_name, u.role, u.created_at,
             s.date_of_birth, s.address, s.emergency_contact, s.emergency_phone,
             r.id as relationship_id, r.status, r.requested_at, r.responded_at
      FROM caregiver_patient_relationships r
      JOIN users u ON r.patient_id = u.id
      LEFT JOIN seniors s ON u.id = s.user_id
      WHERE r.caregiver_id = ? AND r.status = 'approved'
      ORDER BY u.full_name
    `).all(req.params.caregiverId);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all available patients (seniors not yet connected to this caregiver)
app.get('/api/relationships/caregiver/:caregiverId/available-patients', (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT u.id, u.email, u.full_name, u.role, u.created_at,
             s.date_of_birth, s.address, s.emergency_contact, s.emergency_phone,
             r.status as relationship_status
      FROM users u
      LEFT JOIN seniors s ON u.id = s.user_id
      LEFT JOIN caregiver_patient_relationships r ON r.patient_id = u.id AND r.caregiver_id = ?
      WHERE u.role = 'senior'
      ORDER BY u.full_name
    `).all(req.params.caregiverId);
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request access to a patient
app.post('/api/relationships/request', (req, res) => {
  try {
    const { caregiverId, patientId, notes } = req.body;

    // Check if relationship already exists
    const existing = db.prepare(`
      SELECT * FROM caregiver_patient_relationships
      WHERE caregiver_id = ? AND patient_id = ?
    `).get(caregiverId, patientId);

    if (existing) {
      return res.status(400).json({ error: 'Relationship request already exists' });
    }

    const result = db.prepare(`
      INSERT INTO caregiver_patient_relationships (caregiver_id, patient_id, notes)
      VALUES (?, ?, ?)
    `).run(caregiverId, patientId, notes || null);

    res.json({ id: result.lastInsertRowid, message: 'Access request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending requests for a patient
app.get('/api/relationships/patient/:patientId/requests', (req, res) => {
  try {
    const requests = db.prepare(`
      SELECT r.id, r.status, r.requested_at, r.responded_at, r.notes,
             u.id as caregiver_id, u.email, u.full_name, u.role
      FROM caregiver_patient_relationships r
      JOIN users u ON r.caregiver_id = u.id
      WHERE r.patient_id = ? AND r.status = 'pending'
      ORDER BY r.requested_at DESC
    `).all(req.params.patientId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve or reject a caregiver request
app.put('/api/relationships/:relationshipId/respond', (req, res) => {
  try {
    const { status, patientId } = req.body; // status: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify the relationship belongs to this patient
    const relationship = db.prepare(`
      SELECT * FROM caregiver_patient_relationships
      WHERE id = ? AND patient_id = ?
    `).get(req.params.relationshipId, patientId);

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found or unauthorized' });
    }

    db.prepare(`
      UPDATE caregiver_patient_relationships
      SET status = ?, responded_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, req.params.relationshipId);

    res.json({ message: `Request ${status} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a relationship
app.delete('/api/relationships/:relationshipId', (req, res) => {
  try {
    const { userId } = req.body; // Can be either caregiver or patient

    const relationship = db.prepare(`
      SELECT * FROM caregiver_patient_relationships
      WHERE id = ? AND (caregiver_id = ? OR patient_id = ?)
    `).get(req.params.relationshipId, userId, userId);

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found or unauthorized' });
    }

    db.prepare(`
      UPDATE caregiver_patient_relationships
      SET status = 'removed', responded_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.params.relationshipId);

    res.json({ message: 'Relationship removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ROUTINES ROUTES =====
app.get('/api/routines/senior/:seniorId', (req, res) => {
  try {
    const routines = db.prepare('SELECT * FROM daily_routines WHERE senior_id = ? ORDER BY time').all(req.params.seniorId);
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== MEDICINES ROUTES =====
app.get('/api/medicines/senior/:seniorId', (req, res) => {
  try {
    const medicines = db.prepare('SELECT * FROM medicines WHERE senior_id = ? AND is_active = 1 ORDER BY time').all(req.params.seniorId);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== SENSOR ALERTS ROUTES =====
app.get('/api/sensor-alerts/senior/:seniorId', (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const alerts = db.prepare(`
      SELECT sa.*, s.name as sensor_name, s.location
      FROM sensor_alerts sa
      JOIN sensors s ON sa.sensor_id = s.id
      WHERE sa.senior_id = ?
      ORDER BY sa.created_at DESC
      LIMIT ?
    `).all(req.params.seniorId, limit);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== SERVICE PROVIDERS ROUTES =====
app.get('/api/service-providers', (req, res) => {
  try {
    const providers = db.prepare('SELECT * FROM service_providers WHERE is_active = 1 ORDER BY name').all();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CAREGIVER TIPS ROUTES =====
app.get('/api/caregiver-tips', (req, res) => {
  try {
    const tips = db.prepare('SELECT * FROM caregiver_tips ORDER BY category, title').all();
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== HAPPY NOTES ROUTES =====
app.get('/api/happy-notes/today', (req, res) => {
  try {
    const note = db.prepare('SELECT * FROM happy_notes WHERE is_active = 1 ORDER BY date DESC LIMIT 1').get();
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== IOT DEVICES ROUTES =====
app.get('/api/iot-devices/senior/:seniorId', (req, res) => {
  try {
    const devices = db.prepare('SELECT * FROM iot_devices WHERE senior_id = ? ORDER BY device_type').all(req.params.seniorId);
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/iot-devices', (req, res) => {
  try {
    const { seniorId, deviceType, deviceName, deviceBrand, deviceModel, apiEndpoint, apiKey, apiConfig, location, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO iot_devices (senior_id, device_type, device_name, device_brand, device_model, api_endpoint, api_key, api_config, location, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(seniorId, deviceType, deviceName, deviceBrand, deviceModel, apiEndpoint, apiKey, apiConfig, location, notes);
    res.json({ id: result.lastInsertRowid, message: 'Device added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== VITALS DATA ROUTES =====
app.get('/api/vitals/senior/:seniorId', (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const vitalType = req.query.type;

    let query = 'SELECT * FROM vitals_data WHERE senior_id = ?';
    let params = [req.params.seniorId];

    if (vitalType) {
      query += ' AND vital_type = ?';
      params.push(vitalType);
    }

    query += ' ORDER BY recorded_at DESC LIMIT ?';
    params.push(limit);

    const vitals = db.prepare(query).all(...params);
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/vitals/senior/:seniorId/latest', (req, res) => {
  try {
    const vitals = db.prepare(`
      SELECT vital_type, value, systolic, diastolic, unit, recorded_at, is_anomaly
      FROM vitals_data
      WHERE senior_id = ? AND id IN (
        SELECT MAX(id) FROM vitals_data WHERE senior_id = ? GROUP BY vital_type
      )
    `).all(req.params.seniorId, req.params.seniorId);
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ACTIVITY LOG ROUTES =====
app.get('/api/activity/senior/:seniorId', (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const activities = db.prepare(`
      SELECT a.*, d.device_name, d.device_type
      FROM activity_log a
      LEFT JOIN iot_devices d ON a.device_id = d.id
      WHERE a.senior_id = ?
      ORDER BY a.recorded_at DESC
      LIMIT ?
    `).all(req.params.seniorId, limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/activity/senior/:seniorId/today', (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT a.*, d.device_name, d.device_type
      FROM activity_log a
      LEFT JOIN iot_devices d ON a.device_id = d.id
      WHERE a.senior_id = ? AND DATE(a.recorded_at) = DATE('now')
      ORDER BY a.recorded_at DESC
    `).all(req.params.seniorId);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== EMERGENCY ALERTS ROUTES =====
app.get('/api/emergency-alerts/senior/:seniorId', (req, res) => {
  try {
    const alerts = db.prepare(`
      SELECT e.*, d.device_name, u.full_name as acknowledged_by_name
      FROM emergency_alerts e
      LEFT JOIN iot_devices d ON e.device_id = d.id
      LEFT JOIN users u ON e.acknowledged_by = u.id
      WHERE e.senior_id = ?
      ORDER BY e.triggered_at DESC
      LIMIT 20
    `).all(req.params.seniorId);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/emergency-alerts/:alertId/acknowledge', (req, res) => {
  try {
    const { userId } = req.body;
    db.prepare(`
      UPDATE emergency_alerts
      SET acknowledged_at = CURRENT_TIMESTAMP, acknowledged_by = ?
      WHERE id = ?
    `).run(userId, req.params.alertId);
    res.json({ message: 'Alert acknowledged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== AI INSIGHTS ROUTES =====
app.get('/api/ai-insights/senior/:seniorId', (req, res) => {
  try {
    const insights = db.prepare(`
      SELECT * FROM ai_insights
      WHERE senior_id = ? AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY priority DESC, generated_at DESC
      LIMIT 10
    `).all(req.params.seniorId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== DASHBOARD SUMMARY ROUTE =====
app.get('/api/dashboard/summary/:seniorId', (req, res) => {
  try {
    const seniorId = req.params.seniorId;

    // Get latest vitals summary
    const latestVitals = db.prepare(`
      SELECT vital_type, value, systolic, diastolic, unit, recorded_at, is_anomaly
      FROM vitals_data
      WHERE senior_id = ? AND id IN (
        SELECT MAX(id) FROM vitals_data WHERE senior_id = ? GROUP BY vital_type
      )
    `).all(seniorId, seniorId);

    // Get unacknowledged emergency alerts count
    const emergencyAlertsCount = db.prepare(`
      SELECT COUNT(*) as count FROM emergency_alerts
      WHERE senior_id = ? AND acknowledged_at IS NULL
    `).get(seniorId);

    // Get pending medication count (today)
    const pendingMedicationsCount = db.prepare(`
      SELECT COUNT(*) as count FROM medication_adherence
      WHERE senior_id = ? AND DATE(scheduled_time) = DATE('now') AND status = 'pending'
    `).get(seniorId);

    // Get device status summary
    const deviceStats = db.prepare(`
      SELECT
        COUNT(*) as total_devices,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_devices,
        SUM(CASE WHEN battery_level < 20 THEN 1 ELSE 0 END) as low_battery
      FROM iot_devices
      WHERE senior_id = ?
    `).get(seniorId);

    // Get today's activity count
    const todayActivityCount = db.prepare(`
      SELECT COUNT(*) as count FROM activity_log
      WHERE senior_id = ? AND DATE(recorded_at) = DATE('now')
    `).get(seniorId);

    res.json({
      latestVitals,
      alerts: {
        emergency: emergencyAlertsCount?.count || 0,
        pendingMedications: pendingMedicationsCount?.count || 0
      },
      devices: {
        total: deviceStats?.total_devices || 0,
        active: deviceStats?.active_devices || 0,
        lowBattery: deviceStats?.low_battery || 0
      },
      todayActivities: todayActivityCount?.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== SAMPLE DATA GENERATION =====
app.post('/api/sample-data/generate/:seniorId', (req, res) => {
  try {
    const seniorId = req.params.seniorId;

    // Generate IoT Devices
    const devices = [
      { type: 'blood_pressure', name: 'Omron BP Monitor', brand: 'Omron', model: 'HEM-7156', location: 'Bedroom' },
      { type: 'glucose_monitor', name: 'AccuChek Glucometer', brand: 'Roche', model: 'Guide', location: 'Kitchen' },
      { type: 'smart_scale', name: 'Smart Body Scale', brand: 'Withings', model: 'Body+', location: 'Bathroom' },
      { type: 'heart_rate_monitor', name: 'Fitness Band', brand: 'Fitbit', model: 'Charge 5', location: 'Wrist' },
      { type: 'door_sensor', name: 'Smart Door Sensor', brand: 'Samsung', model: 'SmartThings', location: 'Front Door' },
      { type: 'motion_sensor', name: 'Motion Detector', brand: 'Philips', model: 'Hue', location: 'Hallway' },
      { type: 'bed_sensor', name: 'Sleep Monitor', brand: 'Emfit', model: 'QS', location: 'Bed' },
      { type: 'pill_dispenser', name: 'Smart Pill Box', brand: 'MedMinder', model: 'Jon', location: 'Kitchen Counter' },
      { type: 'panic_button', name: 'Emergency Button', brand: 'Medical Guardian', model: 'Mini', location: 'Necklace' },
      { type: 'temperature_sensor', name: 'Room Temp Sensor', brand: 'Nest', model: 'Temperature', location: 'Living Room' }
    ];

    devices.forEach(device => {
      db.prepare(`
        INSERT INTO iot_devices (senior_id, device_type, device_name, device_brand, device_model, location, status, battery_level, last_sync)
        VALUES (?, ?, ?, ?, ?, ?, 'active', ?, datetime('now'))
      `).run(seniorId, device.type, device.name, device.brand, device.model, device.location, 75 + Math.floor(Math.random() * 25));
    });

    // Generate Vitals Data (last 7 days)
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      // Blood Pressure (twice daily)
      for (let reading = 0; reading < 2; reading++) {
        const hour = reading === 0 ? 8 : 20;
        date.setHours(hour, Math.floor(Math.random() * 60));
        const systolic = 115 + Math.floor(Math.random() * 25);
        const diastolic = 70 + Math.floor(Math.random() * 15);
        db.prepare(`
          INSERT INTO vitals_data (senior_id, vital_type, value, systolic, diastolic, unit, recorded_at)
          VALUES (?, 'blood_pressure', ?, ?, ?, 'mmHg', ?)
        `).run(seniorId, `${systolic}/${diastolic}`, systolic, diastolic, date.toISOString());
      }

      // Glucose (morning)
      date.setHours(7, 30);
      const glucose = 85 + Math.floor(Math.random() * 35);
      db.prepare(`
        INSERT INTO vitals_data (senior_id, vital_type, value, unit, recorded_at, is_anomaly)
        VALUES (?, 'glucose', ?, 'mg/dL', ?, ?)
      `).run(seniorId, glucose.toString(), date.toISOString(), glucose > 115 ? 1 : 0);

      // Weight
      date.setHours(6, 45);
      const weight = 68 + (Math.random() - 0.5) * 2;
      db.prepare(`
        INSERT INTO vitals_data (senior_id, vital_type, value, unit, recorded_at)
        VALUES (?, 'weight', ?, 'kg', ?)
      `).run(seniorId, weight.toFixed(1), date.toISOString());

      // Heart Rate (throughout day)
      for (let hr = 0; hr < 10; hr++) {
        date.setHours(6 + hr * 1.5, Math.floor(Math.random() * 60));
        const heartRate = 65 + Math.floor(Math.random() * 20);
        db.prepare(`
          INSERT INTO vitals_data (senior_id, vital_type, value, unit, recorded_at)
          VALUES (?, 'heart_rate', ?, 'bpm', ?)
        `).run(seniorId, heartRate.toString(), date.toISOString());
      }

      // SpO2
      date.setHours(9, 0);
      const spo2 = 95 + Math.floor(Math.random() * 5);
      db.prepare(`
        INSERT INTO vitals_data (senior_id, vital_type, value, unit, recorded_at)
        VALUES (?, 'spo2', ?, '%', ?)
      `).run(seniorId, spo2.toString(), date.toISOString());

      // Steps
      date.setHours(21, 0);
      const steps = 2000 + Math.floor(Math.random() * 4000);
      db.prepare(`
        INSERT INTO vitals_data (senior_id, vital_type, value, unit, recorded_at)
        VALUES (?, 'steps', ?, 'steps', ?)
      `).run(seniorId, steps.toString(), date.toISOString());
    }

    // Generate Activity Log (today)
    const activities = [
      { type: 'woke_up', hour: 6, location: 'Bedroom' },
      { type: 'bathroom_visit', hour: 6, location: 'Bathroom', duration: 10 },
      { type: 'meal_consumed', hour: 7, location: 'Kitchen', duration: 20 },
      { type: 'medication_taken', hour: 8, location: 'Kitchen', duration: 2 },
      { type: 'walking', hour: 9, location: 'Garden', duration: 30 },
      { type: 'sitting', hour: 10, location: 'Living Room', duration: 120 },
      { type: 'meal_consumed', hour: 12, location: 'Dining Room', duration: 30 },
      { type: 'bathroom_visit', hour: 13, location: 'Bathroom', duration: 8 },
      { type: 'tv_watching', hour: 14, location: 'Living Room', duration: 90 },
      { type: 'social_call', hour: 16, location: 'Living Room', duration: 25 },
      { type: 'walking', hour: 17, location: 'Garden', duration: 20 },
      { type: 'meal_consumed', hour: 18, location: 'Kitchen', duration: 25 },
      { type: 'medication_taken', hour: 19, location: 'Kitchen', duration: 2 },
      { type: 'tv_watching', hour: 19, location: 'Living Room', duration: 60 },
      { type: 'bathroom_visit', hour: 21, location: 'Bathroom', duration: 10 },
      { type: 'sleeping', hour: 22, location: 'Bedroom', duration: 480 }
    ];

    const today = new Date();
    activities.forEach(activity => {
      today.setHours(activity.hour, Math.floor(Math.random() * 60));
      db.prepare(`
        INSERT INTO activity_log (senior_id, activity_type, location, duration_minutes, recorded_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(seniorId, activity.type, activity.location, activity.duration || null, today.toISOString());
    });

    // Generate AI Insights
    const insights = [
      {
        type: 'health_trend',
        title: 'Blood Pressure Trending Well',
        description: 'Your blood pressure readings have been consistently within the healthy range over the past week. Keep up the good work!',
        priority: 'low',
        confidence: 0.92
      },
      {
        type: 'behavior_change',
        title: 'Increased Physical Activity',
        description: 'We noticed a 15% increase in your daily steps compared to last week. This is excellent for cardiovascular health.',
        priority: 'medium',
        confidence: 0.88
      },
      {
        type: 'recommendation',
        title: 'Hydration Reminder',
        description: 'Based on your activity patterns, we recommend increasing water intake, especially during morning walks.',
        priority: 'medium',
        confidence: 0.75,
        action: 1
      },
      {
        type: 'prediction',
        title: 'Sleep Pattern Optimization',
        description: 'Your sleep data suggests going to bed 30 minutes earlier could improve overall rest quality.',
        priority: 'low',
        confidence: 0.81
      }
    ];

    insights.forEach(insight => {
      db.prepare(`
        INSERT INTO ai_insights (senior_id, insight_type, title, description, confidence_score, priority, action_required)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(seniorId, insight.type, insight.title, insight.description, insight.confidence, insight.priority, insight.action || 0);
    });

    // Generate Emergency Alerts (past week, some resolved)
    const emergencyAlerts = [
      { type: 'panic', severity: 'critical', description: 'Emergency button pressed', resolved: true, days: 5 },
      { type: 'abnormal_vitals', severity: 'high', description: 'Blood pressure spike detected: 165/95', resolved: true, days: 3 },
      { type: 'no_activity', severity: 'medium', description: 'No movement detected for 4 hours during daytime', resolved: true, days: 2 }
    ];

    emergencyAlerts.forEach(alert => {
      const alertDate = new Date();
      alertDate.setDate(alertDate.getDate() - alert.days);
      db.prepare(`
        INSERT INTO emergency_alerts (senior_id, alert_type, severity, description, triggered_at, acknowledged_at, resolved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        seniorId,
        alert.type,
        alert.severity,
        alert.description,
        alertDate.toISOString(),
        alert.resolved ? new Date(alertDate.getTime() + 600000).toISOString() : null,
        alert.resolved ? new Date(alertDate.getTime() + 1800000).toISOString() : null
      );
    });

    res.json({
      message: 'Sample data generated successfully',
      generated: {
        devices: devices.length,
        vitals: '7 days of data',
        activities: activities.length,
        insights: insights.length,
        alerts: emergencyAlerts.length
      }
    });
  } catch (error) {
    console.error('Sample data generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: peace-watch.db`);
  console.log(`\n Demo accounts:`);
  console.log(`   - senior@demo.com / demo123`);
  console.log(`   - caregiver@demo.com / demo123`);
  console.log(`   - provider@demo.com / demo123\n`);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  db.close();
  process.exit(0);
});
