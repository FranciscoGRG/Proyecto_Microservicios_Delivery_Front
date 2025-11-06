import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
})
export class LandingPageComponent {

  private router = inject(Router)

  goToProducts() {
    this.router.navigate(['/productos'])
  }
}
