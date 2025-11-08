import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductModel } from '../../models/product-model';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
})
export class ProductsComponent implements OnInit {
  products = signal<ProductModel[]>([]);
  loading = signal(true);

  private service = inject(ProductService);

  ngOnInit(): void {
    this.service.getProducts().subscribe({
      next: (products) => {
        this.products.set(products)
        this.loading.set(false);
      },
      error: (error) => {
        console.error("Error al cargar los productos: ", error);
        this.products.set([]);
        this.loading.set(false);
      }
    })
  }

}
