import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { LeaveRequest, LeaveType, LeaveBalance } from '../../../core/models';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'طلبات الإجازة' : 'Leave Requests' }}</h1>
          <p class="text-sm text-slate-500 mt-1">
            {{ lang.currentLanguage() === 'ar' ? 'إدارة ومراجعة طلبات الإجازات' : 'Manage and review leave requests' }}
          </p>
        </div>
        <button class="btn btn-primary" (click)="showNewRequestModal = true">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ lang.currentLanguage() === 'ar' ? 'طلب إجازة جديد' : 'New Leave Request' }}
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xl">⏳</div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ pendingCount() }}</div>
              <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'قيد الانتظار' : 'Pending' }}</div>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl">✓</div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ approvedCount() }}</div>
              <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'موافق عليها' : 'Approved' }}</div>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl">✗</div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ rejectedCount() }}</div>
              <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'مرفوضة' : 'Rejected' }}</div>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl">📅</div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ totalRequests().length }}</div>
              <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'إجمالي الطلبات' : 'Total Requests' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="p-4 flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-64">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              [placeholder]="lang.currentLanguage() === 'ar' ? 'البحث بالاسم...' : 'Search by name...'"
              class="form-input"
            />
          </div>
          <select [(ngModel)]="statusFilter" class="form-select w-40">
            <option value="">{{ lang.currentLanguage() === 'ar' ? 'جميع الحالات' : 'All Status' }}</option>
            <option value="pending">{{ lang.currentLanguage() === 'ar' ? 'قيد الانتظار' : 'Pending' }}</option>
            <option value="approved">{{ lang.currentLanguage() === 'ar' ? 'موافق عليه' : 'Approved' }}</option>
            <option value="rejected">{{ lang.currentLanguage() === 'ar' ? 'مرفوض' : 'Rejected' }}</option>
          </select>
          <select [(ngModel)]="leaveTypeFilter" class="form-select w-48">
            <option value="">{{ lang.currentLanguage() === 'ar' ? 'جميع الأنواع' : 'All Types' }}</option>
            @for (type of leaveTypes; track type.id) {
              <option [value]="type.id">{{ lang.currentLanguage() === 'ar' ? type.nameAr : type.name }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Requests List -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الموظف' : 'Employee' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'نوع الإجازة' : 'Leave Type' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الفترة' : 'Period' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الأيام' : 'Days' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'تاريخ الطلب' : 'Requested' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الإجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (request of filteredRequests(); track request.id) {
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs">
                        {{ getInitials(request.employeeName) }}
                      </div>
                      <div>
                        <div class="font-medium text-slate-900">
                          {{ lang.currentLanguage() === 'ar' && request.employeeNameAr ? request.employeeNameAr : request.employeeName }}
                        </div>
                        <div class="text-xs text-slate-500">{{ request.departmentName }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class]="getLeaveTypeBadgeClass(request.leaveTypeName)">
                      {{ lang.currentLanguage() === 'ar' ? request.leaveTypeNameAr : request.leaveTypeName }}
                    </span>
                  </td>
                  <td>
                    <div class="text-sm">
                      <div>{{ lang.formatDate(request.startDate, 'short') }}</div>
                      <div class="text-slate-400">{{ lang.currentLanguage() === 'ar' ? 'إلى' : 'to' }} {{ lang.formatDate(request.endDate, 'short') }}</div>
                    </div>
                  </td>
                  <td class="font-medium">{{ request.totalDays }}</td>
                  <td>
                    <span class="badge" [class]="getStatusBadgeClass(request.status)">
                      {{ getStatusLabel(request.status) }}
                    </span>
                  </td>
                  <td class="text-sm text-slate-500">
                    {{ lang.formatRelativeDate(request.createdAt) }}
                  </td>
                  <td>
                    @if (request.status === 'pending') {
                      <div class="flex items-center gap-1">
                        <button
                          (click)="approveRequest(request)"
                          class="btn btn-sm btn-success"
                        >
                          {{ lang.currentLanguage() === 'ar' ? 'موافقة' : 'Approve' }}
                        </button>
                        <button
                          (click)="rejectRequest(request)"
                          class="btn btn-sm btn-secondary"
                        >
                          {{ lang.currentLanguage() === 'ar' ? 'رفض' : 'Reject' }}
                        </button>
                      </div>
                    } @else {
                      <button class="btn btn-sm btn-ghost" (click)="viewDetails(request)">
                        {{ lang.currentLanguage() === 'ar' ? 'عرض' : 'View' }}
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-12">
                    <div class="text-slate-400">
                      <span class="text-4xl">📋</span>
                      <p class="mt-2">{{ lang.currentLanguage() === 'ar' ? 'لا توجد طلبات' : 'No requests found' }}</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- New Leave Request Modal -->
      @if (showNewRequestModal) {
        <div class="modal-overlay" (click)="showNewRequestModal = false"></div>
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ lang.currentLanguage() === 'ar' ? 'طلب إجازة جديد' : 'New Leave Request' }}
                </h3>
                <button (click)="showNewRequestModal = false" class="p-1 text-slate-400 hover:text-slate-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="px-6 py-5 space-y-4">
                <div>
                  <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'نوع الإجازة' : 'Leave Type' }} *</label>
                  <select class="form-select">
                    @for (type of leaveTypes; track type.id) {
                      <option [value]="type.id">{{ lang.currentLanguage() === 'ar' ? type.nameAr : type.name }}</option>
                    }
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'تاريخ البداية' : 'Start Date' }} *</label>
                    <input type="date" class="form-input" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'تاريخ النهاية' : 'End Date' }} *</label>
                    <input type="date" class="form-input" />
                  </div>
                </div>

                <div class="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div class="flex items-center gap-2 text-green-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium">
                      {{ lang.currentLanguage() === 'ar' ? 'الرصيد المتاح: 18 يوم' : 'Available Balance: 18 days' }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'السبب' : 'Reason' }}</label>
                  <textarea class="form-input" rows="3" [placeholder]="lang.currentLanguage() === 'ar' ? 'أدخل سبب الإجازة...' : 'Enter reason for leave...'"></textarea>
                </div>

                <div>
                  <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'المرفقات' : 'Attachments' }}</label>
                  <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer">
                    <svg class="w-8 h-8 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mt-2 text-sm text-slate-500">
                      {{ lang.currentLanguage() === 'ar' ? 'اسحب الملفات هنا أو انقر للتحميل' : 'Drag files here or click to upload' }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button class="btn btn-secondary" (click)="showNewRequestModal = false">
                  {{ lang.currentLanguage() === 'ar' ? 'إلغاء' : 'Cancel' }}
                </button>
                <button class="btn btn-primary">
                  {{ lang.currentLanguage() === 'ar' ? 'تقديم الطلب' : 'Submit Request' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class LeaveRequestsComponent implements OnInit {
  lang = inject(LanguageService);
  private mockData = inject(MockDataService);

  showNewRequestModal = false;
  searchQuery = '';
  statusFilter = '';
  leaveTypeFilter = '';

  totalRequests = signal<LeaveRequest[]>([]);
  leaveTypes: LeaveType[] = [];

  pendingCount = signal(0);
  approvedCount = signal(0);
  rejectedCount = signal(0);

  ngOnInit() {
    this.leaveTypes = this.mockData.leaveTypes;
    this.totalRequests.set(this.mockData.leaveRequests);
    this.updateCounts();
  }

  updateCounts() {
    const requests = this.totalRequests();
    this.pendingCount.set(requests.filter(r => r.status === 'pending').length);
    this.approvedCount.set(requests.filter(r => r.status === 'approved').length);
    this.rejectedCount.set(requests.filter(r => r.status === 'rejected').length);
  }

  filteredRequests(): LeaveRequest[] {
    let results = this.totalRequests();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      results = results.filter(r =>
        r.employeeName.toLowerCase().includes(q) ||
        (r.employeeNameAr && r.employeeNameAr.includes(this.searchQuery))
      );
    }

    if (this.statusFilter) {
      results = results.filter(r => r.status === this.statusFilter);
    }

    if (this.leaveTypeFilter) {
      results = results.filter(r => r.leaveTypeId === this.leaveTypeFilter);
    }

    return results;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      case 'cancelled': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      'pending': { en: 'Pending', ar: 'قيد الانتظار' },
      'approved': { en: 'Approved', ar: 'موافق عليه' },
      'rejected': { en: 'Rejected', ar: 'مرفوض' },
      'cancelled': { en: 'Cancelled', ar: 'ملغي' }
    };
    const label = labels[status] || { en: status, ar: status };
    return this.lang.currentLanguage() === 'ar' ? label.ar : label.en;
  }

  getLeaveTypeBadgeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'annual leave': return 'badge-success';
      case 'sick leave': return 'badge-warning';
      case 'emergency leave': return 'badge-danger';
      default: return 'badge-info';
    }
  }

  approveRequest(request: LeaveRequest) {
    request.status = 'approved';
    this.updateCounts();
  }

  rejectRequest(request: LeaveRequest) {
    request.status = 'rejected';
    this.updateCounts();
  }

  viewDetails(request: LeaveRequest) {
    // Show details modal
  }
}
