import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  readonly currentYear = new Date().getFullYear();

  constructor(private auth: AuthService) {}

  async submit(): Promise<void> {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;

    try {
      await this.auth.signIn(this.email, this.password);
    } catch {
      this.errorMessage = 'E-mail ou senha inválidos. Confira os dados e tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}
