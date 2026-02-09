# WorkSphere Pro - System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WORKSPHERE PRO ARCHITECTURE                      │
│                        Swastik Industries HRMS                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    React 18 + TypeScript                         │  │
│  │                         (Vite 5.0)                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Dashboard  │  │  Employees  │  │ Attendance  │  │   Leaves    │  │
│  │    Page     │  │    Page     │  │    Page     │  │    Page     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Payroll   │  │ Performance │  │  Settings   │  │    Login    │  │
│  │    Page     │  │    Page     │  │    Page     │  │    Page     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      UI COMPONENTS                               │  │
│  │  shadcn/ui • TailwindCSS • Framer Motion • Lucide Icons         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    STATE MANAGEMENT                              │  │
│  │  Zustand (Client) • React Query (Server) • Socket.io Client     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Express.js + TypeScript + Node.js 20                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      MIDDLEWARE LAYER                           │   │
│  │  Auth • RBAC • Validation • Rate Limit • Error Handler         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        API ROUTES                                │  │
│  │                                                                  │  │
│  │  /api/auth          - Authentication & Authorization            │  │
│  │  /api/employees     - Employee CRUD & Management                │  │
│  │  /api/attendance    - Attendance Tracking                       │  │
│  │  /api/leaves        - Leave Management                          │  │
│  │  /api/payroll       - Payroll Processing                        │  │
│  │  /api/performance   - Performance Reviews                       │  │
│  │  /api/departments   - Department Management                     │  │
│  │  /api/reports       - Reports & Analytics                       │  │
│  │  /api/settings      - System Configuration                      │  │
│  │  /api/dashboard     - Dashboard Data                            │  │
│  │  /api/notifications - Notifications                             │  │
│  │  /api/audit         - Audit Logs                                │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      CONTROLLERS                                 │  │
│  │  Business Logic • Data Processing • Response Formatting         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      SERVICES                                    │  │
│  │  Email • File Upload • PDF Generation • QR Code • Socket.io     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Mongoose ODM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        MongoDB 7.0                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    Users    │  │  Employees  │  │ Departments │  │ Attendance  │  │
│  │ Collection  │  │ Collection  │  │ Collection  │  │ Collection  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Leaves    │  │  LeaveTypes │  │   Payroll   │  │ Performance │  │
│  │ Collection  │  │ Collection  │  │ Collection  │  │ Collection  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Assets    │  │  Trainings  │  │Notifications│  │ Audit Logs  │  │
│  │ Collection  │  │ Collection  │  │ Collection  │  │ Collection  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Cloudinary  │  │   Resend    │  │   Stripe    │  │   Redis     │  │
│  │   (Files)   │  │   (Email)   │  │ (Payments)  │  │  (Cache)    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY FEATURES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ✅ JWT Authentication          ✅ Password Hashing (bcrypt)            │
│  ✅ Role-Based Access Control   ✅ Input Validation (Zod)               │
│  ✅ XSS Protection              ✅ CSRF Protection                       │
│  ✅ Rate Limiting               ✅ Helmet Security Headers              │
│  ✅ CORS Configuration          ✅ Audit Logging                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         KEY FEATURES                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📊 Dashboard           - Real-time analytics & KPIs                    │
│  👥 Employees           - Complete lifecycle management                 │
│  📅 Attendance          - Check-in/out, GPS tracking                    │
│  📝 Leaves              - Multi-level approval workflow                 │
│  💰 Payroll             - Auto calculation, payslips                    │
│  📈 Performance         - 360° feedback, KPIs, reviews                  │
│  🎨 Theme System        - Light/Dark/System modes                       │
│  🔔 Notifications       - Real-time updates                             │
│  📱 Responsive          - Mobile, tablet, desktop                       │
│  🌐 i18n Ready          - Multi-language support                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT OPTIONS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Frontend:  Vercel • Netlify • AWS S3 + CloudFront                      │
│  Backend:   Railway • Render • AWS EC2 • DigitalOcean                   │
│  Database:  MongoDB Atlas • AWS DocumentDB                              │
│  Docker:    Docker Compose • Kubernetes                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


                    Built with ❤️ for Swastik Industries
                         WorkSphere Pro v1.0.0
```
