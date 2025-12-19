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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        @for (account of bankAccounts(); track account.id) {
          <div class="card p-3 sm:p-5">
            <div class="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <ng-icon name="heroBuildingLibrary" class="text-lg sm:text-xl text-primary-600"></ng-icon>
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-sm sm:text-base text-gray-900 truncate">{{ lang.currentLanguage() === 'ar' ? account.bankNameAr : account.bankName }}</div>
                <div class="text-xs sm:text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? account.accountTypeAr : account.accountType }}</div>
              </div>
            </div>
            <div class="mb-2 sm:mb-3">
              <div class="text-xs sm:text-sm text-gray-500 mb-0.5">{{ lang.currentLanguage() === 'ar' ? 'رقم الحساب' : 'Account Number' }}</div>
              <div class="font-mono text-xs sm:text-sm text-gray-700" dir="ltr">{{ account.accountNumber }}</div>
            </div>
            <div class="pt-2 sm:pt-3 border-t border-gray-100">
              <div class="text-xs sm:text-sm text-gray-500">{{ lang.currentLanguage() === 'ar' ? 'الرصيد الحالي' : 'Current Balance' }}</div>
              <div class="text-base sm:text-xl font-bold text-gray-900">{{ lang.formatCurrency(account.balance) }}</div>
            </div>
          </div>
        }
      </div>

      <!-- Total Balance Summary -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-primary-100 text-primary-600">
            <ng-icon name="heroBuildingLibrary" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value text-xs sm:text-base truncate">{{ lang.formatCurrency(totalBalance()) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-success-100 text-success-600">
            <ng-icon name="heroArrowDownLeft" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value text-xs sm:text-base truncate">{{ lang.formatCurrency(125000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'إيداعات' : 'Deposits' }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-danger-100 text-danger-600">
            <ng-icon name="heroArrowUpRight" class="text-lg sm:text-xl"></ng-icon>
          </div>
          <div class="stat-card-value text-xs sm:text-base truncate">{{ lang.formatCurrency(85000) }}</div>
          <div class="stat-card-label">{{ lang.currentLanguage() === 'ar' ? 'مسحوبات' : 'Withdrawals' }}</div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card">
        <div class="p-3 sm:p-4 border-b border-gray-100">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'المعاملات الأخيرة' : 'Recent Transactions' }}</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          @for (tx of transactions(); track tx.id) {
            <div class="p-3 sm:p-4 border-b border-gray-100 last:border-b-0">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-sm text-gray-900 truncate">{{ lang.currentLanguage() === 'ar' ? tx.descriptionAr : tx.description }}</div>
                  <div class="text-xs text-gray-500">{{ tx.account }}</div>
                </div>
                <span class="flex items-center gap-0.5 shrink-0 font-semibold text-sm" [class.text-success-600]="tx.type === 'credit'" [class.text-danger-600]="tx.type === 'debit'">
                  @if (tx.type === 'credit') {
                    <ng-icon name="heroArrowDownLeft" class="text-xs"></ng-icon>
                    +
                  } @else {
                    <ng-icon name="heroArrowUpRight" class="text-xs"></ng-icon>
                    -
                  }
                  {{ lang.formatCurrency(tx.amount) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ lang.formatDate(tx.date, 'short') }}</span>
                <span class="font-medium text-gray-700">{{ lang.currentLanguage() === 'ar' ? 'الرصيد:' : 'Bal:' }} {{ lang.formatCurrency(tx.balance) }}</span>
              </div>
            </div>
          }
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block table-container">
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
        bankName: 'Bank Muscat',
        bankNameAr: 'بنك مسقط',
        accountNumber: '****4521',
        accountType: 'Business Current',
        accountTypeAr: 'حساب جاري تجاري',
        balance: 89350.500,
        currency: 'OMR'
      },
      {
        id: '2',
        bankName: 'Bank Dhofar',
        bankNameAr: 'بنك ظفار',
        accountNumber: '****7832',
        accountType: 'Savings Account',
        accountTypeAr: 'حساب توفير',
        balance: 45200.000,
        currency: 'OMR'
      },
      {
        id: '3',
        bankName: 'NBO',
        bankNameAr: 'البنك الوطني العماني',
        accountNumber: '****1294',
        accountType: 'Business Current',
        accountTypeAr: 'حساب جاري تجاري',
        balance: 32150.750,
        currency: 'OMR'
      }
    ]);

    this.transactions.set([
      {
        id: '1',
        date: new Date(2024, 11, 18),
        description: 'Payment received - Invoice INV-2024-001',
        descriptionAr: 'دفعة مستلمة - فاتورة INV-2024-001',
        type: 'credit',
        amount: 5197.500,
        balance: 89350.500,
        account: 'Bank Muscat'
      },
      {
        id: '2',
        date: new Date(2024, 11, 17),
        description: 'Vendor payment - Office Supplies Co.',
        descriptionAr: 'دفعة للمورد - شركة مستلزمات المكاتب',
        type: 'debit',
        amount: 1850.000,
        balance: 84153.000,
        account: 'Bank Muscat'
      },
      {
        id: '3',
        date: new Date(2024, 11, 16),
        description: 'Salary payments - December 2024',
        descriptionAr: 'رواتب - ديسمبر 2024',
        type: 'debit',
        amount: 12500.000,
        balance: 86003.000,
        account: 'Bank Dhofar'
      },
      {
        id: '4',
        date: new Date(2024, 11, 15),
        description: 'Payment received - Invoice INV-2024-002',
        descriptionAr: 'دفعة مستلمة - فاتورة INV-2024-002',
        type: 'credit',
        amount: 3750.000,
        balance: 98503.000,
        account: 'Bank Muscat'
      },
      {
        id: '5',
        date: new Date(2024, 11, 14),
        description: 'Utility bills payment',
        descriptionAr: 'دفع فواتير المرافق',
        type: 'debit',
        amount: 425.500,
        balance: 94753.000,
        account: 'NBO'
      }
    ]);
  }
}
