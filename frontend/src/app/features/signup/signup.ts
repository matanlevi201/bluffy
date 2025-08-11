import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordValidator } from '../../shared/password.validator';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  signupForm: FormGroup = this.fb.group({});
  isHidden = true;

  get name() {
    return this.signupForm.get('name')!;
  }

  get email() {
    return this.signupForm.get('email')!;
  }

  get password() {
    return this.signupForm.get('password')!;
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword')!;
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: [''],
      },
      { validators: PasswordValidator }
    );
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log(this.signupForm.value);
    this.authService
      .signup(
        this.signupForm.value.name,
        this.signupForm.value.email,
        this.signupForm.value.password
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/signin']);
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });
  }
}
