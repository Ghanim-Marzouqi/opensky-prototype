import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroDocumentText,
  heroPlus,
  heroEye
} from '@ng-icons/heroicons/outline';

interface Bill {
  id: string;
  billNumber: string;
  vendorName: string;
  vendorNameAr: string;
  billDate: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
}

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroDocumentText,
      heroPlus,
      heroEye
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'الفواتير' : 'Bills' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة فواتير الموردين' : 'Manage vendor bills' }}</p>
        </div>
        <button class="btn btn-primary">
          <ng-icon name="heroPlus" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'إضافة فاتورة' : 'Add Bill' }}
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroDocumentText" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(32) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي' : 'Total' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroDocumentText" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(85000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'مدفوعة' : 'Paid' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroDocumentText" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(42000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'غير مدفوعة' : 'Unpaid' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroDocumentText" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(15000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'متأخرة' : 'Overdue' }}</div>
        </div>
      </div>

      <!-- Bills Table -->
      <div class="card">
        <div class="p-3 sm:p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'قائمة الفواتير' : 'Bills List' }}</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (bill of bills(); track bill.id) {
            <div class="p-3 sm:p-4 border-b border-gray-100 last:border-b-0">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-sm text-gray-900 truncate">{{ lang.currentLanguage() === 'ar' ? bill.vendorNameAr : bill.vendorName }}</div>
                  <div class="text-xs text-gray-500" dir="ltr">{{ bill.billNumber }}</div>
                </div>
                <span class="badge shrink-0" [class]="getStatusClass(bill.status)">
                  {{ getStatusLabel(bill.status) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'المبلغ:' : 'Amount:' }}</span>
                <span class="font-semibold">{{ lang.formatCurrency(bill.amount) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'المدفوع:' : 'Paid:' }}</span>
                <span class="text-success-600">{{ lang.formatCurrency(bill.paidAmount) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ lang.currentLanguage() === 'ar' ? 'الاستحقاق:' : 'Due:' }} {{ lang.formatDate(bill.dueDate, 'short') }}</span>
                <button class="btn btn-ghost btn-sm">
                  <ng-icon name="heroEye" class="text-sm"></ng-icon>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'رقم الفاتورة' : 'Bill #' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المورد' : 'Vendor' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'تاريخ الفاتورة' : 'Bill Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المدفوع' : 'Paid' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الإجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (bill of bills(); track bill.id) {
                <tr>
                  <td class="font-medium"><span dir="ltr" class="inline-block">{{ bill.billNumber }}</span></td>
                  <td>{{ lang.currentLanguage() === 'ar' ? bill.vendorNameAr : bill.vendorName }}</td>
                  <td>{{ lang.formatDate(bill.billDate, 'short') }}</td>
                  <td>{{ lang.formatDate(bill.dueDate, 'short') }}</td>
                  <td class="font-medium">{{ lang.formatCurrency(bill.amount) }}</td>
                  <td>{{ lang.formatCurrency(bill.paidAmount) }}</td>
                  <td>
                    <span class="badge" [class]="getStatusClass(bill.status)">
                      {{ getStatusLabel(bill.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-sm">
                      <ng-icon name="heroEye" class="text-sm"></ng-icon>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BillsComponent implements OnInit {
  lang = inject(LanguageService);

  bills = signal<Bill[]>([]);

  ngOnInit() {
    this.bills.set([
      {
        id: '1',
        billNumber: 'BILL-001',
        vendorName: 'Office Supplies Co.',
        vendorNameAr: 'شركة مستلزمات المكاتب',
        billDate: new Date(2024, 11, 1),
        dueDate: new Date(2024, 11, 31),
        amount: 5500,
        paidAmount: 5500,
        status: 'paid'
      },
      {
        id: '2',
        billNumber: 'BILL-002',
        vendorName: 'Tech Solutions LLC',
        vendorNameAr: 'حلول التقنية ذ.م.م',
        billDate: new Date(2024, 11, 5),
        dueDate: new Date(2025, 0, 4),
        amount: 18000,
        paidAmount: 9000,
        status: 'partial'
      },
      {
        id: '3',
        billNumber: 'BILL-003',
        vendorName: 'Cleaning Services',
        vendorNameAr: 'خدمات التنظيف',
        billDate: new Date(2024, 11, 10),
        dueDate: new Date(2025, 0, 9),
        amount: 3500,
        paidAmount: 0,
        status: 'unpaid'
      },
      {
        id: '4',
        billNumber: 'BILL-004',
        vendorName: 'IT Hardware Store',
        vendorNameAr: 'متجر أجهزة تقنية المعلومات',
        billDate: new Date(2024, 10, 15),
        dueDate: new Date(2024, 11, 15),
        amount: 15000,
        paidAmount: 0,
        status: 'overdue'
      },
      {
        id: '5',
        billNumber: 'BILL-005',
        vendorName: 'Marketing Agency',
        vendorNameAr: 'وكالة التسويق',
        billDate: new Date(2024, 11, 12),
        dueDate: new Date(2025, 0, 11),
        amount: 25000,
        paidAmount: 25000,
        status: 'paid'
      }
    ]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'partial': return 'badge-warning';
      case 'unpaid': return 'badge-neutral';
      case 'overdue': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    if (this.lang.currentLanguage() === 'ar') {
      switch (status) {
        case 'paid': return 'مدفوعة';
        case 'partial': return 'جزئي';
        case 'unpaid': return 'غير مدفوعة';
        case 'overdue': return 'متأخرة';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
