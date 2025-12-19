# OpenSky ERP - UI/UX Design System

## Document Information
| Field | Value |
|-------|-------|
| Project | OpenSky International ERP |
| Module | Design System & UI Guidelines |
| Version | 1.0 |
| Date | December 2024 |
| Author | Development Team |

---

## 1. Design Philosophy

### 1.1 Vision
Create a **modern, professional, and intuitive** ERP interface that feels more like a premium SaaS product than traditional enterprise software. The design should reduce cognitive load, accelerate workflows, and make complex business processes feel effortless.

### 1.2 Core Principles

| Principle | Description |
|-----------|-------------|
| **Clarity First** | Every element serves a purpose. Remove visual noise. |
| **Scannable** | Users should grasp key information in 3 seconds or less |
| **Consistent** | Same patterns everywhere reduce learning curve |
| **Responsive** | Seamless experience from desktop to mobile |
| **Accessible** | WCAG 2.1 AA compliant, works for everyone |
| **Delightful** | Subtle animations and micro-interactions that feel premium |

### 1.3 Design Inspiration
Drawing from best-in-class SaaS products:
- **Linear** - Clean, focused interfaces with keyboard shortcuts
- **Notion** - Flexible layouts with excellent information hierarchy
- **Stripe Dashboard** - Data-rich yet uncluttered financial views
- **Figma** - Collaborative feel with real-time updates
- **Odoo** - Modular ERP with modern aesthetics

---

## 2. Visual Identity

### 2.1 Color Palette

#### Primary Colors
```
Primary Blue (Brand)
├── 50:  #EFF6FF  (Backgrounds, hover states)
├── 100: #DBEAFE  (Light accents)
├── 200: #BFDBFE  (Borders)
├── 500: #3B82F6  (Interactive elements)
├── 600: #2563EB  (Primary buttons, links)
├── 700: #1D4ED8  (Hover states)
└── 900: #1E3A8A  (Text on light backgrounds)
```

#### Secondary Colors
```
Teal (Accents & Success indicators)
├── 50:  #F0FDFA
├── 500: #14B8A6
└── 600: #0D9488

Slate (Neutrals)
├── 50:  #F8FAFC  (Page background)
├── 100: #F1F5F9  (Card backgrounds, alt rows)
├── 200: #E2E8F0  (Borders, dividers)
├── 400: #94A3B8  (Placeholder text)
├── 500: #64748B  (Secondary text)
├── 700: #334155  (Body text)
├── 800: #1E293B  (Headings)
└── 900: #0F172A  (Primary text)
```

#### Status Colors
```
Success:  #22C55E (Green)  - Approved, Complete, Positive
Warning:  #F59E0B (Amber)  - Pending, Attention needed
Danger:   #EF4444 (Red)    - Rejected, Error, Overdue
Info:     #3B82F6 (Blue)   - Information, Processing
```

### 2.2 Typography

#### Font Stack
```css
/* Primary Font - Clean, modern, professional */
font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;

/* Monospace - For codes, numbers, IDs */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale
| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Display | 36px | 700 | 1.2 | Page titles |
| H1 | 28px | 700 | 1.3 | Section headers |
| H2 | 22px | 600 | 1.4 | Card titles |
| H3 | 18px | 600 | 1.4 | Subsections |
| Body | 14px | 400 | 1.5 | Default text |
| Small | 13px | 400 | 1.4 | Secondary info |
| Caption | 12px | 500 | 1.4 | Labels, badges |
| Micro | 11px | 500 | 1.3 | Timestamps |

### 2.3 Spacing System
Using 4px base unit:
```
xs:   4px   (Tight spacing within components)
sm:   8px   (Between related elements)
md:   16px  (Standard padding)
lg:   24px  (Between sections)
xl:   32px  (Major separations)
2xl:  48px  (Page-level spacing)
3xl:  64px  (Hero sections)
```

### 2.4 Border Radius
```
none:   0px     (Tables, specific elements)
sm:     4px     (Buttons, inputs)
md:     8px     (Cards, dropdowns)
lg:     12px    (Modals, large cards)
xl:     16px    (Feature cards)
full:   9999px  (Avatars, pills)
```

### 2.5 Shadows
```css
/* Subtle - Cards, containers */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Default - Raised elements */
shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Medium - Dropdowns, popovers */
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);

/* Large - Modals, dialogs */
shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

/* Elevated - Floating elements */
shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
```

---

## 3. Layout System

### 3.1 Application Shell

```
┌─────────────────────────────────────────────────────────────────┐
│ Top Bar (56px) - Logo, Search, Notifications, User Menu         │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Sidebar  │  Main Content Area                                   │
│ (240px)  │  ┌────────────────────────────────────────────────┐  │
│          │  │ Page Header                                    │  │
│ • Nav    │  │ Title + Breadcrumbs + Actions                  │  │
│ • Groups │  ├────────────────────────────────────────────────┤  │
│ • Items  │  │                                                │  │
│          │  │ Content Area (scrollable)                      │  │
│ Collaps- │  │                                                │  │
│ ible to  │  │ • Cards                                        │  │
│ 64px     │  │ • Tables                                       │  │
│ (icons   │  │ • Forms                                        │  │
│  only)   │  │ • Charts                                       │  │
│          │  │                                                │  │
│          │  └────────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────┘
```

### 3.2 Grid System
- **12-column grid** for main content
- **Gutter:** 24px
- **Max content width:** 1440px
- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### 3.3 Responsive Behavior
| Screen | Sidebar | Layout |
|--------|---------|--------|
| Desktop (≥1280px) | Expanded (240px) | Full |
| Laptop (1024-1279px) | Collapsed (64px) | Full |
| Tablet (768-1023px) | Hidden (overlay) | Adapted |
| Mobile (<768px) | Hidden (drawer) | Stacked |

---

## 4. Component Library

### 4.1 Navigation

#### Sidebar Navigation Item
```
┌─────────────────────────────┐
│ [icon]  Label          (99) │  ← Badge for counts
└─────────────────────────────┘

States:
- Default: bg-transparent, text-slate-600
- Hover: bg-slate-100, text-slate-900
- Active: bg-primary-50, text-primary-700, left-border-primary-600
```

#### Top Navigation Bar
```
┌──────────────────────────────────────────────────────────────────┐
│ [≡] [Logo]     [🔍 Search anything... ⌘K]     [🔔] [❓] [Avatar▾]│
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Buttons

#### Button Hierarchy
| Type | Usage | Style |
|------|-------|-------|
| **Primary** | Main action per section | Solid blue, white text |
| **Secondary** | Alternative actions | White bg, gray border |
| **Ghost** | Tertiary actions | Transparent, gray text |
| **Danger** | Destructive actions | Solid red (confirm only) |
| **Success** | Positive confirmations | Solid green |

#### Button Sizes
| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| xs | 28px | 8px 12px | 12px |
| sm | 32px | 8px 14px | 13px |
| md | 40px | 10px 18px | 14px |
| lg | 48px | 12px 24px | 16px |

### 4.3 Form Controls

#### Text Input
```
┌────────────────────────────────────┐
│ Label *                            │
│ ┌────────────────────────────────┐ │
│ │ Placeholder text...            │ │
│ └────────────────────────────────┘ │
│ Helper text or error message       │
└────────────────────────────────────┘

States: Default → Focus (blue ring) → Error (red border) → Disabled (gray bg)
Height: 40px | Border-radius: 8px | Padding: 12px 16px
```

#### Select Dropdown
```
┌────────────────────────────────────┐
│ Selected option              [▼]   │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Option 1                      [✓]  │
│ Option 2                           │
│ Option 3                           │
└────────────────────────────────────┘
```

### 4.4 Data Display

#### Stat Card
```
┌─────────────────────────────────┐
│ [icon]              [↗ +12.5%] │
│                                 │
│ OMR 45,250.00                  │
│ Total Revenue                   │
│                                 │
│ ▁▂▃▄▅▆▇█▇▆ (sparkline)         │
└─────────────────────────────────┘
```

#### Data Table
```
┌─────────────────────────────────────────────────────────────────┐
│ [☐] Name           │ Department  │ Status    │ Actions         │
├─────────────────────────────────────────────────────────────────┤
│ [☐] Ahmed Al-Balushi│ Operations │ [●Active] │ [👁] [✎] [⋮]    │
│ [☐] Fatima Hassan  │ Finance     │ [●Active] │ [👁] [✎] [⋮]    │
│ [☐] Said Al-Rashdi │ HR          │ [○Leave]  │ [👁] [✎] [⋮]    │
├─────────────────────────────────────────────────────────────────┤
│ Showing 1-10 of 156 │ [◀] [1] [2] [3] ... [16] [▶]             │
└─────────────────────────────────────────────────────────────────┘

Features:
- Sticky header on scroll
- Sortable columns (click header)
- Row hover highlight
- Bulk selection
- Inline actions
- Pagination or infinite scroll
```

### 4.5 Feedback Components

#### Badges/Pills
```
[● Active]    - Green, filled
[○ Pending]   - Amber, outline
[✗ Rejected]  - Red, filled
[◐ Draft]     - Gray, outline
```

#### Toast Notifications
```
┌─────────────────────────────────────────────┐
│ [✓] Employee record saved successfully  [×] │
└─────────────────────────────────────────────┘
Position: Top-right | Auto-dismiss: 5s | Stackable
```

#### Empty States
```
┌─────────────────────────────────────────────┐
│                                             │
│           [illustration]                    │
│                                             │
│         No employees found                  │
│    Try adjusting your search filters        │
│                                             │
│         [Clear Filters] [Add Employee]      │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.6 Modals & Dialogs

#### Modal Structure
```
┌─────────────────────────────────────────────────────────┐
│ Modal Title                                         [×] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Content area with form fields, information,            │
│  or confirmation messages                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                          [Cancel]  [Confirm Action]     │
└─────────────────────────────────────────────────────────┘

Sizes: sm (400px) | md (560px) | lg (720px) | xl (960px) | full
```

---

## 5. Motion & Animation

### 5.1 Timing Functions
```css
/* Standard easing for most transitions */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

/* Deceleration - elements entering screen */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);

/* Acceleration - elements leaving screen */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
```

### 5.2 Duration Guidelines
| Action | Duration | Usage |
|--------|----------|-------|
| Micro | 100ms | Hover states, toggles |
| Fast | 150ms | Buttons, small elements |
| Normal | 200ms | Cards, panels |
| Slow | 300ms | Modals, page transitions |
| Complex | 400ms+ | Multi-step animations |

### 5.3 Animation Patterns

#### Page Transitions
```css
/* Content fade-in on page load */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 300ms ease-out;
```

#### Skeleton Loading
```
┌─────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░ │ ← Shimmer effect
│ ██████████░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ████████████████████░░░░░░░░░░░░░░ │
└─────────────────────────────────────┘
```

---

## 6. Iconography

### 6.1 Icon Library
**Primary:** Lucide Icons (consistent with modern SaaS)
**Size variants:** 16px, 20px, 24px
**Stroke width:** 1.5px (default), 2px (emphasized)

### 6.2 Icon Usage
| Context | Size | Color |
|---------|------|-------|
| Navigation | 20px | slate-500, primary-600 (active) |
| Buttons | 16px | Inherit from text |
| Table actions | 16px | slate-400, slate-600 (hover) |
| Stats/KPIs | 24px | Contextual (success, warning, etc.) |
| Empty states | 48px | slate-300 |

---

## 7. Accessibility Guidelines

### 7.1 Color Contrast
- **Normal text:** Minimum 4.5:1 ratio
- **Large text (18px+):** Minimum 3:1 ratio
- **UI components:** Minimum 3:1 ratio

### 7.2 Focus States
All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

### 7.3 Keyboard Navigation
- All functions accessible via keyboard
- Logical tab order
- Escape closes modals/dropdowns
- Arrow keys navigate menus
- Enter/Space activates buttons

### 7.4 Screen Reader Support
- Semantic HTML structure
- ARIA labels for icons/buttons
- Live regions for dynamic content
- Skip navigation links

---

## 8. RTL & Arabic Support

Full Right-to-Left (RTL) support is required for Arabic language interface.

### 8.1 Key RTL Considerations
- **Layout Mirroring:** Sidebar moves to right, content flows right-to-left
- **Typography:** Arabic fonts (IBM Plex Sans Arabic) with increased line-height (1.7)
- **Bidirectional Text:** Support mixed Arabic/English content
- **CSS Logical Properties:** Use `margin-inline-start` instead of `margin-left`

### 8.2 Arabic Font Stack
```css
--font-arabic: 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Tajawal', system-ui, sans-serif;
```

### 8.3 Bilingual Data
Key fields support both English and Arabic values:
- Employee names (firstName + firstNameAr)
- Department names
- Document titles
- Product descriptions

**See:** `OpenSky-ERP-RTL-Arabic-Guide.md` for comprehensive RTL implementation details.

---

## 9. Dark Mode (Future)

Reserved for future implementation. Design tokens are structured to support:
```
Light Mode → Dark Mode mapping:
slate-50  → slate-900
slate-100 → slate-800
slate-200 → slate-700
white     → slate-900
primary-600 → primary-400
```

---

## 10. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-primary-light: #EFF6FF;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  
  /* Typography */
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
}
```

---

## 11. Implementation Notes

### 10.1 CSS Framework
**Tailwind CSS** - Utility-first approach for rapid development
- Custom configuration extending default theme
- Component classes via `@apply` for reusable patterns
- PurgeCSS for production optimization

### 10.2 Component Architecture
**Angular Material** as base + custom styling
- Override Material Design defaults with design system
- Create wrapper components for consistent usage
- Maintain design tokens in SCSS variables

### 10.3 Asset Management
- Icons: Inline SVG via Lucide Angular
- Images: WebP format with fallbacks
- Fonts: Self-hosted with font-display: swap

---

*This design system is a living document and will evolve as the application develops.*
