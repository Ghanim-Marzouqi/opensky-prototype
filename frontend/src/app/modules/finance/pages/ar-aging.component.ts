import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroDocumentText,
  heroExclamationTriangle,
  heroClock
} from '@ng-icons/heroicons/outline';

interface ARAgingRecord {
  id: string;
  customerName: string;
  customerNameAr: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  over90: number;
  total: number;
}

@Component({
  selector: 'app-ar-aging',
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
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'تقادم المدينين' : 'AR Aging' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'تقرير المستحقات من العملاء' : 'Accounts receivable aging report' }}</p>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroDocumentText" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(85000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'جاري' : 'Current' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroClock" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(42500) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? '1-30 يوم' : '1-30 Days' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-orange-100 text-orange-600">
            <ng-icon name="heroClock" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(18000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? '31-60 يوم' : '31-60 Days' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroExclamationTriangle" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(12500) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'أكثر من 60 يوم' : 'Over 60 Days' }}</div>
        </div>
      </div>

      <!-- Aging Table -->
      <div class="card">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'تفاصيل أعمار الذمم' : 'Aging Details' }}</h2>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'العميل' : 'Customer' }}</th>
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
                  <td class="font-medium">{{ lang.currentLanguage() === 'ar' ? record.customerNameAr : record.customerName }}</td>
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
                <td class="font-semibold">{{ lang.formatCurrency(85000) }}</td>
                <td class="font-semibold text-warning-600">{{ lang.formatCurrency(42500) }}</td>
                <td class="font-semibold text-orange-600">{{ lang.formatCurrency(18000) }}</td>
                <td class="font-semibold text-danger-600">{{ lang.formatCurrency(8000) }}</td>
                <td class="font-semibold text-danger-700">{{ lang.formatCurrency(4500) }}</td>
                <td class="font-semibold">{{ lang.formatCurrency(158000) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ARAgingComponent implements OnInit {
  lang = inject(LanguageService);

  agingRecords = signal<ARAgingRecord[]>([]);

  ngOnInit() {
    this.agingRecords.set([
      {
        id: '1',
        customerName: 'Al-Futtaim Group',
        customerNameAr: 'مجموعة الفطيم',
        current: 25000,
        days1to30: 12000,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
        total: 37000
      },
      {
        id: '2',
        customerName: 'Emirates NBD',
        customerNameAr: 'بنك الإمارات دبي الوطني',
        current: 18000,
        days1to30: 8500,
        days31to60: 5000,
        days61to90: 0,
        over90: 0,
        total: 31500
      },
      {
        id: '3',
        customerName: 'Dubai Holdings',
        customerNameAr: 'دبي القابضة',
        current: 22000,
        days1to30: 15000,
        days31to60: 8000,
        days61to90: 4000,
        over90: 0,
        total: 49000
      },
      {
        id: '4',
        customerName: 'Majid Al Futtaim',
        customerNameAr: 'ماجد الفطيم',
        current: 12000,
        days1to30: 7000,
        days31to60: 5000,
        days61to90: 4000,
        over90: 4500,
        total: 32500
      },
      {
        id: '5',
        customerName: 'Emaar Properties',
        customerNameAr: 'إعمار العقارية',
        current: 8000,
        days1to30: 0,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
        total: 8000
      }
    ]);
  }
}
