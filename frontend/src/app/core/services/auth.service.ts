import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'hr' | 'finance';
  avatar?: string;
}

// Mock users for demo
const MOCK_USERS: { [key: string]: { password: string; user: User } } = {
  'hr.manager': {
    password: 'hr123',
    user: {
      id: '1',
      username: 'hr.manager',
      name: 'Sarah Al-Rashid',
      nameAr: 'سارة الراشد',
      email: 'sarah.hr@opensky.com',
      role: 'hr'
    }
  },
  'finance.manager': {
    password: 'fin123',
    user: {
      id: '2',
      username: 'finance.manager',
      name: 'Ahmed Al-Farsi',
      nameAr: 'أحمد الفارسي',
      email: 'ahmed.finance@opensky.com',
      role: 'finance'
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => this.currentUser() !== null);
  userRole = computed(() => this.currentUser()?.role || null);

  constructor(private router: Router) {
    // Check for saved session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(username: string, password: string): { success: boolean; error?: string } {
    const userRecord = MOCK_USERS[username];

    if (!userRecord) {
      return { success: false, error: 'User not found' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    this.currentUser.set(userRecord.user);
    localStorage.setItem('currentUser', JSON.stringify(userRecord.user));

    return { success: true };
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getDefaultRoute(): string {
    const role = this.userRole();
    if (role === 'hr') {
      return '/hr/dashboard';
    } else if (role === 'finance') {
      return '/finance/dashboard';
    }
    return '/login';
  }
}
