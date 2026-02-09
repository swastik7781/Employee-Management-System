# 🚀 WorkSphere Pro - Setup & Deployment Guide

## Quick Setup (5 Minutes)

### Prerequisites Check
```bash
node --version  # Should be 20.x or higher
npm --version   # Should be 10.x or higher
mongod --version  # Should be 7.0 or higher
```

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 3: Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### Step 4: Seed Database (Creates 100 Employees)
```bash
cd ../server
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
MongoDB Connected: localhost
Clearing existing data...
Creating departments...
✅ Created 10 departments
Creating leave types...
✅ Created 8 leave types
Creating shifts...
✅ Created 4 shifts
Creating holidays...
✅ Created 6 holidays
Creating admin user...
✅ Created admin user
Creating 100 sample employees...
Created 10 employees...
Created 20 employees...
...
✅ Created 100 sample employees

🎉 Database seeding completed successfully!

📝 Login Credentials:
Admin: admin@swastikindustries.com / Admin@123
Employee: [any employee email] / Employee@123
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 6: Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

### Step 7: Login
```
Email: admin@swastikindustries.com
Password: Admin@123
```

---

## 🐳 Docker Setup (Recommended)

### Start Everything
```bash
docker-compose up -d
```

### Seed Database
```bash
docker-compose exec server npm run seed
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Everything
```bash
docker-compose down
```

---

## 🎨 Features to Test

### 1. Dashboard
- ✅ View employee statistics
- ✅ Check department distribution
- ✅ See recent activities
- ✅ Toggle theme (Light/Dark/System)

### 2. Employees
- ✅ Browse 100 sample employees
- ✅ Search employees
- ✅ Filter by department/status
- ✅ View employee details

### 3. Attendance
- ✅ Check-in/Check-out
- ✅ View attendance status
- ✅ See working hours

### 4. Leaves
- ✅ View leave balance
- ✅ Apply for leave
- ✅ Approve/Reject leaves

### 5. Payroll
- ✅ View payroll summary
- ✅ Download payslips
- ✅ Process payroll

### 6. Performance
- ✅ View performance ratings
- ✅ See review statistics

### 7. Settings
- ✅ Change theme
- ✅ View company info

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

### Port Already in Use
```bash
# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Mobile Testing

The application is fully responsive. Test on:
- Mobile (375px)
- Tablet (768px)
- Desktop (1024px+)

---

## 🚀 Production Deployment

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel)
1. Import GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update MONGODB_URI

---

## 📊 Sample Data

The seed script creates:
- **1 Admin User**
- **100 Employees** across 10 departments
- **10 Departments** (Engineering, HR, Finance, etc.)
- **8 Leave Types** (Annual, Sick, Casual, etc.)
- **4 Shifts** (General, Morning, Evening, Night)
- **6 Holidays** (National holidays)

---

## 🎯 Next Steps

1. ✅ Explore all modules
2. ✅ Test theme switching
3. ✅ Try employee search
4. ✅ Check mobile responsiveness
5. ✅ Review API documentation

---

## 💡 Tips

- Use **Ctrl+K** for quick search (coming soon)
- Toggle theme from Settings or header
- All data is seeded - feel free to experiment
- Check API docs at http://localhost:5000/api-docs

---

**Enjoy WorkSphere Pro! 🎉**
