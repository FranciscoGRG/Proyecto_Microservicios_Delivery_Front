import { Component, inject, OnInit, signal } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { env } from '../../../../env';
import { CartService } from '../../services/cart-service';
import { OrderService } from '../../services/order-service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ItemPayload } from '../../models/item-payload';
import { OrderRequestPayload } from '../../models/order-request-payload';
import { OrderResponse } from '../../models/order-response';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: any;

  isLoading = signal(false);
  paymentError = signal<string | null>(null);

  carTotal$ = this.cartService.getTotalPrice();

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(env.stripePK);

    if (this.stripe) {
      this.elements = this.stripe.elements();

      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            '::placeholder': { color: '#aab7c4' },
          },
        },
      });
      this.cardElement.mount('#card-element');
    }
  }

  async initiateTokenization(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.stripe || !this.cardElement || this.isLoading()) return;

    this.isLoading.set(true);
    this.paymentError.set(null);

    let currentCartItems: any[];
    try {
      currentCartItems = this.cartService.getCartItems();
    } catch (e) {
      this.paymentError.set('Error al cargar los ítems del carrito.');
      this.isLoading.set(false);
      return;
    }

    if (!currentCartItems || currentCartItems.length === 0) {
      this.paymentError.set('Tu carrito está vacío. Agrega productos para pagar.');
      this.isLoading.set(false);
      return;
    }

    const { token, error } = await this.stripe.createToken(this.cardElement);

    if (error) {
      this.paymentError.set(error.message || 'Error al tokenizar la tarjeta.');
      this.isLoading.set(false);
      return;
    }

    if (token) {
      this.submitOrderWithPayment(currentCartItems, token.id);
    }
  }

  private submitOrderWithPayment(cartItems: any[], paymentToken: string): void {
    const itemsPayload: ItemPayload[] = cartItems.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }));

    const orderPayload: OrderRequestPayload = {
      items: itemsPayload,
      paymentMethodToken: paymentToken,
    };

    this.orderService
      .createOrder(orderPayload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: OrderResponse) => {
          if (response.status === 'PAYMENT_INTENT_CREATED' || response.status === 'COMPLETED') {
            this.cartService.clearCart();
            this.router.navigate(['/success', response.id]);
          } else if (
            response.status === 'PAYMENT_FAILED_SYNC' ||
            response.status === 'PAYMENT_ERROR_CLIENT'
          ) {
            this.paymentError.set(
              `Pago rechazado. Estado: ${response.status}. Verifique su tarjeta.`
            );
          } else {
            this.paymentError.set('Error desconocido al procesar la orden.');
          }
        },
        error: (err) => {
          const errorMessage =
            err.error?.message || 'Error de conexión con el servidor de órdenes. Intente de nuevo.';
          this.paymentError.set(errorMessage);
          console.error('Error en el servicio de orden:', err);
        },
      });
  }
}
