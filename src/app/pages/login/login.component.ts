// Changed from FormsModule to ReactiveFormsModule
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EMPTY } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { ComponentState } from '@lithiumjs/angular';
import { UserUtils } from '../../utils/user-utils.service';
import { EntryBasePage } from '../base/entry/entry-base-page';
import { AuthService } from './auth.service';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'; // Added FormGroup import

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true, // Added standalone flag
    imports: [
        CommonModule,
        ReactiveFormsModule, // Replaced FormsModule with ReactiveFormsModule
        MatSelectModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule
    ],
    providers: [
        ComponentState.create(LoginComponent)
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends EntryBasePage {
  // Declare form control if not present in base class
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    injector: Injector,
    cdRef: ChangeDetectorRef,
    // 2. Add proper access modifiers and types
    protected router: Router,
    private userUtils: UserUtils,
    private snackBar: MatSnackBar
  ) {
    // 3. Match base class constructor parameters
   super(injector, cdRef, snackBar);

    // Form initialization
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Login error:', err);
          this.snackBar.open('Login failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}