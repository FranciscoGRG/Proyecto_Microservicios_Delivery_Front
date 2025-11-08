import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
})
export class AdminComponent implements OnInit {

  private productService = inject(ProductService);
  actibeTab: 'products' | 'orders' = 'products';

  setActiveTab(tab: 'products' | 'orders'): void {
    this.actibeTab = tab;
  }


    ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
