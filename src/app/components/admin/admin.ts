import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { OrderService } from '../../services/order-service';
import { ProductModel } from '../../models/product-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
})
export class AdminComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  actibeTab: 'products' | 'orders' = 'products';
  products = signal<ProductModel[]>([]);
  loading = signal(true);

  setActiveTab(tab: 'products' | 'orders'): void {
    this.actibeTab = tab;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void{
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar los productos: ', error);
        this.products.set([]);
        this.loading.set(false);
      },
    });
  }

  onDelete(productId: string): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        console.log("Producto eliminado")
        this.loadProducts();
      },
      error: (error) => {console.error("Error al eliminar el producto con id: ", productId)}
    })
  }
}
