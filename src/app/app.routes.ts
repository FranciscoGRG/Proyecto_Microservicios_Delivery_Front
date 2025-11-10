import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductsComponent } from './components/products/products';
import { AdminComponent } from './components/admin/admin';
import { authGuardGuard } from './guards/auth-guard-guard';
import { ProductEditComponent } from './components/product-edit/product-edit';
import { CartComponent } from './components/cart/cart';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },

  {
    path: 'admin',
    canActivate: [authGuardGuard],
    children: [
      { path: '', component: AdminComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },
      { path: 'products/new', component: ProductEditComponent},
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' },
];
