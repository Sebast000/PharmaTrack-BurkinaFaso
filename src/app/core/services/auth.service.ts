import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private userRole: string | null = null;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.isLoggedIn = true;
      this.userRole = 'admin';
      return true;
    }
    if (username === 'user' && password === 'user') {
      this.isLoggedIn = true;
      this.userRole = 'user';
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getRole(): string | null {
    return this.userRole;
  }
}
