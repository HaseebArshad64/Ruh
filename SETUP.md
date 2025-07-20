# Virtual Wellness Platform - Setup Guide

## 📋 Prerequisites

Ensure you have the following installed:

- **Ruby** 2.6.10+
- **PostgreSQL** 12+
- **Node.js** 18+ and npm
- **Git**

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
cd Ruh  # Project directory
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Method 1: Using createdb (recommended)
createdb wellness_platform_dev

# Method 2: Using psql
psql postgres
CREATE DATABASE wellness_platform_dev;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install Ruby dependencies
bundle install

# Configure environment (optional)
cp env.example .env
# Edit .env if needed - defaults work for local development

# Start the backend
ruby app.rb
```

**Backend will start on:** `http://localhost:4567`

### 4. Frontend Setup

```bash
cd frontend

# Install Node.js dependencies
npm install

# Configure environment (optional)
cp env.example .env.local
# Edit .env.local if needed - defaults work for local development

# Start the frontend
npm start
```

**Frontend will start on:** `http://localhost:3000`

## 🔧 Configuration

### Backend Environment (`.env`)

```bash
DB_HOST=localhost
DB_NAME=wellness_platform_dev
DB_USER=your_username
DB_PASSWORD=your_password
```

### Frontend Environment (`.env.local`)

```bash
REACT_APP_API_BASE_URL=http://localhost:4567
REACT_APP_ENV=development
```

## 🧪 Testing the Application

### 1. API Health Check

```bash
curl http://localhost:4567/health
# Expected: {"status":"OK","timestamp":"..."}
```

### 2. Create a Test Client

```bash
curl -X POST http://localhost:4567/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

### 3. Get All Clients

```bash
curl http://localhost:4567/api/clients
```

### 4. Create a Test Appointment

```bash
curl -X POST http://localhost:4567/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "1",
    "time": "2025-07-25T10:00:00Z"
  }'
```

### 5. Get Appointments with Client Details

```bash
curl http://localhost:4567/api/appointments/with_clients
```

## 🖥️ Frontend Testing

### Manual Testing Workflow

1. **Visit Application**: `http://localhost:3000`

2. **Dashboard Testing**:

   - Verify statistics display correctly
   - Check upcoming appointments section
   - Test navigation buttons

3. **Client Management**:

   - Navigate to "Clients" page
   - Test search functionality
   - Verify client cards display properly

4. **Appointment Scheduling**:

   - Navigate to "Appointments" page
   - Click "Schedule Appointment"
   - Test both modes:
     - **Existing Client**: Select from dropdown
     - **New Client**: Fill out client form
   - Submit appointment and verify success

5. **Data Persistence**:
   - Refresh browser
   - Verify data persists
   - Check database contains records

## 🗂️ Project Structure

```
Ruh/
├── backend/                  # Ruby Sinatra API
│   ├── app.rb               # Main application
│   ├── config.ru            # Rack configuration
│   ├── Gemfile              # Ruby dependencies
│   └── env.example          # Environment template
├── frontend/                # React TypeScript app
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Main application
│   ├── package.json         # Node dependencies
│   └── env.example          # Environment template
├── IMPLEMENTATION.md         # Technical documentation
└── README.md                # Project overview
```

## 🔌 API Endpoints

| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| GET    | `/health`                        | Health check                      |
| GET    | `/api/clients`                   | Get all clients                   |
| POST   | `/api/clients`                   | Create new client                 |
| GET    | `/api/appointments`              | Get all appointments              |
| GET    | `/api/appointments/with_clients` | Get appointments with client info |
| POST   | `/api/appointments`              | Create new appointment            |
| POST   | `/api/sync`                      | Manual sync trigger               |

## 🐛 Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error

```bash
# Ensure PostgreSQL is running
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Check database exists
psql -l | grep wellness_platform_dev
```

#### 2. Ruby Gem Conflicts

```bash
# Clear gem conflicts
cd backend
bundle install --clean
```

#### 3. Node Module Issues

```bash
# Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. Port Already in Use

```bash
# Kill processes on ports
lsof -ti:4567 | xargs kill  # Backend
lsof -ti:3000 | xargs kill  # Frontend
```

#### 5. Database Permission Issues

```bash
# Grant permissions (if needed)
psql postgres
GRANT ALL PRIVILEGES ON DATABASE wellness_platform_dev TO your_username;
```

### Verification Commands

#### Check Services Running

```bash
# Backend
curl -I http://localhost:4567/health

# Frontend
curl -I http://localhost:3000

# Database
psql wellness_platform_dev -c "SELECT current_database();"
```

#### View Logs

```bash
# Backend logs (if running in background)
tail -f backend/logs/app.log  # If logging configured

# Frontend logs (in terminal where npm start was run)
# Check browser console for frontend errors
```

## 📈 Performance Tips

### Backend Optimization

- Use connection pooling for database
- Add database indexes for frequent queries
- Enable gzip compression for responses

### Frontend Optimization

- Build for production: `npm run build`
- Use React.memo for expensive components
- Implement lazy loading for routes

## 🚀 Production Deployment

### Backend Deployment

```bash
# Using Puma (production server)
cd backend
bundle exec rackup config.ru -p 4567

# Environment variables for production
export DB_HOST=production_host
export DB_NAME=wellness_platform_prod
export DB_USER=prod_user
export DB_PASSWORD=secure_password
```

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy build/ directory to your web server
```

## 📊 Monitoring

### Health Checks

- Backend: `GET /health`
- Database: Connection monitoring
- Frontend: Application availability

### Metrics to Monitor

- Response times
- Database connection count
- Error rates
- User activity

## 🔒 Security Considerations

### Development

- Use environment variables for sensitive data
- Enable CORS only for required origins
- Validate all user inputs

### Production

- Use HTTPS
- Implement rate limiting
- Add authentication/authorization
- Regular security updates

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Check system logs for detailed error messages
4. Ensure database is accessible and permissions are correct

## ✅ Success Indicators

Your setup is successful when:

- ✅ Backend health check returns `{"status":"OK"}`
- ✅ Frontend loads at `http://localhost:3000`
- ✅ You can create clients and appointments
- ✅ Data persists after page refresh
- ✅ Dashboard shows correct statistics
