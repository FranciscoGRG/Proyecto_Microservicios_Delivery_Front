import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { OrderService } from '../../services/order-service';
import { ProductModel } from '../../models/product-model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderModel } from '../../models/order-model';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
})
export class AdminComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  actibeTab: 'products' | 'orders' = 'products';
  products = signal<ProductModel[]>([]);
  orders = signal<OrderModel[]>([]);
  loading = signal(true);

  setActiveTab(tab: 'products' | 'orders'): void {
    this.actibeTab = tab;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts(): void {
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

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        console.log(orders)
        this.loading.set(false);
      },
      error: (error) => {
        console.log("Error al obtener las ordenes: ", error);
        this.orders.set([])
        this.loading.set(false);
      }
    });
  }

  onDeleteProduct(productId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir la eliminación de este producto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado correctamente.', 'success');
            this.products.update((currentProducts) =>
              currentProducts.filter((p) => p.id !== productId)
            );
          },
          error: (error) => {
            console.error('Error al eliminar el producto: ', error);
            Swal.fire('Error', 'Hubo un problema al intentar eliminar el producto.', 'error');
          },
        });
      }
    });
  }

  onDeleteOrder(orderId: number): void {
        Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir la eliminación de esta orden!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrderById(orderId).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'La orden ha sido eliminada correctamente.', 'success');
            this.orders.update((currentOrders) =>
              currentOrders.filter((o) => o.id !== orderId)
            );
          },
          error: (error) => {
            console.error('Error al eliminar la orden: ', error);
            Swal.fire('Error', 'Hubo un problema al intentar eliminar la orden.', 'error');
          },
        });
      }
    });
  }
}
