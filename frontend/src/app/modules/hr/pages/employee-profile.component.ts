import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Employee, LeaveBalance, LeaveRequest } from '../../../core/models';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <!-- Back Link -->
      <a routerLink="/hr/employees" class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <svg class="w-4 h-4 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ lang.currentLanguage() === 'ar' ? 'العودة للدليل' : 'Back to Directory' }}
      </a>

      @if (employee()) {
        <!-- Profile Header -->
        <div class="card mb-6">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-6">
              <!-- Avatar -->
              <div class="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-3xl font-bold">
                {{ getInitials(employee()!) }}
              </div>

              <!-- Info -->
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-slate-900">
                  {{ lang.currentLanguage() === 'ar' && employee()!.firstNameAr
                    ? employee()!.firstNameAr + ' ' + (employee()!.lastNameAr || '')
                    : employee()!.firstName + ' ' + employee()!.lastName }}
                </h1>
                <p class="text-slate-600 mt-1">
                  {{ lang.currentLanguage() === 'ar' ? employee()!.positionTitleAr : employee()!.positionTitle }}
                  &bull;
                  {{ lang.currentLanguage() === 'ar' ? employee()!.departmentNameAr : employee()!.departmentName }}
                </p>

                <div class="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                  <div class="flex items-center gap-2">
                    <span>📧</span>
                    <span dir="ltr" class="inline-block">{{ employee()!.workEmail }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>📱</span>
                    <span dir="ltr" class="inline-block">{{ employee()!.phone }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span>📍</span>
                    <span>Head Office</span>
                  </div>
                </div>

                <div class="flex items-center gap-3 mt-4">
                  <span class="badge" [class]="getStatusBadgeClass(employee()!.status)">
                    {{ getStatusLabel(employee()!.status) }}
                  </span>
                  <span class="text-sm text-slate-500">
                    📅 {{ lang.currentLanguage() === 'ar' ? 'انضم في' : 'Joined' }} {{ lang.formatDate(employee()!.joinDate) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button class="btn btn-secondary">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ lang.currentLanguage() === 'ar' ? 'تعديل' : 'Edit' }}
                </button>
                <button class="btn btn-ghost">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="card">
          <div class="border-b border-slate-200">
            <div class="flex overflow-x-auto">
              <button
                (click)="activeTab.set('personal')"
                class="tab"
                [class.active]="activeTab() === 'personal'"
              >
                {{ lang.currentLanguage() === 'ar' ? 'المعلومات الشخصية' : 'Personal Info' }}
              </button>
              <button
                (click)="activeTab.set('employment')"
                class="tab"
                [class.active]="activeTab() === 'employment'"
              >
                {{ lang.currentLanguage() === 'ar' ? 'معلومات التوظيف' : 'Employment' }}
              </button>
              <button
                (click)="activeTab.set('leave')"
                class="tab"
                [class.active]="activeTab() === 'leave'"
              >
                {{ lang.currentLanguage() === 'ar' ? 'الإجازات' : 'Leave' }}
              </button>
              <button
                (click)="activeTab.set('documents')"
                class="tab"
                [class.active]="activeTab() === 'documents'"
              >
                {{ lang.currentLanguage() === 'ar' ? 'المستندات' : 'Documents' }}
              </button>
              <button
                (click)="activeTab.set('activity')"
                class="tab"
                [class.active]="activeTab() === 'activity'"
              >
                {{ lang.currentLanguage() === 'ar' ? 'النشاط' : 'Activity' }}
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- Personal Tab -->
            @if (activeTab() === 'personal') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Basic Info -->
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">
                    {{ lang.currentLanguage() === 'ar' ? 'المعلومات الأساسية' : 'Basic Information' }}
                  </h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الاسم الكامل' : 'Full Name' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ employee()!.firstName }} {{ employee()!.lastName }}</dd>
                    </div>
                    @if (employee()!.firstNameAr) {
                      <div class="flex">
                        <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الاسم بالعربية' : 'Arabic Name' }}</dt>
                        <dd class="flex-1 text-sm text-slate-900">{{ employee()!.firstNameAr }} {{ employee()!.lastNameAr }}</dd>
                      </div>
                    }
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'رقم الموظف' : 'Employee ID' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900 font-mono">{{ employee()!.employeeId }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الجنس' : 'Gender' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ employee()!.gender === 'male' ? (lang.currentLanguage() === 'ar' ? 'ذكر' : 'Male') : (lang.currentLanguage() === 'ar' ? 'أنثى' : 'Female') }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ lang.formatDate(employee()!.dateOfBirth) }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الجنسية' : 'Nationality' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ employee()!.nationality }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'رقم الهوية' : 'National ID' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900 font-mono">{{ employee()!.nationalId }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الحالة الاجتماعية' : 'Marital Status' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ getMaritalStatusLabel(employee()!.maritalStatus) }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Contact Info -->
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">
                    {{ lang.currentLanguage() === 'ar' ? 'معلومات الاتصال' : 'Contact Information' }}
                  </h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'البريد الوظيفي' : 'Work Email' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900"><span dir="ltr" class="inline-block">{{ employee()!.workEmail }}</span></dd>
                    </div>
                    @if (employee()!.personalEmail) {
                      <div class="flex">
                        <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'البريد الشخصي' : 'Personal Email' }}</dt>
                        <dd class="flex-1 text-sm text-slate-900"><span dir="ltr" class="inline-block">{{ employee()!.personalEmail }}</span></dd>
                      </div>
                    }
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الهاتف' : 'Phone' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900"><span dir="ltr" class="inline-block">{{ employee()!.phone }}</span></dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'العنوان' : 'Address' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ employee()!.address }}</dd>
                    </div>
                  </dl>

                  <h3 class="text-lg font-semibold text-slate-900 mb-4 mt-8">
                    {{ lang.currentLanguage() === 'ar' ? 'جهة اتصال الطوارئ' : 'Emergency Contact' }}
                  </h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الاسم' : 'Name' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ employee()!.emergencyContactName }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'صلة القرابة' : 'Relationship' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ employee()!.emergencyContactRelation }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الهاتف' : 'Phone' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900"><span dir="ltr" class="inline-block">{{ employee()!.emergencyContactPhone }}</span></dd>
                    </div>
                  </dl>
                </div>
              </div>
            }

            <!-- Employment Tab -->
            @if (activeTab() === 'employment') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">
                    {{ lang.currentLanguage() === 'ar' ? 'المنصب الحالي' : 'Current Position' }}
                  </h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'المنصب' : 'Job Title' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ lang.currentLanguage() === 'ar' ? employee()!.positionTitleAr : employee()!.positionTitle }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'القسم' : 'Department' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ lang.currentLanguage() === 'ar' ? employee()!.departmentNameAr : employee()!.departmentName }}</dd>
                    </div>
                    @if (employee()!.managerName) {
                      <div class="flex">
                        <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'يتبع لـ' : 'Reports To' }}</dt>
                        <dd class="flex-1 text-sm text-slate-900">{{ employee()!.managerName }}</dd>
                      </div>
                    }
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'موقع العمل' : 'Work Location' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ lang.currentLanguage() === 'ar' ? 'المكتب الرئيسي' : 'Head Office' }}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">
                    {{ lang.currentLanguage() === 'ar' ? 'تفاصيل التوظيف' : 'Employment Details' }}
                  </h3>
                  <dl class="space-y-3">
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'نوع التوظيف' : 'Employment Type' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ getEmploymentTypeLabel(employee()!.employmentType) }}</dd>
                    </div>
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'تاريخ الانضمام' : 'Join Date' }}</dt>
                      <dd class="flex-1 text-sm text-slate-900">{{ lang.formatDate(employee()!.joinDate) }}</dd>
                    </div>
                    @if (employee()!.probationEndDate) {
                      <div class="flex">
                        <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'نهاية التجربة' : 'Probation End' }}</dt>
                        <dd class="flex-1 text-sm text-slate-900">{{ lang.formatDate(employee()!.probationEndDate!) }}</dd>
                      </div>
                    }
                    <div class="flex">
                      <dt class="w-1/3 text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</dt>
                      <dd class="flex-1">
                        <span class="badge" [class]="getStatusBadgeClass(employee()!.status)">{{ getStatusLabel(employee()!.status) }}</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            }

            <!-- Leave Tab -->
            @if (activeTab() === 'leave') {
              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-4">
                  {{ lang.currentLanguage() === 'ar' ? 'أرصدة الإجازات' : 'Leave Balances' }}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  @for (balance of leaveBalances(); track balance.id) {
                    <div class="p-4 bg-slate-50 rounded-lg">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-slate-700">
                          {{ lang.currentLanguage() === 'ar' ? balance.leaveTypeNameAr : balance.leaveTypeName }}
                        </span>
                        <span class="text-xs px-2 py-0.5 rounded-full" [style.background-color]="balance.color + '20'" [style.color]="balance.color">
                          {{ balance.remaining }}/{{ balance.entitled }}
                        </span>
                      </div>
                      <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full"
                          [style.width.%]="(balance.taken / balance.entitled) * 100"
                          [style.background-color]="balance.color"
                        ></div>
                      </div>
                      <div class="flex justify-between mt-2 text-xs text-slate-500">
                        <span>{{ lang.currentLanguage() === 'ar' ? 'مستخدم:' : 'Used:' }} {{ balance.taken }}</span>
                        <span>{{ lang.currentLanguage() === 'ar' ? 'متبقي:' : 'Remaining:' }} {{ balance.remaining }}</span>
                      </div>
                    </div>
                  }
                </div>

                <h3 class="text-lg font-semibold text-slate-900 mb-4">
                  {{ lang.currentLanguage() === 'ar' ? 'سجل الإجازات' : 'Leave History' }}
                </h3>
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ lang.currentLanguage() === 'ar' ? 'النوع' : 'Type' }}</th>
                        <th>{{ lang.currentLanguage() === 'ar' ? 'من' : 'From' }}</th>
                        <th>{{ lang.currentLanguage() === 'ar' ? 'إلى' : 'To' }}</th>
                        <th>{{ lang.currentLanguage() === 'ar' ? 'الأيام' : 'Days' }}</th>
                        <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (request of leaveRequests(); track request.id) {
                        <tr>
                          <td>{{ lang.currentLanguage() === 'ar' ? request.leaveTypeNameAr : request.leaveTypeName }}</td>
                          <td>{{ lang.formatDate(request.startDate) }}</td>
                          <td>{{ lang.formatDate(request.endDate) }}</td>
                          <td>{{ request.totalDays }}</td>
                          <td>
                            <span class="badge" [class]="getLeaveStatusBadgeClass(request.status)">
                              {{ getLeaveStatusLabel(request.status) }}
                            </span>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="5" class="text-center py-8 text-slate-500">
                            {{ lang.currentLanguage() === 'ar' ? 'لا توجد إجازات' : 'No leave history' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- Documents Tab -->
            @if (activeTab() === 'documents') {
              <div class="text-center py-12 text-slate-500">
                <svg class="w-16 h-16 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="mt-4 font-medium">{{ lang.currentLanguage() === 'ar' ? 'لا توجد مستندات' : 'No documents yet' }}</p>
                <button class="btn btn-primary mt-4">
                  {{ lang.currentLanguage() === 'ar' ? 'رفع مستند' : 'Upload Document' }}
                </button>
              </div>
            }

            <!-- Activity Tab -->
            @if (activeTab() === 'activity') {
              <div class="space-y-4">
                <div class="flex gap-4">
                  <div class="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p class="text-sm text-slate-700">{{ lang.currentLanguage() === 'ar' ? 'تم إنشاء الملف' : 'Profile created' }}</p>
                    <p class="text-xs text-slate-400">{{ lang.formatDate(employee()!.joinDate) }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="card p-12 text-center">
          <p class="text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'جاري التحميل...' : 'Loading...' }}</p>
        </div>
      }
    </div>
  `
})
export class EmployeeProfileComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);

  employee = signal<Employee | null>(null);
  leaveBalances = signal<LeaveBalance[]>([]);
  leaveRequests = signal<LeaveRequest[]>([]);
  activeTab = signal<'personal' | 'employment' | 'leave' | 'documents' | 'activity'>('personal');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const emp = this.mockData.getEmployeeById(id);
      if (emp) {
        this.employee.set(emp);
        this.leaveBalances.set(this.mockData.getLeaveBalancesForEmployee(id));
        this.leaveRequests.set(this.mockData.getLeaveRequestsForEmployee(id));
      }
    }
    // Default to first employee for demo
    if (!this.employee()) {
      this.employee.set(this.mockData.employees[0]);
      this.leaveBalances.set(this.mockData.leaveBalances.filter(lb => lb.employeeId === 'emp-1'));
      this.leaveRequests.set(this.mockData.leaveRequests.filter(lr => lr.employeeId === 'emp-1'));
    }
  }

  getInitials(employee: Employee): string {
    return (employee.firstName[0] + employee.lastName[0]).toUpperCase();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'badge-success';
      case 'on-leave': return 'badge-warning';
      case 'probation': return 'badge-info';
      case 'terminated': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      'active': { en: 'Active', ar: 'نشط' },
      'on-leave': { en: 'On Leave', ar: 'في إجازة' },
      'probation': { en: 'Probation', ar: 'فترة تجربة' },
      'terminated': { en: 'Terminated', ar: 'منتهي' }
    };
    const label = labels[status] || { en: status, ar: status };
    return this.lang.currentLanguage() === 'ar' ? label.ar : label.en;
  }

  getMaritalStatusLabel(status: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      'single': { en: 'Single', ar: 'أعزب' },
      'married': { en: 'Married', ar: 'متزوج' },
      'divorced': { en: 'Divorced', ar: 'مطلق' },
      'widowed': { en: 'Widowed', ar: 'أرمل' }
    };
    const label = labels[status] || { en: status, ar: status };
    return this.lang.currentLanguage() === 'ar' ? label.ar : label.en;
  }

  getEmploymentTypeLabel(type: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      'full-time': { en: 'Full-time', ar: 'دوام كامل' },
      'part-time': { en: 'Part-time', ar: 'دوام جزئي' },
      'contract': { en: 'Contract', ar: 'عقد' }
    };
    const label = labels[type] || { en: type, ar: type };
    return this.lang.currentLanguage() === 'ar' ? label.ar : label.en;
  }

  getLeaveStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'rejected': return 'badge-danger';
      case 'cancelled': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  }

  getLeaveStatusLabel(status: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      'pending': { en: 'Pending', ar: 'قيد الانتظار' },
      'approved': { en: 'Approved', ar: 'موافق عليه' },
      'rejected': { en: 'Rejected', ar: 'مرفوض' },
      'cancelled': { en: 'Cancelled', ar: 'ملغي' }
    };
    const label = labels[status] || { en: status, ar: status };
    return this.lang.currentLanguage() === 'ar' ? label.ar : label.en;
  }
}
