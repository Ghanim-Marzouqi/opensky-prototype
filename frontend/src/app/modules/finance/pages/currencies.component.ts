import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCurrencyDollar,
  heroArrowTrendingUp,
  heroArrowTrendingDown,
  heroArrowPath
} from '@ng-icons/heroicons/outline';

interface Currency {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  symbol: string;
  exchangeRate: number;
  change: number;
  lastUpdated: Date;
}

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroCurrencyDollar,
      heroArrowTrendingUp,
      heroArrowTrendingDown,
      heroArrowPath
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'العملات' : 'Currencies' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة العملات وأسعار الصرف' : 'Manage currencies and exchange rates' }}</p>
        </div>
        <button class="btn btn-secondary">
          <ng-icon name="heroArrowPath" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'تحديث الأسعار' : 'Update Rates' }}
        </button>
      </div>

      <!-- Base Currency Card -->
      <div class="card p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <span class="text-sm sm:text-xl font-bold text-primary-600">ر.ع.</span>
            </div>
            <div>
              <div class="text-xs sm:text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'العملة الأساسية' : 'Base Currency' }}</div>
              <div class="text-base sm:text-xl font-bold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'الريال العماني (OMR)' : 'Omani Rial (OMR)' }}</div>
            </div>
          </div>
          <div class="text-start sm:text-end">
            <div class="text-xs sm:text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'آخر تحديث' : 'Last Updated' }}</div>
            <div class="text-xs sm:text-sm text-gray-700">{{ lang.formatDate(lastUpdated, 'medium') }}</div>
          </div>
        </div>
      </div>

      <!-- Currency Cards Grid -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        @for (currency of currencies(); track currency.id) {
          <div class="card p-2.5 sm:p-4">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <span class="text-sm sm:text-lg font-semibold text-gray-700">{{ currency.symbol }}</span>
                </div>
                <div class="min-w-0">
                  <div class="font-semibold text-sm text-gray-900">{{ currency.code }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ lang.currentLanguage() === 'ar' ? currency.nameAr : currency.name }}</div>
                </div>
              </div>
              <div class="text-end shrink-0">
                <div class="font-semibold text-xs sm:text-sm text-gray-900" dir="ltr">{{ lang.formatNumber(currency.exchangeRate, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) }}</div>
                <div class="flex items-center justify-end gap-0.5" [class.text-success-600]="currency.change > 0" [class.text-danger-600]="currency.change < 0" [class.text-gray-500]="currency.change === 0">
                  @if (currency.change > 0) {
                    <ng-icon name="heroArrowTrendingUp" class="text-xs"></ng-icon>
                  } @else if (currency.change < 0) {
                    <ng-icon name="heroArrowTrendingDown" class="text-xs"></ng-icon>
                  }
                  <span class="text-[10px] font-medium" dir="ltr">{{ currency.change > 0 ? '+' : '' }}{{ currency.change }}%</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Exchange Rates Table -->
      <div class="card">
        <div class="p-3 sm:p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'أسعار الصرف' : 'Exchange Rates' }}</h2>
        </div>
        <div class="hidden md:block table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الرمز' : 'Code' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'العملة' : 'Currency' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'سعر الصرف' : 'Exchange Rate' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'التغيير' : 'Change' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'آخر تحديث' : 'Last Updated' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (currency of currencies(); track currency.id) {
                <tr>
                  <td class="font-medium"><span dir="ltr" class="inline-block">{{ currency.code }}</span></td>
                  <td>{{ lang.currentLanguage() === 'ar' ? currency.nameAr : currency.name }}</td>
                  <td class="font-mono"><span dir="ltr" class="inline-block">{{ lang.formatNumber(currency.exchangeRate, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) }}</span></td>
                  <td>
                    <span class="inline-flex items-center gap-1" [class.text-success-600]="currency.change > 0" [class.text-danger-600]="currency.change < 0">
                      @if (currency.change > 0) {
                        <ng-icon name="heroArrowTrendingUp" class="text-sm"></ng-icon>
                      } @else if (currency.change < 0) {
                        <ng-icon name="heroArrowTrendingDown" class="text-sm"></ng-icon>
                      }
                      <span dir="ltr" class="inline-block">{{ currency.change > 0 ? '+' : '' }}{{ lang.formatNumber(currency.change, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%</span>
                    </span>
                  </td>
                  <td>{{ lang.formatDate(currency.lastUpdated, 'short') }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CurrenciesComponent implements OnInit {
  lang = inject(LanguageService);

  currencies = signal<Currency[]>([]);
  lastUpdated = new Date();

  ngOnInit() {
    // Exchange rates are per 1 OMR
    this.currencies.set([
      {
        id: '1',
        code: 'USD',
        name: 'US Dollar',
        nameAr: 'دولار أمريكي',
        symbol: '$',
        exchangeRate: 2.6008,
        change: 0.00,
        lastUpdated: new Date()
      },
      {
        id: '2',
        code: 'SAR',
        name: 'Saudi Riyal',
        nameAr: 'ريال سعودي',
        symbol: 'ر.س',
        exchangeRate: 9.7500,
        change: 0.00,
        lastUpdated: new Date()
      },
      {
        id: '3',
        code: 'AED',
        name: 'UAE Dirham',
        nameAr: 'درهم إماراتي',
        symbol: 'د.إ',
        exchangeRate: 9.5480,
        change: 0.00,
        lastUpdated: new Date()
      },
      {
        id: '4',
        code: 'EUR',
        name: 'Euro',
        nameAr: 'يورو',
        symbol: '€',
        exchangeRate: 2.4050,
        change: -0.15,
        lastUpdated: new Date()
      },
      {
        id: '5',
        code: 'GBP',
        name: 'British Pound',
        nameAr: 'جنيه إسترليني',
        symbol: '£',
        exchangeRate: 2.0520,
        change: 0.08,
        lastUpdated: new Date()
      },
      {
        id: '6',
        code: 'INR',
        name: 'Indian Rupee',
        nameAr: 'روبية هندية',
        symbol: '₹',
        exchangeRate: 216.2500,
        change: -0.12,
        lastUpdated: new Date()
      }
    ]);
  }
}
