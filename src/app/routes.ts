import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';

export const APP_ROUTES: Routes = [
    { path: 'login', loadComponent: async () => (await import("./pages/login/login.component")).LoginComponent },
    { path: 'register', loadComponent: async () => (await import("./pages/register/register.component")).RegisterComponent },
    { path: 'home', loadComponent: async () => (await import("./pages/home/home.component")).HomeComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '' }
];