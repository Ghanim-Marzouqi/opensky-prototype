import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroDocumentText,
  heroExclamationTriangle,
  heroClock
} from '@ng-icons/heroicons/outline';

interface APAgingRecord {
  id: string;
  vendorName: string;
  vendorNameAr: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  total: number;
}

@Component({
  selector: 'app-ap-aging',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroDocumentText,
      heroExclamationTriangle,
      heroClock
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'تقادم الدائنين' : 'AP Aging' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'تقرير المستحقات للموردين' : 'Accounts payable aging report' }}</p>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroDocumentText" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(52000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'جاري' : 'Current' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroClock" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(28000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? '1-30 يوم' : '1-30 Days' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-orange-100 text-orange-600">
            <ng-icon name="heroClock" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(12000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? '31-60 يوم' : '31-60 Days' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroExclamationTriangle" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(8000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? '+60 يوم' : 'Over 60' }}</div>
        </div>
      </div>

      <!-- Aging Table -->
      <div class="card">
        <div class="p-3 sm:p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'تفاصيل أعمار الذمم' : 'Aging Details' }}</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (record of agingRecords(); track record.id) {
            <div class="p-3 sm:p-4 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center justify-between mb-3">
                <div class="font-medium text-sm text-gray-900">{{ lang.currentLanguage() === 'ar' ? record.vendorNameAr : record.vendorName }}</div>
                <div class="text-sm font-semibold">{{ lang.formatCurrency(record.total) }}</div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex justify-between p-1.5 bg-gray-50 rounded">
                  <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'جاري' : 'Current' }}</span>
                  <span>{{ record.current > 0 ? lang.formatCurrency(record.current) : '-' }}</span>
                </div>
                <div class="flex justify-between p-1.5 bg-warning-50 rounded">
                  <span class="text-gray-500">1-30</span>
                  <span class="text-warning-600">{{ record.days1to30 > 0 ? lang.formatCurrency(record.days1to30) : '-' }}</span>
                </div>
                <div class="flex justify-between p-1.5 bg-orange-50 rounded">
                  <span class="text-gray-500">31-60</span>
                  <span class="text-orange-600">{{ record.days31to60 > 0 ? lang.formatCurrency(record.days31to60) : '-' }}</span>
                </div>
                <div class="flex justify-between p-1.5 bg-danger-50 rounded">
                  <span class="text-gray-500">60+</span>
                  <span class="text-danger-600">{{ (record.days61to90 + record.over90) > 0 ? lang.formatCurrency(record.days61to90 + record.over90) : '-' }}</span>
                </div>
              </div>
            </div>
          }
          <!-- Mobile Total -->
          <div class="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-sm">{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</span>
              <span class="font-bold">{{ lang.formatCurrency(100000) }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المورد' : 'Vendor' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'جاري' : 'Current' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? '1-30 يوم' : '1-30 Days' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? '31-60 يوم' : '31-60 Days' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? '61-90 يوم' : '61-90 Days' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'أكثر من 90' : 'Over 90' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (record of agingRecords(); track record.id) {
                <tr>
                  <td class="font-medium">{{ lang.currentLanguage() === 'ar' ? record.vendorNameAr : record.vendorName }}</td>
                  <td>{{ record.current > 0 ? lang.formatCurrency(record.current) : '-' }}</td>
                  <td [class.text-warning-600]="record.days1to30 > 0">{{ record.days1to30 > 0 ? lang.formatCurrency(record.days1to30) : '-' }}</td>
                  <td [class.text-orange-600]="record.days31to60 > 0">{{ record.days31to60 > 0 ? lang.formatCurrency(record.days31to60) : '-' }}</td>
                  <td [class.text-danger-600]="record.days61to90 > 0">{{ record.days61to90 > 0 ? lang.formatCurrency(record.days61to90) : '-' }}</td>
                  <td [class.text-danger-700]="record.over90 > 0" [class.font-semibold]="record.over90 > 0">{{ record.over90 > 0 ? lang.formatCurrency(record.over90) : '-' }}</td>
                  <td class="font-semibold">{{ lang.formatCurrency(record.total) }}</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr class="bg-gray-50">
                <td class="font-semibold">{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                <td class="font-semibold">{{ lang.formatCurrency(52000) }}</td>
                <td class="font-semibold text-warning-600">{{ lang.formatCurrency(28000) }}</td>
                <td class="font-semibold text-orange-600">{{ lang.formatCurrency(12000) }}</td>
                <td class="font-semibold text-danger-600">{{ lang.formatCurrency(5000) }}</td>
                <td class="font-semibold text-danger-700">{{ lang.formatCurrency(3000) }}</td>
                <td class="font-semibold">{{ lang.formatCurrency(100000) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `
})
export class APAgingComponent implements OnInit {
  lang = inject(LanguageService);

  agingRecords = signal<APAgingRecord[]>([]);

  ngOnInit() {
    this.agingRecords.set([
      {
        id: '1',
        vendorName: 'Office Supplies Co.',
        vendorNameAr: 'شركة مستلزمات المكاتب',
        current: 12000,
        days1to30: 5000,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
        total: 17000
      },
      {
        id: '2',
        vendorName: 'Tech Solutions LLC',
        vendorNameAr: 'حلول التقنية ذ.م.م',
        current: 18000,
        days1to30: 9000,
        days31to60: 4000,
        days61to90: 0,
        over90: 0,
        total: 31000
      },
      {
        id: '3',
        vendorName: 'Marketing Agency',
        vendorNameAr: 'وكالة التسويق',
        current: 8000,
        days1to30: 6000,
        days31to60: 5000,
        days61to90: 3000,
        over90: 0,
        total: 22000
      },
      {
        id: '4',
        vendorName: 'IT Hardware Store',
        vendorNameAr: 'متجر أجهزة تقنية المعلومات',
        current: 10000,
        days1to30: 8000,
        days31to60: 3000,
        days61to90: 2000,
        over90: 3000,
        total: 26000
      },
      {
        id: '5',
        vendorName: 'Cleaning Services',
        vendorNameAr: 'خدمات التنظيف',
        current: 4000,
        days1to30: 0,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
        total: 4000
      }
    ]);
  }
}
