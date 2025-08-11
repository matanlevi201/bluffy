import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SigninM } from './signin.model';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
  standalone: true,
})
export class Signin {
  private authService = inject(AuthService);
  private router = inject(Router);

  signinModel = new SigninM('', '');
  submitted = false;
  isHidden = true;
  errorMsg = '';

  onSubmit() {
    this.submitted = true;
    this.authService
      .signin(this.signinModel.email, this.signinModel.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });
  }
}
