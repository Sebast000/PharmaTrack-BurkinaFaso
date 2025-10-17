import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    const success = this.auth.login(this.username, this.password);

    if (success) {
      const role = this.auth.getRole();

      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'user') {
        this.router.navigate(['/sales']);
      }
    } else {
      this.errorMessage = 'Identifiants invalides.';
    }
  }
}
