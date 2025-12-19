# OpenSky ERP - RTL & Arabic Localization Guide

## Document Information
| Field | Value |
|-------|-------|
| Project | OpenSky International ERP |
| Module | Localization & Internationalization |
| Version | 1.0 |
| Date | December 2024 |
| Languages | English (en), Arabic (ar) |

---

## 1. Overview

### 1.1 Requirements
OpenSky International operates in Oman where Arabic is the official language. The ERP must support:

- **Full RTL (Right-to-Left) layout** for Arabic interface
- **Bilingual content** - Arabic and English
- **Bidirectional text** - Mixed Arabic/English in same context
- **User preference** - Language switching per user
- **Data in both languages** - Employee names, descriptions, etc.

### 1.2 Default Behavior
| Setting | Value |
|---------|-------|
| Default Language | English |
| RTL Support | Full |
| Language Switching | User preference (stored) |
| Data Fields | Bilingual where applicable |

---

## 2. Typography for Arabic

### 2.1 Arabic Font Stack
```css
/* Arabic-optimized font stack */
--font-arabic: 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Tajawal', 'Cairo', system-ui, sans-serif;

/* Combined stack for bilingual support */
--font-sans: 'Plus Jakarta Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif;

/* Monospace (numbers, codes) - same for both */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 2.2 Recommended Arabic Fonts

| Font | Style | Best For | Source |
|------|-------|----------|--------|
| **IBM Plex Sans Arabic** | Modern, clean | UI text, body | Google Fonts |
| **Noto Sans Arabic** | Neutral, readable | Fallback, accessibility | Google Fonts |
| **Tajawal** | Modern, elegant | Headings | Google Fonts |
| **Cairo** | Friendly, rounded | Casual interfaces | Google Fonts |
| **Amiri** | Traditional, serif | Formal documents | Google Fonts |

### 2.3 Typography Adjustments for Arabic

```css
/* Arabic text typically needs larger size and more line height */
[dir="rtl"] {
  /* Increase base font size slightly */
  font-size: 15px; /* vs 14px for English */
  
  /* More generous line height for Arabic diacritics */
  line-height: 1.7; /* vs 1.5 for English */
  
  /* Letter spacing - tighter for Arabic */
  letter-spacing: 0;
}

/* Headings in Arabic */
[dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3 {
  font-weight: 600; /* Arabic fonts often need less bold */
  line-height: 1.4;
}
```

### 2.4 Font Size Scale Comparison

| Element | English | Arabic | Notes |
|---------|---------|--------|-------|
| Display | 36px | 38px | Arabic needs slightly larger |
| H1 | 28px | 30px | |
| H2 | 22px | 24px | |
| H3 | 18px | 19px | |
| Body | 14px | 15px | |
| Small | 13px | 14px | |
| Caption | 12px | 13px | |

---

## 3. RTL Layout System

### 3.1 Layout Mirroring

The entire UI mirrors horizontally for RTL:

```
LTR Layout:                          RTL Layout:
┌──────────┬─────────────────┐      ┌─────────────────┬──────────┐
│          │                 │      │                 │          │
│ Sidebar  │    Content      │  →   │    Content      │  Sidebar │
│   ←      │       →         │      │       ←         │    →     │
│          │                 │      │                 │          │
└──────────┴─────────────────┘      └─────────────────┴──────────┘
```

### 3.2 Elements That Mirror

| Element | LTR | RTL |
|---------|-----|-----|
| Sidebar | Left | Right |
| Text alignment | Left | Right |
| Icons (directional) | → | ← |
| Progress bars | Left to right | Right to left |
| Breadcrumbs | Home > Section > Page | الرئيسية > القسم > الصفحة |
| Form labels | Above/Left | Above/Right |
| Checkboxes | Left of text | Right of text |
| Close buttons | Top-right | Top-left |
| Back arrows | ← | → |
| Navigation flow | Left → Right | Right → Left |

### 3.3 Elements That Don't Mirror

| Element | Reason |
|---------|--------|
| Logo | Brand identity |
| Phone numbers | Universal format |
| Numbers (Latin) | Mathematical convention |
| Media controls | Universal (play/pause) |
| Sliders/ranges | Value increases right |
| Code/technical | Always LTR |
| Currency symbols | Position varies by locale |
| Graphs/charts | Data convention |

### 3.4 CSS Implementation

```css
/* Base RTL setup */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Logical properties (modern approach) */
.card {
  /* Instead of margin-left, use logical properties */
  margin-inline-start: 16px;
  padding-inline-end: 24px;
  border-inline-start: 3px solid var(--color-primary);
}

/* Flexbox auto-mirrors with dir="rtl" */
.nav-item {
  display: flex;
  gap: 12px;
  /* Will auto-reverse in RTL */
}

/* Icons that need explicit mirroring */
.icon-arrow {
  transform: scaleX(1);
}
[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}

/* Icons that should NOT mirror */
.icon-no-flip {
  /* Add class to prevent mirroring */
}
[dir="rtl"] .icon-no-flip {
  transform: scaleX(1) !important;
}
```

### 3.5 Angular RTL Implementation

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `
    <div [dir]="direction" [class.rtl]="isRtl">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  direction: 'ltr' | 'rtl' = 'ltr';
  isRtl = false;

  constructor(private translate: TranslateService) {
    // Set based on user preference or browser
    this.setLanguage(localStorage.getItem('lang') || 'en');
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.isRtl = lang === 'ar';
    document.documentElement.dir = this.direction;
    document.documentElement.lang = lang;
  }
}
```

---

## 4. Bilingual Data Model

### 4.1 Fields Requiring Bilingual Support

| Entity | Bilingual Fields |
|--------|------------------|
| Employee | firstName, lastName (+ arabicName) |
| Department | name, description |
| Position | title, description |
| Product | name, description |
| Customer | companyName |
| Invoice | notes, terms |
| Leave Type | name |
| Document | title |

### 4.2 Data Structure Options

**Option A: Separate Fields (Recommended for key fields)**
```typescript
interface Employee {
  firstName: string;        // English
  lastName: string;         // English
  firstNameAr?: string;     // Arabic
  lastNameAr?: string;      // Arabic
  // Computed display name based on current language
}
```

**Option B: JSON Object (For optional content)**
```typescript
interface Department {
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}
```

**Option C: Translation Table (For system labels)**
```typescript
// Separate translation files
// en.json
{
  "dashboard": "Dashboard",
  "employees": "Employees",
  "leave_request": "Leave Request"
}

// ar.json
{
  "dashboard": "لوحة التحكم",
  "employees": "الموظفون",
  "leave_request": "طلب إجازة"
}
```

### 4.3 Display Name Logic

```typescript
// Helper function for displaying bilingual names
function getDisplayName(employee: Employee, lang: string): string {
  if (lang === 'ar' && employee.firstNameAr) {
    return `${employee.firstNameAr} ${employee.lastNameAr || ''}`.trim();
  }
  return `${employee.firstName} ${employee.lastName}`.trim();
}

// For departments, products, etc.
function getLocalizedValue(field: { en: string; ar: string }, lang: string): string {
  return lang === 'ar' ? (field.ar || field.en) : field.en;
}
```

---

## 5. UI Components - RTL Adaptations

### 5.1 Navigation Sidebar

```
LTR:                                 RTL:
┌────────────────────┐              ┌────────────────────┐
│ [☰] OpenSky       │              │       OpenSky [☰] │
├────────────────────┤              ├────────────────────┤
│ [🏠] Dashboard     │              │     لوحة التحكم [🏠] │
│ [👥] Employees     │              │       الموظفون [👥] │
│ [📅] Leave         │              │       الإجازات [📅] │
│ [💰] Finance       │              │         المالية [💰] │
└────────────────────┘              └────────────────────┘
```

### 5.2 Data Tables

```
LTR Table:
┌─────────────────────────────────────────────────────────────────┐
│ [☐] │ Name           │ Department  │ Status    │ Actions       │
├─────────────────────────────────────────────────────────────────┤
│ [☐] │ Ahmed Hassan   │ Operations  │ [●Active] │ [👁] [✎] [⋮] │
└─────────────────────────────────────────────────────────────────┘

RTL Table:
┌─────────────────────────────────────────────────────────────────┐
│ الإجراءات      │ الحالة     │ القسم      │ الاسم          │ [☐] │
├─────────────────────────────────────────────────────────────────┤
│ [⋮] [✎] [👁] │ [نشط●]     │ العمليات   │ أحمد حسن       │ [☐] │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Forms

```
LTR Form:                            RTL Form:
┌────────────────────────┐          ┌────────────────────────┐
│ First Name *           │          │          * الاسم الأول │
│ ┌────────────────────┐ │          │ ┌────────────────────┐ │
│ │ Ahmed              │ │          │ │              أحمد  │ │
│ └────────────────────┘ │          │ └────────────────────┘ │
│                        │          │                        │
│ Department *           │          │              * القسم │
│ ┌────────────────────┐ │          │ ┌────────────────────┐ │
│ │ Operations     [▼] │ │          │ │ [▼]      العمليات │ │
│ └────────────────────┘ │          │ └────────────────────┘ │
│                        │          │                        │
│ [Cancel] [Save]        │          │        [حفظ] [إلغاء] │
└────────────────────────┘          └────────────────────────┘
```

### 5.4 Stat Cards

```
LTR:                                 RTL:
┌─────────────────────┐             ┌─────────────────────┐
│ [👥]        ↑ 12%   │             │   %12 ↑        [👥] │
│                     │             │                     │
│ 156                 │             │                 156 │
│ Total Employees     │             │     إجمالي الموظفين │
└─────────────────────┘             └─────────────────────┘
```

### 5.5 Modals

```
LTR Modal:                           RTL Modal:
┌─────────────────────────┐         ┌─────────────────────────┐
│ Add Employee        [×] │         │ [×]        إضافة موظف │
├─────────────────────────┤         ├─────────────────────────┤
│                         │         │                         │
│ Form content...         │         │         ...محتوى النموذج │
│                         │         │                         │
├─────────────────────────┤         ├─────────────────────────┤
│      [Cancel] [Save]    │         │    [حفظ] [إلغاء]      │
└─────────────────────────┘         └─────────────────────────┘
```

---

## 6. Numbers, Dates & Currency

### 6.1 Number Formatting

| Format | English | Arabic (Eastern) | Arabic (Western) |
|--------|---------|------------------|------------------|
| Standard | 1,234.56 | ١٬٢٣٤٫٥٦ | 1.234,56 |
| Phone | +968 9123 4567 | +968 9123 4567 | Same |
| Percentage | 12.5% | %12.5 or ١٢٫٥٪ | Same |

**Recommendation:** Use Western Arabic numerals (0-9) for consistency in business context, but support Eastern Arabic numerals (٠-٩) as user preference.

```typescript
// Angular pipe for number formatting
@Pipe({ name: 'localNumber' })
export class LocalNumberPipe implements PipeTransform {
  transform(value: number, locale: string = 'en'): string {
    const options = { useGrouping: true, minimumFractionDigits: 2 };
    
    // Use 'ar-EG' for Western numerals, 'ar-SA' for Eastern
    const arabicLocale = 'ar-EG'; // Western Arabic numerals
    
    return new Intl.NumberFormat(
      locale === 'ar' ? arabicLocale : 'en-US',
      options
    ).format(value);
  }
}
```

### 6.2 Date Formatting

| Format | English | Arabic |
|--------|---------|--------|
| Short | Dec 18, 2024 | 18 ديسمبر 2024 |
| Long | Thursday, December 18, 2024 | الخميس، 18 ديسمبر 2024 |
| Input | MM/DD/YYYY | DD/MM/YYYY |
| Relative | 2 days ago | منذ يومين |

**Calendar Considerations:**
- Gregorian calendar is standard in Oman business
- Hijri calendar display as secondary (optional)
- Week starts on Sunday in Oman

```typescript
// Date formatting
@Pipe({ name: 'localDate' })
export class LocalDatePipe implements PipeTransform {
  transform(value: Date, format: string = 'medium', locale: string = 'en'): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat(
      locale === 'ar' ? 'ar-OM' : 'en-US',
      options
    ).format(new Date(value));
  }
}
```

### 6.3 Currency Formatting

| Currency | English | Arabic |
|----------|---------|--------|
| OMR | OMR 1,234.500 | 1,234.500 ر.ع. |
| USD | USD 1,234.56 | 1,234.56 دولار |
| EUR | EUR 1,234.56 | 1,234.56 يورو |

**OMR Note:** Omani Rial uses 3 decimal places (1 OMR = 1000 baisa)

```typescript
// Currency formatting
function formatCurrency(amount: number, currencyCode: string, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-OM' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'OMR' ? 3 : 2,
    maximumFractionDigits: currencyCode === 'OMR' ? 3 : 2
  }).format(amount);
}
```

---

## 7. Translation Strategy

### 7.1 Translation File Structure

```
src/
├── assets/
│   └── i18n/
│       ├── en.json          # English translations
│       ├── ar.json          # Arabic translations
│       ├── en/
│       │   ├── common.json
│       │   ├── hr.json
│       │   └── finance.json
│       └── ar/
│           ├── common.json
│           ├── hr.json
│           └── finance.json
```

### 7.2 Translation Keys Convention

```json
// en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "loading": "Loading...",
    "no_data": "No data found",
    "confirm_delete": "Are you sure you want to delete?"
  },
  "nav": {
    "dashboard": "Dashboard",
    "employees": "Employees",
    "leave": "Leave",
    "finance": "Finance",
    "settings": "Settings"
  },
  "hr": {
    "employee": {
      "title": "Employees",
      "add": "Add Employee",
      "first_name": "First Name",
      "last_name": "Last Name",
      "department": "Department",
      "position": "Position",
      "status": "Status",
      "active": "Active",
      "on_leave": "On Leave"
    },
    "leave": {
      "title": "Leave Management",
      "request": "Leave Request",
      "balance": "Leave Balance",
      "type": "Leave Type",
      "annual": "Annual Leave",
      "sick": "Sick Leave",
      "approve": "Approve",
      "reject": "Reject"
    }
  }
}
```

```json
// ar.json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "search": "بحث",
    "filter": "تصفية",
    "export": "تصدير",
    "loading": "جاري التحميل...",
    "no_data": "لا توجد بيانات",
    "confirm_delete": "هل أنت متأكد من الحذف؟"
  },
  "nav": {
    "dashboard": "لوحة التحكم",
    "employees": "الموظفون",
    "leave": "الإجازات",
    "finance": "المالية",
    "settings": "الإعدادات"
  },
  "hr": {
    "employee": {
      "title": "الموظفون",
      "add": "إضافة موظف",
      "first_name": "الاسم الأول",
      "last_name": "اسم العائلة",
      "department": "القسم",
      "position": "المنصب",
      "status": "الحالة",
      "active": "نشط",
      "on_leave": "في إجازة"
    },
    "leave": {
      "title": "إدارة الإجازات",
      "request": "طلب إجازة",
      "balance": "رصيد الإجازات",
      "type": "نوع الإجازة",
      "annual": "إجازة سنوية",
      "sick": "إجازة مرضية",
      "approve": "موافقة",
      "reject": "رفض"
    }
  }
}
```

### 7.3 Using ngx-translate

```typescript
// app.module.ts
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ]
})
export class AppModule { }
```

```html
<!-- Template usage -->
<h1>{{ 'hr.employee.title' | translate }}</h1>

<button>{{ 'common.save' | translate }}</button>

<!-- With parameters -->
<p>{{ 'messages.welcome' | translate:{ name: userName } }}</p>
```

---

## 8. Language Switcher Component

### 8.1 UI Design

```
Header (LTR):
┌────────────────────────────────────────────────────────────────┐
│ [Logo]  [Search...]                    [🔔] [EN ▼] [👤 Ahmed] │
└────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
                                         ┌─────────┐
                                         │ English │ ✓
                                         │ العربية │
                                         └─────────┘

Header (RTL):
┌────────────────────────────────────────────────────────────────┐
│ [أحمد 👤] [عر ▼] [🔔]                    [...بحث]  [Logo] │
└────────────────────────────────────────────────────────────────┘
           │
           ▼
      ┌─────────┐
      │ English │
      │ العربية │ ✓
      └─────────┘
```

### 8.2 Component Implementation

```typescript
@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="language-dropdown" [class.rtl]="isRtl">
      <button (click)="toggleDropdown()" class="lang-button">
        {{ currentLang === 'ar' ? 'عر' : 'EN' }}
        <svg class="dropdown-icon">...</svg>
      </button>
      
      <div *ngIf="isOpen" class="dropdown-menu">
        <button 
          *ngFor="let lang of languages"
          (click)="switchLanguage(lang.code)"
          [class.active]="currentLang === lang.code">
          {{ lang.name }}
          <span *ngIf="currentLang === lang.code">✓</span>
        </button>
      </div>
    </div>
  `
})
export class LanguageSwitcherComponent {
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];
  
  currentLang = 'en';
  isOpen = false;
  isRtl = false;
  
  constructor(
    private translate: TranslateService,
    private localeService: LocaleService
  ) {
    this.currentLang = this.localeService.getCurrentLanguage();
    this.isRtl = this.currentLang === 'ar';
  }
  
  switchLanguage(lang: string) {
    this.localeService.setLanguage(lang);
    this.currentLang = lang;
    this.isRtl = lang === 'ar';
    this.isOpen = false;
    
    // Reload to apply full RTL changes
    window.location.reload();
  }
}
```

---

## 9. Testing Checklist

### 9.1 RTL Testing

- [ ] Sidebar appears on right in RTL
- [ ] All text aligns right in RTL
- [ ] Directional icons mirror correctly
- [ ] Non-directional icons don't mirror
- [ ] Tables mirror column order
- [ ] Forms align correctly
- [ ] Modals close button moves to left
- [ ] Breadcrumbs flow right-to-left
- [ ] Pagination mirrors
- [ ] Dropdowns open correctly
- [ ] Scrollbars appear on left
- [ ] Charts render correctly

### 9.2 Arabic Content Testing

- [ ] Arabic text displays correctly
- [ ] Mixed Arabic/English renders properly
- [ ] Numbers format correctly
- [ ] Dates localize properly
- [ ] Currency symbols position correctly
- [ ] Long Arabic text wraps properly
- [ ] Arabic search works
- [ ] Sorting handles Arabic correctly

### 9.3 Language Switching

- [ ] Language persists after refresh
- [ ] All UI labels translate
- [ ] Form validation messages translate
- [ ] Error messages translate
- [ ] Notifications translate
- [ ] PDF exports in correct language
- [ ] Email templates localize

---

## 10. Implementation Priority

### Phase 1: Infrastructure
1. Set up ngx-translate
2. Create translation files structure
3. Implement language switcher
4. Configure RTL CSS

### Phase 2: Core UI
1. Mirror layout components
2. Update navigation
3. Adapt forms
4. Update tables

### Phase 3: Content
1. Translate all UI labels
2. Add bilingual data fields
3. Localize dates/numbers
4. Update email templates

### Phase 4: Polish
1. Fine-tune Arabic typography
2. Test all flows in Arabic
3. Add missing translations
4. Performance optimization

---

## 11. Common Arabic HR/Finance Terms

### HR Terms
| English | Arabic |
|---------|--------|
| Employee | موظف |
| Department | قسم |
| Position | منصب |
| Salary | راتب |
| Leave | إجازة |
| Annual Leave | إجازة سنوية |
| Sick Leave | إجازة مرضية |
| Attendance | الحضور |
| Absent | غائب |
| Present | حاضر |
| Probation | فترة تجربة |
| Contract | عقد |

### Finance Terms
| English | Arabic |
|---------|--------|
| Invoice | فاتورة |
| Payment | دفعة |
| Balance | رصيد |
| Credit | دائن |
| Debit | مدين |
| Receivable | مستحق |
| Payable | مستحق الدفع |
| Revenue | إيرادات |
| Expense | مصروفات |
| Tax | ضريبة |
| VAT | ضريبة القيمة المضافة |
| Exchange Rate | سعر الصرف |

---

*This document provides comprehensive guidelines for RTL and Arabic support in the OpenSky ERP system.*
