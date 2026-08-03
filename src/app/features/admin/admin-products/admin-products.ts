import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../core/services/product';
import { Product as ProductModel } from '../../../core/models/product.model';
import { Router } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ConfirmationModal } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-admin-products',
  imports: [
    Loading,
    EmptyState,
    ConfirmationModal,
  ],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {

  // inject service
  private productService = inject(Product);
  private toastService = inject(Toast);

  // inject router
  private router = inject(Router);

  // state data
  products = signal<ProductModel[]>([]);

  // state loading
  loading = signal(false);
  deleting = signal(false);

  // state delete modal
  showDeleteModal = signal(false);
  productIdToDelete = signal<number | null>(null);

  loadProducts(): void {

    this.loading.set(true);
    
    this.productService
    .getProducts()
    .subscribe({
      next: (response) => {
        this.products.set(response.data.data);

        this.loading.set(false);
      },
      error: (error) => {
        console.log(error);

        this.loading.set(false);
      }
    });
  }

  goToCreateProduct(): void {
    this.router.navigate([
      '/admin/products/create'
    ]);
  }

  goToEditProduct(productId: number):void {
    this.router.navigate([
      '/admin/products',
        productId, 
        'edit'
    ]); 
  }

  deleteProduct(): void {
    
    const productId = this.productIdToDelete();

    if (!productId) {
      return;
    }

    this.deleting.set(true);

    this.productService
      .deleteProduct(productId)
      .subscribe({
        next: () => { 

          this.deleting.set(false);
          this.toastService.success('Product deleted successfully');
          this.closeDeleteModal();
          // update signal untuk update ui
          this.products.update( products => {
            return products.filter(product => product.id !== productId);
          });
        },
        error: (error) => {
          console.log(error);
          this.deleting.set(false);
          this.toastService.error('Failed to delete product');
        }
      })
  }

  openDeleteModal(productId: number): void {
    this.productIdToDelete.set(productId);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.productIdToDelete.set(null);
    this.showDeleteModal.set(false);
  }

  ngOnInit(): void {
    this.loadProducts();
  }
}
