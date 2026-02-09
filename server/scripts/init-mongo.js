// MongoDB initialization script
db = db.getSiblingDB('worksphere');

// Create collections with validation
db.createCollection('users');
db.createCollection('employees');
db.createCollection('departments');
db.createCollection('attendance');
db.createCollection('leaves');
db.createCollection('leavetypes');
db.createCollection('leavebalances');
db.createCollection('payrolls');
db.createCollection('performancereviews');
db.createCollection('assets');
db.createCollection('trainings');
db.createCollection('notifications');
db.createCollection('auditlogs');
db.createCollection('holidays');
db.createCollection('shifts');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ employeeId: 1 }, { unique: true });
db.employees.createIndex({ employeeNumber: 1 }, { unique: true });
db.employees.createIndex({ 'contactInfo.email': 1 });
db.employees.createIndex({ 'professionalInfo.department': 1 });
db.attendance.createIndex({ employee: 1, date: 1 }, { unique: true });
db.leaves.createIndex({ employee: 1, fromDate: -1 });
db.payrolls.createIndex({ employee: 1, month: 1, year: 1 }, { unique: true });

print('WorkSphere Pro database initialized successfully!');
