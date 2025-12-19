import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Employee, Department } from '../../../core/models';

@Component({
  selector: 'app-employee-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'دليل الموظفين' : 'Employee Directory' }}</h1>
          <p class="text-sm text-slate-500 dark:text-gray-400 mt-1">
            {{ lang.currentLanguage() === 'ar' ? 'إدارة وعرض جميع الموظفين' : 'Manage and view all employees' }}
          </p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal = true">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ lang.currentLanguage() === 'ar' ? 'إضافة موظف' : 'Add Employee' }}
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="p-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 sm:items-center">
          <!-- Search -->
          <div class="w-full sm:flex-1 sm:min-w-48 sm:max-w-sm">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="filterEmployees()"
                [placeholder]="lang.currentLanguage() === 'ar' ? 'البحث بالاسم أو البريد أو الرقم...' : 'Search by name, email, or ID...'"
                class="form-input ps-10"
              />
              <svg class="absolute start-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filter Row -->
          <div class="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
            <!-- Department Filter -->
            <select [(ngModel)]="selectedDepartment" (ngModelChange)="filterEmployees()" class="form-select w-full sm:w-40 md:w-48">
              <option value="">{{ lang.currentLanguage() === 'ar' ? 'جميع الأقسام' : 'All Departments' }}</option>
              @for (dept of departments; track dept.id) {
                <option [value]="dept.id">{{ lang.currentLanguage() === 'ar' ? dept.nameAr : dept.name }}</option>
              }
            </select>

            <!-- Status Filter -->
            <select [(ngModel)]="selectedStatus" (ngModelChange)="filterEmployees()" class="form-select w-full sm:w-36 md:w-40">
              <option value="">{{ lang.currentLanguage() === 'ar' ? 'جميع الحالات' : 'All Status' }}</option>
              <option value="active">{{ lang.currentLanguage() === 'ar' ? 'نشط' : 'Active' }}</option>
              <option value="on-leave">{{ lang.currentLanguage() === 'ar' ? 'في إجازة' : 'On Leave' }}</option>
              <option value="probation">{{ lang.currentLanguage() === 'ar' ? 'فترة تجربة' : 'Probation' }}</option>
              <option value="terminated">{{ lang.currentLanguage() === 'ar' ? 'منتهي' : 'Terminated' }}</option>
            </select>

            <!-- Export Button -->
            <button class="btn btn-secondary w-full sm:w-auto">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {{ lang.currentLanguage() === 'ar' ? 'تصدير' : 'Export' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Employee List -->
      <div class="card overflow-hidden">
        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (employee of filteredEmployees(); track employee.id) {
            <div class="p-3 sm:p-4 border-b border-gray-100 dark:border-surface-800 last:border-b-0" (click)="viewEmployee(employee)">
              <div class="flex items-start gap-2 sm:gap-3">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold text-xs sm:text-sm shrink-0">
                  {{ getInitials(employee) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-1 sm:gap-2">
                    <div class="min-w-0 flex-1">
                      <div class="font-medium text-slate-900 dark:text-white text-sm sm:text-base truncate">
                        {{ lang.currentLanguage() === 'ar' && employee.firstNameAr
                          ? employee.firstNameAr + ' ' + (employee.lastNameAr || '')
                          : employee.firstName + ' ' + employee.lastName }}
                      </div>
                      <div class="text-xs sm:text-sm text-slate-500 dark:text-gray-400 truncate">{{ employee.workEmail }}</div>
                    </div>
                    <span class="badge shrink-0" [class]="getStatusBadgeClass(employee.status)">
                      {{ getStatusLabel(employee.status) }}
                    </span>
                  </div>
                  <div class="mt-1.5 sm:mt-2 flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-0.5 text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                    <span class="truncate">{{ lang.currentLanguage() === 'ar' ? employee.departmentNameAr : employee.departmentName }}</span>
                    <span class="text-slate-400 dark:text-gray-500 hidden sm:inline">•</span>
                    <span class="truncate">{{ lang.currentLanguage() === 'ar' ? employee.positionTitleAr : employee.positionTitle }}</span>
                  </div>
                  <div class="mt-2 sm:mt-3 flex items-center gap-2">
                    <a
                      [routerLink]="['/hr/employees', employee.id]"
                      (click)="$event.stopPropagation()"
                      class="btn btn-sm btn-secondary flex-1 text-xs sm:text-sm"
                    >
                      {{ lang.currentLanguage() === 'ar' ? 'عرض' : 'View' }}
                    </a>
                    <button
                      class="btn btn-sm btn-ghost"
                      (click)="$event.stopPropagation(); editEmployee(employee)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-center py-12">
              <div class="text-slate-400 dark:text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-lg font-medium dark:text-gray-400">{{ lang.currentLanguage() === 'ar' ? 'لا توجد نتائج' : 'No results found' }}</p>
                <p class="text-sm mt-1">{{ lang.currentLanguage() === 'ar' ? 'حاول تغيير معايير البحث' : 'Try changing your search criteria' }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th class="w-12">
                  <input type="checkbox" class="form-checkbox" (change)="toggleSelectAll($event)" [checked]="allSelected()" />
                </th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الموظف' : 'Employee' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'القسم' : 'Department' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المنصب' : 'Position' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'تاريخ الانضمام' : 'Join Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
                <th class="w-24">{{ lang.currentLanguage() === 'ar' ? 'الإجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (employee of filteredEmployees(); track employee.id) {
                <tr class="cursor-pointer" (click)="viewEmployee(employee)">
                  <td (click)="$event.stopPropagation()">
                    <input
                      type="checkbox"
                      class="form-checkbox"
                      [checked]="selectedIds().has(employee.id)"
                      (change)="toggleSelect(employee.id)"
                    />
                  </td>
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold text-sm">
                        {{ getInitials(employee) }}
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">
                          {{ lang.currentLanguage() === 'ar' && employee.firstNameAr
                            ? employee.firstNameAr + ' ' + (employee.lastNameAr || '')
                            : employee.firstName + ' ' + employee.lastName }}
                        </div>
                        <div class="text-sm text-slate-500 dark:text-gray-400">{{ employee.workEmail }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="text-slate-700 dark:text-gray-300">
                      {{ lang.currentLanguage() === 'ar' ? employee.departmentNameAr : employee.departmentName }}
                    </span>
                  </td>
                  <td>
                    <span class="text-slate-700 dark:text-gray-300">
                      {{ lang.currentLanguage() === 'ar' ? employee.positionTitleAr : employee.positionTitle }}
                    </span>
                  </td>
                  <td>
                    <span class="text-slate-600 dark:text-gray-400">{{ lang.formatDate(employee.joinDate) }}</span>
                  </td>
                  <td>
                    <span class="badge" [class]="getStatusBadgeClass(employee.status)">
                      {{ getStatusLabel(employee.status) }}
                    </span>
                  </td>
                  <td (click)="$event.stopPropagation()">
                    <div class="flex items-center gap-1">
                      <button
                        class="p-1.5 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-700 rounded"
                        [routerLink]="['/hr/employees', employee.id]"
                        [title]="lang.currentLanguage() === 'ar' ? 'عرض' : 'View'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        class="p-1.5 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-700 rounded"
                        (click)="editEmployee(employee)"
                        [title]="lang.currentLanguage() === 'ar' ? 'تعديل' : 'Edit'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        class="p-1.5 text-slate-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        (click)="deleteEmployee(employee)"
                        [title]="lang.currentLanguage() === 'ar' ? 'حذف' : 'Delete'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-12">
                    <div class="text-slate-400 dark:text-gray-500">
                      <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p class="text-lg font-medium dark:text-gray-400">{{ lang.currentLanguage() === 'ar' ? 'لا توجد نتائج' : 'No results found' }}</p>
                      <p class="text-sm mt-1">{{ lang.currentLanguage() === 'ar' ? 'حاول تغيير معايير البحث' : 'Try changing your search criteria' }}</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 border-t border-slate-200 dark:border-surface-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-sm text-slate-500 dark:text-gray-400 text-center sm:text-start">
            {{ lang.currentLanguage() === 'ar' ? 'عرض' : 'Showing' }}
            <span class="font-medium">1-{{ Math.min(filteredEmployees().length, 10) }}</span>
            {{ lang.currentLanguage() === 'ar' ? 'من' : 'of' }}
            <span class="font-medium">{{ filteredEmployees().length }}</span>
            {{ lang.currentLanguage() === 'ar' ? 'موظف' : 'employees' }}
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm btn-secondary" disabled>
              <svg class="w-4 h-4 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium">1</span>
            <button class="btn btn-sm btn-secondary">
              <svg class="w-4 h-4 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Employee Modal -->
      @if (showAddModal) {
        <div class="modal-overlay" (click)="showAddModal = false"></div>
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="modal-content w-full max-w-2xl" (click)="$event.stopPropagation()">
              <div class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-surface-700">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ lang.currentLanguage() === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee' }}
                </h3>
                <button (click)="showAddModal = false" class="p-2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-700 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="px-4 sm:px-6 py-5 max-h-[60vh] overflow-y-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'الاسم الأول (English)' : 'First Name (English)' }} *</label>
                    <input type="text" class="form-input" placeholder="Ahmed" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'اسم العائلة (English)' : 'Last Name (English)' }} *</label>
                    <input type="text" class="form-input" placeholder="Al-Balushi" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'الاسم الأول (عربي)' : 'First Name (Arabic)' }}</label>
                    <input type="text" class="form-input" placeholder="أحمد" dir="rtl" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'اسم العائلة (عربي)' : 'Last Name (Arabic)' }}</label>
                    <input type="text" class="form-input" placeholder="البلوشي" dir="rtl" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'البريد الإلكتروني' : 'Work Email' }} *</label>
                    <input type="email" class="form-input" placeholder="ahmed@opensky.om" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'رقم الهاتف' : 'Phone Number' }} *</label>
                    <input type="tel" class="form-input" placeholder="+968 9123 4567" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'القسم' : 'Department' }} *</label>
                    <select class="form-select">
                      <option value="">{{ lang.currentLanguage() === 'ar' ? 'اختر القسم' : 'Select Department' }}</option>
                      @for (dept of departments; track dept.id) {
                        <option [value]="dept.id">{{ lang.currentLanguage() === 'ar' ? dept.nameAr : dept.name }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'المنصب' : 'Position' }} *</label>
                    <select class="form-select">
                      <option value="">{{ lang.currentLanguage() === 'ar' ? 'اختر المنصب' : 'Select Position' }}</option>
                      @for (pos of positions; track pos.id) {
                        <option [value]="pos.id">{{ lang.currentLanguage() === 'ar' ? pos.titleAr : pos.title }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'تاريخ الانضمام' : 'Join Date' }} *</label>
                    <input type="date" class="form-input" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'نوع التوظيف' : 'Employment Type' }} *</label>
                    <select class="form-select">
                      <option value="full-time">{{ lang.currentLanguage() === 'ar' ? 'دوام كامل' : 'Full-time' }}</option>
                      <option value="part-time">{{ lang.currentLanguage() === 'ar' ? 'دوام جزئي' : 'Part-time' }}</option>
                      <option value="contract">{{ lang.currentLanguage() === 'ar' ? 'عقد' : 'Contract' }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-800">
                <button class="btn btn-secondary w-full sm:w-auto" (click)="showAddModal = false">
                  {{ lang.currentLanguage() === 'ar' ? 'إلغاء' : 'Cancel' }}
                </button>
                <button class="btn btn-primary w-full sm:w-auto">
                  {{ lang.currentLanguage() === 'ar' ? 'إضافة الموظف' : 'Add Employee' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class EmployeeDirectoryComponent implements OnInit {
  lang = inject(LanguageService);
  private mockData = inject(MockDataService);

  Math = Math;
  showAddModal = false;

  employees = signal<Employee[]>([]);
  filteredEmployees = signal<Employee[]>([]);
  selectedIds = signal<Set<string>>(new Set());

  departments: Department[] = [];
  positions = this.mockData.positions;

  searchQuery = '';
  selectedDepartment = '';
  selectedStatus = '';

  allSelected = computed(() => {
    const employees = this.filteredEmployees();
    const selected = this.selectedIds();
    return employees.length > 0 && employees.every(e => selected.has(e.id));
  });

  ngOnInit() {
    this.departments = this.mockData.departments;
    this.employees.set(this.mockData.employees);
    this.filteredEmployees.set(this.mockData.employees);
  }

  filterEmployees() {
    let results = this.employees();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      results = results.filter(e =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q) ||
        e.workEmail.toLowerCase().includes(q) ||
        (e.firstNameAr && e.firstNameAr.includes(this.searchQuery)) ||
        (e.lastNameAr && e.lastNameAr.includes(this.searchQuery))
      );
    }

    if (this.selectedDepartment) {
      results = results.filter(e => e.departmentId === this.selectedDepartment);
    }

    if (this.selectedStatus) {
      results = results.filter(e => e.status === this.selectedStatus);
    }

    this.filteredEmployees.set(results);
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

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedIds.set(new Set(this.filteredEmployees().map(e => e.id)));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  toggleSelect(id: string) {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  viewEmployee(employee: Employee) {
    // Navigate to employee detail
  }

  editEmployee(employee: Employee) {
    // Open edit modal
  }

  deleteEmployee(employee: Employee) {
    // Show delete confirmation
  }
}
