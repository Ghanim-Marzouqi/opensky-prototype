import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCog6Tooth,
  heroGlobeAlt,
  heroBell,
  heroMoon,
  heroSun,
  heroPaintBrush,
  heroShieldCheck,
  heroDevicePhoneMobile,
  heroEnvelope,
  heroCheckCircle
} from '@ng-icons/heroicons/outline';

interface SettingOption {
  id: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroCog6Tooth,
      heroGlobeAlt,
      heroBell,
      heroMoon,
      heroSun,
      heroPaintBrush,
      heroShieldCheck,
      heroDevicePhoneMobile,
      heroEnvelope,
      heroCheckCircle
    })
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'الإعدادات' : 'Settings' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة تفضيلات حسابك' : 'Manage your account preferences' }}</p>
        </div>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- Language & Region -->
        <div class="card p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrapper icon-wrapper-primary">
              <ng-icon name="heroGlobeAlt" class="text-lg"></ng-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'اللغة والمنطقة' : 'Language & Region' }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ lang.currentLanguage() === 'ar' ? 'تخصيص إعدادات اللغة والمنطقة' : 'Customize language and regional settings' }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Language Selection -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'اللغة' : 'Language' }}</div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'اختر لغة الواجهة' : 'Choose interface language' }}</div>
              </div>
              <div class="flex gap-2">
                <button
                  (click)="lang.setLanguage('en')"
                  class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                  [class.bg-primary-600]="lang.currentLanguage() === 'en'"
                  [class.text-white]="lang.currentLanguage() === 'en'"
                  [class.bg-white]="lang.currentLanguage() !== 'en'"
                  [class.text-gray-700]="lang.currentLanguage() !== 'en'"
                  [class.border]="lang.currentLanguage() !== 'en'"
                  [class.border-gray-200]="lang.currentLanguage() !== 'en'"
                >
                  English
                </button>
                <button
                  (click)="lang.setLanguage('ar')"
                  class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                  [class.bg-primary-600]="lang.currentLanguage() === 'ar'"
                  [class.text-white]="lang.currentLanguage() === 'ar'"
                  [class.bg-white]="lang.currentLanguage() !== 'ar'"
                  [class.text-gray-700]="lang.currentLanguage() !== 'ar'"
                  [class.border]="lang.currentLanguage() !== 'ar'"
                  [class.border-gray-200]="lang.currentLanguage() !== 'ar'"
                >
                  العربية
                </button>
              </div>
            </div>

            <!-- Timezone -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'المنطقة الزمنية' : 'Timezone' }}</div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'منطقتك الزمنية الحالية' : 'Your current timezone' }}</div>
              </div>
              <select class="form-select w-auto py-2 text-sm">
                <option value="asia/muscat">{{ lang.currentLanguage() === 'ar' ? 'مسقط (GMT+4)' : 'Muscat (GMT+4)' }}</option>
                <option value="asia/riyadh">{{ lang.currentLanguage() === 'ar' ? 'الرياض (GMT+3)' : 'Riyadh (GMT+3)' }}</option>
                <option value="asia/dubai">{{ lang.currentLanguage() === 'ar' ? 'دبي (GMT+4)' : 'Dubai (GMT+4)' }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="card p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrapper icon-wrapper-accent">
              <ng-icon name="heroBell" class="text-lg"></ng-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'الإشعارات' : 'Notifications' }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ lang.currentLanguage() === 'ar' ? 'إدارة تفضيلات الإشعارات' : 'Manage notification preferences' }}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            @for (option of notificationOptions(); track option.id) {
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div class="flex items-center gap-3">
                  <ng-icon [name]="option.id === 'email' ? 'heroEnvelope' : 'heroDevicePhoneMobile'" class="text-lg text-gray-500"></ng-icon>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? option.labelAr : option.labelEn }}</div>
                    <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? option.descriptionAr : option.descriptionEn }}</div>
                  </div>
                </div>
                <button
                  (click)="toggleOption(option)"
                  class="relative w-12 h-6 rounded-full transition-colors"
                  [class.bg-primary-600]="option.enabled"
                  [class.bg-gray-300]="!option.enabled"
                >
                  <span
                    class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                    [class.start-1]="!option.enabled"
                    [class.start-7]="option.enabled"
                  ></span>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Appearance -->
        <div class="card p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrapper icon-wrapper-warning">
              <ng-icon name="heroPaintBrush" class="text-lg"></ng-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'المظهر' : 'Appearance' }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ lang.currentLanguage() === 'ar' ? 'تخصيص مظهر التطبيق' : 'Customize app appearance' }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-surface-800 rounded-xl">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ lang.currentLanguage() === 'ar' ? 'الوضع' : 'Theme' }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ lang.currentLanguage() === 'ar' ? 'اختر المظهر المفضل' : 'Choose your preferred theme' }}</div>
            </div>
            <div class="flex gap-2">
              <button
                (click)="theme.setTheme('light')"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
                [class.bg-primary-600]="theme.currentTheme() === 'light'"
                [class.text-white]="theme.currentTheme() === 'light'"
                [class.bg-white]="theme.currentTheme() !== 'light'"
                [class.dark:bg-surface-700]="theme.currentTheme() !== 'light'"
                [class.text-gray-700]="theme.currentTheme() !== 'light'"
                [class.dark:text-gray-300]="theme.currentTheme() !== 'light'"
                [class.border]="theme.currentTheme() !== 'light'"
                [class.border-gray-200]="theme.currentTheme() !== 'light'"
                [class.dark:border-surface-600]="theme.currentTheme() !== 'light'"
              >
                <ng-icon name="heroSun" class="text-sm"></ng-icon>
                {{ lang.currentLanguage() === 'ar' ? 'فاتح' : 'Light' }}
              </button>
              <button
                (click)="theme.setTheme('dark')"
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
                [class.bg-primary-600]="theme.currentTheme() === 'dark'"
                [class.text-white]="theme.currentTheme() === 'dark'"
                [class.bg-white]="theme.currentTheme() !== 'dark'"
                [class.dark:bg-surface-700]="theme.currentTheme() !== 'dark'"
                [class.text-gray-700]="theme.currentTheme() !== 'dark'"
                [class.dark:text-gray-300]="theme.currentTheme() !== 'dark'"
                [class.border]="theme.currentTheme() !== 'dark'"
                [class.border-gray-200]="theme.currentTheme() !== 'dark'"
                [class.dark:border-surface-600]="theme.currentTheme() !== 'dark'"
              >
                <ng-icon name="heroMoon" class="text-sm"></ng-icon>
                {{ lang.currentLanguage() === 'ar' ? 'داكن' : 'Dark' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="card p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrapper icon-wrapper-success">
              <ng-icon name="heroShieldCheck" class="text-lg"></ng-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ lang.currentLanguage() === 'ar' ? 'الأمان' : 'Security' }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ lang.currentLanguage() === 'ar' ? 'إدارة إعدادات الأمان' : 'Manage security settings' }}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication' }}</div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'إضافة طبقة أمان إضافية' : 'Add an extra layer of security' }}</div>
              </div>
              <button class="btn btn-secondary btn-sm">
                {{ lang.currentLanguage() === 'ar' ? 'تفعيل' : 'Enable' }}
              </button>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'سجل الجلسات' : 'Session History' }}</div>
                <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'عرض الأجهزة المتصلة' : 'View connected devices' }}</div>
              </div>
              <button class="btn btn-secondary btn-sm">
                {{ lang.currentLanguage() === 'ar' ? 'عرض' : 'View' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end mt-6">
        <button class="btn btn-primary">
          <ng-icon name="heroCheckCircle" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'حفظ التغييرات' : 'Save Changes' }}
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent {
  lang = inject(LanguageService);
  theme = inject(ThemeService);

  notificationOptions = signal<SettingOption[]>([
    {
      id: 'email',
      labelEn: 'Email Notifications',
      labelAr: 'إشعارات البريد الإلكتروني',
      descriptionEn: 'Receive updates via email',
      descriptionAr: 'استلام التحديثات عبر البريد الإلكتروني',
      enabled: true
    },
    {
      id: 'push',
      labelEn: 'Push Notifications',
      labelAr: 'الإشعارات الفورية',
      descriptionEn: 'Receive push notifications',
      descriptionAr: 'استلام الإشعارات الفورية',
      enabled: true
    }
  ]);

  toggleOption(option: SettingOption) {
    option.enabled = !option.enabled;
    this.notificationOptions.update(options => [...options]);
  }
}
