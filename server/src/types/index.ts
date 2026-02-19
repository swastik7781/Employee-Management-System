import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ==================== USER & AUTH ====================
export interface IUser extends Document {
    _id: Types.ObjectId;
    employeeId: string;
    email: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    avatar?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLogin?: Date;
    refreshToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
    preferences?: {
        theme?: 'light' | 'dark' | 'system';
        notifications?: {
            email: boolean;
            inApp: boolean;
            leaves: boolean;
            payroll: boolean;
            attendance: boolean;
            performance: boolean;
            announcements: boolean;
        };
        sidebarExpanded?: boolean;
    };
    comparePassword(enteredPassword: string): Promise<boolean>;
    generateAuthToken(): string;
    generateRefreshToken(): string;
}

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    HR_ADMIN = 'hr_admin',
    DEPARTMENT_HEAD = 'department_head',
    TEAM_LEAD = 'team_lead',
    MANAGER = 'manager',
    EMPLOYEE = 'employee',
    INTERN = 'intern',
    CONTRACTOR = 'contractor',
    VIEWER = 'viewer',
    FINANCE_ADMIN = 'finance_admin',
    IT_ADMIN = 'it_admin',
    SECURITY_ADMIN = 'security_admin',
}

export interface AuthRequest extends Request {
    user?: IUser;
}

// ==================== EMPLOYEE ====================
export interface IEmployee extends Document {
    _id: Types.ObjectId;
    employeeNumber: string;
    userId: Types.ObjectId;

    // Personal Information
    personalInfo: {
        firstName: string;
        middleName?: string;
        lastName: string;
        dateOfBirth: Date;
        gender: 'male' | 'female' | 'other';
        maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
        bloodGroup?: string;
        nationality: string;
        religion?: string;
        photo?: string;
    };

    // Contact Information
    contactInfo: {
        email: string;
        personalEmail?: string;
        phone: string;
        alternatePhone?: string;
        currentAddress: IAddress;
        permanentAddress: IAddress;
    };

    // Professional Information
    professionalInfo: {
        designation: string;
        department: Types.ObjectId;
        team?: Types.ObjectId;
        employeeType: 'full-time' | 'part-time' | 'contract' | 'intern';
        employmentStatus: 'active' | 'inactive' | 'terminated' | 'resigned' | 'on-leave';
        joiningDate: Date;
        confirmationDate?: Date;
        probationPeriod?: number; // in months
        isProbation: boolean;
        reportingManager?: Types.ObjectId;
        workLocation: string;
        shift?: Types.ObjectId;
        workMode: 'office' | 'remote' | 'hybrid';
    };

    // Salary Information
    salaryInfo: {
        currentSalary: number;
        currency: string;
        paymentMode: 'bank-transfer' | 'cash' | 'cheque';
        bankDetails?: IBankDetails;
    };

    // Emergency Contacts
    emergencyContacts: IEmergencyContact[];

    // Family Members
    familyMembers: IFamilyMember[];

    // Education
    education: IEducation[];

    // Work Experience
    workExperience: IWorkExperience[];

    // Skills & Certifications
    skills: string[];
    certifications: ICertification[];

    // Documents
    documents: IDocument[];

    // Additional Fields
    qrCode?: string;
    biometricId?: string;
    rfidCard?: string;

    // Status
    isActive: boolean;
    exitDate?: Date;
    exitReason?: string;

    // Metadata
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface IBankDetails {
    accountNumber: string;
    accountHolderName: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
    swiftCode?: string;
}

export interface IEmergencyContact {
    name: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
    address?: string;
}

export interface IFamilyMember {
    name: string;
    relationship: string;
    dateOfBirth?: Date;
    occupation?: string;
    phone?: string;
    isDependent: boolean;
}

export interface IEducation {
    degree: string;
    institution: string;
    university: string;
    yearOfPassing: number;
    percentage?: number;
    grade?: string;
}

export interface IWorkExperience {
    company: string;
    designation: string;
    from: Date;
    to?: Date;
    isCurrent: boolean;
    description?: string;
}

export interface ICertification {
    name: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
}

export interface IDocument {
    type: string;
    name: string;
    url: string;
    uploadDate: Date;
    expiryDate?: Date;
    verificationStatus: 'pending' | 'verified' | 'rejected';
}

// ==================== DEPARTMENT ====================
export interface IDepartment extends Document {
    _id: Types.ObjectId;
    name: string;
    code: string;
    description?: string;
    head?: Types.ObjectId;
    parentDepartment?: Types.ObjectId;
    location: string;
    budget?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== ATTENDANCE ====================
export interface IAttendance extends Document {
    _id: Types.ObjectId;
    employee: Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    status: 'present' | 'absent' | 'half-day' | 'late' | 'on-leave' | 'holiday' | 'weekend';
    workHours?: number;
    overtimeHours?: number;
    breaks: IBreak[];
    location?: ILocation;
    device?: string;
    remarks?: string;
    isRegularized: boolean;
    regularizationReason?: string;
    approvedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBreak {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    type: 'lunch' | 'tea' | 'other';
}

export interface ILocation {
    latitude: number;
    longitude: number;
    address?: string;
}

// ==================== LEAVE ====================
export interface ILeave extends Document {
    _id: Types.ObjectId;
    employee: Types.ObjectId;
    leaveType: Types.ObjectId;
    fromDate: Date;
    toDate: Date;
    numberOfDays: number;
    isHalfDay: boolean;
    halfDayPeriod?: 'first-half' | 'second-half';
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    appliedDate: Date;
    approvalWorkflow: IApprovalStep[];
    attachments?: string[];
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IApprovalStep {
    approver: Types.ObjectId;
    level: number;
    status: 'pending' | 'approved' | 'rejected';
    actionDate?: Date;
    comments?: string;
}

export interface ILeaveType extends Document {
    _id: Types.ObjectId;
    name: string;
    code: string;
    description?: string;
    maxDaysPerYear: number;
    isCarryForward: boolean;
    maxCarryForwardDays?: number;
    isEncashable: boolean;
    isPaid: boolean;
    applicableGender?: 'male' | 'female' | 'all';
    minServiceMonths?: number;
    requiresApproval: boolean;
    approvalLevels: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILeaveBalance extends Document {
    _id: Types.ObjectId;
    employee: Types.ObjectId;
    leaveType: Types.ObjectId;
    year: number;
    allocated: number;
    used: number;
    balance: number;
    carriedForward: number;
    encashed: number;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== PAYROLL ====================
export interface IPayroll extends Document {
    _id: Types.ObjectId;
    employee: Types.ObjectId;
    month: number;
    year: number;
    payPeriodStart: Date;
    payPeriodEnd: Date;
    payDate: Date;

    earnings: IPayrollComponent[];
    deductions: IPayrollComponent[];

    grossSalary: number;
    totalDeductions: number;
    netSalary: number;

    taxDetails: ITaxDetails;

    status: 'draft' | 'processed' | 'paid' | 'cancelled';
    paymentMethod: 'bank-transfer' | 'cash' | 'cheque';
    transactionId?: string;

    remarks?: string;
    processedBy?: Types.ObjectId;
    approvedBy?: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

export interface IPayrollComponent {
    name: string;
    type: string;
    amount: number;
    isTaxable: boolean;
    isStatutory: boolean;
}

export interface ITaxDetails {
    taxableIncome: number;
    incomeTax: number;
    professionalTax: number;
    tds: number;
    totalTax: number;
}

// ==================== PERFORMANCE ====================
export interface IPerformanceReview extends Document {
    _id: Types.ObjectId;
    employee: Types.ObjectId;
    reviewPeriod: {
        startDate: Date;
        endDate: Date;
    };
    reviewType: 'annual' | 'half-yearly' | 'quarterly' | 'probation';

    selfAssessment?: IAssessment;
    managerAssessment?: IAssessment;
    peerReviews: IPeerReview[];

    kpis: IKPI[];
    goals: IGoal[];

    overallRating: number;
    strengths?: string[];
    areasOfImprovement?: string[];
    trainingRecommendations?: string[];

    status: 'draft' | 'submitted' | 'under-review' | 'completed';

    reviewer: Types.ObjectId;
    reviewDate?: Date;

    createdAt: Date;
    updatedAt: Date;
}

export interface IAssessment {
    ratings: IRating[];
    comments?: string;
    submittedDate: Date;
}

export interface IRating {
    category: string;
    rating: number;
    maxRating: number;
    comments?: string;
}

export interface IPeerReview {
    reviewer: Types.ObjectId;
    rating: number;
    comments?: string;
    submittedDate: Date;
}

export interface IKPI {
    name: string;
    target: number;
    achieved: number;
    unit: string;
    weight: number;
    score: number;
}

export interface IGoal {
    title: string;
    description: string;
    targetDate: Date;
    status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
    completionPercentage: number;
}

// ==================== ASSET ====================
export interface IAsset extends Document {
    _id: Types.ObjectId;
    assetNumber: string;
    name: string;
    category: string;
    type: string;
    brand?: string;
    modelName?: string;
    serialNumber?: string;
    purchaseDate: Date;
    purchasePrice: number;
    currentValue: number;
    depreciationRate?: number;
    warrantyExpiry?: Date;

    assignedTo?: Types.ObjectId;
    assignmentDate?: Date;
    returnDate?: Date;

    status: 'available' | 'assigned' | 'under-maintenance' | 'retired' | 'lost';
    condition: 'excellent' | 'good' | 'fair' | 'poor';

    location: string;
    qrCode?: string;

    maintenanceHistory: IMaintenanceRecord[];

    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMaintenanceRecord {
    date: Date;
    type: 'repair' | 'service' | 'upgrade';
    description: string;
    cost?: number;
    performedBy?: string;
}

// ==================== TRAINING ====================
export interface ITraining extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    category: string;
    type: 'internal' | 'external' | 'online' | 'workshop' | 'seminar';
    trainer?: string;
    trainerType: 'internal' | 'external';

    startDate: Date;
    endDate: Date;
    duration: number; // in hours

    location?: string;
    mode: 'online' | 'offline' | 'hybrid';

    maxParticipants?: number;
    participants: ITrainingParticipant[];

    budget?: number;
    actualCost?: number;

    materials?: string[];

    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

    createdAt: Date;
    updatedAt: Date;
}

export interface ITrainingParticipant {
    employee: Types.ObjectId;
    enrollmentDate: Date;
    status: 'enrolled' | 'completed' | 'dropped' | 'failed';
    attendance?: number;
    score?: number;
    feedback?: string;
    certificateUrl?: string;
}

// ==================== NOTIFICATION ====================
export interface INotification extends Document {
    _id: Types.ObjectId;
    recipient: Types.ObjectId;
    type: string;
    title: string;
    message: string;
    data?: any;
    isRead: boolean;
    readAt?: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    actionUrl?: string;
    createdAt: Date;
}

// ==================== AUDIT LOG ====================
export interface IAuditLog extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: any;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}

// ==================== SETTINGS ====================
export interface ICompanySettings extends Document {
    _id: Types.ObjectId;
    companyName: string;
    companyLogo?: string;
    email: string;
    phone: string;
    address: IAddress;
    website?: string;
    taxId?: string;

    workingDays: number[];
    workingHours: {
        start: string;
        end: string;
    };

    leaveSettings: any;
    attendanceSettings: any;
    payrollSettings: any;

    updatedAt: Date;
}

export interface IHoliday extends Document {
    _id: Types.ObjectId;
    name: string;
    date: Date;
    type: 'national' | 'regional' | 'company';
    isOptional: boolean;
    applicableLocations?: string[];
    description?: string;
    createdAt: Date;
}

export interface IShift extends Document {
    _id: Types.ObjectId;
    name: string;
    code: string;
    startTime: string;
    endTime: string;
    graceTime?: number; // in minutes
    minimumHours: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== CHAT ====================
export interface IChat extends Document {
    _id: Types.ObjectId;
    type: 'direct' | 'group' | 'channel';
    name?: string;
    participants: Types.ObjectId[];
    admins?: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage extends Document {
    _id: Types.ObjectId;
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    type: 'text' | 'file' | 'image' | 'video';
    fileUrl?: string;
    isRead: boolean;
    readBy: Types.ObjectId[];
    createdAt: Date;
}

// ==================== RESPONSE TYPES ====================
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
