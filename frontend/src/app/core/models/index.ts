// Employee Models
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  nationality: string;
  nationalId: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  workEmail: string;
  personalEmail?: string;
  phone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  departmentId: string;
  departmentName: string;
  departmentNameAr: string;
  positionId: string;
  positionTitle: string;
  positionTitleAr: string;
  managerId?: string;
  managerName?: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  joinDate: Date;
  probationEndDate?: Date;
  status: 'active' | 'on-leave' | 'probation' | 'terminated';
  avatar?: string;
  basicSalary?: number;
}

export interface Department {
  id: string;
  name: string;
  nameAr: string;
  managerId?: string;
  employeeCount: number;
}

export interface Position {
  id: string;
  title: string;
  titleAr: string;
  departmentId: string;
}

// Leave Models
export interface LeaveType {
  id: string;
  name: string;
  nameAr: string;
  annualAllowance: number;
  carryForward: boolean;
  maxCarryForward?: number;
  requiresApproval: boolean;
  attachmentRequired: boolean;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNameAr?: string;
  departmentName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeNameAr: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverId: string;
  approverName?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  approverNotes?: string;
  createdAt: Date;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeNameAr: string;
  year: number;
  entitled: number;
  carriedForward: number;
  taken: number;
  pending: number;
  remaining: number;
  color: string;
}

// Finance Models
export interface Customer {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  vatNumber?: string;
}

export interface Supplier {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  vatNumber?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'invoice' | 'credit_note';
  customerId: string;
  customerName: string;
  customerAddress: string;
  invoiceDate: Date;
  dueDate: Date;
  currencyCode: string;
  exchangeRate: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  subtotalBase: number;
  taxAmountBase: number;
  totalAmountBase: number;
  amountPaid: number;
  balanceDue: number;
  status: 'draft' | 'open' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  lineItems: InvoiceLineItem[];
  notes?: string;
  terms?: string;
  createdBy: string;
  createdAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  billDate: Date;
  dueDate: Date;
  currencyCode: string;
  exchangeRate: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: 'draft' | 'open' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  lineItems: InvoiceLineItem[];
}

export interface Payment {
  id: string;
  paymentNumber: string;
  type: 'received' | 'made';
  customerId?: string;
  customerName?: string;
  supplierId?: string;
  supplierName?: string;
  paymentDate: Date;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'card';
  referenceNumber?: string;
  currencyCode: string;
  exchangeRate: number;
  amount: number;
  amountBase: number;
  invoiceId?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: Date;
}

export interface Currency {
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
  isBaseCurrency: boolean;
  rateToBase: number;
  lastUpdated: Date;
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  currencyCode: string;
  balance: number;
  isActive: boolean;
}

export interface AgingBucket {
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  total: number;
}

export interface AgingReport {
  customerId?: string;
  customerName?: string;
  supplierId?: string;
  supplierName?: string;
  buckets: AgingBucket;
}

// Dashboard Models
export interface HRDashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingRequests: number;
  newHires: number;
  departmentHeadcount: { name: string; nameAr: string; count: number }[];
}

export interface FinanceDashboardStats {
  revenue: number;
  revenueChange: number;
  receivables: number;
  receivablesCount: number;
  payables: number;
  payablesCount: number;
  cashPosition: number;
  cashChange: number;
}

// Activity Log
export interface ActivityLog {
  id: string;
  type: 'employee' | 'leave' | 'invoice' | 'payment';
  action: string;
  actionAr: string;
  description: string;
  descriptionAr: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

// Event
export interface UpcomingEvent {
  id: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'leave';
  title: string;
  titleAr: string;
  date: Date;
  employeeId?: string;
  employeeName?: string;
}
