# OpenSky ERP - HR Module PRD

## Document Information
| Field | Value |
|-------|-------|
| Project | OpenSky International ERP |
| Module | Human Resources (HR) |
| Version | 1.0 |
| Date | December 2024 |
| Status | Draft |

---

## 1. Executive Summary

### 1.1 Purpose
Build a comprehensive Human Resources module for OpenSky International that manages the complete employee lifecycle - from onboarding to offboarding - with intuitive self-service capabilities and powerful administrative tools.

### 1.2 Target Users
| User Role | Primary Needs |
|-----------|--------------|
| **HR Manager** | Full employee management, reporting, compliance |
| **Department Head** | Team oversight, leave approvals, performance |
| **Employee** | Self-service portal, leave requests, documents |
| **Finance** | Payroll data, cost centers, headcount |
| **Executive** | Headcount analytics, org health metrics |

### 1.3 Business Value
- Eliminate manual HR processes and paperwork
- Reduce leave management overhead by 80%
- Centralize employee data as single source of truth
- Enable data-driven workforce decisions
- Improve employee satisfaction through self-service

---

## 2. Module Overview

### 2.1 Feature Map

```
HR Module
├── Employee Management
│   ├── Employee Directory
│   ├── Employee Profiles
│   ├── Organization Chart
│   └── Document Management
│
├── Leave Management
│   ├── Leave Policies
│   ├── Leave Requests
│   ├── Leave Calendar
│   └── Leave Balances
│
├── Attendance
│   ├── Check-in/Check-out
│   ├── Timesheets
│   └── Attendance Reports
│
├── Employee Self-Service
│   ├── My Profile
│   ├── My Leave
│   ├── My Documents
│   └── My Team (Managers)
│
└── HR Administration
    ├── Departments & Positions
    ├── Employment Types
    ├── Leave Policy Setup
    └── HR Reports & Analytics
```

### 2.2 Module Navigation Structure

```
Sidebar → HR
├── Dashboard
├── Employees
│   ├── Directory
│   ├── Add Employee
│   └── Org Chart
├── Leave
│   ├── Requests
│   ├── Calendar
│   └── Policies
├── Attendance
│   ├── Daily Log
│   └── Timesheets
├── Self-Service
│   ├── My Profile
│   ├── My Leave
│   └── My Documents
└── Settings
    ├── Departments
    ├── Positions
    └── Leave Types
```

---

## 3. Detailed Features

### 3.1 HR Dashboard

#### 3.1.1 Overview
Central command center displaying key HR metrics and actionable items.

#### 3.1.2 UI Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│ HR Dashboard                                            [This Month ▼]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ 👥 156       │ │ 🟢 148       │ │ 🏖️ 8         │ │ 📋 5         │   │
│  │ Total Staff  │ │ Present Today│ │ On Leave     │ │ Pending      │   │
│  │ +3 this month│ │ 94.8%        │ │ 5.2%         │ │ Requests     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────┐ ┌─────────────────────────────┐│
│  │ Headcount by Department             │ │ Pending Approvals           ││
│  │                                     │ │                             ││
│  │  Operations    ████████████ 45     │ │ [!] Annual Leave - Ahmed    ││
│  │  Logistics     █████████ 38        │ │     Dec 20-24 (5 days)      ││
│  │  Finance       ██████ 28           │ │     [Approve] [Reject]      ││
│  │  HR            ███ 15              │ │                             ││
│  │  Sales         ████████ 30         │ │ [!] Sick Leave - Fatima     ││
│  │                                     │ │     Dec 18 (1 day)          ││
│  └─────────────────────────────────────┘ │     [Approve] [Reject]      ││
│                                          └─────────────────────────────┘│
│  ┌─────────────────────────────────────┐ ┌─────────────────────────────┐│
│  │ Upcoming Events                     │ │ Recent Activity             ││
│  │                                     │ │                             ││
│  │ 🎂 Dec 20 - Ali's Birthday         │ │ • New hire: Sarah joined    ││
│  │ 🎂 Dec 22 - Maryam's Birthday      │ │ • Leave approved: Mohamed   ││
│  │ 📅 Dec 25 - Public Holiday         │ │ • Profile updated: Ahmed    ││
│  │ 🎉 Jan 1 - Work Anniversary (Said) │ │ • Document added: HR Policy ││
│  └─────────────────────────────────────┘ └─────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.1.3 Components

**Stat Cards (Top Row)**
| Metric | Icon | Description | Click Action |
|--------|------|-------------|--------------|
| Total Staff | 👥 | Active employee count | → Employee Directory |
| Present Today | 🟢 | Checked-in today | → Attendance Log |
| On Leave | 🏖️ | Currently on leave | → Leave Calendar |
| Pending Requests | 📋 | Awaiting approval | → Leave Requests |

**Headcount Chart**
- Horizontal bar chart by department
- Hover shows exact count + percentage
- Click department → filtered directory

**Pending Approvals Widget**
- Show top 5 pending leave requests
- Quick approve/reject buttons
- "View All" link to full list

**Upcoming Events**
- Birthdays (next 7 days)
- Work anniversaries
- Public holidays
- Company events

**Recent Activity Feed**
- Last 10 HR-related activities
- New hires, leaves, updates
- Timestamp + actor

---

### 3.2 Employee Directory

#### 3.2.1 Overview
Searchable, filterable list of all employees with quick access to profiles.

#### 3.2.2 UI Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Employees                                            [+ Add Employee]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [🔍 Search by name, email, ID...]  [Department ▼] [Status ▼] [⚙️]     │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ [☐]│ Employee          │ Department  │ Position      │ Status │ ⋮ │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ [☐]│ [👤] Ahmed Al-B.  │ Operations  │ Manager       │ 🟢 Active│ ⋮ │ │
│  │    │ ahmed@opensky.om  │             │               │         │   │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ [☐]│ [👤] Fatima H.    │ Finance     │ Accountant    │ 🟢 Active│ ⋮ │ │
│  │    │ fatima@opensky.om │             │               │         │   │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ [☐]│ [👤] Said Al-R.   │ HR          │ HR Officer    │ 🟡 Leave │ ⋮ │ │
│  │    │ said@opensky.om   │             │               │         │   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Showing 1-25 of 156 employees        [◀] 1 2 3 4 5 6 7 [▶]            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.3 Features

**Search & Filters**
| Filter | Type | Options |
|--------|------|---------|
| Search | Text | Name, Email, Employee ID |
| Department | Multi-select | All departments |
| Status | Multi-select | Active, On Leave, Probation, Terminated |
| Position | Multi-select | All positions |
| Employment Type | Multi-select | Full-time, Part-time, Contract |
| Join Date | Date range | From - To |

**Table Columns**
| Column | Content | Sortable |
|--------|---------|----------|
| Checkbox | Bulk selection | No |
| Employee | Avatar + Name + Email | Yes (Name) |
| Department | Department name | Yes |
| Position | Job title | Yes |
| Status | Badge (Active/Leave/etc.) | Yes |
| Actions | Dropdown menu | No |

**Row Actions (⋮ Menu)**
- View Profile
- Edit Employee
- View Documents
- Change Status
- Export Details

**Bulk Actions (when selected)**
- Export Selected
- Send Email
- Change Department

---

### 3.3 Employee Profile

#### 3.3.1 Overview
Comprehensive employee information page with tabbed sections.

#### 3.3.2 UI Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Directory                                    [Edit] [⋮ More]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                                                                     ││
│  │  [    👤    ]   Ahmed Al-Balushi                                   ││
│  │  [ Avatar  ]   Operations Manager                                  ││
│  │  [  120px  ]   Operations Department                               ││
│  │                                                                     ││
│  │  📧 ahmed@opensky.om    📱 +968 9123 4567    📍 Head Office        ││
│  │                                                                     ││
│  │  [🟢 Active]  [📅 Joined: Jan 15, 2020]  [🎂 Mar 22]              ││
│  │                                                                     ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ [Personal] [Employment] [Leave] [Documents] [Activity]              ││
│  ├─────────────────────────────────────────────────────────────────────┤│
│  │                                                                     ││
│  │  Personal Information                                [Edit Section] ││
│  │  ─────────────────────────────────────────────────                 ││
│  │                                                                     ││
│  │  Full Name         Ahmed bin Khalid Al-Balushi                     ││
│  │  Employee ID       EMP-0042                                        ││
│  │  Gender            Male                                            ││
│  │  Date of Birth     March 22, 1988                                  ││
│  │  Nationality       Omani                                           ││
│  │  National ID       12345678                                        ││
│  │  Marital Status    Married                                         ││
│  │                                                                     ││
│  │  Contact Information                                               ││
│  │  ─────────────────────────────────────────────────                 ││
│  │                                                                     ││
│  │  Personal Email    ahmed.personal@gmail.com                        ││
│  │  Phone             +968 9123 4567                                  ││
│  │  Address           Villa 42, Al Khuwair, Muscat                    ││
│  │                                                                     ││
│  │  Emergency Contact                                                 ││
│  │  ─────────────────────────────────────────────────                 ││
│  │                                                                     ││
│  │  Name              Khalid Al-Balushi (Father)                      ││
│  │  Phone             +968 9234 5678                                  ││
│  │                                                                     ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.3.3 Profile Tabs

**Tab: Personal**
| Section | Fields |
|---------|--------|
| Basic Info | Full Name, Employee ID, Gender, DOB, Nationality, National ID, Marital Status |
| Contact | Personal Email, Phone, Address |
| Emergency | Contact Name, Relationship, Phone |

**Tab: Employment**
| Section | Fields |
|---------|--------|
| Current Position | Job Title, Department, Reports To, Work Location |
| Employment Details | Employee Type, Join Date, Probation End, Contract Type |
| Compensation | Basic Salary, Allowances, Bank Details (masked) |
| Work History | Previous positions within company (timeline) |

**Tab: Leave**
| Section | Content |
|---------|---------|
| Balances | Visual display of all leave types with used/remaining |
| History | Table of past leave requests with status |
| Calendar | Personal leave calendar view |

**Tab: Documents**
| Section | Content |
|---------|---------|
| Categories | ID Documents, Contracts, Certificates, Other |
| Document List | Filename, Type, Upload Date, Actions (View/Download) |
| Upload | Drag & drop upload interface |

**Tab: Activity**
| Content |
|---------|
| Audit log of all changes to employee record |
| Timeline format with actor, action, timestamp |

---

### 3.4 Leave Management

#### 3.4.1 Leave Request Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Submit    │───▶│   Pending   │───▶│  Approved/  │───▶│  Completed  │
│   Request   │    │   Review    │    │  Rejected   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                   │                  │
     │              [Manager]          [Notification]
     │                   │                  │
     └──[Auto-check]─────┴──────────────────┘
       • Balance
       • Conflicts
       • Policy
```

#### 3.4.2 Leave Request Form
```
┌─────────────────────────────────────────────────────────────────────────┐
│ New Leave Request                                                   [×] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Leave Type *                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Annual Leave                                               [▼]  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │ Start Date *            │  │ End Date *              │              │
│  │ ┌───────────────────┐   │  │ ┌───────────────────┐   │              │
│  │ │ 📅 Dec 20, 2024   │   │  │ │ 📅 Dec 24, 2024   │   │              │
│  │ └───────────────────┘   │  │ └───────────────────┘   │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
│                                                                         │
│  Duration: 5 working days                                              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Available Balance                                               │   │
│  │ Annual Leave: 18 days remaining (of 30)                        │   │
│  │ ✓ Sufficient balance for this request                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Reason / Notes                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Family vacation - traveling to visit relatives                  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Attachment (Optional)                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │        📎 Drag files here or click to upload                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Approver: Mohammed Al-Said (Operations Director)                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                        [Cancel]  [Submit Request]       │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.4.3 Leave Types Configuration
| Leave Type | Annual Allowance | Carry Forward | Requires Approval | Attachment Required |
|------------|------------------|---------------|-------------------|---------------------|
| Annual Leave | 30 days | Max 15 days | Yes | No |
| Sick Leave | 15 days | No | Yes | If > 2 days |
| Emergency Leave | 5 days | No | Yes | No |
| Maternity Leave | 50 days | No | Yes | Medical cert |
| Paternity Leave | 3 days | No | Yes | No |
| Unpaid Leave | Unlimited | N/A | Yes | No |
| Public Holiday | Per calendar | N/A | No | N/A |

#### 3.4.4 Leave Calendar View
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Leave Calendar                          [◀ Dec 2024 ▶] [Month▾] [Team▾]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     Sun    Mon    Tue    Wed    Thu    Fri    Sat                      │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐                    │
│  │  1   │  2   │  3   │  4   │  5   │  6   │  7   │                    │
│  │      │      │      │      │      │ 🔴   │      │                    │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│  │  8   │  9   │  10  │  11  │  12  │  13  │  14  │                    │
│  │      │      │      │      │      │ 🔴   │      │                    │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│  │  15  │  16  │  17  │  18  │  19  │  20  │  21  │                    │
│  │      │      │      │ 🟡   │ 🟡   │ 🔴🟢 │      │                    │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│  │  22  │  23  │  24  │  25  │  26  │  27  │  28  │                    │
│  │ 🟢   │ 🟢   │ 🟢   │ 🔵   │      │ 🔴   │      │                    │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                    │
│  │  29  │  30  │  31  │      │      │      │      │                    │
│  │      │      │      │      │      │      │      │                    │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘                    │
│                                                                         │
│  Legend: 🔴 Weekend/Holiday  🟢 Annual  🟡 Sick  🔵 Public Holiday     │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │ Dec 20-24: Ahmed Al-Balushi - Annual Leave (Approved)             ││
│  │ Dec 18-19: Fatima Hassan - Sick Leave (Pending)                   ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.5 Organization Chart

#### 3.5.1 UI Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Organization Chart                      [Expand All] [Collapse] [Export]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         ┌─────────────────┐                            │
│                         │ [👤] CEO        │                            │
│                         │ Abdullah Al-S.  │                            │
│                         └────────┬────────┘                            │
│                                  │                                      │
│           ┌──────────────────────┼──────────────────────┐              │
│           │                      │                      │              │
│  ┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐      │
│  │ [👤] COO       │   │ [👤] CFO       │   │ [👤] CHRO      │      │
│  │ Mohammed A.    │   │ Salim Al-H.    │   │ Aisha Al-M.    │      │
│  │ (45 reports)   │   │ (28 reports)   │   │ (15 reports)   │      │
│  └────────┬────────┘   └────────┬────────┘   └────────────────┘      │
│           │                      │                                      │
│     ┌─────┴─────┐          ┌─────┴─────┐                               │
│     │           │          │           │                               │
│  ┌──▼──┐     ┌──▼──┐    ┌──▼──┐     ┌──▼──┐                           │
│  │Ops  │     │Log  │    │Fin  │     │Acc  │                           │
│  │(20) │     │(25) │    │(15) │     │(13) │                           │
│  └─────┘     └─────┘    └─────┘     └─────┘                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.5.2 Features
- Expandable/collapsible nodes
- Click node → employee profile
- Hover → quick info card
- Search to highlight person
- Export as PDF/image

---

## 4. Data Models

### 4.1 Employee Entity
```typescript
interface Employee {
  // Identity
  id: string;
  employeeId: string;          // EMP-0001 format
  
  // Personal Info
  firstName: string;
  lastName: string;
  arabicName?: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  nationality: string;
  nationalId: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  
  // Contact
  workEmail: string;
  personalEmail?: string;
  phone: string;
  address: Address;
  emergencyContact: EmergencyContact;
  
  // Employment
  departmentId: string;
  positionId: string;
  managerId?: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  joinDate: Date;
  probationEndDate?: Date;
  status: 'active' | 'on-leave' | 'probation' | 'terminated';
  
  // System
  userId?: string;             // Linked Keycloak user
  companyId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Leave Request Entity
```typescript
interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverId: string;
  approvedAt?: Date;
  approverNotes?: string;
  createdAt: Date;
}
```

### 4.3 Leave Balance Entity
```typescript
interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  entitled: number;          // Annual entitlement
  carriedForward: number;    // From previous year
  taken: number;             // Used this year
  pending: number;           // In pending requests
  remaining: number;         // Calculated: entitled + carried - taken - pending
}
```

---

## 5. API Endpoints

### 5.1 Employee APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hr/employees` | List employees (paginated, filterable) |
| GET | `/api/hr/employees/:id` | Get employee details |
| POST | `/api/hr/employees` | Create new employee |
| PUT | `/api/hr/employees/:id` | Update employee |
| PATCH | `/api/hr/employees/:id/status` | Change status |
| DELETE | `/api/hr/employees/:id` | Soft delete employee |
| GET | `/api/hr/employees/:id/documents` | Get employee documents |
| POST | `/api/hr/employees/:id/documents` | Upload document |

### 5.2 Leave APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hr/leave/requests` | List leave requests |
| GET | `/api/hr/leave/requests/:id` | Get request details |
| POST | `/api/hr/leave/requests` | Submit new request |
| PUT | `/api/hr/leave/requests/:id` | Update request |
| POST | `/api/hr/leave/requests/:id/approve` | Approve request |
| POST | `/api/hr/leave/requests/:id/reject` | Reject request |
| POST | `/api/hr/leave/requests/:id/cancel` | Cancel request |
| GET | `/api/hr/leave/balances/:employeeId` | Get leave balances |
| GET | `/api/hr/leave/calendar` | Get calendar view data |

### 5.3 Organization APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hr/departments` | List departments |
| GET | `/api/hr/positions` | List positions |
| GET | `/api/hr/org-chart` | Get org chart data |

---

## 6. Permissions Matrix

| Permission | HR Admin | HR Officer | Manager | Employee |
|------------|:--------:|:----------:|:-------:|:--------:|
| View all employees | ✅ | ✅ | Team only | ❌ |
| Create employee | ✅ | ✅ | ❌ | ❌ |
| Edit any employee | ✅ | ✅ | ❌ | ❌ |
| Edit own profile | ✅ | ✅ | ✅ | Limited |
| Delete employee | ✅ | ❌ | ❌ | ❌ |
| View all leave requests | ✅ | ✅ | Team only | Own only |
| Approve leave | ✅ | ✅ | Team only | ❌ |
| Submit leave request | ✅ | ✅ | ✅ | ✅ |
| Configure leave policies | ✅ | ❌ | ❌ | ❌ |
| View HR reports | ✅ | ✅ | Limited | ❌ |
| Manage departments | ✅ | ❌ | ❌ | ❌ |

---

## 7. Notifications

### 7.1 Leave Notifications
| Event | Recipients | Channels |
|-------|------------|----------|
| Leave request submitted | Manager, HR | In-app, Email |
| Leave approved | Employee, Team | In-app, Email |
| Leave rejected | Employee | In-app, Email |
| Leave starting tomorrow | Team members | In-app |
| Low balance warning | Employee | In-app, Email |

### 7.2 Employee Notifications
| Event | Recipients | Channels |
|-------|------------|----------|
| New employee joined | Team, HR | In-app |
| Probation ending soon | Manager, HR | In-app, Email |
| Birthday today | All employees | In-app |
| Work anniversary | All employees | In-app |

---

## 8. Reports

### 8.1 Standard HR Reports
| Report | Description | Filters |
|--------|-------------|---------|
| Headcount Report | Employee count by department, type, status | Date, Department |
| Leave Summary | Leave taken by type, department | Period, Department, Employee |
| Leave Balance Report | Current balances for all employees | Department, Leave Type |
| Attendance Report | Check-in/out times, hours worked | Period, Department, Employee |
| Turnover Report | Joiners and leavers analysis | Period |
| Birthday/Anniversary List | Upcoming events | Month |

### 8.2 Export Formats
- PDF (formatted report)
- Excel (data export)
- CSV (raw data)

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Employee entity and basic CRUD
- [ ] Employee directory with search/filter
- [ ] Employee profile view
- [ ] Department and position management

### Phase 2: Leave Management (Week 3-4)
- [ ] Leave types configuration
- [ ] Leave request submission
- [ ] Approval workflow
- [ ] Leave balances calculation
- [ ] Leave calendar view

### Phase 3: Self-Service & Polish (Week 5)
- [ ] Employee self-service portal
- [ ] Manager team view
- [ ] Document management
- [ ] Notifications
- [ ] Organization chart
- [ ] HR dashboard
- [ ] Basic reports

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Leave request processing time | < 24 hours |
| Self-service adoption rate | > 80% of employees |
| Data accuracy | > 99% |
| User satisfaction score | > 4.0/5.0 |
| Support tickets (HR module) | < 5/month after stabilization |

---

## 11. Mock Data Requirements

For demo purposes, generate:
- 150+ employees across 6 departments
- Realistic Omani names (Arabic + English)
- Proper reporting hierarchy
- Leave history for past 6 months
- Varied leave balances
- Mix of employment types and statuses

---

*This document serves as the product specification for the HR module. Implementation details may be refined during development.*
