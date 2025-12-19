import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBanknotes,
  heroArrowUpRight,
  heroPlus
} from '@ng-icons/heroicons/outline';

interface PaymentMade {
  id: string;
  paymentNumber: string;
  vendorName: string;
  vendorNameAr: string;
  billNumber: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentMethodAr: string;
  status: 'completed' | 'pending' | 'failed';
}

@Component({
  selector: 'app-payments-made',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroBanknotes,
      heroArrowUpRight,
      heroPlus
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'المدفوعات الصادرة' : 'Payments Made' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة المدفوعات للموردين' : 'Manage payments to vendors' }}</p>
        </div>
        <button class="btn btn-primary">
          <ng-icon name="heroPlus" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'تسجيل دفعة' : 'Record Payment' }}
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="stat-card col-span-2 md:col-span-1">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroArrowUpRight" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value truncate">{{ lang.formatCurrency(98500) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي المدفوعات' : 'Total Paid' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroBanknotes" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(35) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'عدد المدفوعات' : 'Payments' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroBanknotes" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(3) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'قيد الانتظار' : 'Pending' }}</div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card">
        <div class="p-3 sm:p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'المدفوعات الأخيرة' : 'Recent Payments' }}</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (payment of payments(); track payment.id) {
            <div class="p-3 sm:p-4 border-b border-gray-100 last:border-b-0">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-sm text-gray-900 truncate">{{ lang.currentLanguage() === 'ar' ? payment.vendorNameAr : payment.vendorName }}</div>
                  <div class="text-xs text-gray-500" dir="ltr">{{ payment.paymentNumber }}</div>
                </div>
                <span class="badge shrink-0" [class]="getStatusClass(payment.status)">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الفاتورة:' : 'Bill:' }}</span>
                <span dir="ltr" class="font-medium">{{ payment.billNumber }}</span>
              </div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'المبلغ:' : 'Amount:' }}</span>
                <span class="font-semibold text-danger-600">{{ lang.formatCurrency(payment.amount) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ lang.currentLanguage() === 'ar' ? payment.paymentMethodAr : payment.paymentMethod }}</span>
                <span>{{ lang.formatDate(payment.paymentDate, 'short') }}</span>
              </div>
            </div>
          }
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'رقم الدفعة' : 'Payment #' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المورد' : 'Vendor' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'رقم الفاتورة' : 'Bill #' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'التاريخ' : 'Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'طريقة الدفع' : 'Method' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (payment of payments(); track payment.id) {
                <tr>
                  <td class="font-medium"><span dir="ltr" class="inline-block">{{ payment.paymentNumber }}</span></td>
                  <td>{{ lang.currentLanguage() === 'ar' ? payment.vendorNameAr : payment.vendorName }}</td>
                  <td><span dir="ltr" class="inline-block">{{ payment.billNumber }}</span></td>
                  <td class="font-medium text-danger-600">{{ lang.formatCurrency(payment.amount) }}</td>
                  <td>{{ lang.formatDate(payment.paymentDate, 'short') }}</td>
                  <td>{{ lang.currentLanguage() === 'ar' ? payment.paymentMethodAr : payment.paymentMethod }}</td>
                  <td>
                    <span class="badge" [class]="getStatusClass(payment.status)">
                      {{ getStatusLabel(payment.status) }}
                    </span>
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
export class PaymentsMadeComponent implements OnInit {
  lang = inject(LanguageService);

  payments = signal<PaymentMade[]>([]);

  ngOnInit() {
    this.payments.set([
      {
        id: '1',
        paymentNumber: 'PMNT-001',
        vendorName: 'Office Supplies Co.',
        vendorNameAr: 'شركة مستلزمات المكاتب',
        billNumber: 'BILL-001',
        amount: 5500,
        paymentDate: new Date(2024, 11, 15),
        paymentMethod: 'Bank Transfer',
        paymentMethodAr: 'تحويل بنكي',
        status: 'completed'
      },
      {
        id: '2',
        paymentNumber: 'PMNT-002',
        vendorName: 'Tech Solutions LLC',
        vendorNameAr: 'حلول التقنية ذ.م.م',
        billNumber: 'BILL-002',
        amount: 9000,
        paymentDate: new Date(2024, 11, 14),
        paymentMethod: 'Check',
        paymentMethodAr: 'شيك',
        status: 'completed'
      },
      {
        id: '3',
        paymentNumber: 'PMNT-003',
        vendorName: 'Marketing Agency',
        vendorNameAr: 'وكالة التسويق',
        billNumber: 'BILL-005',
        amount: 25000,
        paymentDate: new Date(2024, 11, 13),
        paymentMethod: 'Bank Transfer',
        paymentMethodAr: 'تحويل بنكي',
        status: 'pending'
      },
      {
        id: '4',
        paymentNumber: 'PMNT-004',
        vendorName: 'Utilities Provider',
        vendorNameAr: 'مزود المرافق',
        billNumber: 'BILL-006',
        amount: 8500,
        paymentDate: new Date(2024, 11, 12),
        paymentMethod: 'Direct Debit',
        paymentMethodAr: 'خصم مباشر',
        status: 'completed'
      },
      {
        id: '5',
        paymentNumber: 'PMNT-005',
        vendorName: 'Software Vendor',
        vendorNameAr: 'مورد البرمجيات',
        billNumber: 'BILL-007',
        amount: 12000,
        paymentDate: new Date(2024, 11, 11),
        paymentMethod: 'Bank Transfer',
        paymentMethodAr: 'تحويل بنكي',
        status: 'completed'
      }
    ]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'failed': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    if (this.lang.currentLanguage() === 'ar') {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'pending': return 'قيد الانتظار';
        case 'failed': return 'فشل';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
