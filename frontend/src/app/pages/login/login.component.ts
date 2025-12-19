import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUser,
  heroLockClosed,
  heroEye,
  heroEyeSlash,
  heroGlobeAlt,
  heroExclamationCircle
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroUser,
      heroLockClosed,
      heroEye,
      heroEyeSlash,
      heroGlobeAlt,
      heroExclamationCircle
    })
  ],
  template: `
    <div class="min-h-screen flex" [dir]="lang.direction()">
      <!-- Left Panel - Login Form -->
      <div class="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div class="w-full max-w-md">
          <!-- Sign In Header -->
          <h1 class="text-2xl font-bold text-gray-900 mb-8">
            {{ lang.currentLanguage() === 'ar' ? 'تسجيل الدخول' : 'Sign In' }}
          </h1>

          <!-- Error Message -->
          @if (error()) {
            <div class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-center gap-3 text-danger-700">
              <ng-icon name="heroExclamationCircle" class="text-xl flex-shrink-0"></ng-icon>
              <span class="text-sm">{{ error() }}</span>
            </div>
          }

          <!-- Login Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Username -->
            <div>
              <label class="form-label">
                {{ lang.currentLanguage() === 'ar' ? 'اسم المستخدم' : 'Username' }}
              </label>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="username"
                  name="username"
                  class="form-input ps-11"
                  [placeholder]="lang.currentLanguage() === 'ar' ? 'أدخل اسم المستخدم' : 'Enter your username'"
                  required
                />
                <ng-icon name="heroUser" class="absolute start-4 top-3.5 text-gray-400"></ng-icon>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="form-label">
                {{ lang.currentLanguage() === 'ar' ? 'كلمة المرور' : 'Password' }}
              </label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  class="form-input ps-11 pe-11"
                  [placeholder]="lang.currentLanguage() === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'"
                  required
                />
                <ng-icon name="heroLockClosed" class="absolute start-4 top-3.5 text-gray-400"></ng-icon>
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute end-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <ng-icon [name]="showPassword() ? 'heroEyeSlash' : 'heroEye'"></ng-icon>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-gray-600">
                  {{ lang.currentLanguage() === 'ar' ? 'تذكرني' : 'Remember me' }}
                </span>
              </label>
              <a routerLink="/forgot-password" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                {{ lang.currentLanguage() === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?' }}
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-full py-3"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              }
              {{ lang.currentLanguage() === 'ar' ? 'تسجيل الدخول' : 'Sign In' }}
            </button>
          </form>

          <!-- Demo Credentials -->
          <div class="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {{ lang.currentLanguage() === 'ar' ? 'بيانات تجريبية' : 'Demo Credentials' }}
            </p>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                (click)="fillCredentials('hr.manager', 'hr123')"
              >
                <div>
                  <div class="text-sm font-semibold text-gray-900">
                    {{ lang.currentLanguage() === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager' }}
                  </div>
                  <div class="text-xs text-gray-500">hr.manager / hr123</div>
                </div>
                <span class="badge badge-primary">HR</span>
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-accent-300 hover:bg-accent-50/30 transition-all"
                (click)="fillCredentials('finance.manager', 'fin123')"
              >
                <div>
                  <div class="text-sm font-semibold text-gray-900">
                    {{ lang.currentLanguage() === 'ar' ? 'مدير المالية' : 'Finance Manager' }}
                  </div>
                  <div class="text-xs text-gray-500">finance.manager / fin123</div>
                </div>
                <span class="badge badge-info">Finance</span>
              </div>
            </div>
          </div>

          <!-- Language Toggle -->
          <div class="mt-6 text-center">
            <button
              (click)="lang.toggleLanguage()"
              class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ng-icon name="heroGlobeAlt" class="text-lg"></ng-icon>
              {{ lang.currentLanguage() === 'ar' ? 'English' : 'العربية' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel - Decorative (Prodify-style purple gradient) -->
      <div class="hidden md:flex md:flex-1 items-center justify-center relative overflow-hidden" style="background: linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A855F7 100%);">
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-center p-8 lg:p-12 text-center">
          <div class="w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/20">
            <img src="assets/logo.png" alt="OpenSky" class="h-20 w-20 lg:h-28 lg:w-28 object-contain" />
          </div>
          <h2 class="text-2xl lg:text-3xl font-bold text-white">OpenSky ERP</h2>
          <p class="text-white/70 mt-2 text-base lg:text-lg">{{ lang.currentLanguage() === 'ar' ? 'نظام إدارة موارد المؤسسات' : 'Enterprise Resource Planning' }}</p>
        </div>

        <!-- Decorative Circles with purple/teal tint -->
        <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full" style="background: radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%);"></div>
        <div class="absolute -top-16 -left-16 w-64 h-64 rounded-full" style="background: radial-gradient(circle, rgba(192,132,252,0.2) 0%, transparent 70%);"></div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  lang = inject(LanguageService);

  username = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    // Redirect if already logged in
    if (this.auth.isAuthenticated()) {
      this.router.navigate([this.auth.getDefaultRoute()]);
    }
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  fillCredentials(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.error.set(null);
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.error.set(this.lang.currentLanguage() === 'ar'
        ? 'يرجى إدخال اسم المستخدم وكلمة المرور'
        : 'Please enter username and password');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // Simulate network delay
    setTimeout(() => {
      const result = this.auth.login(this.username, this.password);

      if (result.success) {
        this.router.navigate([this.auth.getDefaultRoute()]);
      } else {
        this.error.set(this.lang.currentLanguage() === 'ar'
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
          : result.error || 'Invalid credentials');
      }

      this.isLoading.set(false);
    }, 500);
  }
}
