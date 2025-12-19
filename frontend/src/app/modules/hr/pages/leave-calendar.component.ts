import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeft,
  heroChevronRight,
  heroCalendarDays
} from '@ng-icons/heroicons/outline';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  leaves: { name: string; nameAr: string; type: string; typeAr: string }[];
}

@Component({
  selector: 'app-leave-calendar',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroChevronLeft,
      heroChevronRight,
      heroCalendarDays
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'تقويم الإجازات' : 'Leave Calendar' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'عرض جدول الإجازات للفريق' : 'View team leave schedule' }}</p>
        </div>
      </div>

      <!-- Calendar Card -->
      <div class="card">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
          <button (click)="previousMonth()" class="btn btn-ghost btn-icon">
            <ng-icon name="heroChevronLeft" class="text-lg flip-rtl"></ng-icon>
          </button>
          <h2 class="text-sm sm:text-lg font-semibold text-gray-900 text-center">{{ currentMonthYear }}</h2>
          <button (click)="nextMonth()" class="btn btn-ghost btn-icon">
            <ng-icon name="heroChevronRight" class="text-lg flip-rtl"></ng-icon>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="p-2 sm:p-4">
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            @for (day of weekDays; track day) {
              <div class="text-center text-[10px] sm:text-sm font-medium text-gray-500 py-1 sm:py-2">{{ day }}</div>
            }
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-0.5 sm:gap-1">
            @for (day of calendarDays(); track $index) {
              <div
                class="min-h-[50px] sm:min-h-[100px] p-1 sm:p-2 border border-gray-100 rounded"
                [class.bg-gray-50]="!day.isCurrentMonth"
                [class.bg-primary-50]="day.isToday"
                [class.border-primary-200]="day.isToday"
              >
                <div
                  class="text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1"
                  [class.text-gray-400]="!day.isCurrentMonth"
                  [class.text-primary-600]="day.isToday"
                  [class.text-gray-900]="day.isCurrentMonth && !day.isToday"
                >
                  {{ day.date }}
                </div>
                @for (leave of day.leaves; track leave.name) {
                  <div class="text-[8px] sm:text-xs p-0.5 sm:p-1 rounded mb-0.5 sm:mb-1 truncate" [class]="getLeaveTypeClass(leave.type)">
                    <span class="hidden sm:inline">{{ lang.currentLanguage() === 'ar' ? leave.nameAr : leave.name }}</span>
                    <span class="sm:hidden">{{ (lang.currentLanguage() === 'ar' ? leave.nameAr : leave.name).charAt(0) }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-4 p-3 sm:p-4 border-t border-gray-100">
          <span class="text-xs sm:text-sm text-gray-500 w-full sm:w-auto">{{ lang.currentLanguage() === 'ar' ? 'الأنواع:' : 'Types:' }}</span>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-success-100"></span>
            <span class="text-xs sm:text-sm text-gray-600">{{ lang.currentLanguage() === 'ar' ? 'سنوية' : 'Annual' }}</span>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-warning-100"></span>
            <span class="text-xs sm:text-sm text-gray-600">{{ lang.currentLanguage() === 'ar' ? 'مرضية' : 'Sick' }}</span>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-danger-100"></span>
            <span class="text-xs sm:text-sm text-gray-600">{{ lang.currentLanguage() === 'ar' ? 'طارئة' : 'Emergency' }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveCalendarComponent implements OnInit {
  lang = inject(LanguageService);

  currentDate = new Date();
  calendarDays = signal<CalendarDay[]>([]);

  get weekDays(): string[] {
    return this.lang.currentLanguage() === 'ar'
      ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  get currentMonthYear(): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return this.lang.currentLanguage() === 'ar'
      ? this.currentDate.toLocaleDateString('ar-SA-u-nu-latn', options)
      : this.currentDate.toLocaleDateString('en-US', options);
  }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    const days: CalendarDay[] = [];

    // Previous month days
    const startDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        leaves: []
      });
    }

    // Current month days
    const mockLeaves = this.getMockLeaves();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        leaves: mockLeaves[i] || []
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        leaves: []
      });
    }

    this.calendarDays.set(days);
  }

  getMockLeaves(): Record<number, any[]> {
    return {
      5: [{ name: 'Mohammed', nameAr: 'محمد', type: 'annual', typeAr: 'سنوية' }],
      8: [{ name: 'Sarah', nameAr: 'سارة', type: 'sick', typeAr: 'مرضية' }],
      12: [
        { name: 'Ahmed', nameAr: 'أحمد', type: 'annual', typeAr: 'سنوية' },
        { name: 'Fatima', nameAr: 'فاطمة', type: 'annual', typeAr: 'سنوية' }
      ],
      15: [{ name: 'Omar', nameAr: 'عمر', type: 'emergency', typeAr: 'طارئة' }],
      20: [{ name: 'Layla', nameAr: 'ليلى', type: 'annual', typeAr: 'سنوية' }],
      25: [{ name: 'Khalid', nameAr: 'خالد', type: 'sick', typeAr: 'مرضية' }]
    };
  }

  getLeaveTypeClass(type: string): string {
    switch (type) {
      case 'annual': return 'bg-success-100 text-success-700';
      case 'sick': return 'bg-warning-100 text-warning-700';
      case 'emergency': return 'bg-danger-100 text-danger-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }
}
