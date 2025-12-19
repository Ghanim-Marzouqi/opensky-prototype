import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroClock,
  heroCheckCircle,
  heroXCircle,
  heroChevronLeft,
  heroChevronRight
} from '@ng-icons/heroicons/outline';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  department: string;
  departmentAr: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'leave';
  workHours: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroClock,
      heroCheckCircle,
      heroXCircle,
      heroChevronLeft,
      heroChevronRight
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header flex-col sm:flex-row items-start sm:items-center gap-4">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'سجل الحضور' : 'Attendance' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'تتبع حضور وانصراف الموظفين' : 'Track employee check-in and check-out times' }}</p>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <button (click)="previousDay()" class="btn btn-ghost btn-icon">
            <ng-icon name="heroChevronLeft" class="text-lg flip-rtl"></ng-icon>
          </button>
          <span class="px-3 sm:px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-center flex-1 sm:flex-none">{{ currentDateFormatted }}</span>
          <button (click)="nextDay()" class="btn btn-ghost btn-icon">
            <ng-icon name="heroChevronRight" class="text-lg flip-rtl"></ng-icon>
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroCheckCircle" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(42) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'حاضرين' : 'Present' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroClock" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(5) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'متأخرين' : 'Late' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroXCircle" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(3) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'غائبين' : 'Absent' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroCheckCircle" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(2) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'في إجازة' : 'On Leave' }}</div>
        </div>
      </div>

      <!-- Attendance Table -->
      <div class="card">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'سجل اليوم' : 'Daily Record' }}</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (record of attendanceRecords(); track record.id) {
            <div class="p-4 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? record.employeeNameAr : record.employeeName }}</span>
                <span class="badge" [class]="getStatusClass(record.status)">
                  {{ getStatusLabel(record.status) }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mb-2">{{ lang.currentLanguage() === 'ar' ? record.departmentAr : record.department }}</div>
              <div class="flex items-center justify-between text-sm">
                <div>
                  <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الحضور:' : 'In:' }}</span>
                  <span dir="ltr" class="font-medium ms-1">{{ record.checkIn || '-' }}</span>
                </div>
                <div>
                  <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الانصراف:' : 'Out:' }}</span>
                  <span dir="ltr" class="font-medium ms-1">{{ record.checkOut || '-' }}</span>
                </div>
                <div>
                  <span dir="ltr" class="font-medium text-primary-600">{{ record.workHours }}</span>
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
                <th>{{ lang.currentLanguage() === 'ar' ? 'وقت الحضور' : 'Check In' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'وقت الانصراف' : 'Check Out' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'ساعات العمل' : 'Work Hours' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (record of attendanceRecords(); track record.id) {
                <tr>
                  <td class="font-medium">{{ lang.currentLanguage() === 'ar' ? record.employeeNameAr : record.employeeName }}</td>
                  <td>{{ lang.currentLanguage() === 'ar' ? record.departmentAr : record.department }}</td>
                  <td><span dir="ltr" class="inline-block">{{ record.checkIn || '-' }}</span></td>
                  <td><span dir="ltr" class="inline-block">{{ record.checkOut || '-' }}</span></td>
                  <td><span dir="ltr" class="inline-block">{{ record.workHours }}</span></td>
                  <td>
                    <span class="badge" [class]="getStatusClass(record.status)">
                      {{ getStatusLabel(record.status) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AttendanceComponent implements OnInit {
  lang = inject(LanguageService);

  currentDate = new Date();
  attendanceRecords = signal<AttendanceRecord[]>([]);

  get currentDateFormatted(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return this.lang.currentLanguage() === 'ar'
      ? this.currentDate.toLocaleDateString('ar-SA-u-nu-latn', options)
      : this.currentDate.toLocaleDateString('en-US', options);
  }

  ngOnInit() {
    this.loadAttendanceData();
  }

  loadAttendanceData() {
    this.attendanceRecords.set([
      {
        id: '1',
        employeeName: 'Mohammed Ali',
        employeeNameAr: 'محمد علي',
        department: 'Human Resources',
        departmentAr: 'الموارد البشرية',
        checkIn: '08:55',
        checkOut: '17:05',
        status: 'present',
        workHours: '8h 10m'
      },
      {
        id: '2',
        employeeName: 'Sarah Johnson',
        employeeNameAr: 'سارة جونسون',
        department: 'Finance',
        departmentAr: 'المالية',
        checkIn: '09:15',
        checkOut: '17:30',
        status: 'late',
        workHours: '8h 15m'
      },
      {
        id: '3',
        employeeName: 'Ahmed Al-Rashid',
        employeeNameAr: 'أحمد الراشد',
        department: 'Operations',
        departmentAr: 'العمليات',
        checkIn: '08:45',
        checkOut: '17:00',
        status: 'present',
        workHours: '8h 15m'
      },
      {
        id: '4',
        employeeName: 'Fatima Hassan',
        employeeNameAr: 'فاطمة حسن',
        department: 'Human Resources',
        departmentAr: 'الموارد البشرية',
        checkIn: '',
        checkOut: '',
        status: 'leave',
        workHours: '-'
      },
      {
        id: '5',
        employeeName: 'Omar Al-Said',
        employeeNameAr: 'عمر السعيد',
        department: 'Finance',
        departmentAr: 'المالية',
        checkIn: '',
        checkOut: '',
        status: 'absent',
        workHours: '-'
      },
      {
        id: '6',
        employeeName: 'Layla Ahmed',
        employeeNameAr: 'ليلى أحمد',
        department: 'Finance',
        departmentAr: 'المالية',
        checkIn: '08:50',
        checkOut: '17:10',
        status: 'present',
        workHours: '8h 20m'
      }
    ]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'present': return 'badge-success';
      case 'late': return 'badge-warning';
      case 'absent': return 'badge-danger';
      case 'leave': return 'badge-primary';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    if (this.lang.currentLanguage() === 'ar') {
      switch (status) {
        case 'present': return 'حاضر';
        case 'late': return 'متأخر';
        case 'absent': return 'غائب';
        case 'leave': return 'إجازة';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  previousDay() {
    this.currentDate = new Date(this.currentDate.getTime() - 24 * 60 * 60 * 1000);
  }

  nextDay() {
    this.currentDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
  }
}
