import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/services/product/product';
import { Product as ProductModel } from '../../core/models/product/product.model';
import { Loading } from '../../shared/components/loading/loading';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [
    RouterLink,
    Loading,
    EmptyState,
    CurrencyPipe,
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  
  private productService = inject(Product);

  products = signal<ProductModel[]>([]);
  
  // loading state
  loading = signal(false);
  errorMessage = signal('');

  loadProducts() {
    this.loading.set(true);
    this.productService.getProducts()
    .subscribe({
      next: (response) => {
        this.products.set(response.data.data);

        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Gagal memuat produk. Silakan coba lagi.');
      }
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }
}
