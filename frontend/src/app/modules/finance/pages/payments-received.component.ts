import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBanknotes,
  heroCheckCircle,
  heroClock,
  heroPlus
} from '@ng-icons/heroicons/outline';

interface PaymentReceived {
  id: string;
  paymentNumber: string;
  customerName: string;
  customerNameAr: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentMethodAr: string;
  status: 'completed' | 'pending' | 'failed';
}

@Component({
  selector: 'app-payments-received',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroBanknotes,
      heroCheckCircle,
      heroClock,
      heroPlus
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'المدفوعات المستلمة' : 'Payments Received' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة المدفوعات الواردة من العملاء' : 'Manage incoming payments from customers' }}</p>
        </div>
        <button class="btn btn-primary">
          <ng-icon name="heroPlus" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'تسجيل دفعة' : 'Record Payment' }}
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroBanknotes" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(125000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي المدفوعات' : 'Total Received' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroCheckCircle" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(48) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'عدد المدفوعات' : 'Total Payments' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-warning-100 text-warning-600">
            <ng-icon name="heroClock" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatNumber(5) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'قيد الانتظار' : 'Pending' }}</div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="card">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'المدفوعات الأخيرة' : 'Recent Payments' }}</h2>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'رقم الدفعة' : 'Payment #' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'العميل' : 'Customer' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'رقم الفاتورة' : 'Invoice #' }}</th>
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
                  <td>{{ lang.currentLanguage() === 'ar' ? payment.customerNameAr : payment.customerName }}</td>
                  <td><span dir="ltr" class="inline-block">{{ payment.invoiceNumber }}</span></td>
                  <td class="font-medium text-success-600">{{ lang.formatCurrency(payment.amount) }}</td>
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
export class PaymentsReceivedComponent implements OnInit {
  lang = inject(LanguageService);

  payments = signal<PaymentReceived[]>([]);

  ngOnInit() {
    this.payments.set([
      {
        id: '1',
        paymentNumber: 'PAY-001',
        customerName: 'Al-Futtaim Group',
        customerNameAr: 'مجموعة الفطيم',
        invoiceNumber: 'INV-2024-001',
        amount: 15000,
        paymentDate: new Date(2024, 11, 15),
        paymentMethod: 'Bank Transfer',
        paymentMethodAr: 'تحويل بنكي',
        status: 'completed'
      },
      {
        id: '2',
        paymentNumber: 'PAY-002',
        customerName: 'Emirates NBD',
        customerNameAr: 'بنك الإمارات دبي الوطني',
        invoiceNumber: 'INV-2024-002',
        amount: 28500,
        paymentDate: new Date(2024, 11, 14),
        paymentMethod: 'Check',
        paymentMethodAr: 'شيك',
        status: 'completed'
      },
      {
        id: '3',
        paymentNumber: 'PAY-003',
        customerName: 'Dubai Holdings',
        customerNameAr: 'دبي القابضة',
        invoiceNumber: 'INV-2024-003',
        amount: 42000,
        paymentDate: new Date(2024, 11, 13),
        paymentMethod: 'Bank Transfer',
        paymentMethodAr: 'تحويل بنكي',
        status: 'pending'
      },
      {
        id: '4',
        paymentNumber: 'PAY-004',
        customerName: 'Majid Al Futtaim',
        customerNameAr: 'ماجد الفطيم',
        invoiceNumber: 'INV-2024-004',
        amount: 18750,
        paymentDate: new Date(2024, 11, 12),
        paymentMethod: 'Credit Card',
        paymentMethodAr: 'بطاقة ائتمان',
        status: 'completed'
      },
      {
        id: '5',
        paymentNumber: 'PAY-005',
        customerName: 'Emaar Properties',
        customerNameAr: 'إعمار العقارية',
        invoiceNumber: 'INV-2024-005',
        amount: 20750,
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
