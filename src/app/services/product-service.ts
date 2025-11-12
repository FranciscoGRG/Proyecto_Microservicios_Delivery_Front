import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { ProductModel } from '../models/product-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductRequest } from '../models/product-request';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8082/api/v1/products';
  private http = inject(HttpClient);

  private searchProduct = signal('');

  private allProductsSubject = new BehaviorSubject<ProductModel[]>([]);

  private allProductsSignal = signal<ProductModel[]>([]);

  public productsFiltered = computed(() => {
    const term = this.searchProduct().trim().toLowerCase();
    const products = this.allProductsSignal();

    if (!term || term.length < 2) {
      return products;
    }

    return products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  });

  constructor() {
    effect(() => {
      this.allProductsSignal.set(this.allProductsSubject.getValue());
    });

    this.loadAllProducts();
  }

  setSearchProduct(product: string): void {
    this.searchProduct.set(product);
  }

  private loadAllProducts(): void {
    this.getProducts().subscribe({
      next: (products) => {
        this.allProductsSubject.next(products);
        this.allProductsSignal.set(products);
      },
      error: (error) => console.error('Error al cargar productos: ', error),
    });
  }

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`);
  }

  createProduct(createProduct: ProductRequest): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${this.apiUrl}`, createProduct);
  }

  updateProduct(updateProduct: ProductRequest, productId: string): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/${productId}`, updateProduct);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
}
