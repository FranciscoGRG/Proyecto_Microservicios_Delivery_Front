import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);

  isMobileMenuOpen = false;
  isProfileMenuOpen = false;

  searchText = '';

  cartItemCount$!: Observable<number>;

  ngOnInit(): void {
    this.cartItemCount$ = this.cartService.getTotalItemsCount();
  }

  toogleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) this.isProfileMenuOpen = false;
  }

  toogleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isMobileMenuOpen = false;
    this.isProfileMenuOpen = false;
    this.router.navigate(['/products']);
  }

  onSearch(event?: Event) {
    if (event) event.preventDefault();

    this.productService.setSearchProduct(this.searchText);

    if (this.router.url !== '/products') {
      this.router.navigate(['/products']);
    }

    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }
}
