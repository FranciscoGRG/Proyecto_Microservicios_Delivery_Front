import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  isMobileMenuOpen: boolean = false;
  isProfileMenuOpen: boolean = false;

  toogleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if(this.isMobileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toogleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;

    if(this.isProfileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout()
    this.isMobileMenuOpen = false;
    this.isProfileMenuOpen = false;
    this.router.navigate(['/products']);
  }

}
