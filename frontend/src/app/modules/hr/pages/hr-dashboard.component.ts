import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { HRDashboardStats, LeaveRequest, ActivityLog, UpcomingEvent } from '../../../core/models';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUsers,
  heroCheckCircle,
  heroCalendarDays,
  heroClipboardDocumentList,
  heroArrowTrendingUp,
  heroArrowTrendingDown,
  heroCheck,
  heroXMark,
  heroCake,
  heroStar,
  heroCalendar,
  heroGift,
  heroArrowPath,
  heroChatBubbleLeftRight
} from '@ng-icons/heroicons/outline';
import {
  heroUsersSolid,
  heroCheckCircleSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroUsers,
      heroCheckCircle,
      heroCalendarDays,
      heroClipboardDocumentList,
      heroArrowTrendingUp,
      heroArrowTrendingDown,
      heroCheck,
      heroXMark,
      heroCake,
      heroStar,
      heroCalendar,
      heroGift,
      heroArrowPath,
      heroUsersSolid,
      heroCheckCircleSolid,
      heroChatBubbleLeftRight
    })
  ],
  template: `
    <div>
      <!-- Prodify-style Greeting Header -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ lang.currentLanguage() === 'ar' ? 'مرحباً' : 'Hello' }}, {{ userName }}
          </h1>
          <p class="text-accent-500 text-lg font-medium mt-1">
            {{ lang.currentLanguage() === 'ar' ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- AI Assistant Avatar - Prodify Style -->
          <div class="ai-avatar">
            <ng-icon name="heroChatBubbleLeftRight" class="text-xl"></ng-icon>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <!-- Total Employees -->
        <div class="stat-card group">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-primary-light text-primary-600">
              <ng-icon name="heroUsers" class="text-2xl"></ng-icon>
            </div>
            <span class="stat-card-change positive">
              <ng-icon name="heroArrowTrendingUp" class="text-sm"></ng-icon>
              +3
            </span>
          </div>
          <div class="stat-card-value">{{ stats()?.totalEmployees || 0 }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي الموظفين' : 'Total Employees' }}</div>
        </div>

        <!-- Present Today -->
        <div class="stat-card group">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-success-light text-success-600">
              <ng-icon name="heroCheckCircle" class="text-2xl"></ng-icon>
            </div>
            <span class="text-sm font-semibold text-success-600">94.8%</span>
          </div>
          <div class="stat-card-value">{{ stats()?.presentToday || 0 }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'الحاضرون اليوم' : 'Present Today' }}</div>
        </div>

        <!-- On Leave -->
        <div class="stat-card group">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-warning-light text-warning-600">
              <ng-icon name="heroCalendarDays" class="text-2xl"></ng-icon>
            </div>
            <span class="text-sm font-semibold text-warning-600">5.2%</span>
          </div>
          <div class="stat-card-value">{{ stats()?.onLeave || 0 }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'في إجازة' : 'On Leave' }}</div>
        </div>

        <!-- Pending Requests -->
        <div class="stat-card group cursor-pointer" routerLink="/hr/leave/requests">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-danger-light text-danger-600">
              <ng-icon name="heroClipboardDocumentList" class="text-2xl"></ng-icon>
            </div>
            @if ((stats()?.pendingRequests || 0) > 0) {
              <span class="badge badge-danger">{{ lang.currentLanguage() === 'ar' ? 'يحتاج اهتمام' : 'Action needed' }}</span>
            }
          </div>
          <div class="stat-card-value">{{ stats()?.pendingRequests || 0 }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'طلبات معلقة' : 'Pending Requests' }}</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Department Headcount -->
          <div class="card">
            <div class="px-6 py-5 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'عدد الموظفين حسب القسم' : 'Headcount by Department' }}
              </h2>
            </div>
            <div class="p-6">
              @for (dept of stats()?.departmentHeadcount; track dept.name) {
                <div class="mb-5 last:mb-0">
                  <div class="flex items-center justify-between text-sm mb-2">
                    <span class="font-medium text-gray-700">{{ lang.currentLanguage() === 'ar' ? dept.nameAr : dept.name }}</span>
                    <span class="font-semibold text-gray-900">{{ dept.count }}</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-bar-fill"
                      [style.width.%]="(dept.count / 50) * 100"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Pending Approvals -->
          <div class="card">
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'الموافقات المعلقة' : 'Pending Approvals' }}
              </h2>
              <a routerLink="/hr/leave/requests" class="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                {{ lang.currentLanguage() === 'ar' ? 'عرض الكل' : 'View All' }} →
              </a>
            </div>
            <div class="divide-y divide-gray-100">
              @for (request of pendingRequests(); track request.id) {
                <div class="p-5 hover:bg-gray-50/50 transition-colors">
                  <div class="flex items-start gap-4">
                    <div class="avatar w-11 h-11 text-sm">
                      {{ getInitials(request.employeeName) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-semibold text-gray-900">
                          {{ lang.currentLanguage() === 'ar' && request.employeeNameAr ? request.employeeNameAr : request.employeeName }}
                        </span>
                        <span class="badge" [class]="getLeaveTypeBadgeClass(request.leaveTypeName)">
                          {{ lang.currentLanguage() === 'ar' ? request.leaveTypeNameAr : request.leaveTypeName }}
                        </span>
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        {{ lang.formatDate(request.startDate, 'short') }} - {{ lang.formatDate(request.endDate, 'short') }}
                        <span class="text-gray-400 mx-1">·</span>
                        {{ request.totalDays }} {{ lang.currentLanguage() === 'ar' ? 'أيام' : 'days' }}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="btn btn-sm btn-success">
                        <ng-icon name="heroCheck" class="text-base"></ng-icon>
                        {{ lang.currentLanguage() === 'ar' ? 'موافقة' : 'Approve' }}
                      </button>
                      <button class="btn btn-sm btn-secondary">
                        <ng-icon name="heroXMark" class="text-base"></ng-icon>
                      </button>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="p-10 text-center">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-success-50 text-success-500 flex items-center justify-center">
                    <ng-icon name="heroCheckCircleSolid" class="text-3xl"></ng-icon>
                  </div>
                  <p class="text-gray-600 font-medium">{{ lang.currentLanguage() === 'ar' ? 'لا توجد طلبات معلقة' : 'All caught up!' }}</p>
                  <p class="text-sm text-gray-400 mt-1">{{ lang.currentLanguage() === 'ar' ? 'تمت مراجعة جميع الطلبات' : 'No pending requests to review' }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Upcoming Events -->
          <div class="card">
            <div class="px-6 py-5 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events' }}
              </h2>
            </div>
            <div class="divide-y divide-gray-100">
              @for (event of upcomingEvents(); track event.id) {
                <div class="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div class="icon-wrapper" [class]="getEventIconClass(event.type)">
                    <ng-icon [name]="getEventIconName(event.type)" class="text-lg"></ng-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 truncate">
                      {{ lang.currentLanguage() === 'ar' ? event.titleAr : event.title }}
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5">
                      {{ lang.formatDate(event.date, 'short') }}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <div class="px-6 py-5 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'النشاط الأخير' : 'Recent Activity' }}
              </h2>
            </div>
            <div class="divide-y divide-gray-100">
              @for (activity of recentActivity(); track activity.id) {
                <div class="p-4">
                  <div class="flex items-start gap-3">
                    <div class="w-2.5 h-2.5 mt-1.5 rounded-full" [class]="getActivityColor(activity.type)"></div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-gray-700 leading-relaxed">
                        {{ lang.currentLanguage() === 'ar' ? activity.descriptionAr : activity.description }}
                      </div>
                      <div class="text-xs text-gray-400 mt-1.5 font-medium">
                        {{ lang.formatRelativeDate(activity.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HRDashboardComponent implements OnInit {
  lang = inject(LanguageService);
  private mockData = inject(MockDataService);
  private auth = inject(AuthService);

  stats = signal<HRDashboardStats | null>(null);
  pendingRequests = signal<LeaveRequest[]>([]);
  upcomingEvents = signal<UpcomingEvent[]>([]);
  recentActivity = signal<ActivityLog[]>([]);

  // Get user's first name for greeting
  get userName(): string {
    const user = this.auth.user();
    if (!user) return '';
    const name = this.lang.currentLanguage() === 'ar' ? (user.nameAr || user.name) : user.name;
    return name.split(' ')[0];
  }

  ngOnInit() {
    this.stats.set(this.mockData.getHRDashboardStats());
    this.pendingRequests.set(this.mockData.leaveRequests.filter(r => r.status === 'pending'));
    this.upcomingEvents.set(this.mockData.upcomingEvents);
    this.recentActivity.set(this.mockData.activityLogs.slice(0, 5));
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getLeaveTypeBadgeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'annual leave': return 'badge-success';
      case 'sick leave': return 'badge-warning';
      case 'emergency leave': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  getEventIconName(type: string): string {
    switch (type) {
      case 'birthday': return 'heroCake';
      case 'anniversary': return 'heroStar';
      case 'holiday': return 'heroCalendar';
      case 'leave': return 'heroGift';
      default: return 'heroCalendar';
    }
  }

  getEventIconClass(type: string): string {
    switch (type) {
      case 'birthday': return 'icon-wrapper-danger';
      case 'anniversary': return 'icon-wrapper-warning';
      case 'holiday': return 'icon-wrapper-primary';
      case 'leave': return 'icon-wrapper-success';
      default: return 'icon-wrapper-primary';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'employee': return 'bg-primary-500';
      case 'leave': return 'bg-success-500';
      case 'invoice': return 'bg-accent-500';
      case 'payment': return 'bg-warning-500';
      default: return 'bg-gray-400';
    }
  }
}
