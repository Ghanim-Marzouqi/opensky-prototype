import { Injectable } from '@angular/core';
import {
  Employee, Department, Position, LeaveType, LeaveRequest, LeaveBalance,
  Customer, Supplier, Invoice, Bill, Payment, Currency, BankAccount,
  HRDashboardStats, FinanceDashboardStats, ActivityLog, UpcomingEvent, AgingReport
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  // Departments
  readonly departments: Department[] = [
    { id: 'dept-1', name: 'Operations', nameAr: 'العمليات', employeeCount: 45 },
    { id: 'dept-2', name: 'Logistics', nameAr: 'اللوجستيات', employeeCount: 38 },
    { id: 'dept-3', name: 'Finance', nameAr: 'المالية', employeeCount: 28 },
    { id: 'dept-4', name: 'Human Resources', nameAr: 'الموارد البشرية', employeeCount: 15 },
    { id: 'dept-5', name: 'Sales', nameAr: 'المبيعات', employeeCount: 30 },
    { id: 'dept-6', name: 'IT', nameAr: 'تقنية المعلومات', employeeCount: 12 },
  ];

  // Positions
  readonly positions: Position[] = [
    { id: 'pos-1', title: 'Operations Manager', titleAr: 'مدير العمليات', departmentId: 'dept-1' },
    { id: 'pos-2', title: 'Operations Supervisor', titleAr: 'مشرف العمليات', departmentId: 'dept-1' },
    { id: 'pos-3', title: 'Logistics Manager', titleAr: 'مدير اللوجستيات', departmentId: 'dept-2' },
    { id: 'pos-4', title: 'Warehouse Supervisor', titleAr: 'مشرف المستودعات', departmentId: 'dept-2' },
    { id: 'pos-5', title: 'Finance Manager', titleAr: 'مدير المالية', departmentId: 'dept-3' },
    { id: 'pos-6', title: 'Senior Accountant', titleAr: 'محاسب أول', departmentId: 'dept-3' },
    { id: 'pos-7', title: 'Accountant', titleAr: 'محاسب', departmentId: 'dept-3' },
    { id: 'pos-8', title: 'HR Manager', titleAr: 'مدير الموارد البشرية', departmentId: 'dept-4' },
    { id: 'pos-9', title: 'HR Officer', titleAr: 'موظف موارد بشرية', departmentId: 'dept-4' },
    { id: 'pos-10', title: 'Sales Manager', titleAr: 'مدير المبيعات', departmentId: 'dept-5' },
    { id: 'pos-11', title: 'Sales Executive', titleAr: 'تنفيذي مبيعات', departmentId: 'dept-5' },
    { id: 'pos-12', title: 'IT Manager', titleAr: 'مدير تقنية المعلومات', departmentId: 'dept-6' },
  ];

  // Leave Types
  readonly leaveTypes: LeaveType[] = [
    { id: 'lt-1', name: 'Annual Leave', nameAr: 'إجازة سنوية', annualAllowance: 30, carryForward: true, maxCarryForward: 15, requiresApproval: true, attachmentRequired: false, color: '#22C55E' },
    { id: 'lt-2', name: 'Sick Leave', nameAr: 'إجازة مرضية', annualAllowance: 15, carryForward: false, requiresApproval: true, attachmentRequired: true, color: '#F59E0B' },
    { id: 'lt-3', name: 'Emergency Leave', nameAr: 'إجازة طارئة', annualAllowance: 5, carryForward: false, requiresApproval: true, attachmentRequired: false, color: '#EF4444' },
    { id: 'lt-4', name: 'Maternity Leave', nameAr: 'إجازة أمومة', annualAllowance: 50, carryForward: false, requiresApproval: true, attachmentRequired: true, color: '#EC4899' },
    { id: 'lt-5', name: 'Paternity Leave', nameAr: 'إجازة أبوة', annualAllowance: 3, carryForward: false, requiresApproval: true, attachmentRequired: false, color: '#8B5CF6' },
    { id: 'lt-6', name: 'Unpaid Leave', nameAr: 'إجازة بدون راتب', annualAllowance: 0, carryForward: false, requiresApproval: true, attachmentRequired: false, color: '#6B7280' },
  ];

  // Currencies
  readonly currencies: Currency[] = [
    { code: 'OMR', name: 'Omani Rial', nameAr: 'ريال عماني', symbol: 'ر.ع.', decimalPlaces: 3, isActive: true, isBaseCurrency: true, rateToBase: 1, lastUpdated: new Date() },
    { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', decimalPlaces: 2, isActive: true, isBaseCurrency: false, rateToBase: 0.3845, lastUpdated: new Date() },
    { code: 'EUR', name: 'Euro', nameAr: 'يورو', symbol: '€', decimalPlaces: 2, isActive: true, isBaseCurrency: false, rateToBase: 0.4125, lastUpdated: new Date() },
    { code: 'GBP', name: 'British Pound', nameAr: 'جنيه إسترليني', symbol: '£', decimalPlaces: 2, isActive: true, isBaseCurrency: false, rateToBase: 0.4890, lastUpdated: new Date() },
    { code: 'INR', name: 'Indian Rupee', nameAr: 'روبية هندية', symbol: '₹', decimalPlaces: 2, isActive: true, isBaseCurrency: false, rateToBase: 0.0046, lastUpdated: new Date() },
    { code: 'CNY', name: 'Chinese Yuan', nameAr: 'يوان صيني', symbol: '¥', decimalPlaces: 2, isActive: true, isBaseCurrency: false, rateToBase: 0.0528, lastUpdated: new Date() },
    { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', decimalPlaces: 2, isActive: true, isBaseCurrency: false, rateToBase: 0.1047, lastUpdated: new Date() },
  ];

  // Bank Accounts
  readonly bankAccounts: BankAccount[] = [
    { id: 'bank-1', accountName: 'Bank Muscat - Main', accountNumber: '0123456789', bankName: 'Bank Muscat', currencyCode: 'OMR', balance: 89350.500, isActive: true },
    { id: 'bank-2', accountName: 'Bank Muscat - USD', accountNumber: '0123456790', bankName: 'Bank Muscat', currencyCode: 'USD', balance: 45200.00, isActive: true },
    { id: 'bank-3', accountName: 'NBO - Operations', accountNumber: '9876543210', bankName: 'National Bank of Oman', currencyCode: 'OMR', balance: 32150.750, isActive: true },
  ];

  // Employees
  readonly employees: Employee[] = [
    {
      id: 'emp-1', employeeId: 'EMP-0001', firstName: 'Ahmed', lastName: 'Al-Balushi', firstNameAr: 'أحمد', lastNameAr: 'البلوشي',
      gender: 'male', dateOfBirth: new Date(1988, 2, 22), nationality: 'Omani', nationalId: '12345678', maritalStatus: 'married',
      workEmail: 'ahmed.albalushi@opensky.om', personalEmail: 'ahmed.personal@gmail.com', phone: '+968 9123 4567',
      address: 'Villa 42, Al Khuwair, Muscat', emergencyContactName: 'Khalid Al-Balushi', emergencyContactRelation: 'Father', emergencyContactPhone: '+968 9234 5678',
      departmentId: 'dept-1', departmentName: 'Operations', departmentNameAr: 'العمليات', positionId: 'pos-1', positionTitle: 'Operations Manager', positionTitleAr: 'مدير العمليات',
      employmentType: 'full-time', joinDate: new Date(2020, 0, 15), status: 'active', basicSalary: 2500
    },
    {
      id: 'emp-2', employeeId: 'EMP-0002', firstName: 'Fatima', lastName: 'Al-Harthi', firstNameAr: 'فاطمة', lastNameAr: 'الحارثي',
      gender: 'female', dateOfBirth: new Date(1992, 5, 10), nationality: 'Omani', nationalId: '23456789', maritalStatus: 'single',
      workEmail: 'fatima.alharthi@opensky.om', phone: '+968 9234 5678',
      address: 'Apt 12, Ruwi, Muscat', emergencyContactName: 'Mohammed Al-Harthi', emergencyContactRelation: 'Brother', emergencyContactPhone: '+968 9345 6789',
      departmentId: 'dept-3', departmentName: 'Finance', departmentNameAr: 'المالية', positionId: 'pos-7', positionTitle: 'Accountant', positionTitleAr: 'محاسب',
      employmentType: 'full-time', joinDate: new Date(2021, 3, 1), status: 'active', basicSalary: 1800
    },
    {
      id: 'emp-3', employeeId: 'EMP-0003', firstName: 'Said', lastName: 'Al-Rashdi', firstNameAr: 'سعيد', lastNameAr: 'الراشدي',
      gender: 'male', dateOfBirth: new Date(1985, 8, 5), nationality: 'Omani', nationalId: '34567890', maritalStatus: 'married',
      workEmail: 'said.alrashdi@opensky.om', phone: '+968 9345 6789',
      address: 'House 8, Sohar', emergencyContactName: 'Salim Al-Rashdi', emergencyContactRelation: 'Father', emergencyContactPhone: '+968 9456 7890',
      departmentId: 'dept-4', departmentName: 'Human Resources', departmentNameAr: 'الموارد البشرية', positionId: 'pos-9', positionTitle: 'HR Officer', positionTitleAr: 'موظف موارد بشرية',
      employmentType: 'full-time', joinDate: new Date(2019, 6, 15), status: 'on-leave', basicSalary: 1600
    },
    {
      id: 'emp-4', employeeId: 'EMP-0004', firstName: 'Maryam', lastName: 'Al-Lawati', firstNameAr: 'مريم', lastNameAr: 'اللواتي',
      gender: 'female', dateOfBirth: new Date(1990, 11, 18), nationality: 'Omani', nationalId: '45678901', maritalStatus: 'married',
      workEmail: 'maryam.allawati@opensky.om', phone: '+968 9456 7890',
      address: 'Villa 15, Qurum, Muscat', emergencyContactName: 'Ali Al-Lawati', emergencyContactRelation: 'Husband', emergencyContactPhone: '+968 9567 8901',
      departmentId: 'dept-3', departmentName: 'Finance', departmentNameAr: 'المالية', positionId: 'pos-5', positionTitle: 'Finance Manager', positionTitleAr: 'مدير المالية',
      employmentType: 'full-time', joinDate: new Date(2018, 2, 1), status: 'active', basicSalary: 3200
    },
    {
      id: 'emp-5', employeeId: 'EMP-0005', firstName: 'Mohammed', lastName: 'Al-Said', firstNameAr: 'محمد', lastNameAr: 'السعيدي',
      gender: 'male', dateOfBirth: new Date(1980, 3, 12), nationality: 'Omani', nationalId: '56789012', maritalStatus: 'married',
      workEmail: 'mohammed.alsaid@opensky.om', phone: '+968 9567 8901',
      address: 'Villa 88, Al Mouj, Muscat', emergencyContactName: 'Saif Al-Said', emergencyContactRelation: 'Brother', emergencyContactPhone: '+968 9678 9012',
      departmentId: 'dept-1', departmentName: 'Operations', departmentNameAr: 'العمليات', positionId: 'pos-1', positionTitle: 'Operations Director', positionTitleAr: 'مدير العمليات',
      managerId: 'emp-1', managerName: 'Ahmed Al-Balushi', employmentType: 'full-time', joinDate: new Date(2015, 0, 1), status: 'active', basicSalary: 4500
    },
    {
      id: 'emp-6', employeeId: 'EMP-0006', firstName: 'Aisha', lastName: 'Al-Maskari', firstNameAr: 'عائشة', lastNameAr: 'المسكري',
      gender: 'female', dateOfBirth: new Date(1987, 7, 25), nationality: 'Omani', nationalId: '67890123', maritalStatus: 'single',
      workEmail: 'aisha.almaskari@opensky.om', phone: '+968 9678 9012',
      address: 'Apt 5, MBD, Muscat', emergencyContactName: 'Salma Al-Maskari', emergencyContactRelation: 'Mother', emergencyContactPhone: '+968 9789 0123',
      departmentId: 'dept-4', departmentName: 'Human Resources', departmentNameAr: 'الموارد البشرية', positionId: 'pos-8', positionTitle: 'HR Manager', positionTitleAr: 'مدير الموارد البشرية',
      employmentType: 'full-time', joinDate: new Date(2017, 5, 1), status: 'active', basicSalary: 2800
    },
    {
      id: 'emp-7', employeeId: 'EMP-0007', firstName: 'Khalid', lastName: 'Al-Busaidi', firstNameAr: 'خالد', lastNameAr: 'البوسعيدي',
      gender: 'male', dateOfBirth: new Date(1993, 1, 8), nationality: 'Omani', nationalId: '78901234', maritalStatus: 'single',
      workEmail: 'khalid.albusaidi@opensky.om', phone: '+968 9789 0123',
      address: 'Room 12, Staff Housing, Muscat', emergencyContactName: 'Hamad Al-Busaidi', emergencyContactRelation: 'Father', emergencyContactPhone: '+968 9890 1234',
      departmentId: 'dept-5', departmentName: 'Sales', departmentNameAr: 'المبيعات', positionId: 'pos-11', positionTitle: 'Sales Executive', positionTitleAr: 'تنفيذي مبيعات',
      employmentType: 'full-time', joinDate: new Date(2022, 8, 1), status: 'probation', probationEndDate: new Date(2023, 2, 1), basicSalary: 1200
    },
    {
      id: 'emp-8', employeeId: 'EMP-0008', firstName: 'Sara', lastName: 'Al-Kindi', firstNameAr: 'سارة', lastNameAr: 'الكندي',
      gender: 'female', dateOfBirth: new Date(1995, 9, 30), nationality: 'Omani', nationalId: '89012345', maritalStatus: 'single',
      workEmail: 'sara.alkindi@opensky.om', phone: '+968 9890 1234',
      address: 'Apt 8, Ghubrah, Muscat', emergencyContactName: 'Nasser Al-Kindi', emergencyContactRelation: 'Father', emergencyContactPhone: '+968 9901 2345',
      departmentId: 'dept-6', departmentName: 'IT', departmentNameAr: 'تقنية المعلومات', positionId: 'pos-12', positionTitle: 'IT Specialist', positionTitleAr: 'أخصائي تقنية المعلومات',
      employmentType: 'full-time', joinDate: new Date(2023, 0, 15), status: 'active', basicSalary: 1500
    },
  ];

  // Customers
  readonly customers: Customer[] = [
    { id: 'cust-1', name: 'Al-Maha Trading LLC', nameAr: 'المها للتجارة', email: 'info@almahatrading.om', phone: '+968 2456 7890', address: 'P.O. Box 123, Muscat', city: 'Muscat', country: 'Oman', vatNumber: 'OM1234567' },
    { id: 'cust-2', name: 'Gulf Imports Co.', nameAr: 'شركة الخليج للاستيراد', email: 'orders@gulfimports.ae', phone: '+971 4 567 8901', address: 'Office 45, Business Bay', city: 'Dubai', country: 'UAE', vatNumber: 'AE987654321' },
    { id: 'cust-3', name: 'Oman Wholesale', nameAr: 'عمان للجملة', email: 'sales@omanwholesale.om', phone: '+968 2567 8901', address: 'Industrial Area, Sohar', city: 'Sohar', country: 'Oman', vatNumber: 'OM2345678' },
    { id: 'cust-4', name: 'Salalah Trading', nameAr: 'صلالة للتجارة', email: 'contact@salalahtrading.om', phone: '+968 2345 6789', address: 'P.O. Box 456, Salalah', city: 'Salalah', country: 'Oman', vatNumber: 'OM3456789' },
    { id: 'cust-5', name: 'Dubai Exports FZE', nameAr: 'دبي للتصدير', email: 'export@dubaiexports.ae', phone: '+971 4 678 9012', address: 'JAFZA, Dubai', city: 'Dubai', country: 'UAE', vatNumber: 'AE123456789' },
  ];

  // Suppliers
  readonly suppliers: Supplier[] = [
    { id: 'sup-1', name: 'Shanghai Industrial Co.', nameAr: 'شنغهاي الصناعية', email: 'sales@shanghai-ind.cn', phone: '+86 21 1234 5678', address: 'Pudong District', city: 'Shanghai', country: 'China' },
    { id: 'sup-2', name: 'Mumbai Exports Pvt Ltd', nameAr: 'مومباي للتصدير', email: 'orders@mumbaiexports.in', phone: '+91 22 2345 6789', address: 'Andheri East', city: 'Mumbai', country: 'India' },
    { id: 'sup-3', name: 'European Machinery GmbH', nameAr: 'المعدات الأوروبية', email: 'info@euromachinery.de', phone: '+49 30 3456 7890', address: 'Industriestr 45', city: 'Berlin', country: 'Germany' },
    { id: 'sup-4', name: 'American Parts Inc.', nameAr: 'أمريكان للقطع', email: 'parts@americanparts.us', phone: '+1 555 456 7890', address: '123 Industrial Blvd', city: 'Houston', country: 'USA' },
  ];

  // Invoices
  readonly invoices: Invoice[] = [
    {
      id: 'inv-1', invoiceNumber: 'INV-2024-0156', type: 'invoice', customerId: 'cust-1', customerName: 'Al-Maha Trading LLC',
      customerAddress: 'P.O. Box 123, Muscat, Oman', invoiceDate: new Date(2024, 11, 15), dueDate: new Date(2025, 0, 14),
      currencyCode: 'OMR', exchangeRate: 1, subtotal: 4950, taxAmount: 247.50, totalAmount: 5197.50,
      subtotalBase: 4950, taxAmountBase: 247.50, totalAmountBase: 5197.50, amountPaid: 0, balanceDue: 5197.50,
      status: 'open', lineItems: [
        { id: 'li-1', description: 'Industrial Pumps P-200', quantity: 10, unitPrice: 450, amount: 4500 },
        { id: 'li-2', description: 'Installation Kit', quantity: 10, unitPrice: 35, amount: 350 },
        { id: 'li-3', description: 'Delivery Charges', quantity: 1, unitPrice: 100, amount: 100 },
      ], createdBy: 'Ahmed', createdAt: new Date(2024, 11, 15)
    },
    {
      id: 'inv-2', invoiceNumber: 'INV-2024-0155', type: 'invoice', customerId: 'cust-2', customerName: 'Gulf Imports Co.',
      customerAddress: 'Office 45, Business Bay, Dubai, UAE', invoiceDate: new Date(2024, 11, 14), dueDate: new Date(2025, 0, 13),
      currencyCode: 'USD', exchangeRate: 0.3845, subtotal: 8000, taxAmount: 400, totalAmount: 8400,
      subtotalBase: 3076, taxAmountBase: 153.80, totalAmountBase: 3229.80, amountPaid: 0, balanceDue: 8400,
      status: 'open', lineItems: [
        { id: 'li-4', description: 'Industrial Valves 2"', quantity: 100, unitPrice: 50, amount: 5000 },
        { id: 'li-5', description: 'Pipe Fittings Set', quantity: 200, unitPrice: 15, amount: 3000 },
      ], createdBy: 'Fatima', createdAt: new Date(2024, 11, 14)
    },
    {
      id: 'inv-3', invoiceNumber: 'INV-2024-0154', type: 'invoice', customerId: 'cust-3', customerName: 'Oman Wholesale',
      customerAddress: 'Industrial Area, Sohar, Oman', invoiceDate: new Date(2024, 11, 12), dueDate: new Date(2024, 11, 12),
      currencyCode: 'OMR', exchangeRate: 1, subtotal: 3571.43, taxAmount: 178.57, totalAmount: 3750,
      subtotalBase: 3571.43, taxAmountBase: 178.57, totalAmountBase: 3750, amountPaid: 3750, balanceDue: 0,
      status: 'paid', lineItems: [
        { id: 'li-6', description: 'Electrical Cables (500m)', quantity: 5, unitPrice: 500, amount: 2500 },
        { id: 'li-7', description: 'Junction Boxes', quantity: 50, unitPrice: 21.43, amount: 1071.43 },
      ], createdBy: 'Ahmed', createdAt: new Date(2024, 11, 12)
    },
    {
      id: 'inv-4', invoiceNumber: 'INV-2024-0153', type: 'invoice', customerId: 'cust-4', customerName: 'Salalah Trading',
      customerAddress: 'P.O. Box 456, Salalah, Oman', invoiceDate: new Date(2024, 11, 10), dueDate: new Date(2024, 10, 10),
      currencyCode: 'OMR', exchangeRate: 1, subtotal: 5809.52, taxAmount: 290.48, totalAmount: 6100,
      subtotalBase: 5809.52, taxAmountBase: 290.48, totalAmountBase: 6100, amountPaid: 0, balanceDue: 6100,
      status: 'overdue', lineItems: [
        { id: 'li-8', description: 'Hydraulic Systems', quantity: 2, unitPrice: 2500, amount: 5000 },
        { id: 'li-9', description: 'Maintenance Kit', quantity: 4, unitPrice: 202.38, amount: 809.52 },
      ], createdBy: 'Fatima', createdAt: new Date(2024, 11, 10)
    },
    {
      id: 'inv-5', invoiceNumber: 'INV-2024-0152', type: 'invoice', customerId: 'cust-5', customerName: 'Dubai Exports FZE',
      customerAddress: 'JAFZA, Dubai, UAE', invoiceDate: new Date(2024, 11, 8), dueDate: new Date(2025, 0, 7),
      currencyCode: 'USD', exchangeRate: 0.3845, subtotal: 12000, taxAmount: 0, totalAmount: 12000,
      subtotalBase: 4614, taxAmountBase: 0, totalAmountBase: 4614, amountPaid: 4000, balanceDue: 8000,
      status: 'partial', lineItems: [
        { id: 'li-10', description: 'Industrial Motors', quantity: 6, unitPrice: 2000, amount: 12000 },
      ], createdBy: 'Ahmed', createdAt: new Date(2024, 11, 8)
    },
  ];

  // Bills
  readonly bills: Bill[] = [
    {
      id: 'bill-1', billNumber: 'BILL-2024-0234', supplierId: 'sup-1', supplierName: 'Shanghai Industrial Co.',
      billDate: new Date(2024, 11, 16), dueDate: new Date(2025, 0, 15),
      currencyCode: 'CNY', exchangeRate: 0.0528, subtotal: 150000, taxAmount: 0, totalAmount: 150000,
      amountPaid: 0, balanceDue: 150000, status: 'open', lineItems: [
        { id: 'bli-1', description: 'Valves & Fittings Batch', quantity: 1, unitPrice: 150000, amount: 150000 },
      ]
    },
    {
      id: 'bill-2', billNumber: 'BILL-2024-0233', supplierId: 'sup-2', supplierName: 'Mumbai Exports Pvt Ltd',
      billDate: new Date(2024, 11, 14), dueDate: new Date(2024, 11, 21),
      currencyCode: 'INR', exchangeRate: 0.0046, subtotal: 500000, taxAmount: 90000, totalAmount: 590000,
      amountPaid: 0, balanceDue: 590000, status: 'open', lineItems: [
        { id: 'bli-2', description: 'Textile Raw Materials', quantity: 1, unitPrice: 500000, amount: 500000, taxRate: 18, taxAmount: 90000 },
      ]
    },
    {
      id: 'bill-3', billNumber: 'BILL-2024-0232', supplierId: 'sup-3', supplierName: 'European Machinery GmbH',
      billDate: new Date(2024, 11, 10), dueDate: new Date(2025, 1, 10),
      currencyCode: 'EUR', exchangeRate: 0.4125, subtotal: 25000, taxAmount: 4750, totalAmount: 29750,
      amountPaid: 29750, balanceDue: 0, status: 'paid', lineItems: [
        { id: 'bli-3', description: 'CNC Machine Parts', quantity: 1, unitPrice: 25000, amount: 25000, taxRate: 19, taxAmount: 4750 },
      ]
    },
  ];

  // Payments
  readonly payments: Payment[] = [
    {
      id: 'pay-1', paymentNumber: 'PAY-2024-0089', type: 'received', customerId: 'cust-3', customerName: 'Oman Wholesale',
      paymentDate: new Date(2024, 11, 12), paymentMethod: 'bank_transfer', referenceNumber: 'TRF-12345678',
      currencyCode: 'OMR', exchangeRate: 1, amount: 3750, amountBase: 3750,
      invoiceId: 'inv-3', invoiceNumber: 'INV-2024-0154', createdAt: new Date(2024, 11, 12)
    },
    {
      id: 'pay-2', paymentNumber: 'PAY-2024-0088', type: 'received', customerId: 'cust-5', customerName: 'Dubai Exports FZE',
      paymentDate: new Date(2024, 11, 10), paymentMethod: 'bank_transfer', referenceNumber: 'TRF-23456789',
      currencyCode: 'USD', exchangeRate: 0.3845, amount: 4000, amountBase: 1538,
      invoiceId: 'inv-5', invoiceNumber: 'INV-2024-0152', createdAt: new Date(2024, 11, 10)
    },
    {
      id: 'pay-3', paymentNumber: 'PAY-2024-0090', type: 'made', supplierId: 'sup-3', supplierName: 'European Machinery GmbH',
      paymentDate: new Date(2024, 11, 11), paymentMethod: 'bank_transfer', referenceNumber: 'TRF-34567890',
      currencyCode: 'EUR', exchangeRate: 0.4125, amount: 29750, amountBase: 12271.875,
      invoiceId: 'bill-3', invoiceNumber: 'BILL-2024-0232', createdAt: new Date(2024, 11, 11)
    },
  ];

  // Leave Requests
  readonly leaveRequests: LeaveRequest[] = [
    {
      id: 'lr-1', employeeId: 'emp-1', employeeName: 'Ahmed Al-Balushi', employeeNameAr: 'أحمد البلوشي', departmentName: 'Operations',
      leaveTypeId: 'lt-1', leaveTypeName: 'Annual Leave', leaveTypeNameAr: 'إجازة سنوية',
      startDate: new Date(2024, 11, 20), endDate: new Date(2024, 11, 24), totalDays: 5,
      reason: 'Family vacation - traveling to visit relatives', status: 'pending',
      approverId: 'emp-5', approverName: 'Mohammed Al-Said', createdAt: new Date(2024, 11, 15)
    },
    {
      id: 'lr-2', employeeId: 'emp-2', employeeName: 'Fatima Al-Harthi', employeeNameAr: 'فاطمة الحارثي', departmentName: 'Finance',
      leaveTypeId: 'lt-2', leaveTypeName: 'Sick Leave', leaveTypeNameAr: 'إجازة مرضية',
      startDate: new Date(2024, 11, 18), endDate: new Date(2024, 11, 18), totalDays: 1,
      reason: 'Medical appointment', status: 'pending',
      approverId: 'emp-4', approverName: 'Maryam Al-Lawati', createdAt: new Date(2024, 11, 17)
    },
    {
      id: 'lr-3', employeeId: 'emp-3', employeeName: 'Said Al-Rashdi', employeeNameAr: 'سعيد الراشدي', departmentName: 'Human Resources',
      leaveTypeId: 'lt-1', leaveTypeName: 'Annual Leave', leaveTypeNameAr: 'إجازة سنوية',
      startDate: new Date(2024, 11, 15), endDate: new Date(2024, 11, 19), totalDays: 5,
      reason: 'Personal matters', status: 'approved',
      approverId: 'emp-6', approverName: 'Aisha Al-Maskari', approvedAt: new Date(2024, 11, 14), createdAt: new Date(2024, 11, 12)
    },
    {
      id: 'lr-4', employeeId: 'emp-7', employeeName: 'Khalid Al-Busaidi', employeeNameAr: 'خالد البوسعيدي', departmentName: 'Sales',
      leaveTypeId: 'lt-3', leaveTypeName: 'Emergency Leave', leaveTypeNameAr: 'إجازة طارئة',
      startDate: new Date(2024, 11, 10), endDate: new Date(2024, 11, 10), totalDays: 1,
      reason: 'Family emergency', status: 'approved',
      approverId: 'emp-5', approverName: 'Mohammed Al-Said', approvedAt: new Date(2024, 11, 10), createdAt: new Date(2024, 11, 10)
    },
  ];

  // Leave Balances
  readonly leaveBalances: LeaveBalance[] = [
    { id: 'lb-1', employeeId: 'emp-1', leaveTypeId: 'lt-1', leaveTypeName: 'Annual Leave', leaveTypeNameAr: 'إجازة سنوية', year: 2024, entitled: 30, carriedForward: 5, taken: 12, pending: 5, remaining: 18, color: '#22C55E' },
    { id: 'lb-2', employeeId: 'emp-1', leaveTypeId: 'lt-2', leaveTypeName: 'Sick Leave', leaveTypeNameAr: 'إجازة مرضية', year: 2024, entitled: 15, carriedForward: 0, taken: 3, pending: 0, remaining: 12, color: '#F59E0B' },
    { id: 'lb-3', employeeId: 'emp-1', leaveTypeId: 'lt-3', leaveTypeName: 'Emergency Leave', leaveTypeNameAr: 'إجازة طارئة', year: 2024, entitled: 5, carriedForward: 0, taken: 1, pending: 0, remaining: 4, color: '#EF4444' },
    { id: 'lb-4', employeeId: 'emp-2', leaveTypeId: 'lt-1', leaveTypeName: 'Annual Leave', leaveTypeNameAr: 'إجازة سنوية', year: 2024, entitled: 30, carriedForward: 0, taken: 8, pending: 0, remaining: 22, color: '#22C55E' },
    { id: 'lb-5', employeeId: 'emp-2', leaveTypeId: 'lt-2', leaveTypeName: 'Sick Leave', leaveTypeNameAr: 'إجازة مرضية', year: 2024, entitled: 15, carriedForward: 0, taken: 2, pending: 1, remaining: 12, color: '#F59E0B' },
  ];

  // Activity Logs
  readonly activityLogs: ActivityLog[] = [
    { id: 'act-1', type: 'employee', action: 'New hire', actionAr: 'موظف جديد', description: 'Sara Al-Kindi joined IT department', descriptionAr: 'انضمت سارة الكندي لقسم تقنية المعلومات', userId: 'emp-6', userName: 'Aisha Al-Maskari', timestamp: new Date(2024, 11, 18, 10, 30) },
    { id: 'act-2', type: 'leave', action: 'Leave approved', actionAr: 'تمت الموافقة على الإجازة', description: 'Annual leave approved for Said Al-Rashdi', descriptionAr: 'تمت الموافقة على الإجازة السنوية لسعيد الراشدي', userId: 'emp-6', userName: 'Aisha Al-Maskari', timestamp: new Date(2024, 11, 17, 14, 15) },
    { id: 'act-3', type: 'employee', action: 'Profile updated', actionAr: 'تم تحديث الملف', description: 'Ahmed Al-Balushi updated contact information', descriptionAr: 'حدّث أحمد البلوشي معلومات الاتصال', userId: 'emp-1', userName: 'Ahmed Al-Balushi', timestamp: new Date(2024, 11, 16, 9, 45) },
    { id: 'act-4', type: 'invoice', action: 'Invoice created', actionAr: 'تم إنشاء فاتورة', description: 'Invoice INV-2024-0156 created for Al-Maha Trading', descriptionAr: 'تم إنشاء الفاتورة INV-2024-0156 لشركة المها للتجارة', userId: 'emp-1', userName: 'Ahmed', timestamp: new Date(2024, 11, 15, 14, 32) },
    { id: 'act-5', type: 'payment', action: 'Payment received', actionAr: 'تم استلام دفعة', description: 'Payment received from Oman Wholesale - OMR 3,750', descriptionAr: 'تم استلام دفعة من عمان للجملة - 3,750 ر.ع.', userId: 'emp-2', userName: 'Fatima', timestamp: new Date(2024, 11, 12, 11, 20) },
  ];

  // Upcoming Events
  readonly upcomingEvents: UpcomingEvent[] = [
    { id: 'evt-1', type: 'birthday', title: "Ali's Birthday", titleAr: 'عيد ميلاد علي', date: new Date(2024, 11, 20), employeeId: 'emp-9', employeeName: 'Ali Al-Hinai' },
    { id: 'evt-2', type: 'birthday', title: "Maryam's Birthday", titleAr: 'عيد ميلاد مريم', date: new Date(2024, 11, 22), employeeId: 'emp-4', employeeName: 'Maryam Al-Lawati' },
    { id: 'evt-3', type: 'holiday', title: 'Christmas Holiday', titleAr: 'عطلة الكريسماس', date: new Date(2024, 11, 25) },
    { id: 'evt-4', type: 'anniversary', title: "Said's Work Anniversary (5 years)", titleAr: 'ذكرى عمل سعيد (5 سنوات)', date: new Date(2025, 0, 1), employeeId: 'emp-3', employeeName: 'Said Al-Rashdi' },
    { id: 'evt-5', type: 'leave', title: 'Ahmed on leave', titleAr: 'أحمد في إجازة', date: new Date(2024, 11, 20), employeeId: 'emp-1', employeeName: 'Ahmed Al-Balushi' },
  ];

  // Dashboard Stats
  getHRDashboardStats(): HRDashboardStats {
    return {
      totalEmployees: 156,
      presentToday: 148,
      onLeave: 8,
      pendingRequests: 5,
      newHires: 3,
      departmentHeadcount: this.departments.map(d => ({ name: d.name, nameAr: d.nameAr, count: d.employeeCount }))
    };
  }

  getFinanceDashboardStats(): FinanceDashboardStats {
    return {
      revenue: 125450,
      revenueChange: 12.5,
      receivables: 45200,
      receivablesCount: 15,
      payables: 32100,
      payablesCount: 8,
      cashPosition: 89350,
      cashChange: 18.2
    };
  }

  // AR Aging Report
  getARAgingReport(): AgingReport[] {
    return [
      { customerId: 'cust-1', customerName: 'Al-Maha Trading', buckets: { current: 5200, days1to30: 2100, days31to60: 0, days61to90: 0, over90: 0, total: 7300 } },
      { customerId: 'cust-2', customerName: 'Gulf Imports', buckets: { current: 8400, days1to30: 0, days31to60: 1500, days61to90: 0, over90: 0, total: 9900 } },
      { customerId: 'cust-4', customerName: 'Salalah Trading', buckets: { current: 0, days1to30: 3200, days31to60: 2650, days61to90: 1450, over90: 850, total: 8150 } },
      { customerId: 'cust-3', customerName: 'Oman Wholesale', buckets: { current: 6850, days1to30: 0, days31to60: 0, days61to90: 0, over90: 0, total: 6850 } },
      { customerId: 'cust-5', customerName: 'Dubai Exports', buckets: { current: 8000, days1to30: 3420, days31to60: 0, days61to90: 0, over90: 0, total: 11420 } },
    ];
  }

  // AP Aging Report
  getAPAgingReport(): AgingReport[] {
    return [
      { supplierId: 'sup-1', supplierName: 'Shanghai Industrial', buckets: { current: 7920, days1to30: 0, days31to60: 0, days61to90: 0, over90: 0, total: 7920 } },
      { supplierId: 'sup-2', supplierName: 'Mumbai Exports', buckets: { current: 2714, days1to30: 0, days31to60: 0, days61to90: 0, over90: 0, total: 2714 } },
    ];
  }

  // Revenue Trend (last 6 months)
  getRevenueTrend(): { month: string; amount: number }[] {
    return [
      { month: 'Jul', amount: 98500 },
      { month: 'Aug', amount: 112300 },
      { month: 'Sep', amount: 105800 },
      { month: 'Oct', amount: 118900 },
      { month: 'Nov', amount: 108200 },
      { month: 'Dec', amount: 125450 },
    ];
  }

  // Search & Filter Methods
  searchEmployees(query: string, filters?: { department?: string; status?: string }): Employee[] {
    let results = this.employees;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(e =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.workEmail.toLowerCase().includes(q) ||
        (e.firstNameAr && e.firstNameAr.includes(query)) ||
        (e.lastNameAr && e.lastNameAr.includes(query))
      );
    }

    if (filters?.department) {
      results = results.filter(e => e.departmentId === filters.department);
    }

    if (filters?.status) {
      results = results.filter(e => e.status === filters.status);
    }

    return results;
  }

  searchInvoices(query: string, filters?: { status?: string; customer?: string }): Invoice[] {
    let results = this.invoices;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q)
      );
    }

    if (filters?.status) {
      results = results.filter(i => i.status === filters.status);
    }

    if (filters?.customer) {
      results = results.filter(i => i.customerId === filters.customer);
    }

    return results;
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices.find(i => i.id === id);
  }

  getLeaveBalancesForEmployee(employeeId: string): LeaveBalance[] {
    return this.leaveBalances.filter(lb => lb.employeeId === employeeId);
  }

  getLeaveRequestsForEmployee(employeeId: string): LeaveRequest[] {
    return this.leaveRequests.filter(lr => lr.employeeId === employeeId);
  }
}
