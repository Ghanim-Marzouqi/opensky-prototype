import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LanguageService } from '../core/services/language.service';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { filter } from 'rxjs/operators';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroUsers,
  heroUserGroup,
  heroBuildingOffice2,
  heroCalendarDays,
  heroClipboardDocumentList,
  heroClock,
  heroBanknotes,
  heroDocumentText,
  heroCreditCard,
  heroChartBar,
  heroCurrencyDollar,
  heroBuildingLibrary,
  heroChevronRight,
  heroChevronDown,
  heroBars3,
  heroMagnifyingGlass,
  heroBell,
  heroGlobeAlt,
  heroCog6Tooth,
  heroArrowRightOnRectangle,
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroDocumentDuplicate,
  heroArrowTrendingUp,
  heroArrowTrendingDown,
  heroWallet,
  heroReceiptPercent,
  heroCalculator,
  heroCalendar,
  heroClipboardDocumentCheck,
  heroUserPlus,
  heroIdentification,
  heroScale
} from '@ng-icons/heroicons/outline';

interface NavItem {
  id: string;
  labelEn: string;
  labelAr: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [
    provideIcons({
      heroHome,
      heroUsers,
      heroUserGroup,
      heroBuildingOffice2,
      heroCalendarDays,
      heroClipboardDocumentList,
      heroClock,
      heroBanknotes,
      heroDocumentText,
      heroCreditCard,
      heroChartBar,
      heroCurrencyDollar,
      heroBuildingLibrary,
      heroChevronRight,
      heroChevronDown,
      heroBars3,
      heroMagnifyingGlass,
      heroBell,
      heroGlobeAlt,
      heroCog6Tooth,
      heroArrowRightOnRectangle,
      heroChevronDoubleLeft,
      heroChevronDoubleRight,
      heroDocumentDuplicate,
      heroArrowTrendingUp,
      heroArrowTrendingDown,
      heroWallet,
      heroReceiptPercent,
      heroCalculator,
      heroCalendar,
      heroClipboardDocumentCheck,
      heroUserPlus,
      heroIdentification,
      heroScale
    })
  ],
  template: `
    <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-surface-950" [dir]="lang.direction()">
      <!-- Mobile Overlay -->
      @if (mobileMenuOpen()) {
        <div
          class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          (click)="mobileMenuOpen.set(false)"
        ></div>
      }

      <!-- Sidebar - Light Prodify Style -->
      <aside
        class="sidebar transition-all duration-300"
        [class.w-64]="!sidebarCollapsed()"
        [class.w-20]="sidebarCollapsed()"
        [class.-translate-x-full]="!mobileMenuOpen() && lang.direction() === 'ltr'"
        [class.translate-x-full]="!mobileMenuOpen() && lang.direction() === 'rtl'"
        [class.translate-x-0]="mobileMenuOpen()"
        [class.lg:translate-x-0]="true"
      >
        <!-- User Profile at Top -->
        <div class="p-4 border-b border-gray-200 dark:border-surface-800">
          <div class="flex items-center gap-3">
            <div class="avatar w-10 h-10 text-sm">{{ userInitials() }}</div>
            @if (!sidebarCollapsed()) {
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ lang.currentLanguage() === 'ar' ? auth.user()?.nameAr : auth.user()?.name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ auth.userRole() === 'hr'
                    ? (lang.currentLanguage() === 'ar' ? 'الموارد البشرية' : 'HR Manager')
                    : (lang.currentLanguage() === 'ar' ? 'المالية' : 'Finance Manager') }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
          @for (section of filteredNavSections(); track section.id) {
            <!-- Section Header -->
            @if (!sidebarCollapsed()) {
              <div class="nav-section-title mt-4 first:mt-0 mb-2">
                {{ lang.currentLanguage() === 'ar' ? section.labelAr : section.labelEn }}
              </div>
            } @else {
              <div class="my-3 border-t border-gray-200 dark:border-surface-800"></div>
            }

            @for (item of section.items; track item.id) {
              @if (item.children && item.children.length > 0) {
                <!-- Parent Item -->
                <button
                  (click)="toggleExpand(item)"
                  class="w-full nav-item mb-1"
                  [class.justify-center]="sidebarCollapsed()"
                  [class.px-3]="sidebarCollapsed()"
                >
                  <ng-icon [name]="item.icon" class="text-xl"></ng-icon>
                  @if (!sidebarCollapsed()) {
                    <span class="flex-1 text-start">{{ lang.currentLanguage() === 'ar' ? item.labelAr : item.labelEn }}</span>
                    <ng-icon
                      [name]="item.expanded ? 'heroChevronDown' : 'heroChevronRight'"
                      class="text-sm transition-transform flip-rtl"
                    ></ng-icon>
                  }
                </button>

                <!-- Child Items -->
                @if (item.expanded && !sidebarCollapsed()) {
                  <div class="ms-3 mb-2 ps-3 border-s border-gray-300 dark:border-surface-700">
                    @for (child of item.children; track child.id) {
                      <a
                        [routerLink]="child.route"
                        routerLinkActive="active"
                        class="nav-item mb-0.5 py-2.5"
                      >
                        <ng-icon [name]="child.icon" class="text-lg"></ng-icon>
                        <span class="text-sm">{{ lang.currentLanguage() === 'ar' ? child.labelAr : child.labelEn }}</span>
                      </a>
                    }
                  </div>
                }
              } @else {
                <!-- Simple Item -->
                <a
                  [routerLink]="item.route"
                  routerLinkActive="active"
                  class="nav-item mb-1"
                  [class.justify-center]="sidebarCollapsed()"
                  [class.px-3]="sidebarCollapsed()"
                  [attr.title]="sidebarCollapsed() ? (lang.currentLanguage() === 'ar' ? item.labelAr : item.labelEn) : null"
                >
                  <ng-icon [name]="item.icon" class="text-xl"></ng-icon>
                  @if (!sidebarCollapsed()) {
                    <span>{{ lang.currentLanguage() === 'ar' ? item.labelAr : item.labelEn }}</span>
                  }
                </a>
              }
            }
          }
        </nav>

        <!-- Collapse Toggle at Bottom -->
        <div class="border-t border-gray-200 dark:border-surface-800 p-3">
          <button
            (click)="toggleSidebar()"
            class="w-full nav-item justify-center py-2"
          >
            <ng-icon
              [name]="sidebarCollapsed() ? 'heroChevronDoubleRight' : 'heroChevronDoubleLeft'"
              class="text-lg flip-rtl"
            ></ng-icon>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ms-64"
        [class.lg:ms-64]="!sidebarCollapsed()"
        [class.lg:ms-20]="sidebarCollapsed()"
      >
        <!-- Header - Clean Prodify Style -->
        <header
          class="fixed top-0 left-0 right-0 z-20 h-14 bg-white dark:bg-surface-900 border-b border-gray-200 dark:border-surface-800 flex items-center px-4 sm:px-6 gap-2 sm:gap-4 transition-all duration-300"
          [class.lg:left-64]="!sidebarCollapsed() && lang.direction() === 'ltr'"
          [class.lg:left-20]="sidebarCollapsed() && lang.direction() === 'ltr'"
          [class.lg:right-64]="!sidebarCollapsed() && lang.direction() === 'rtl'"
          [class.lg:right-20]="sidebarCollapsed() && lang.direction() === 'rtl'"
        >
          <!-- Mobile Menu Toggle -->
          <button
            (click)="toggleMobileMenu()"
            class="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 rounded-xl"
          >
            <ng-icon name="heroBars3" class="text-xl"></ng-icon>
          </button>

          <!-- Date Display - Prodify Style -->
          <div class="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ng-icon name="heroCalendar" class="text-lg"></ng-icon>
            <span>{{ currentDate }}</span>
          </div>

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- Right Actions -->
          <div class="flex items-center gap-2">
            <!-- Search -->
            <div class="relative hidden md:block">
              <input
                type="text"
                [placeholder]="lang.currentLanguage() === 'ar' ? 'بحث...' : 'Search...'"
                class="w-40 lg:w-48 h-10 ps-10 pe-4 text-sm bg-gray-50 dark:bg-surface-800 border border-gray-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white dark:focus:bg-surface-700 dark:text-white dark:placeholder:text-gray-500 transition-all"
              />
              <ng-icon name="heroMagnifyingGlass" class="absolute start-3 top-2.5 text-gray-400"></ng-icon>
            </div>

            <!-- Language Toggle -->
            <button
              (click)="lang.toggleLanguage()"
              class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-all"
            >
              <ng-icon name="heroGlobeAlt" class="text-lg"></ng-icon>
              <span class="hidden sm:inline">{{ lang.currentLanguage() === 'ar' ? 'EN' : 'AR' }}</span>
            </button>

            <!-- Notifications -->
            <button class="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-800 rounded-xl transition-all">
              <ng-icon name="heroBell" class="text-xl"></ng-icon>
              <span class="absolute top-1.5 end-1.5 w-2 h-2 bg-coral-500 rounded-full ring-2 ring-white"></span>
            </button>

            <!-- User Menu (Compact) -->
            <div class="relative ms-1">
              <button
                (click)="toggleUserMenu()"
                class="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-surface-800 rounded-xl transition-all"
              >
                <div class="avatar w-8 h-8 text-xs">{{ userInitials() }}</div>
                <ng-icon name="heroChevronDown" class="text-gray-400 text-sm hidden sm:block"></ng-icon>
              </button>

              @if (userMenuOpen()) {
                <div class="absolute end-0 mt-2 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-gray-200 dark:border-surface-800 py-2 z-50">
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-surface-800">
                    <div class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ lang.currentLanguage() === 'ar' ? auth.user()?.nameAr : auth.user()?.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ auth.user()?.email }}</div>
                  </div>
                  <a routerLink="/profile" (click)="userMenuOpen.set(false)" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                    <ng-icon name="heroIdentification" class="text-lg text-gray-500"></ng-icon>
                    {{ lang.currentLanguage() === 'ar' ? 'ملفي الشخصي' : 'My Profile' }}
                  </a>
                  <a routerLink="/settings" (click)="userMenuOpen.set(false)" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                    <ng-icon name="heroCog6Tooth" class="text-lg text-gray-500"></ng-icon>
                    {{ lang.currentLanguage() === 'ar' ? 'الإعدادات' : 'Settings' }}
                  </a>
                  <div class="border-t border-gray-200 dark:border-surface-800 my-1"></div>
                  <button
                    (click)="logout()"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <ng-icon name="heroArrowRightOnRectangle" class="text-lg"></ng-icon>
                    {{ lang.currentLanguage() === 'ar' ? 'تسجيل الخروج' : 'Sign Out' }}
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Page Content - Light Background -->
        <main class="flex-1 overflow-auto p-4 sm:p-6 mt-14 bg-gray-50 dark:bg-surface-950">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class LayoutComponent {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  userMenuOpen = signal(false);
  mobileMenuOpen = signal(false);

  // Current date for header display - Prodify style
  // Always use English (Latin) numerals even for Arabic
  get currentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return this.lang.currentLanguage() === 'ar'
      ? date.toLocaleDateString('ar-SA-u-nu-latn', options)
      : date.toLocaleDateString('en-US', options);
  }

  // Filter navigation based on user role
  filteredNavSections = computed(() => {
    const role = this.auth.userRole();
    return this.navSections.filter(section => section.id === role);
  });

  // Get user initials for avatar
  userInitials = computed(() => {
    const user = this.auth.user();
    if (!user) return '??';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });

  navSections: { id: string; labelEn: string; labelAr: string; items: NavItem[] }[] = [
    {
      id: 'hr',
      labelEn: 'Human Resources',
      labelAr: 'الموارد البشرية',
      items: [
        { id: 'hr-dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', icon: 'heroHome', route: '/hr/dashboard' },
        {
          id: 'hr-employees', labelEn: 'Employees', labelAr: 'الموظفون', icon: 'heroUsers', expanded: true,
          children: [
            { id: 'hr-directory', labelEn: 'Directory', labelAr: 'الدليل', icon: 'heroUserGroup', route: '/hr/employees' },
            { id: 'hr-org-chart', labelEn: 'Org Chart', labelAr: 'الهيكل', icon: 'heroBuildingOffice2', route: '/hr/org-chart' },
          ]
        },
        {
          id: 'hr-leave', labelEn: 'Leave', labelAr: 'الإجازات', icon: 'heroCalendarDays', expanded: false,
          children: [
            { id: 'hr-leave-requests', labelEn: 'Requests', labelAr: 'الطلبات', icon: 'heroClipboardDocumentList', route: '/hr/leave/requests' },
            { id: 'hr-leave-calendar', labelEn: 'Calendar', labelAr: 'التقويم', icon: 'heroCalendar', route: '/hr/leave/calendar' },
            { id: 'hr-leave-balances', labelEn: 'Balances', labelAr: 'الأرصدة', icon: 'heroScale', route: '/hr/leave/balances' },
          ]
        },
        { id: 'hr-attendance', labelEn: 'Attendance', labelAr: 'الحضور', icon: 'heroClock', route: '/hr/attendance' },
      ]
    },
    {
      id: 'finance',
      labelEn: 'Finance',
      labelAr: 'المالية',
      items: [
        { id: 'fin-dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', icon: 'heroChartBar', route: '/finance/dashboard' },
        {
          id: 'fin-receivables', labelEn: 'Receivables', labelAr: 'المستحقات', icon: 'heroArrowTrendingUp', expanded: true,
          children: [
            { id: 'fin-invoices', labelEn: 'Invoices', labelAr: 'الفواتير', icon: 'heroDocumentText', route: '/finance/invoices' },
            { id: 'fin-payments-received', labelEn: 'Payments', labelAr: 'المدفوعات', icon: 'heroBanknotes', route: '/finance/payments-received' },
            { id: 'fin-ar-aging', labelEn: 'AR Aging', labelAr: 'التقادم', icon: 'heroReceiptPercent', route: '/finance/ar-aging' },
          ]
        },
        {
          id: 'fin-payables', labelEn: 'Payables', labelAr: 'المدفوعات', icon: 'heroArrowTrendingDown', expanded: false,
          children: [
            { id: 'fin-bills', labelEn: 'Bills', labelAr: 'الفواتير', icon: 'heroDocumentDuplicate', route: '/finance/bills' },
            { id: 'fin-payments-made', labelEn: 'Payments', labelAr: 'المصروفات', icon: 'heroCreditCard', route: '/finance/payments-made' },
            { id: 'fin-ap-aging', labelEn: 'AP Aging', labelAr: 'التقادم', icon: 'heroCalculator', route: '/finance/ap-aging' },
          ]
        },
        { id: 'fin-currencies', labelEn: 'Currencies', labelAr: 'العملات', icon: 'heroCurrencyDollar', route: '/finance/currencies' },
        { id: 'fin-banking', labelEn: 'Banking', labelAr: 'البنوك', icon: 'heroBuildingLibrary', route: '/finance/banking' },
      ]
    }
  ];

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.userMenuOpen.set(false);
      this.mobileMenuOpen.set(false);
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleExpand(item: NavItem) {
    item.expanded = !item.expanded;
  }

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
  }
}
