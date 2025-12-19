import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { FinanceDashboardStats, Payment } from '../../../core/models';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBanknotes,
  heroArrowTrendingUp,
  heroArrowTrendingDown,
  heroWallet,
  heroCurrencyDollar,
  heroArrowPath,
  heroExclamationCircle,
  heroInformationCircle,
  heroArrowDownTray,
  heroArrowUpTray
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroBanknotes,
      heroArrowTrendingUp,
      heroArrowTrendingDown,
      heroWallet,
      heroCurrencyDollar,
      heroArrowPath,
      heroExclamationCircle,
      heroInformationCircle,
      heroArrowDownTray,
      heroArrowUpTray
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header flex-col sm:flex-row items-start sm:items-center gap-4">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'لوحة التحكم - المالية' : 'Finance Dashboard' }}</h1>
          <p class="page-subtitle">
            {{ lang.currentLanguage() === 'ar' ? 'نظرة عامة على الوضع المالي' : 'Financial overview and key metrics' }}
          </p>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <select class="form-select flex-1 sm:flex-none sm:w-44">
            <option>{{ lang.currentLanguage() === 'ar' ? 'هذا الشهر' : 'This Month' }}</option>
            <option>{{ lang.currentLanguage() === 'ar' ? 'الشهر الماضي' : 'Last Month' }}</option>
            <option>{{ lang.currentLanguage() === 'ar' ? 'هذا العام' : 'This Year' }}</option>
          </select>
          <button class="btn btn-secondary btn-icon shrink-0">
            <ng-icon name="heroArrowPath" class="text-lg"></ng-icon>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-5 mb-4 sm:mb-8">
        <!-- Revenue -->
        <div class="stat-card">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-success-light text-success-600">
              <ng-icon name="heroBanknotes" class="text-lg sm:text-2xl"></ng-icon>
            </div>
            <span class="stat-card-change positive hidden sm:inline-flex">
              <ng-icon name="heroArrowTrendingUp" class="text-sm"></ng-icon>
              {{ stats()?.revenueChange }}%
            </span>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(stats()?.revenue || 0) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'الإيرادات' : 'Revenue (MTD)' }}</div>
        </div>

        <!-- Receivables -->
        <div class="stat-card cursor-pointer" routerLink="/finance/ar-aging">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-primary-light text-primary-600">
              <ng-icon name="heroArrowDownTray" class="text-lg sm:text-2xl"></ng-icon>
            </div>
            <span class="text-[10px] sm:text-sm font-semibold text-slate-500 hidden sm:inline">{{ stats()?.receivablesCount }} {{ lang.currentLanguage() === 'ar' ? 'فاتورة' : 'invoices' }}</span>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(stats()?.receivables || 0) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'المستحقات' : 'Receivables' }}</div>
        </div>

        <!-- Payables -->
        <div class="stat-card cursor-pointer" routerLink="/finance/ap-aging">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-warning-light text-warning-600">
              <ng-icon name="heroArrowUpTray" class="text-lg sm:text-2xl"></ng-icon>
            </div>
            <span class="text-[10px] sm:text-sm font-semibold text-slate-500 hidden sm:inline">{{ stats()?.payablesCount }} {{ lang.currentLanguage() === 'ar' ? 'فاتورة' : 'bills' }}</span>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(stats()?.payables || 0) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'المدفوعات' : 'Payables' }}</div>
        </div>

        <!-- Cash Position -->
        <div class="stat-card cursor-pointer" routerLink="/finance/banking">
          <div class="flex items-start justify-between">
            <div class="stat-card-icon bg-gradient-accent-light text-accent-600">
              <ng-icon name="heroWallet" class="text-lg sm:text-2xl"></ng-icon>
            </div>
            <span class="stat-card-change positive hidden sm:inline-flex">
              <ng-icon name="heroArrowTrendingUp" class="text-sm"></ng-icon>
              {{ stats()?.cashChange }}%
            </span>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(stats()?.cashPosition || 0) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'الوضع النقدي' : 'Cash Position' }}</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <!-- Revenue Trend -->
        <div class="card">
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">
              {{ lang.currentLanguage() === 'ar' ? 'اتجاه الإيرادات (6 أشهر)' : 'Revenue Trend (6 months)' }}
            </h2>
          </div>
          <div class="p-4 sm:p-6">
            <div class="flex items-end gap-2 sm:gap-3 h-40 sm:h-52">
              @for (item of revenueTrend(); track item.month) {
                <div class="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                  <div
                    class="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                    [style.height.%]="(item.amount / 130000) * 100"
                    style="background: linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%);"
                  ></div>
                  <span class="text-[10px] sm:text-xs font-medium text-slate-500">{{ item.month }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- AR Aging Chart -->
        <div class="card">
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">
              {{ lang.currentLanguage() === 'ar' ? 'تقادم المستحقات' : 'Receivables Aging' }}
            </h2>
          </div>
          <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
            @for (bucket of agingBuckets; track bucket.label) {
              <div>
                <div class="flex justify-between text-xs sm:text-sm mb-2">
                  <span class="font-medium text-slate-700">{{ lang.currentLanguage() === 'ar' ? bucket.labelAr : bucket.label }}</span>
                  <span class="font-semibold text-slate-900">{{ bucket.percentage }}%</span>
                </div>
                <div class="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [style.width.%]="bucket.percentage"
                    [style.background-color]="bucket.color"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Currency Exposure -->
        <div class="card">
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">
              {{ lang.currentLanguage() === 'ar' ? 'التعرض للعملات' : 'Currency Exposure' }}
            </h2>
          </div>
          <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
            @for (curr of currencyExposure; track curr.code) {
              <div class="flex items-center gap-3 sm:gap-4">
                <span class="text-xs sm:text-sm font-semibold text-slate-700 w-10 sm:w-12">{{ curr.code }}</span>
                <div class="flex-1 h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    [style.width.%]="curr.percentage"
                    style="background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%);"
                  ></div>
                </div>
                <span class="text-xs sm:text-sm font-medium text-slate-500 w-10 sm:w-12 text-end">{{ curr.percentage }}%</span>
              </div>
            }
            <div class="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
              <div class="flex justify-between text-xs sm:text-sm">
                <span class="text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</span>
                <span class="font-semibold text-slate-900">{{ lang.formatCurrency(285400) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">
              {{ lang.currentLanguage() === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions' }}
            </h2>
          </div>
          <div class="divide-y divide-slate-100">
            @for (payment of recentPayments(); track payment.id) {
              <div class="px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                  [class.bg-success-50]="payment.type === 'received'"
                  [class.text-success-600]="payment.type === 'received'"
                  [class.bg-danger-50]="payment.type === 'made'"
                  [class.text-danger-600]="payment.type === 'made'"
                >
                  <ng-icon [name]="payment.type === 'received' ? 'heroArrowDownTray' : 'heroArrowUpTray'" class="text-lg sm:text-xl"></ng-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs sm:text-sm font-semibold text-slate-900 truncate">{{ payment.invoiceNumber }}</div>
                  <div class="text-[10px] sm:text-xs text-slate-500 truncate">{{ payment.customerName || payment.supplierName }}</div>
                </div>
                <div class="text-end shrink-0">
                  <div class="text-xs sm:text-sm font-semibold" [class.text-success-600]="payment.type === 'received'" [class.text-danger-600]="payment.type === 'made'">
                    {{ payment.type === 'received' ? '+' : '-' }}{{ lang.formatCurrency(payment.amountBase) }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Action Items -->
        <div class="card md:col-span-2 lg:col-span-1">
          <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">
              {{ lang.currentLanguage() === 'ar' ? 'الإجراءات المطلوبة' : 'Action Items' }}
            </h2>
          </div>
          <div class="divide-y divide-slate-100">
            <div class="px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-3 sm:gap-4">
              <div class="icon-wrapper icon-wrapper-danger w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <ng-icon name="heroExclamationCircle" class="text-base sm:text-lg"></ng-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm text-slate-700">
                  {{ lang.currentLanguage() === 'ar' ? '3 فواتير متأخرة > 60 يوم' : '3 invoices overdue > 60 days' }}
                  <span class="text-slate-500">({{ lang.formatCurrency(12450) }})</span>
                </div>
                <a routerLink="/finance/ar-aging" class="text-[10px] sm:text-xs text-primary-600 hover:text-primary-700 font-semibold mt-1 inline-block">
                  {{ lang.currentLanguage() === 'ar' ? 'عرض التفاصيل' : 'View Details' }} →
                </a>
              </div>
            </div>
            <div class="px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-3 sm:gap-4">
              <div class="icon-wrapper icon-wrapper-warning w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <ng-icon name="heroExclamationCircle" class="text-base sm:text-lg"></ng-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm text-slate-700">
                  {{ lang.currentLanguage() === 'ar' ? '2 فاتورة مستحقة هذا الأسبوع' : '2 supplier bills due this week' }}
                  <span class="text-slate-500">({{ lang.formatCurrency(8200) }})</span>
                </div>
                <a routerLink="/finance/bills" class="text-[10px] sm:text-xs text-primary-600 hover:text-primary-700 font-semibold mt-1 inline-block">
                  {{ lang.currentLanguage() === 'ar' ? 'عرض الفواتير' : 'View Bills' }} →
                </a>
              </div>
            </div>
            <div class="px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-3 sm:gap-4">
              <div class="icon-wrapper icon-wrapper-primary w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <ng-icon name="heroInformationCircle" class="text-base sm:text-lg"></ng-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs sm:text-sm text-slate-700">
                  {{ lang.currentLanguage() === 'ar' ? 'آخر تحديث لأسعار الصرف: قبل ساعتين' : 'Exchange rates last updated: 2 hours ago' }}
                </div>
                <button class="text-[10px] sm:text-xs text-primary-600 hover:text-primary-700 font-semibold mt-1">
                  {{ lang.currentLanguage() === 'ar' ? 'تحديث الآن' : 'Update Now' }} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FinanceDashboardComponent implements OnInit {
  lang = inject(LanguageService);
  private mockData = inject(MockDataService);

  stats = signal<FinanceDashboardStats | null>(null);
  revenueTrend = signal<{ month: string; amount: number }[]>([]);
  recentPayments = signal<Payment[]>([]);

  agingBuckets = [
    { label: 'Current (Not Due)', labelAr: 'الحالي (غير مستحق)', percentage: 65, color: '#10B981' },
    { label: '1-30 Days', labelAr: '1-30 يوم', percentage: 20, color: '#6366F1' },
    { label: '31-60 Days', labelAr: '31-60 يوم', percentage: 10, color: '#F59E0B' },
    { label: '61-90 Days', labelAr: '61-90 يوم', percentage: 3, color: '#EF4444' },
    { label: 'Over 90 Days', labelAr: 'أكثر من 90 يوم', percentage: 2, color: '#DC2626' },
  ];

  currencyExposure = [
    { code: 'OMR', percentage: 45 },
    { code: 'USD', percentage: 35 },
    { code: 'EUR', percentage: 12 },
    { code: 'CNY', percentage: 5 },
    { code: 'INR', percentage: 3 },
  ];

  ngOnInit() {
    this.stats.set(this.mockData.getFinanceDashboardStats());
    this.revenueTrend.set(this.mockData.getRevenueTrend());
    this.recentPayments.set(this.mockData.payments);
  }
}
