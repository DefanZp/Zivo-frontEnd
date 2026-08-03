import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProductRequest } from '../../../core/models/create-product-request.model';
import { Product } from '../../../core/services/product';
import { Product as ProductModel } from '../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TextInput } from '../../../shared/components/text-input/text-input';

@Component({
  selector: 'app-admin-product-form',
  imports: [ 
    ReactiveFormsModule,
    TextInput,
   ],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm implements OnInit{

  private formBuilder = inject(NonNullableFormBuilder);

  private productService = inject(Product);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private productId = signal<number | null>(null);

  createProductForm = this.formBuilder.group({

    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    stock: [0, Validators.required],
    category_id: [1, Validators.required],
    image_path: ['', Validators.required],

  });

  private buildRequest(): CreateProductRequest {

    const formData = this.createProductForm.getRawValue();
    
    return {

      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      category_id: formData.category_id,
      image_path: formData.image_path

    }
  }

  // Edit Form

  private getProductId(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.productId.set(Number(id));
  }


  private loadProduct(): void {

    const id = this.productId();

    if (!id) {
      return;
    }

    this.productService
      .getProductById(id)
      .subscribe({
        next: (product) => {
          this.fillForm(product.data);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  private fillForm(product: ProductModel): void {
    
    this.createProductForm.patchValue({

      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category_id: product.category_id,
      image_path: product.image_path
    });
  }

  private createProduct(request: CreateProductRequest): void {

    this.productService
    .createProduct(request)
    .subscribe({
      next: () => {

        alert('Product berhasil ditambahkan');
        
        this.router.navigate(['/admin/products']);

      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  private updateProduct(request: CreateProductRequest): void {

    const productId = this.productId();

    if (!productId) {
      return;
    }

    this.productService
      .updateProduct(productId, request)
      .subscribe({
        next: () => {

          alert('Product berhasil diubah');
          
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
  
  submitForm(): void {

    if (this.createProductForm.invalid) {
      return;
    }

    const request = this.buildRequest();

    // jika id ada maka update
    if (this.productId()) {
      this.updateProduct(request);
      return;
    }

    this.createProduct(request);

  }

  isEditMode(): boolean {
    return this.productId() !== null;
  }

  ngOnInit(): void {
    this.getProductId();
    this.loadProduct();
  }
}
