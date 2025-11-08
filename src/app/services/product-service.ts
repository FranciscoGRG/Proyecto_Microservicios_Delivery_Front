import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductModel } from '../models/product-model';
import { Observable } from 'rxjs';
import { ProductRequest } from '../models/product-request';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8082/api/v1/products';
  private readonly TOKEN_KEY = 'jwt_token';
  private http = inject(HttpClient)

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl)
  }

  getProductById(id: string): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`)
  }

  createProduct(createProduct: ProductRequest): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${this.apiUrl}`, createProduct)
  }

  updateProduct(updateProduct: ProductRequest, productId: string): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/${productId}`, updateProduct)
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`)
  }
}
