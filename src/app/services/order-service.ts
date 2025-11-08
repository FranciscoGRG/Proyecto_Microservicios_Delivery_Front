import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/order-model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8082/api/v1/orders';
  private readonly TOKEN_KEY = 'jwt_token';
  private http = inject(HttpClient);

  getOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${this.apiUrl}`)
  }

  deleteOrderById(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`)
  }
}
