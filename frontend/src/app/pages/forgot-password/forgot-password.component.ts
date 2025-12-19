import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroEnvelope,
  heroArrowLeft,
  heroCheckCircle,
  heroGlobeAlt
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroEnvelope,
      heroArrowLeft,
      heroCheckCircle,
      heroGlobeAlt
    })
  ],
  template: `
    <div class="min-h-screen flex" [dir]="lang.direction()">
      <!-- Left Panel - Form -->
      <div class="flex-1 flex items-center justify-center p-8 bg-white">
        <div class="w-full max-w-md">
          <!-- Back to Login -->
          <a routerLink="/login" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-8 transition-colors">
            <ng-icon name="heroArrowLeft" class="text-lg flip-rtl"></ng-icon>
            {{ lang.currentLanguage() === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Sign In' }}
          </a>

          @if (!submitted()) {
            <!-- Header -->
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ lang.currentLanguage() === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?' }}
            </h1>
            <p class="text-gray-500 mb-8">
              {{ lang.currentLanguage() === 'ar'
                ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'
                : 'Enter your email and we will send you a reset link' }}
            </p>

            <!-- Form -->
            <form (ngSubmit)="onSubmit()" class="space-y-5">
              <!-- Email -->
              <div>
                <label class="form-label">
                  {{ lang.currentLanguage() === 'ar' ? 'البريد الإلكتروني' : 'Email' }}
                </label>
                <div class="relative">
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    class="form-input ps-11"
                    [placeholder]="lang.currentLanguage() === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'"
                    required
                  />
                  <ng-icon name="heroEnvelope" class="absolute start-4 top-3.5 text-gray-400"></ng-icon>
                </div>
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
                {{ lang.currentLanguage() === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link' }}
              </button>
            </form>
          } @else {
            <!-- Success State -->
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-success-50 text-success-500 flex items-center justify-center">
                <ng-icon name="heroCheckCircle" class="text-3xl"></ng-icon>
              </div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">
                {{ lang.currentLanguage() === 'ar' ? 'تم الإرسال!' : 'Check Your Email' }}
              </h1>
              <p class="text-gray-500 mb-8">
                {{ lang.currentLanguage() === 'ar'
                  ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
                  : 'We have sent a password reset link to' }}
                <span class="block font-semibold text-gray-700 mt-1">{{ email }}</span>
              </p>
              <button
                (click)="submitted.set(false); email = ''"
                class="btn btn-secondary"
              >
                {{ lang.currentLanguage() === 'ar' ? 'إرسال مرة أخرى' : 'Send Again' }}
              </button>
            </div>
          }

          <!-- Language Toggle -->
          <div class="mt-8 text-center">
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
      <div class="hidden lg:flex lg:flex-1 items-center justify-center relative overflow-hidden" style="background: linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A855F7 100%);">
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px;"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <div class="w-36 h-36 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/20">
            <img src="assets/logo.png" alt="OpenSky" class="h-28 w-28 object-contain" />
          </div>
          <h2 class="text-3xl font-bold text-white">OpenSky ERP</h2>
          <p class="text-white/70 mt-2 text-lg">{{ lang.currentLanguage() === 'ar' ? 'نظام إدارة موارد المؤسسات' : 'Enterprise Resource Planning' }}</p>
        </div>

        <!-- Decorative Circles with purple/teal tint -->
        <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full" style="background: radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%);"></div>
        <div class="absolute -top-16 -left-16 w-64 h-64 rounded-full" style="background: radial-gradient(circle, rgba(192,132,252,0.2) 0%, transparent 70%);"></div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  lang = inject(LanguageService);

  email = '';
  isLoading = signal(false);
  submitted = signal(false);

  onSubmit() {
    if (!this.email) return;

    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.submitted.set(true);
    }, 1000);
  }
}
