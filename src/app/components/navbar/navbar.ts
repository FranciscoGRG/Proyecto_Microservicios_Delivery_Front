import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {

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

}
