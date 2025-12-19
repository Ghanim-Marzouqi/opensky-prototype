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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroDocumentText" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(32) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي الفواتير' : 'Total Bills' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroDocumentText" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(85000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'مدفوعة' : 'Paid' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroDocumentText" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(42000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'غير مدفوعة' : 'Unpaid' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroDocumentText" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(15000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'متأخرة' : 'Overdue' }}</div>
        </div>
      </div>

      <!-- Bills Table -->
      <div class="card">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'قائمة الفواتير' : 'Bills List' }}</h2>
        </div>
        <div class="table-container">
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
