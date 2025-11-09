import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-edit.html',
})
export class ProductEditComponent implements OnInit {
  private service = inject(ProductService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productId: string | null = null;
  isEdit: boolean = false;
  pageTitle: string = '';
  productForm!: FormGroup;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') as string;
    this.isEdit = !!this.productId;

    this.pageTitle = this.isEdit ? 'Editar producto' : 'Crear nuevo producto';

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      category: ['', Validators.required],
    });

    if (this.isEdit && this.productId) {
      this.loadProductData(this.productId);
    }
  }

  loadProductData(id: string): void {
    this.service.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
      },
      error: (error) => {
        console.error('Error al obtener el producto para editarlo: ', error);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const data = this.productForm.value;

    if (this.isEdit && this.productId) {
      this.service.updateProduct(data, this.productId).subscribe({
        next: () => { this.handleSucces('actualizado') },
        error: (error) => {console.error("Error al actualizar el producto: ", error)},
      });
    } else {
      this.service.createProduct(data).subscribe({
        next: () => { this.handleSucces('creado') },
        error: (error) => {console.error("Error al crear el producto: ", error)},
      });
    }
  }

  handleSucces(action: 'creado' | 'actualizado'): void {
    Swal.fire('Exito', `Producto ${action} correctamente`, 'success');

    this.router.navigate(['/admin'])
  }
}
