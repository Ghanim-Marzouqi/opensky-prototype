import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class App implements OnInit {
  private lang = inject(LanguageService);

  ngOnInit() {
    // Initialize language service to apply RTL if needed
    const currentLang = this.lang.currentLanguage();
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}
