import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBuildingLibrary,
  heroCreditCard,
  heroArrowUpRight,
  heroArrowDownLeft,
  heroPlus
} from '@ng-icons/heroicons/outline';

interface BankAccount {
  id: string;
  bankName: string;
  bankNameAr: string;
  accountNumber: string;
  accountType: string;
  accountTypeAr: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  descriptionAr: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
  account: string;
}

@Component({
  selector: 'app-banking',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroBuildingLibrary,
      heroCreditCard,
      heroArrowUpRight,
      heroArrowDownLeft,
      heroPlus
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'الحسابات البنكية' : 'Banking' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'إدارة الحسابات البنكية والتحويلات' : 'Manage bank accounts and transfers' }}</p>
        </div>
        <button class="btn btn-primary">
          <ng-icon name="heroPlus" class="text-lg"></ng-icon>
          {{ lang.currentLanguage() === 'ar' ? 'إضافة حساب' : 'Add Account' }}
        </button>
      </div>

      <!-- Bank Account Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        @for (account of bankAccounts(); track account.id) {
          <div class="card p-5">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <ng-icon name="heroBuildingLibrary" class="text-xl text-primary-600"></ng-icon>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? account.bankNameAr : account.bankName }}</div>
                  <div class="text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? account.accountTypeAr : account.accountType }}</div>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="text-sm text-gray-500 mb-1">{{ lang.currentLanguage() === 'ar' ? 'رقم الحساب' : 'Account Number' }}</div>
              <div class="font-mono text-sm text-gray-700" dir="ltr">{{ account.accountNumber }}</div>
            </div>
            <div class="pt-3 border-t border-gray-100">
              <div class="text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الرصيد الحالي' : 'Current Balance' }}</div>
              <div class="text-xl font-bold text-gray-900">{{ lang.formatCurrency(account.balance) }}</div>
            </div>
          </div>
        }
      </div>

      <!-- Total Balance Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroBuildingLibrary" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(totalBalance()) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إجمالي الأرصدة' : 'Total Balance' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroArrowDownLeft" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(125000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'الإيداعات (هذا الشهر)' : 'Deposits (This Month)' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroArrowUpRight" class="text-xl"></ng-icon>
          </div>
          <div class="stat-card-value">{{ lang.formatCurrency(85000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'المسحوبات (هذا الشهر)' : 'Withdrawals (This Month)' }}</div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions' }}</h2>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'التاريخ' : 'Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الوصف' : 'Description' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحساب' : 'Account' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الرصيد' : 'Balance' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (tx of transactions(); track tx.id) {
                <tr>
                  <td>{{ lang.formatDate(tx.date, 'short') }}</td>
                  <td>{{ lang.currentLanguage() === 'ar' ? tx.descriptionAr : tx.description }}</td>
                  <td>{{ tx.account }}</td>
                  <td>
                    <span class="flex items-center gap-1" [class.text-success-600]="tx.type === 'credit'" [class.text-danger-600]="tx.type === 'debit'">
                      @if (tx.type === 'credit') {
                        <ng-icon name="heroArrowDownLeft" class="text-sm"></ng-icon>
                        +
                      } @else {
                        <ng-icon name="heroArrowUpRight" class="text-sm"></ng-icon>
                        -
                      }
                      {{ lang.formatCurrency(tx.amount) }}
                    </span>
                  </td>
                  <td class="font-medium">{{ lang.formatCurrency(tx.balance) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class BankingComponent implements OnInit {
  lang = inject(LanguageService);

  bankAccounts = signal<BankAccount[]>([]);
  transactions = signal<Transaction[]>([]);

  totalBalance(): number {
    return this.bankAccounts().reduce((sum, acc) => sum + acc.balance, 0);
  }

  ngOnInit() {
    this.bankAccounts.set([
      {
        id: '1',
        bankName: 'Emirates NBD',
        bankNameAr: 'بنك الإمارات دبي الوطني',
        accountNumber: '****4521',
        accountType: 'Business Current',
        accountTypeAr: 'حساب جاري تجاري',
        balance: 285000,
        currency: 'AED'
      },
      {
        id: '2',
        bankName: 'ADCB',
        bankNameAr: 'بنك أبوظبي التجاري',
        accountNumber: '****7832',
        accountType: 'Savings Account',
        accountTypeAr: 'حساب توفير',
        balance: 150000,
        currency: 'AED'
      },
      {
        id: '3',
        bankName: 'FAB',
        bankNameAr: 'بنك أبوظبي الأول',
        accountNumber: '****1294',
        accountType: 'Business Current',
        accountTypeAr: 'حساب جاري تجاري',
        balance: 95000,
        currency: 'AED'
      }
    ]);

    this.transactions.set([
      {
        id: '1',
        date: new Date(2024, 11, 18),
        description: 'Payment received - Invoice INV-2024-001',
        descriptionAr: 'دفعة مستلمة - فاتورة INV-2024-001',
        type: 'credit',
        amount: 15000,
        balance: 285000,
        account: 'Emirates NBD'
      },
      {
        id: '2',
        date: new Date(2024, 11, 17),
        description: 'Vendor payment - Office Supplies Co.',
        descriptionAr: 'دفعة للمورد - شركة مستلزمات المكاتب',
        type: 'debit',
        amount: 5500,
        balance: 270000,
        account: 'Emirates NBD'
      },
      {
        id: '3',
        date: new Date(2024, 11, 16),
        description: 'Salary payments - December 2024',
        descriptionAr: 'رواتب - ديسمبر 2024',
        type: 'debit',
        amount: 45000,
        balance: 275500,
        account: 'ADCB'
      },
      {
        id: '4',
        date: new Date(2024, 11, 15),
        description: 'Payment received - Invoice INV-2024-002',
        descriptionAr: 'دفعة مستلمة - فاتورة INV-2024-002',
        type: 'credit',
        amount: 28500,
        balance: 320500,
        account: 'Emirates NBD'
      },
      {
        id: '5',
        date: new Date(2024, 11, 14),
        description: 'Utility bills payment',
        descriptionAr: 'دفع فواتير المرافق',
        type: 'debit',
        amount: 3200,
        balance: 292000,
        account: 'FAB'
      }
    ]);
  }
}
