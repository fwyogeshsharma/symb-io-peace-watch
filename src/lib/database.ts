import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('peace-watch.db');

// Initialize database schema
export const initializeDatabase = () => {
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

  // Seniors table (profile information)
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

  // Dietary needs and meals
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

  // Doctor appointments
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

  // Service provider schedules
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

  // Hobbies and activities
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

  // Shopping list (with QR code support)
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

  // Tips and tricks for caregivers
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

  console.log('Database initialized successfully!');
};

// Seed initial data
export const seedDatabase = () => {
  const hasUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

  if (hasUsers.count === 0) {
    // Create demo users
    const hashedPassword = bcrypt.hashSync('demo123', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, full_name, role)
      VALUES (?, ?, ?, ?)
    `);

    const seniorId = insertUser.run('senior@demo.com', hashedPassword, 'Margaret Johnson', 'senior').lastInsertRowid;
    const caregiverId = insertUser.run('caregiver@demo.com', hashedPassword, 'Sarah Johnson', 'caregiver').lastInsertRowid;
    const providerId = insertUser.run('provider@demo.com', hashedPassword, 'Dr. Smith', 'provider').lastInsertRowid;

    // Create senior profile
    db.prepare(`
      INSERT INTO seniors (user_id, date_of_birth, address, emergency_contact, emergency_phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(seniorId, '1945-03-15', '123 Main St, Springfield', 'Sarah Johnson', '555-0123');

    // Add some demo medicines
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

    // Add happy notes
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

// Initialize on import
initializeDatabase();
seedDatabase();

export default db;
