import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item';
import { Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  private service = inject(CartService);
  private router = inject(Router);

  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;

  ngOnInit(): void {
    this.cartItems$ = this.service.cart$;
    this.cartTotal$ = this.service.getTotalPrice();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.service.updateItemQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.service.removeItem(productId);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout'])
  }
}
