import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductsComponent } from './components/products/products';
import { AdminComponent } from './components/admin/admin';
import { authGuardGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
    {path: '', component: LandingPageComponent, pathMatch: 'full'},
    {path: 'products', component: ProductsComponent},
    {path: 'admin', component: AdminComponent, canActivate: [authGuardGuard]},


    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '**', redirectTo: ''}
];
