# 🎯 WorkSphere Pro - Complete User Guide

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Employee Management](#employee-management)
4. [Attendance](#attendance)
5. [Leave Management](#leave-management)
6. [Payroll](#payroll)
7. [Performance](#performance)
8. [Settings](#settings)
9. [Tips & Tricks](#tips--tricks)

---

## 🚀 Getting Started

### First Time Setup

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Seed Database** (Creates 100 employees)
   ```bash
   cd server
   npm run seed
   ```

3. **Start Backend**
   ```bash
   cd server
   npm run dev
   ```

4. **Start Frontend**
   ```bash
   cd client
   npm run dev
   ```

5. **Open Application**
   - Navigate to: http://localhost:5173
   - Login with: `admin@swastikindustries.com` / `Admin@123`

---

## 📊 Dashboard

### Overview
The dashboard provides a comprehensive view of your organization's key metrics.

### Features:
- **Total Employees**: See total employee count with trend
- **Present Today**: Real-time attendance status
- **On Leave**: Current leave statistics
- **Monthly Payroll**: Total payroll amount

### Department Distribution
- Visual representation of employees across departments
- Progress bars showing department sizes
- Click to filter employees by department

### Recent Activities
- Real-time feed of employee actions
- Leave applications, check-ins, submissions
- Timestamped updates

### Upcoming Events
- Team meetings
- Payroll processing dates
- Training sessions
- Performance review deadlines

### Quick Actions:
- Toggle theme (Light/Dark/System)
- Search employees
- View notifications
- Access settings

---

## 👥 Employee Management

### Viewing Employees

1. **Navigate to Employees**
   - Click "Employees" in sidebar
   - View all 100 sample employees

2. **Search & Filter**
   - Use search bar to find employees
   - Filter by department, status, type
   - Results update in real-time

3. **Employee Cards**
   - Avatar with initials
   - Name and designation
   - Employee number
   - Status badges (Active, Inactive, etc.)
   - Employment type (Full-time, Contract, etc.)

### Employee Details
Click any employee card to view:
- Personal information
- Contact details
- Professional information
- Salary details
- Emergency contacts
- Documents
- Work history

### Adding Employees

1. Click "Add Employee" button
2. Fill in required information:
   - Personal details
   - Contact information
   - Professional details
   - Salary information
3. Upload documents
4. Save

### Bulk Import

1. Click "Import" button
2. Download sample Excel template
3. Fill in employee data
4. Upload file
5. Review and confirm

### Export Data

1. Click "Export" button
2. Choose format (Excel/CSV/PDF)
3. Select fields to export
4. Download file

---

## 📅 Attendance

### Check-In/Check-Out

1. **Check In**
   - Click "Check In" button
   - Location is captured (if GPS enabled)
   - Time is recorded

2. **Check Out**
   - Click "Check Out" button
   - Working hours calculated automatically
   - Overtime computed if applicable

### Today's Status
- **Present**: Employees who checked in
- **Absent**: Employees who didn't check in
- **On Leave**: Approved leave applications

### Working Hours
- View your daily working hours
- See break times
- Track overtime

### Attendance Calendar
- Monthly view of attendance
- Color-coded status (Present/Absent/Leave)
- Click dates for details

### Regularization
1. Select date to regularize
2. Provide reason
3. Submit for approval
4. Manager reviews and approves

---

## 📝 Leave Management

### Leave Balance

View your leave balance for:
- **Annual Leave**: 15/21 days
- **Sick Leave**: 10/12 days
- **Casual Leave**: 5/7 days
- **Comp Off**: 3/12 days

### Applying for Leave

1. Click "Apply Leave" button
2. Select leave type
3. Choose dates (from/to)
4. Select half-day if needed
5. Enter reason
6. Attach documents (if required)
7. Submit

### Approval Workflow

**For Employees:**
1. Application submitted
2. Manager reviews
3. HR approves (if needed)
4. Status updated

**For Managers:**
1. View pending requests
2. Review details
3. Approve or reject
4. Add comments

### Leave Calendar
- Company-wide leave calendar
- See who's on leave
- Plan team availability
- Avoid conflicts

### Leave Types

1. **Annual Leave** - Yearly vacation
2. **Sick Leave** - Medical emergencies
3. **Casual Leave** - Personal reasons
4. **Maternity Leave** - 180 days (female)
5. **Paternity Leave** - 15 days (male)
6. **Comp Off** - Compensatory leave
7. **Loss of Pay** - Unpaid leave
8. **Work From Home** - Remote work

---

## 💰 Payroll

### Viewing Payroll

1. **Total Payroll**
   - Monthly total: ₹1,25,00,000
   - Processed: 95/100 employees
   - Pending: 5 employees

2. **Payslip Download**
   - Click employee name
   - Click "Download" button
   - PDF generated instantly

### Payslip Details

Each payslip includes:
- **Earnings**
  - Basic Salary
  - HRA
  - Special Allowance
  - Transport Allowance
  - Other Allowances

- **Deductions**
  - PF (Employee)
  - Professional Tax
  - Income Tax (TDS)
  - Other Deductions

- **Net Salary**
  - Gross Salary - Total Deductions

### Processing Payroll

**For HR/Finance:**
1. Click "Process Payroll"
2. Select month
3. Review calculations
4. Approve
5. Generate payslips
6. Send to employees

### Salary Components

Configure:
- Basic salary percentage
- HRA calculation
- Allowances
- Deductions
- Tax slabs
- PF/ESI rates

---

## 📈 Performance

### Performance Reviews

1. **Self-Assessment**
   - Rate yourself on KPIs
   - Add comments
   - Submit to manager

2. **Manager Assessment**
   - Review employee ratings
   - Provide feedback
   - Set goals

3. **Peer Review**
   - Colleagues provide feedback
   - Anonymous or named
   - Consolidated view

### KPIs (Key Performance Indicators)

Track metrics like:
- Sales targets
- Project completion
- Customer satisfaction
- Quality scores
- Attendance
- Punctuality

### Performance Ratings

- **5.0** - Outstanding
- **4.0** - Exceeds Expectations
- **3.0** - Meets Expectations
- **2.0** - Needs Improvement
- **1.0** - Unsatisfactory

### Performance Trends
- View historical ratings
- Compare periods
- Identify patterns
- Track improvement

### Goals & Objectives

1. Set SMART goals
2. Track progress
3. Update status
4. Mark complete
5. Review achievements

---

## ⚙️ Settings

### Appearance

**Theme Options:**
1. **Light Mode**
   - Clean, bright interface
   - Best for daytime use
   - Easy to read

2. **Dark Mode**
   - Easy on the eyes
   - Perfect for night work
   - Reduces eye strain

3. **System**
   - Follows OS preference
   - Auto-switches
   - Best of both worlds

**How to Change:**
1. Go to Settings
2. Click on preferred theme
3. Changes apply instantly
4. Saved automatically

### Company Information

View and update:
- Company name: Swastik Industries
- Email: hr@swastikindustries.com
- Phone: +91-1234567890
- Address: Mumbai, Maharashtra, India

### User Preferences

Configure:
- Language (English/Hindi)
- Date format
- Currency
- Time zone
- Notifications

---

## 💡 Tips & Tricks

### Keyboard Shortcuts (Coming Soon)
- `Ctrl + K` - Quick search
- `Ctrl + /` - Show shortcuts
- `Ctrl + B` - Toggle sidebar
- `Esc` - Close modals

### Best Practices

1. **Regular Check-ins**
   - Check in on time
   - Don't forget to check out
   - Regularize if missed

2. **Leave Planning**
   - Apply in advance
   - Check team calendar
   - Avoid peak periods

3. **Document Management**
   - Upload clear scans
   - Keep documents updated
   - Verify expiry dates

4. **Performance**
   - Update goals regularly
   - Provide honest feedback
   - Track achievements

### Mobile Usage

The app is fully responsive:
- Use on phone/tablet
- All features available
- Touch-friendly interface
- Swipe gestures

### Notifications

Enable notifications for:
- Leave approvals
- Payslip generation
- Performance reviews
- Important announcements
- Birthday wishes

---

## 🔒 Security

### Password Guidelines

- Minimum 6 characters
- Mix of letters and numbers
- Change regularly
- Don't share

### Two-Factor Authentication (Coming Soon)

- SMS verification
- Email verification
- Authenticator app

### Data Privacy

- Your data is encrypted
- Access controlled by roles
- Audit logs maintained
- GDPR compliant

---

## 📞 Support

### Getting Help

1. **In-App Help**
   - Click "?" icon
   - Search help articles
   - Watch video tutorials

2. **Contact HR**
   - Email: hr@swastikindustries.com
   - Phone: +91-1234567890
   - Office hours: 9 AM - 6 PM

3. **IT Support**
   - For technical issues
   - System access problems
   - Bug reports

---

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- Getting started
- Employee management
- Leave application
- Payroll understanding
- Performance reviews

### Documentation
- User manual (this guide)
- API documentation
- Admin guide
- Developer guide

---

## 🔄 Updates & Changelog

### Version 1.0.0 (Current)
- ✅ Complete HRMS system
- ✅ 100+ features
- ✅ Dark/Light themes
- ✅ Mobile responsive
- ✅ 100 sample employees

### Coming Soon
- Mobile app (iOS/Android)
- Advanced analytics
- AI-powered insights
- Biometric integration
- Video interviews
- Learning management

---

## ❓ FAQs

**Q: How do I reset my password?**
A: Click "Forgot Password" on login page, enter email, follow instructions.

**Q: Can I apply leave for past dates?**
A: Yes, but requires manager approval and valid reason.

**Q: How is overtime calculated?**
A: Hours worked beyond 8 hours/day are counted as overtime.

**Q: When are payslips generated?**
A: Last working day of each month.

**Q: How do I change my theme?**
A: Go to Settings → Appearance → Select theme.

**Q: Can I export employee data?**
A: Yes, click Export button on Employees page (Admin/HR only).

**Q: How many leave types are available?**
A: 8 types including Annual, Sick, Casual, Maternity, etc.

**Q: Is my data secure?**
A: Yes, all data is encrypted and access is role-based.

---

## 🎉 Conclusion

WorkSphere Pro is designed to make employee management simple, efficient, and enjoyable. Explore all features, customize to your needs, and enjoy a seamless HRMS experience!

**Need help?** Contact HR at hr@swastikindustries.com

---

**Built with ❤️ for Swastik Industries**

*WorkSphere Pro - Complete Workforce Management*
