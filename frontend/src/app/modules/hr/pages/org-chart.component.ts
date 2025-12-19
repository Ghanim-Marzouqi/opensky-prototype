import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUserGroup,
  heroEnvelope,
  heroPhone
} from '@ng-icons/heroicons/outline';

interface OrgMember {
  id: string;
  name: string;
  nameAr: string;
  position: string;
  positionAr: string;
  email?: string;
  phone?: string;
}

interface Department {
  id: string;
  name: string;
  nameAr: string;
  position: string;
  positionAr: string;
  department: string;
  departmentAr: string;
  color: 'purple' | 'teal' | 'blue' | 'orange' | 'pink';
  members: OrgMember[];
}

@Component({
  selector: 'app-org-chart',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroUserGroup,
      heroEnvelope,
      heroPhone
    })
  ],
  template: `
    <div>
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ lang.currentLanguage() === 'ar' ? 'الهيكل التنظيمي' : 'Organization Chart' }}</h1>
          <p class="page-subtitle">{{ lang.currentLanguage() === 'ar' ? 'عرض هيكل الشركة والتسلسل الإداري' : 'View company structure and reporting hierarchy' }}</p>
        </div>
      </div>

      <!-- Mobile Org Chart - Vertical Cards -->
      <div class="md:hidden space-y-4">
        <!-- CEO Card -->
        <div class="card p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="avatar w-14 h-14 text-lg ring-2 ring-primary-200">MS</div>
            <div>
              <div class="font-semibold text-gray-900">{{ lang.currentLanguage() === 'ar' ? 'محمد السعيدي' : 'Mohammed Al-Said' }}</div>
              <div class="text-sm text-primary-600 font-medium">{{ lang.currentLanguage() === 'ar' ? 'الرئيس التنفيذي' : 'CEO' }}</div>
            </div>
          </div>
        </div>

        <!-- Departments -->
        @for (dept of departments(); track dept.id) {
          <div class="card overflow-hidden">
            <!-- Department Header -->
            <div class="p-3 border-b border-gray-100" [class]="'bg-' + dept.color + '-50'">
              <div class="flex items-center gap-3">
                <div class="avatar w-10 h-10 text-sm" [class]="'avatar-' + dept.color">
                  {{ getInitials(dept.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm text-gray-900 truncate">{{ lang.currentLanguage() === 'ar' ? dept.nameAr : dept.name }}</div>
                  <div class="text-xs text-gray-500">{{ lang.currentLanguage() === 'ar' ? dept.positionAr : dept.position }}</div>
                </div>
                <div class="badge text-[10px] px-2 py-0.5" [class]="'badge-' + dept.color">
                  {{ lang.currentLanguage() === 'ar' ? dept.departmentAr : dept.department }}
                </div>
              </div>
            </div>
            <!-- Team Members -->
            @if (dept.members.length > 0) {
              <div class="p-2 space-y-1.5">
                @for (member of dept.members; track member.id) {
                  <div class="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <div class="avatar w-8 h-8 text-xs" [class]="'avatar-' + dept.color">
                      {{ getInitials(member.name) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ lang.currentLanguage() === 'ar' ? member.nameAr : member.name }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ lang.currentLanguage() === 'ar' ? member.positionAr : member.position }}</div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Desktop Org Chart -->
      <div class="hidden md:block card p-4 sm:p-8 overflow-x-auto">
        <div class="org-chart-container">
          <!-- CEO Level -->
          <div class="org-level ceo-level">
            <div class="org-node-wrapper">
              <div class="org-node ceo-node group">
                <div class="node-glow"></div>
                <div class="avatar-wrapper ceo-avatar">
                  <div class="avatar w-20 h-20 text-2xl ring-4 ring-white shadow-lg">MS</div>
                  <div class="status-dot"></div>
                </div>
                <div class="node-content">
                  <h3 class="node-name">{{ lang.currentLanguage() === 'ar' ? 'محمد السعيدي' : 'Mohammed Al-Said' }}</h3>
                  <p class="node-title">{{ lang.currentLanguage() === 'ar' ? 'الرئيس التنفيذي' : 'Chief Executive Officer' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Connector from CEO -->
          <div class="connector-vertical h-12">
            <div class="connector-line"></div>
            <div class="connector-dot"></div>
          </div>

          <!-- Horizontal Branch -->
          <div class="connector-horizontal">
            <div class="connector-branch"></div>
          </div>

          <!-- Department Heads Level -->
          <div class="org-level dept-level">
            @for (dept of departments(); track dept.id; let first = $first; let last = $last) {
              <div class="dept-column" [class.first-dept]="first" [class.last-dept]="last">
                <!-- Vertical connector to department -->
                <div class="connector-vertical h-8">
                  <div class="connector-line"></div>
                </div>

                <!-- Department Head Node -->
                <div class="org-node dept-node group" [attr.data-color]="dept.color">
                  <div class="dept-badge" [class]="'badge-' + dept.color">
                    {{ lang.currentLanguage() === 'ar' ? dept.departmentAr : dept.department }}
                  </div>
                  <div class="avatar-wrapper">
                    <div class="avatar w-14 h-14 text-lg" [class]="'avatar-' + dept.color">
                      {{ getInitials(dept.name) }}
                    </div>
                  </div>
                  <div class="node-content">
                    <h4 class="node-name text-sm">{{ lang.currentLanguage() === 'ar' ? dept.nameAr : dept.name }}</h4>
                    <p class="node-title text-xs">{{ lang.currentLanguage() === 'ar' ? dept.positionAr : dept.position }}</p>
                  </div>
                  <div class="team-count">
                    <ng-icon name="heroUserGroup" class="text-xs"></ng-icon>
                    <span>{{ dept.members.length }}</span>
                  </div>
                </div>

                <!-- Team Members -->
                @if (dept.members.length > 0) {
                  <div class="connector-vertical h-6">
                    <div class="connector-line" [class]="'line-' + dept.color"></div>
                  </div>

                  <div class="team-container" [class]="'team-' + dept.color">
                    @for (member of dept.members; track member.id) {
                      <div class="member-node group" [class]="'member-' + dept.color">
                        <div class="avatar w-9 h-9 text-xs" [class]="'avatar-' + dept.color">
                          {{ getInitials(member.name) }}
                        </div>
                        <div class="member-info">
                          <div class="member-name">{{ lang.currentLanguage() === 'ar' ? member.nameAr : member.name }}</div>
                          <div class="member-title">{{ lang.currentLanguage() === 'ar' ? member.positionAr : member.position }}</div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Department Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
        @for (dept of departments(); track dept.id) {
          <div class="summary-card group" [class]="'summary-' + dept.color">
            <div class="summary-icon" [class]="'icon-' + dept.color">
              <ng-icon name="heroUserGroup" class="text-lg sm:text-xl"></ng-icon>
            </div>
            <div class="summary-content min-w-0">
              <h4 class="summary-title truncate">{{ lang.currentLanguage() === 'ar' ? dept.departmentAr : dept.department }}</h4>
              <p class="summary-count">{{ dept.members.length + 1 }} {{ lang.currentLanguage() === 'ar' ? 'موظفين' : 'employees' }}</p>
            </div>
            <div class="summary-bar" [class]="'bar-' + dept.color"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* Org Chart Container */
    .org-chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 700px;
      padding: 0.5rem;
    }

    @media (min-width: 640px) {
      .org-chart-container {
        min-width: 800px;
        padding: 1rem;
      }
    }

    /* Org Levels */
    .org-level {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .dept-level {
      gap: 2rem;
      align-items: flex-start;
    }

    .dept-column {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Connectors */
    .connector-vertical {
      position: relative;
      width: 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .connector-line {
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%);
      border-radius: 1px;
    }

    .connector-dot {
      width: 8px;
      height: 8px;
      background: white;
      border: 2px solid #9CA3AF;
      border-radius: 50%;
      position: absolute;
      bottom: -4px;
    }

    .connector-horizontal {
      width: 66%;
      height: 2px;
      position: relative;
    }

    .connector-branch {
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #D1D5DB 15%, #D1D5DB 85%, transparent 100%);
      border-radius: 1px;
    }

    /* Color-specific connector lines */
    .line-purple { background: linear-gradient(180deg, #E9D5FF 0%, #C4B5FD 100%); }
    .line-teal { background: linear-gradient(180deg, #99F6E4 0%, #5EEAD4 100%); }
    .line-blue { background: linear-gradient(180deg, #BFDBFE 0%, #93C5FD 100%); }
    .line-orange { background: linear-gradient(180deg, #FED7AA 0%, #FDBA74 100%); }
    .line-pink { background: linear-gradient(180deg, #FBCFE8 0%, #F9A8D4 100%); }

    /* Org Nodes */
    .org-node {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      min-width: 180px;
    }

    .org-node:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border-color: #D1D5DB;
    }

    /* CEO Node Special Styling */
    .ceo-node {
      background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
      border: 2px solid #E9D5FF;
      padding: 2rem;
      min-width: 220px;
    }

    .ceo-node:hover {
      border-color: #C4B5FD;
      box-shadow: 0 16px 32px rgba(124, 58, 237, 0.15);
    }

    .node-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, #7C3AED, #A855F7, #C084FC);
      border-radius: 1rem;
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
    }

    .ceo-node:hover .node-glow {
      opacity: 0.1;
    }

    .ceo-avatar {
      position: relative;
    }

    .status-dot {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 14px;
      height: 14px;
      background: #22C55E;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
    }

    /* Department Badge */
    .dept-badge {
      position: absolute;
      top: -10px;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-purple { background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; }
    .badge-teal { background: linear-gradient(135deg, #14B8A6, #2DD4BF); color: white; }
    .badge-blue { background: linear-gradient(135deg, #3B82F6, #60A5FA); color: white; }
    .badge-orange { background: linear-gradient(135deg, #F97316, #FB923C); color: white; }
    .badge-pink { background: linear-gradient(135deg, #EC4899, #F472B6); color: white; }

    /* Mobile badge colors */
    .bg-purple-50 { background-color: #FAF5FF; }
    .bg-teal-50 { background-color: #F0FDFA; }
    .bg-blue-50 { background-color: #EFF6FF; }
    .bg-orange-50 { background-color: #FFF7ED; }
    .bg-pink-50 { background-color: #FDF2F8; }

    /* Avatar Colors */
    .avatar-purple { background: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%); }
    .avatar-teal { background: linear-gradient(135deg, #14B8A6 0%, #2DD4BF 50%, #5EEAD4 100%); }
    .avatar-blue { background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%); }
    .avatar-orange { background: linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%); }
    .avatar-pink { background: linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #F9A8D4 100%); }

    /* Node Content */
    .node-content {
      text-align: center;
      margin-top: 0.75rem;
    }

    .node-name {
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .node-title {
      color: #6B7280;
      font-size: 0.8rem;
    }

    .team-count {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.75rem;
      padding: 0.25rem 0.75rem;
      background: #F3F4F6;
      border-radius: 1rem;
      font-size: 0.75rem;
      color: #6B7280;
      font-weight: 500;
    }

    /* Team Container */
    .team-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #FAFAFA;
      border-radius: 0.75rem;
      border: 1px solid #F3F4F6;
    }

    .team-purple { border-color: #F3E8FF; background: linear-gradient(180deg, #FAF5FF 0%, #FAFAFA 100%); }
    .team-teal { border-color: #CCFBF1; background: linear-gradient(180deg, #F0FDFA 0%, #FAFAFA 100%); }
    .team-blue { border-color: #DBEAFE; background: linear-gradient(180deg, #EFF6FF 0%, #FAFAFA 100%); }
    .team-orange { border-color: #FFEDD5; background: linear-gradient(180deg, #FFF7ED 0%, #FAFAFA 100%); }
    .team-pink { border-color: #FCE7F3; background: linear-gradient(180deg, #FDF2F8 0%, #FAFAFA 100%); }

    /* Member Node */
    .member-node {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      background: white;
      border-radius: 0.625rem;
      border: 1px solid #E5E7EB;
      min-width: 200px;
      transition: all 0.2s ease;
    }

    .member-node:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    html[dir="rtl"] .member-node:hover {
      transform: translateX(-4px);
    }

    .member-purple:hover { border-color: #C4B5FD; }
    .member-teal:hover { border-color: #5EEAD4; }
    .member-blue:hover { border-color: #93C5FD; }
    .member-orange:hover { border-color: #FDBA74; }
    .member-pink:hover { border-color: #F9A8D4; }

    .member-info {
      flex: 1;
      min-width: 0;
    }

    .member-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .member-title {
      font-size: 0.75rem;
      color: #6B7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Summary Cards */
    .summary-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid #E5E7EB;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    @media (min-width: 640px) {
      .summary-card {
        gap: 1rem;
        padding: 1.25rem;
        border-radius: 1rem;
      }
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }

    .summary-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    @media (min-width: 640px) {
      .summary-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
      }
    }

    .icon-purple { background: #F3E8FF; color: #7C3AED; }
    .icon-teal { background: #CCFBF1; color: #14B8A6; }
    .icon-blue { background: #DBEAFE; color: #3B82F6; }
    .icon-orange { background: #FFEDD5; color: #F97316; }
    .icon-pink { background: #FCE7F3; color: #EC4899; }

    .summary-content {
      flex: 1;
    }

    .summary-title {
      font-weight: 600;
      font-size: 0.8rem;
      color: #111827;
      margin-bottom: 0.125rem;
    }

    @media (min-width: 640px) {
      .summary-title {
        font-size: 1rem;
      }
    }

    .summary-count {
      font-size: 0.75rem;
      color: #6B7280;
    }

    @media (min-width: 640px) {
      .summary-count {
        font-size: 0.875rem;
      }
    }

    .summary-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .summary-card:hover .summary-bar {
      opacity: 1;
    }

    .bar-purple { background: linear-gradient(90deg, #7C3AED, #A855F7); }
    .bar-teal { background: linear-gradient(90deg, #14B8A6, #2DD4BF); }
    .bar-blue { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
    .bar-orange { background: linear-gradient(90deg, #F97316, #FB923C); }
    .bar-pink { background: linear-gradient(90deg, #EC4899, #F472B6); }
  `]
})
export class OrgChartComponent implements OnInit {
  lang = inject(LanguageService);

  departments = signal<Department[]>([]);

  ngOnInit() {
    this.departments.set([
      {
        id: '1',
        name: 'Aisha Al-Maskari',
        nameAr: 'عائشة المسكري',
        position: 'HR Director',
        positionAr: 'مدير الموارد البشرية',
        department: 'Human Resources',
        departmentAr: 'الموارد البشرية',
        color: 'purple',
        members: [
          { id: '1a', name: 'Said Al-Rashdi', nameAr: 'سعيد الراشدي', position: 'HR Specialist', positionAr: 'أخصائي موارد بشرية' },
          { id: '1b', name: 'Fatima Al-Harthi', nameAr: 'فاطمة الحارثي', position: 'Recruiter', positionAr: 'مسؤول توظيف' }
        ]
      },
      {
        id: '2',
        name: 'Maryam Al-Lawati',
        nameAr: 'مريم اللواتي',
        position: 'Finance Director',
        positionAr: 'المدير المالي',
        department: 'Finance',
        departmentAr: 'المالية',
        color: 'teal',
        members: [
          { id: '2a', name: 'Khalid Al-Busaidi', nameAr: 'خالد البوسعيدي', position: 'Accountant', positionAr: 'محاسب' },
          { id: '2b', name: 'Layla Al-Hinai', nameAr: 'ليلى الهنائي', position: 'Financial Analyst', positionAr: 'محلل مالي' }
        ]
      },
      {
        id: '3',
        name: 'Ahmed Al-Balushi',
        nameAr: 'أحمد البلوشي',
        position: 'Operations Director',
        positionAr: 'مدير العمليات',
        department: 'Operations',
        departmentAr: 'العمليات',
        color: 'blue',
        members: [
          { id: '3a', name: 'Yusuf Al-Rawahi', nameAr: 'يوسف الرواحي', position: 'Operations Manager', positionAr: 'مدير عمليات' },
          { id: '3b', name: 'Sara Al-Kindi', nameAr: 'سارة الكندي', position: 'Quality Analyst', positionAr: 'محلل جودة' }
        ]
      }
    ]);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
