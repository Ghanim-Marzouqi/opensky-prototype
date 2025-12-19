import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Invoice, Customer } from '../../../core/models';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'الفواتير' : 'Customer Invoices' }}</h1>
          <p class="text-sm text-slate-500 mt-1">
            {{ lang.currentLanguage() === 'ar' ? 'إدارة وتتبع فواتير العملاء' : 'Manage and track customer invoices' }}
          </p>
        </div>
        <button class="btn btn-primary" (click)="showNewInvoiceModal = true">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ lang.currentLanguage() === 'ar' ? 'فاتورة جديدة' : 'New Invoice' }}
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="text-2xl font-bold text-slate-900">{{ openCount() }}</div>
          <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'مفتوحة' : 'Open' }}</div>
          <div class="text-xs text-primary-600 mt-1">{{ lang.formatCurrency(openAmount()) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-amber-600">{{ overdueCount() }}</div>
          <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'متأخرة' : 'Overdue' }}</div>
          <div class="text-xs text-amber-600 mt-1">{{ lang.formatCurrency(overdueAmount()) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-green-600">{{ paidCount() }}</div>
          <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'مدفوعة' : 'Paid' }}</div>
          <div class="text-xs text-green-600 mt-1">{{ lang.formatCurrency(paidAmount()) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-2xl font-bold text-slate-900">{{ totalInvoices().length }}</div>
          <div class="text-sm text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</div>
          <div class="text-xs text-slate-500 mt-1">{{ lang.currentLanguage() === 'ar' ? 'هذا الشهر' : 'This month' }}</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="p-4 flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-64">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="filterInvoices()"
                [placeholder]="lang.currentLanguage() === 'ar' ? 'البحث بالرقم أو اسم العميل...' : 'Search by invoice # or customer...'"
                class="form-input ps-10"
              />
              <svg class="absolute start-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select [(ngModel)]="customerFilter" (ngModelChange)="filterInvoices()" class="form-select w-48">
            <option value="">{{ lang.currentLanguage() === 'ar' ? 'جميع العملاء' : 'All Customers' }}</option>
            @for (customer of customers; track customer.id) {
              <option [value]="customer.id">{{ lang.currentLanguage() === 'ar' && customer.nameAr ? customer.nameAr : customer.name }}</option>
            }
          </select>
          <select [(ngModel)]="statusFilter" (ngModelChange)="filterInvoices()" class="form-select w-40">
            <option value="">{{ lang.currentLanguage() === 'ar' ? 'جميع الحالات' : 'All Status' }}</option>
            <option value="draft">{{ lang.currentLanguage() === 'ar' ? 'مسودة' : 'Draft' }}</option>
            <option value="open">{{ lang.currentLanguage() === 'ar' ? 'مفتوحة' : 'Open' }}</option>
            <option value="partial">{{ lang.currentLanguage() === 'ar' ? 'جزئية' : 'Partial' }}</option>
            <option value="paid">{{ lang.currentLanguage() === 'ar' ? 'مدفوعة' : 'Paid' }}</option>
            <option value="overdue">{{ lang.currentLanguage() === 'ar' ? 'متأخرة' : 'Overdue' }}</option>
          </select>
          <button class="btn btn-secondary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {{ lang.currentLanguage() === 'ar' ? 'تصدير' : 'Export' }}
          </button>
        </div>
      </div>

      <!-- Invoice Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.currentLanguage() === 'ar' ? 'رقم الفاتورة' : 'Invoice #' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'العميل' : 'Customer' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'التاريخ' : 'Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الحالة' : 'Status' }}</th>
                <th>{{ lang.currentLanguage() === 'ar' ? 'الإجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of filteredInvoices(); track invoice.id) {
                <tr class="cursor-pointer" (click)="viewInvoice(invoice)">
                  <td>
                    <span class="font-mono font-medium text-slate-900">{{ invoice.invoiceNumber }}</span>
                  </td>
                  <td>
                    <div>
                      <div class="font-medium text-slate-900">{{ invoice.customerName }}</div>
                      <div class="text-xs text-slate-500">{{ getCityFromAddress(invoice.customerAddress) }}</div>
                    </div>
                  </td>
                  <td class="text-slate-600">{{ lang.formatDate(invoice.invoiceDate) }}</td>
                  <td>
                    <div class="text-slate-600">{{ lang.formatDate(invoice.dueDate) }}</div>
                    @if (isOverdue(invoice)) {
                      <div class="text-xs text-red-600">⚠️ {{ getDaysOverdue(invoice) }} {{ lang.currentLanguage() === 'ar' ? 'يوم تأخير' : 'days overdue' }}</div>
                    }
                  </td>
                  <td>
                    <div class="font-medium text-slate-900">
                      {{ invoice.currencyCode }} {{ lang.formatNumber(invoice.totalAmount) }}
                    </div>
                    @if (invoice.currencyCode !== 'OMR') {
                      <div class="text-xs text-slate-500">{{ lang.formatCurrency(invoice.totalAmountBase) }}</div>
                    }
                  </td>
                  <td>
                    <span class="badge" [class]="getStatusBadgeClass(invoice.status)">
                      {{ getStatusLabel(invoice.status) }}
                    </span>
                  </td>
                  <td (click)="$event.stopPropagation()">
                    <div class="flex items-center gap-1">
                      <button
                        class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                        (click)="viewInvoice(invoice)"
                        [title]="lang.currentLanguage() === 'ar' ? 'عرض' : 'View'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      @if (invoice.status !== 'paid' && invoice.status !== 'cancelled') {
                        <button
                          class="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded"
                          (click)="recordPayment(invoice)"
                          [title]="lang.currentLanguage() === 'ar' ? 'تسجيل دفعة' : 'Record Payment'"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        </button>
                      }
                      <button
                        class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                        (click)="printInvoice(invoice)"
                        [title]="lang.currentLanguage() === 'ar' ? 'طباعة' : 'Print'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="text-center py-12">
                    <div class="text-slate-400">
                      <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p class="text-lg font-medium">{{ lang.currentLanguage() === 'ar' ? 'لا توجد فواتير' : 'No invoices found' }}</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Summary Footer -->
        <div class="px-4 py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div class="text-sm text-slate-500">
            {{ lang.currentLanguage() === 'ar' ? 'الملخص:' : 'Summary:' }}
            <span class="font-medium text-slate-700">{{ openCount() }} {{ lang.currentLanguage() === 'ar' ? 'مفتوحة' : 'Open' }}</span>
            ({{ lang.formatCurrency(openAmount()) }})
            |
            <span class="font-medium text-amber-600">{{ overdueCount() }} {{ lang.currentLanguage() === 'ar' ? 'متأخرة' : 'Overdue' }}</span>
            ({{ lang.formatCurrency(overdueAmount()) }})
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm btn-secondary" disabled>
              <svg class="w-4 h-4 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium">1</span>
            <button class="btn btn-sm btn-secondary">
              <svg class="w-4 h-4 flip-rtl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- New Invoice Modal -->
      @if (showNewInvoiceModal) {
        <div class="modal-overlay" (click)="showNewInvoiceModal = false"></div>
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="modal-content max-w-3xl" (click)="$event.stopPropagation()">
              <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ lang.currentLanguage() === 'ar' ? 'فاتورة مبيعات جديدة' : 'New Sales Invoice' }}
                </h3>
                <button (click)="showNewInvoiceModal = false" class="p-1 text-slate-400 hover:text-slate-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'العميل' : 'Customer' }} *</label>
                    <select class="form-select">
                      <option value="">{{ lang.currentLanguage() === 'ar' ? 'اختر العميل' : 'Select Customer' }}</option>
                      @for (customer of customers; track customer.id) {
                        <option [value]="customer.id">{{ customer.name }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'رقم الفاتورة' : 'Invoice #' }}</label>
                    <input type="text" class="form-input" value="INV-2024-0157" disabled />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date' }} *</label>
                    <input type="date" class="form-input" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date' }} *</label>
                    <input type="date" class="form-input" />
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'العملة' : 'Currency' }} *</label>
                    <select class="form-select">
                      <option value="OMR">OMR - Omani Rial</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'سعر الصرف' : 'Exchange Rate' }}</label>
                    <input type="text" class="form-input" value="1.0000" />
                  </div>
                </div>

                <!-- Line Items -->
                <div class="mt-6">
                  <div class="flex items-center justify-between mb-3">
                    <label class="form-label mb-0">{{ lang.currentLanguage() === 'ar' ? 'البنود' : 'Line Items' }}</label>
                    <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      + {{ lang.currentLanguage() === 'ar' ? 'إضافة بند' : 'Add Line' }}
                    </button>
                  </div>
                  <div class="border border-slate-200 rounded-lg overflow-hidden">
                    <table class="w-full text-sm">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="px-3 py-2 text-start font-medium text-slate-700">#</th>
                          <th class="px-3 py-2 text-start font-medium text-slate-700">{{ lang.currentLanguage() === 'ar' ? 'الوصف' : 'Description' }}</th>
                          <th class="px-3 py-2 text-start font-medium text-slate-700 w-20">{{ lang.currentLanguage() === 'ar' ? 'الكمية' : 'Qty' }}</th>
                          <th class="px-3 py-2 text-start font-medium text-slate-700 w-28">{{ lang.currentLanguage() === 'ar' ? 'السعر' : 'Price' }}</th>
                          <th class="px-3 py-2 text-start font-medium text-slate-700 w-28">{{ lang.currentLanguage() === 'ar' ? 'المبلغ' : 'Amount' }}</th>
                          <th class="px-3 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-t border-slate-100">
                          <td class="px-3 py-2">1</td>
                          <td class="px-3 py-2"><input type="text" class="form-input py-1.5 text-sm" placeholder="Enter description" /></td>
                          <td class="px-3 py-2"><input type="number" class="form-input py-1.5 text-sm" value="1" /></td>
                          <td class="px-3 py-2"><input type="number" class="form-input py-1.5 text-sm" value="0.00" /></td>
                          <td class="px-3 py-2 font-medium">0.00</td>
                          <td class="px-3 py-2 text-center">
                            <button class="text-slate-400 hover:text-red-600">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Totals -->
                <div class="flex justify-end">
                  <div class="w-64 space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'المجموع الفرعي' : 'Subtotal' }}</span>
                      <span class="font-medium">OMR 0.000</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">{{ lang.currentLanguage() === 'ar' ? 'ضريبة القيمة المضافة (5%)' : 'VAT (5%)' }}</span>
                      <span class="font-medium">OMR 0.000</span>
                    </div>
                    <div class="flex justify-between pt-2 border-t border-slate-200 text-base">
                      <span class="font-semibold">{{ lang.currentLanguage() === 'ar' ? 'الإجمالي' : 'Total' }}</span>
                      <span class="font-bold text-primary-600">OMR 0.000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="form-label">{{ lang.currentLanguage() === 'ar' ? 'ملاحظات' : 'Notes' }}</label>
                  <textarea class="form-input" rows="2" [placeholder]="lang.currentLanguage() === 'ar' ? 'ملاحظات إضافية...' : 'Additional notes...'"></textarea>
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button class="btn btn-secondary" (click)="showNewInvoiceModal = false">
                  {{ lang.currentLanguage() === 'ar' ? 'حفظ كمسودة' : 'Save as Draft' }}
                </button>
                <button class="btn btn-secondary" (click)="showNewInvoiceModal = false">
                  {{ lang.currentLanguage() === 'ar' ? 'إلغاء' : 'Cancel' }}
                </button>
                <button class="btn btn-primary">
                  {{ lang.currentLanguage() === 'ar' ? 'حفظ وإرسال' : 'Save & Send' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class InvoicesListComponent implements OnInit {
  lang = inject(LanguageService);
  private mockData = inject(MockDataService);

  showNewInvoiceModal = false;
  searchQuery = '';
  customerFilter = '';
  statusFilter = '';

  totalInvoices = signal<Invoice[]>([]);
  customers: Customer[] = [];

  openCount = signal(0);
  openAmount = signal(0);
  overdueCount = signal(0);
  overdueAmount = signal(0);
  paidCount = signal(0);
  paidAmount = signal(0);

  ngOnInit() {
    this.customers = this.mockData.customers;
    this.totalInvoices.set(this.mockData.invoices);
    this.calculateStats();
  }

  calculateStats() {
    const invoices = this.totalInvoices();

    const open = invoices.filter(i => i.status === 'open' || i.status === 'partial');
    this.openCount.set(open.length);
    this.openAmount.set(open.reduce((sum, i) => sum + i.balanceDue * i.exchangeRate, 0));

    const overdue = invoices.filter(i => i.status === 'overdue');
    this.overdueCount.set(overdue.length);
    this.overdueAmount.set(overdue.reduce((sum, i) => sum + i.balanceDue * i.exchangeRate, 0));

    const paid = invoices.filter(i => i.status === 'paid');
    this.paidCount.set(paid.length);
    this.paidAmount.set(paid.reduce((sum, i) => sum + i.totalAmountBase, 0));
  }

  filterInvoices() {
    // Filter implementation
  }

  filteredInvoices(): Invoice[] {
    let results = this.totalInvoices();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      results = results.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q)
      );
    }

    if (this.customerFilter) {
      results = results.filter(i => i.customerId === this.customerFilter);
    }

    if (this.statusFilter) {
      results = results.filter(i => i.status === this.statusFilter);
    }

    return results;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'open': return 'badge-info';
      case 'partial': return 'badge-warning';
      case 'overdue': return 'badge-danger';
      case 'draft': return 'badge-neutral';
      case 'cancelled': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, { en: string; ar: string }> = {
      'draft': { en: 'Draft', ar: 'مسودة' },
      'open': { en: 'Open', ar: 'مفتوحة' },
      'partial': { en: 'Partial', ar: 'جزئية' },
      'paid': { en: 'Paid', ar: 'مدفوعة' },
      'overdue': { en: 'Overdue', ar: 'متأخرة' },
      'cancelled': { en: 'Cancelled', ar: 'ملغاة' }
    };
    const label = labels[status] || { en: status, ar: status };
    return this.lang.currentLanguage() === 'ar' ? label.ar : label.en;
  }

  getCityFromAddress(address: string): string {
    const parts = address.split(',');
    return parts[parts.length - 1]?.trim() || '';
  }

  isOverdue(invoice: Invoice): boolean {
    return invoice.status === 'overdue';
  }

  getDaysOverdue(invoice: Invoice): number {
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  viewInvoice(invoice: Invoice) {
    // Navigate to invoice detail
  }

  recordPayment(invoice: Invoice) {
    // Open payment modal
  }

  printInvoice(invoice: Invoice) {
    // Print invoice
  }
}
