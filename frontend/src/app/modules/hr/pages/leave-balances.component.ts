import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCalendarDays,
  heroArrowPath
} from '@ng-icons/heroicons/outline';

interface LeaveBalance {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  department: string;
  departmentAr: string;
  annual: { used: number; total: number };
  sick: { used: number; total: number };
  emergency: { used: number; total: number };
}

@Component({
  selector: 'app-leave-balances',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroCalendarDays,
      heroArrowPath
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'أرصدة الإجازات' : 'Leave Balances' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'عرض أرصدة الإجازات للموظفين' : 'View employee leave balances' }}</p>
        </div>
        <button class="btn btn-secondary">
          <ng-icon name="heroArrowPath" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'تحديث' : 'Refresh' }}
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroCalendarDays" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(156) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي السنوية' : 'Total Annual' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroCalendarDays" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(42) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'المستخدمة' : 'Used Days' }}</div>
        </div>
        <div class="stat-card col-span-2 md:col-span-1">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroCalendarDays" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(114) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'الأيام المتبقية' : 'Remaining' }}</div>
        </div>
      </div>

      <!-- Leave Balances Table -->
      <div class="card">
        <div class="p-3 sm:p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'أرصدة الموظفين' : 'Employee Balances' }}</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (balance of leaveBalances(); track balance.id) {
            <div class="p-3 sm:p-4 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <div class="font-medium text-sm text-gray-900">{{ lang.currentLanguage() === 'ar' ? balance.employeeNameAr : balance.employeeName }}</div>
                  <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? balance.departmentAr : balance.department }}</div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'سنوية' : 'Annual' }}</span>
                  <div class="flex items-center gap-2">
                    <div class="progress-bar w-16">
                      <div class="progress-bar-fill bg-success-500" [style.width.%]="(balance.annual.used / balance.annual.total) * 100"></div>
                    </div>
                    <span class="text-xs text-gray-600 w-12 text-end">{{ balance.annual.used }}/{{ balance.annual.total }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'مرضية' : 'Sick' }}</span>
                  <div class="flex items-center gap-2">
                    <div class="progress-bar w-16">
                      <div class="progress-bar-fill bg-warning-500" [style.width.%]="(balance.sick.used / balance.sick.total) * 100"></div>
                    </div>
                    <span class="text-xs text-gray-600 w-12 text-end">{{ balance.sick.used }}/{{ balance.sick.total }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'طارئة' : 'Emergency' }}</span>
                  <div class="flex items-center gap-2">
                    <div class="progress-bar w-16">
                      <div class="progress-bar-fill bg-danger-500" [style.width.%]="(balance.emergency.used / balance.emergency.total) * 100"></div>
                    </div>
                    <span class="text-xs text-gray-600 w-12 text-end">{{ balance.emergency.used }}/{{ balance.emergency.total }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الموظف' : 'Employee' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'القسم' : 'Department' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'سنوية' : 'Annual' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'مرضية' : 'Sick' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'طارئة' : 'Emergency' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (balance of leaveBalances(); track balance.id) {
                <tr>
                  <td class="font-medium">{{ lang.currentLanguage() === 'ar' ? balance.employeeNameAr : balance.employeeName }}</td>
                  <td>{{ lang.currentLanguage() === 'ar' ? balance.departmentAr : balance.department }}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="progress-bar w-20">
                        <div class="progress-bar-fill bg-success-500" [style.width.%]="(balance.annual.used / balance.annual.total) * 100"></div>
                      </div>
                      <span class="text-sm text-gray-600">{{ lang.formatNumber(balance.annual.used) }}/{{ lang.formatNumber(balance.annual.total) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="progress-bar w-20">
                        <div class="progress-bar-fill bg-warning-500" [style.width.%]="(balance.sick.used / balance.sick.total) * 100"></div>
                      </div>
                      <span class="text-sm text-gray-600">{{ lang.formatNumber(balance.sick.used) }}/{{ lang.formatNumber(balance.sick.total) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="progress-bar w-20">
                        <div class="progress-bar-fill bg-danger-500" [style.width.%]="(balance.emergency.used / balance.emergency.total) * 100"></div>
                      </div>
                      <span class="text-sm text-gray-600">{{ lang.formatNumber(balance.emergency.used) }}/{{ lang.formatNumber(balance.emergency.total) }}</span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-bar-fill.bg-success-500 {
      background: linear-gradient(90deg, #22C55E 0%, #4ADE80 100%);
    }
    .progress-bar-fill.bg-warning-500 {
      background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%);
    }
    .progress-bar-fill.bg-danger-500 {
      background: linear-gradient(90deg, #EF4444 0%, #F87171 100%);
    }
  `]
})
export class LeaveBalancesComponent implements OnInit {
  lang = inject(LanguageService);

  leaveBalances = signal<LeaveBalance[]>([]);

  ngOnInit() {
    this.leaveBalances.set([
      {
        id: '1',
        employeeName: 'Mohammed Ali',
        employeeNameAr: 'محمد علي',
        department: 'Human Resources',
        departmentAr: 'الموارد البشرية',
        annual: { used: 8, total: 21 },
        sick: { used: 2, total: 14 },
        emergency: { used: 1, total: 5 }
      },
      {
        id: '2',
        employeeName: 'Sarah Johnson',
        employeeNameAr: 'سارة جونسون',
        department: 'Finance',
        departmentAr: 'المالية',
        annual: { used: 12, total: 21 },
        sick: { used: 0, total: 14 },
        emergency: { used: 0, total: 5 }
      },
      {
        id: '3',
        employeeName: 'Ahmed Al-Rashid',
        employeeNameAr: 'أحمد الراشد',
        department: 'Operations',
        departmentAr: 'العمليات',
        annual: { used: 5, total: 21 },
        sick: { used: 3, total: 14 },
        emergency: { used: 2, total: 5 }
      },
      {
        id: '4',
        employeeName: 'Fatima Hassan',
        employeeNameAr: 'فاطمة حسن',
        department: 'Human Resources',
        departmentAr: 'الموارد البشرية',
        annual: { used: 10, total: 21 },
        sick: { used: 1, total: 14 },
        emergency: { used: 0, total: 5 }
      },
      {
        id: '5',
        employeeName: 'Omar Al-Said',
        employeeNameAr: 'عمر السعيد',
        department: 'Finance',
        departmentAr: 'المالية',
        annual: { used: 7, total: 21 },
        sick: { used: 4, total: 14 },
        emergency: { used: 1, total: 5 }
      }
    ]);
  }
}
