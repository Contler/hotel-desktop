import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  authFirebase = inject(Auth);
  router = inject(Router);
  errorMessage = signal<string>('');
  codeError = signal<string>('');
  isLoad = signal<boolean>(false);
  errorState = computed(() => ({
    error: this.errorMessage(),
    code: this.codeError(),
    hasError: !!this.errorMessage() || !!this.codeError(),
  }));

  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async loginSubmit() {
    this.codeError.set('');
    this.errorMessage.set('');
    this.isLoad.set(true);
    const { email, password } = this.loginForm.value;

    try {
      const auth = await signInWithEmailAndPassword(
        this.authFirebase,
        email as string,
        password as string,
      );
      const tokenResult = await auth.user?.getIdTokenResult();
      const { role } = tokenResult.claims;
      if (role === 'admin' || role === 'administrator' || role === 'chief') {
        this.router.navigate(['home']);
      } else {
        signOut(this.authFirebase);
        this.errorMessage.set(
          "You don't have permission to access. Please contact the administrator.",
        );
      }
      this.isLoad.set(false);
    } catch (error) {
      const fireError = error as FirebaseError;
      setTimeout(() => {
        this.isLoad.set(false);
        this.codeError.set(fireError.code);
        this.errorMessage.set(
          'Email or password is incorrect. Please try again.',
        );
      }, 2000);
    }
  }
}
