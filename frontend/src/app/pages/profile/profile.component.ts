import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUser,
  heroEnvelope,
  heroPhone,
  heroBuildingOffice2,
  heroIdentification,
  heroCamera,
  heroPencil,
  heroShieldCheck,
  heroKey
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroUser,
      heroEnvelope,
      heroPhone,
      heroBuildingOffice2,
      heroIdentification,
      heroCamera,
      heroPencil,
      heroShieldCheck,
      heroKey
    })
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'ملفي الشخصي' : 'My Profile' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة معلوماتك الشخصية' : 'Manage your personal information' }}</p>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="card mb-6">
        <div class="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-2xl">
          <div class="absolute -bottom-12 start-6">
            <div class="relative">
              <div class="avatar w-24 h-24 text-3xl ring-4 ring-white shadow-lg">
                {{ userInitials() }}
              </div>
              <button class="absolute bottom-0 end-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors">
                <ng-icon name="heroCamera" class="text-sm"></ng-icon>
              </button>
            </div>
          </div>
        </div>
        <div class="pt-16 pb-6 px-6">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? user()?.nameAr : user()?.name }}
              </h2>
              <p class="text-gray-500">
                {{ userRole() === 'hr'
                  ? (lang.currentLanguage() === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager')
                  : (lang.currentLanguage() === 'ar' ? 'المدير المالي' : 'Finance Manager') }}
              </p>
            </div>
            <button class="btn btn-secondary">
              <ng-icon name="heroPencil" class="text-sm"></ng-icon>
              {{ lang.currentLanguage() === 'ar' ? 'تعديل' : 'Edit' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Info Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <div class="card p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrapper icon-wrapper-primary">
              <ng-icon name="heroUser" class="text-lg"></ng-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ lang.currentLanguage() === 'ar' ? 'المعلومات الشخصية' : 'Personal Information' }}
            </h3>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ng-icon name="heroUser" class="text-gray-500"></ng-icon>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الاسم الكامل' : 'Full Name' }}</div>
                <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? user()?.nameAr : user()?.name }}</div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ng-icon name="heroEnvelope" class="text-gray-500"></ng-icon>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'البريد الإلكتروني' : 'Email' }}</div>
                <div class="text-sm font-medium text-gray-900" dir="ltr">{{ user()?.email }}</div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ng-icon name="heroPhone" class="text-gray-500"></ng-icon>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'رقم الهاتف' : 'Phone' }}</div>
                <div class="text-sm font-medium text-gray-900" dir="ltr">+971 50 123 4567</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Information -->
        <div class="card p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrapper icon-wrapper-accent">
              <ng-icon name="heroBuildingOffice2" class="text-lg"></ng-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ lang.currentLanguage() === 'ar' ? 'معلومات العمل' : 'Work Information' }}
            </h3>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ng-icon name="heroIdentification" class="text-gray-500"></ng-icon>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'رقم الموظف' : 'Employee ID' }}</div>
                <div class="text-sm font-medium text-gray-900" dir="ltr">EMP-001</div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ng-icon name="heroBuildingOffice2" class="text-gray-500"></ng-icon>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'القسم' : 'Department' }}</div>
                <div class="text-sm font-medium text-gray-900">
                  {{ userRole() === 'hr'
                    ? (lang.currentLanguage() === 'ar' ? 'الموارد البشرية' : 'Human Resources')
                    : (lang.currentLanguage() === 'ar' ? 'المالية' : 'Finance') }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ng-icon name="heroShieldCheck" class="text-gray-500"></ng-icon>
              </div>
              <div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الدور' : 'Role' }}</div>
                <div class="text-sm font-medium text-gray-900">
                  {{ userRole() === 'hr'
                    ? (lang.currentLanguage() === 'ar' ? 'مدير' : 'Manager')
                    : (lang.currentLanguage() === 'ar' ? 'مدير' : 'Manager') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Section -->
      <div class="card p-6 mt-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-wrapper icon-wrapper-warning">
            <ng-icon name="heroKey" class="text-lg"></ng-icon>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ lang.currentLanguage() === 'ar' ? 'الأمان' : 'Security' }}
          </h3>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <ng-icon name="heroKey" class="text-gray-500"></ng-icon>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'كلمة المرور' : 'Password' }}</div>
              <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'آخر تغيير منذ 30 يوم' : 'Last changed 30 days ago' }}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm">
            {{ lang.currentLanguage() === 'ar' ? 'تغيير' : 'Change' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  lang = inject(LanguageService);
  private auth = inject(AuthService);

  user = this.auth.user;
  userRole = this.auth.userRole;

  userInitials(): string {
    const name = this.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
