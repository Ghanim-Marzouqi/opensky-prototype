import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Login Route
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },

  // Forgot Password Route
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [loginGuard]
  },

  // Protected Routes with Layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'hr/dashboard', pathMatch: 'full' },

      // HR Module - Only accessible by HR role
      {
        path: 'hr/dashboard',
        loadComponent: () => import('./modules/hr/pages/hr-dashboard.component').then(m => m.HRDashboardComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/employees',
        loadComponent: () => import('./modules/hr/pages/employee-directory.component').then(m => m.EmployeeDirectoryComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/employees/:id',
        loadComponent: () => import('./modules/hr/pages/employee-profile.component').then(m => m.EmployeeProfileComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/org-chart',
        loadComponent: () => import('./modules/hr/pages/org-chart.component').then(m => m.OrgChartComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/leave/requests',
        loadComponent: () => import('./modules/hr/pages/leave-requests.component').then(m => m.LeaveRequestsComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/leave/calendar',
        loadComponent: () => import('./modules/hr/pages/leave-calendar.component').then(m => m.LeaveCalendarComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/leave/balances',
        loadComponent: () => import('./modules/hr/pages/leave-balances.component').then(m => m.LeaveBalancesComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },
      {
        path: 'hr/attendance',
        loadComponent: () => import('./modules/hr/pages/attendance.component').then(m => m.AttendanceComponent),
        canActivate: [authGuard],
        data: { role: 'hr' }
      },

      // Finance Module - Only accessible by Finance role
      {
        path: 'finance/dashboard',
        loadComponent: () => import('./modules/finance/pages/finance-dashboard.component').then(m => m.FinanceDashboardComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/invoices',
        loadComponent: () => import('./modules/finance/pages/invoices-list.component').then(m => m.InvoicesListComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/invoices/:id',
        loadComponent: () => import('./modules/finance/pages/invoices-list.component').then(m => m.InvoicesListComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/payments-received',
        loadComponent: () => import('./modules/finance/pages/payments-received.component').then(m => m.PaymentsReceivedComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/ar-aging',
        loadComponent: () => import('./modules/finance/pages/ar-aging.component').then(m => m.ARAgingComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/bills',
        loadComponent: () => import('./modules/finance/pages/bills.component').then(m => m.BillsComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/payments-made',
        loadComponent: () => import('./modules/finance/pages/payments-made.component').then(m => m.PaymentsMadeComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/ap-aging',
        loadComponent: () => import('./modules/finance/pages/ap-aging.component').then(m => m.APAgingComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/currencies',
        loadComponent: () => import('./modules/finance/pages/currencies.component').then(m => m.CurrenciesComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },
      {
        path: 'finance/banking',
        loadComponent: () => import('./modules/finance/pages/banking.component').then(m => m.BankingComponent),
        canActivate: [authGuard],
        data: { role: 'finance' }
      },

      // Common pages - accessible by all authenticated users
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard]
      },
    ]
  },

  // Fallback to login
  { path: '**', redirectTo: 'login' }
];
