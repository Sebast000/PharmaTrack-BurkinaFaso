import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string | null = null;

  constructor(private router: Router) {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRole = storedRole;
    }
  }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.userRole = 'admin';
      localStorage.setItem('userRole', this.userRole);
      localStorage.setItem('authToken', 'fake-admin-token');
      return true;
    }
    if (username === 'user' && password === 'user') {
      this.userRole = 'user';
      localStorage.setItem('userRole', this.userRole);
      localStorage.setItem('authToken', 'fake-user-token');
      return true;
    }
    return false;
  }

  logout(): void {
    this.userRole = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getRole(): string | null {
    return this.userRole;
  }
}
