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
      <div class="card p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <span class="text-2xl font-bold text-primary-600">$</span>
            </div>
            <div>
              <div class="text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'العملة الأساسية' : 'Base Currency' }}</div>
              <div class="text-xl font-bold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'الدولار الأمريكي (USD)' : 'US Dollar (USD)' }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'آخر تحديث' : 'Last Updated' }}</div>
            <div class="text-sm text-gray-700">{{ lang.formatDate(lastUpdated, 'medium') }}</div>
          </div>
        </div>
      </div>

      <!-- Currency Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        @for (currency of currencies(); track currency.id) {
          <div class="card p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span class="text-lg font-semibold text-gray-700">{{ currency.symbol }}</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ currency.code }}</div>
                  <div class="text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? currency.nameAr : currency.name }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-gray-900">{{ lang.formatNumber(currency.exchangeRate, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) }}</div>
                <div class="flex items-center gap-1" [class.text-success-600]="currency.change > 0" [class.text-danger-600]="currency.change < 0" [class.text-gray-500]="currency.change === 0">
                  @if (currency.change > 0) {
                    <ng-icon name="heroArrowTrendingUp" class="text-sm"></ng-icon>
                  } @else if (currency.change < 0) {
                    <ng-icon name="heroArrowTrendingDown" class="text-sm"></ng-icon>
                  }
                  <span class="text-xs font-medium">{{ currency.change > 0 ? '+' : '' }}{{ lang.formatNumber(currency.change, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Exchange Rates Table -->
      <div class="card">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'أسعار الصرف' : 'Exchange Rates' }}</h2>
        </div>
        <div class="table-container">
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
    this.currencies.set([
      {
        id: '1',
        code: 'AED',
        name: 'UAE Dirham',
        nameAr: 'درهم إماراتي',
        symbol: 'د.إ',
        exchangeRate: 3.6725,
        change: 0.00,
        lastUpdated: new Date()
      },
      {
        id: '2',
        code: 'SAR',
        name: 'Saudi Riyal',
        nameAr: 'ريال سعودي',
        symbol: 'ر.س',
        exchangeRate: 3.7500,
        change: 0.00,
        lastUpdated: new Date()
      },
      {
        id: '3',
        code: 'EUR',
        name: 'Euro',
        nameAr: 'يورو',
        symbol: '€',
        exchangeRate: 0.9245,
        change: -0.15,
        lastUpdated: new Date()
      },
      {
        id: '4',
        code: 'GBP',
        name: 'British Pound',
        nameAr: 'جنيه إسترليني',
        symbol: '£',
        exchangeRate: 0.7892,
        change: 0.08,
        lastUpdated: new Date()
      },
      {
        id: '5',
        code: 'JPY',
        name: 'Japanese Yen',
        nameAr: 'ين ياباني',
        symbol: '¥',
        exchangeRate: 149.5200,
        change: 0.42,
        lastUpdated: new Date()
      },
      {
        id: '6',
        code: 'INR',
        name: 'Indian Rupee',
        nameAr: 'روبية هندية',
        symbol: '₹',
        exchangeRate: 83.1250,
        change: -0.12,
        lastUpdated: new Date()
      }
    ]);
  }
}
