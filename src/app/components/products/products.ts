import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductModel } from '../../models/product-model';
import { ProductService } from '../../services/product-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { CartItem } from '../../models/cart-item';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
})
export class ProductsComponent implements OnInit {
  products = signal<ProductModel[]>([]);
  loading = signal(true);

  private service = inject(ProductService);
  private cartService = inject(CartService);

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

  addToCart(product: ProductModel): void {
    const newItem: CartItem = {
      productId: product.id,
      quantity: 1,
      priceAtOrder: product.price,
      name: product.name
    }

    this.cartService.addItem(newItem);

    Swal.fire({
      icon: 'success',
      title: '¡Añadido!',
      text: `${product.name} ha sido añadido al carrito.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });

    console.log(this.cartService.getCartItems())
  }

}
