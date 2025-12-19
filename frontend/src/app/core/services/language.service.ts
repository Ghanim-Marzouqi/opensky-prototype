import { Injectable, signal, effect } from '@angular/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'opensky_language';

  currentLanguage = signal<Language>(this.getStoredLanguage());
  isRtl = signal<boolean>(this.currentLanguage() === 'ar');
  direction = signal<'ltr' | 'rtl'>(this.currentLanguage() === 'ar' ? 'rtl' : 'ltr');

  private translations: Record<Language, Record<string, any>> = {
    en: {},
    ar: {}
  };

  constructor() {
    this.loadTranslations();

    effect(() => {
      const lang = this.currentLanguage();
      this.isRtl.set(lang === 'ar');
      this.direction.set(lang === 'ar' ? 'rtl' : 'ltr');
      this.applyToDocument(lang);
      localStorage.setItem(this.STORAGE_KEY, lang);
    });
  }

  private getStoredLanguage(): Language {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'en' || stored === 'ar') {
      return stored;
    }
    return 'en';
  }

  private async loadTranslations() {
    try {
      const [enRes, arRes] = await Promise.all([
        fetch('/assets/i18n/en.json'),
        fetch('/assets/i18n/ar.json')
      ]);
      this.translations.en = await enRes.json();
      this.translations.ar = await arRes.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  private applyToDocument(lang: Language) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
  }

  toggleLanguage() {
    this.setLanguage(this.currentLanguage() === 'en' ? 'ar' : 'en');
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const lang = this.currentLanguage();
    const keys = key.split('.');
    let value: any = this.translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, p) => String(params[p] ?? `{${p}}`));
    }

    return value;
  }

  t(key: string, params?: Record<string, string | number>): string {
    return this.translate(key, params);
  }

  getLocalizedName(en: string, ar?: string): string {
    if (this.currentLanguage() === 'ar' && ar) {
      return ar;
    }
    return en;
  }

  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    // Always use Latin (English) numerals, even for Arabic
    const locale = this.currentLanguage() === 'ar' ? 'ar-u-nu-latn' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(value);
  }

  formatCurrency(value: number, currencyCode: string = 'OMR'): string {
    // Always use Latin (English) numerals, even for Arabic
    const locale = this.currentLanguage() === 'ar' ? 'ar-OM-u-nu-latn' : 'en-US';
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'OMR' ? 3 : 2,
      maximumFractionDigits: currencyCode === 'OMR' ? 3 : 2
    };
    return new Intl.NumberFormat(locale, options).format(value);
  }

  formatDate(date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
    // Always use Latin (English) numerals, even for Arabic
    const locale = this.currentLanguage() === 'ar' ? 'ar-OM-u-nu-latn' : 'en-US';
    const options: Intl.DateTimeFormatOptions = format === 'short'
      ? { day: 'numeric', month: 'short' }
      : format === 'long'
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  formatRelativeDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    // Numbers are already in English (Latin) numerals
    if (this.currentLanguage() === 'ar') {
      if (minutes < 1) return 'الآن';
      if (minutes < 60) return `منذ ${minutes} دقيقة`;
      if (hours < 24) return `منذ ${hours} ساعة`;
      if (days === 1) return 'أمس';
      if (days < 7) return `منذ ${days} أيام`;
      return this.formatDate(date);
    } else {
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} minutes ago`;
      if (hours < 24) return `${hours} hours ago`;
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      return this.formatDate(date);
    }
  }
}
