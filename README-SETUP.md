# SymbIOT Peace Watch - Setup Guide

## Overview
SymbIOT Peace Watch is a comprehensive senior care monitoring application with authentication, real-time sensor monitoring, health tracking, and caregiver support features.

## Architecture
- **Frontend**: React + TypeScript + Vite (Port: 8086)
- **Backend**: Express.js API (Port: 3001)
- **Database**: SQLite (peace-watch.db)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode (Recommended)
Run both frontend and backend servers concurrently:
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend Vite dev server on http://localhost:8086

### Run Individually
**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Demo Accounts

Three demo accounts are pre-seeded in the database:

| Role      | Email                  | Password |
|-----------|------------------------|----------|
| Senior    | senior@demo.com        | demo123  |
| Caregiver | caregiver@demo.com     | demo123  |
| Provider  | provider@demo.com      | demo123  |

## Features

### Authentication
- ✅ Login/Register pages with form validation
- ✅ Protected routes requiring authentication
- ✅ Role-based access control (senior/caregiver/provider)
- ✅ Persistent sessions using localStorage
- ✅ Logout functionality

### Home Dashboard (`/home`)
The main landing page includes:

#### 📝 Happy Note of the Day
- Inspirational daily messages for users

#### 📅 Daily Activities Planned
- **Daily Routines**: Schedule and track daily tasks
- **Medicines**: Medication management with dosage and timing
- **Dietary Needs**: Meal planning for all meals
- **Health Markers**: Real-time vital signs monitoring
- **Doctor Appointments**: Schedule management

#### 🔔 Sensor Alerts & System Status
- Real-time sensor monitoring dashboard
- House diagram showing sensor placements
- System status indicators
- Recent alerts with severity levels
- AI-powered insights and recommendations
- Third-party sensor provider integration

#### 👥 Service Providers
- **Regular Providers**: Scheduled services with reminders
- **Occasional Providers**: On-demand services
- **Emergency Providers**: Quick access emergency contacts
- Call functionality integrated

#### 👤 Key Senior Data
- Medicines overview
- Dietary intake tracking with QR code shopping alerts
- Favorite hobbies/activities with locations
- Quick access to important information

#### 💡 Tips and Tricks
- Caregiver tips organized by category
- Practical advice for senior care
- Nice reminders for caregivers and seniors

## Database Schema

The SQLite database includes the following tables:
- `users` - User accounts
- `seniors` - Senior profile information
- `daily_routines` - Daily routine schedules
- `medicines` - Medication tracking
- `dietary_needs` - Meal planning and dietary restrictions
- `health_markers` - Vital signs and health data
- `appointments` - Doctor appointments
- `sensors` - IoT sensor devices
- `sensor_alerts` - Sensor alerts and notifications
- `service_providers` - Service provider contacts
- `provider_schedules` - Service schedules
- `hobbies` - Senior hobbies and activities
- `shopping_items` - Shopping list with QR codes
- `caregiver_tips` - Tips and advice for caregivers
- `nice_reminders` - Positive reminders
- `happy_notes` - Daily inspirational notes

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/user/:id` - Get user by ID

### Data Endpoints
- `GET /api/routines/senior/:seniorId` - Get daily routines
- `GET /api/medicines/senior/:seniorId` - Get medicines
- `GET /api/sensor-alerts/senior/:seniorId` - Get sensor alerts
- `GET /api/service-providers` - Get all service providers
- `GET /api/caregiver-tips` - Get all caregiver tips
- `GET /api/happy-notes/today` - Get today's happy note

## Routes

### Public Routes
- `/` - Landing page with features and pricing
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/home` - Main dashboard (all users)
- `/dashboard` - Advanced dashboard (all users)
- `/settings` - User settings (all users)
- `/profile` - User profile (all users)
- `/analytics` - Analytics dashboard (all users)
- `/family-dashboard` - Family view (all users)
- `/emergency` - Emergency center (all users)
- `/provider-portal` - Provider portal (providers only)
- `/reports` - Reports (all users)
- `/geofencing` - Geofencing/GPS tracking (all users)

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- TanStack Query
- Shadcn/ui Components
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- better-sqlite3
- bcryptjs (password hashing)
- cors

### Development
- Concurrently (run multiple servers)
- ESLint
- TypeScript ESLint

## Notes

- The database file `peace-watch.db` will be created automatically in the project root
- Demo data is automatically seeded on first run
- The frontend makes API calls to `http://localhost:3001/api`
- CORS is enabled for development

## Troubleshooting

**Ports already in use:**
- Backend uses port 3001
- Frontend will automatically find an available port (typically 8080-8090)

**Database errors:**
- Delete `peace-watch.db` file and restart to reset the database

**API connection errors:**
- Ensure the backend server is running on port 3001
- Check console for CORS errors

## Next Steps

You can extend the application by:
1. Adding more API endpoints for CRUD operations
2. Implementing WebSocket for real-time sensor data
3. Adding file upload for senior photos
4. Implementing QR code generation for shopping
5. Adding email/SMS notifications
6. Integrating with actual IoT devices
7. Building mobile apps using React Native

## License

Private project for SymbIOT Peace Watch
