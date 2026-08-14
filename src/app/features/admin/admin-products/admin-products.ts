import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Product } from '../../../core/services/product/product';
import { Product as ProductModel } from '../../../core/models/product/product.model';
import { Router } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { ConfirmationModal } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { Toast } from '../../../core/services/toast';
import { CurrencyPipe } from '@angular/common';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-admin-products',
  imports: [
    Loading,
    EmptyState,
    ConfirmationModal,
    CurrencyPipe,
    Pagination,
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

  // state pagination
  currentPage = signal(1);
  lastPage = signal(1);

  // state delete modal
  showDeleteModal = signal(false);
  productIdToDelete = signal<number | null>(null);

  loadProducts(): void {

    this.loading.set(true);
    
    this.productService
    .getProducts({
      page: this.currentPage(),
    })
    .subscribe({
      next: (response) => {
        this.products.set(response.data.data);
        this.currentPage.set(response.data.current_page);
        this.lastPage.set(response.data.last_page);
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

  // For pagination

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
    this.scrollToProducts();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // section untuk scroll ketika ubah pagination
  productSection = viewChild<ElementRef>('productSection');

  private scrollToProducts(): void {
    const element = this.productSection()?.nativeElement;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
