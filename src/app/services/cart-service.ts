import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

const CART_KEY = 'Shopping_Cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  loadCart(): void {
    const storedCart = localStorage.getItem(CART_KEY);

    if (storedCart) {
      try {
        const items: CartItem[] = JSON.parse(storedCart);
        this.cartSubject.next(items);
      } catch (error) {
        console.error('Error al hacer json parse al carrito: ', error);
        localStorage.removeItem(CART_KEY);
        this.cartSubject.next([]);
      }
    } else {
      this.cartSubject.next([]);
    }
  }

  public saveCart(): Observable<void> {
    const currentCart = this.cartSubject.getValue();

    localStorage.setItem(CART_KEY, JSON.stringify(currentCart));

    return of(undefined);
  }

  public getCartItems(): CartItem[] {
    return this.cartSubject.getValue();
  }

  addItem(newItem: CartItem): void {
    const currentCart = this.getCartItems();

    const existingItem = currentCart.find((item) => item.productId === newItem.productId);

    if (existingItem) {
      existingItem.quantity += newItem.quantity;

      if (existingItem.quantity < 1) existingItem.quantity = 1;
    } else {
      currentCart.push(newItem);
    }

    this.cartSubject.next(currentCart);
    this.saveCart();
  }

  updateItemQuantity(productId: string, quantity: number): void {
    let currentCart = this.getCartItems();

    const newQuantity = Math.max(1, quantity)

    const existingItem = currentCart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity = newQuantity;
      this.cartSubject.next(currentCart);

      this.saveCart();
    } else {
      console.error("No se ha podido actualizar la cantidad de items");
    }
  }

  removeItem(productId: string): void {
    const currentCart = this.getCartItems();

    const updatedCart = currentCart.filter((item) => item.productId !== productId);

    this.cartSubject.next(updatedCart);
    this.saveCart();
  }

  clearCart(): Observable<void> {
    this.cartSubject.next([]);

    localStorage.removeItem(CART_KEY);

    return of(undefined);
  }

  getTotalPrice(): Observable<number> {
    return this.cart$.pipe(
      map((items) => items.reduce((total, item) => total + item.priceAtOrder * item.quantity, 0))
    );
  }

  getTotalItemsCount(): Observable<number> {
    return this.cart$.pipe(map((items) => items.length));
  }
}
