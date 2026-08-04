import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../core/services/product/product';
import { Product as ProductModel } from '../../../core/models/product/product.model';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../../core/services/cart/cart';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { CartButton } from '../../../shared/components/cart-button/cart-button';
import { Toast } from '../../../core/services/toast';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [
    Loading,
    EmptyState,
    CartButton,
    CurrencyPipe
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit{
  
  private productService = inject(Product);
  private cartService = inject(Cart);
  private toastService = inject(Toast);
  private route = inject(ActivatedRoute); 
  
  product = signal<ProductModel | null>(null);

  loading = signal(false);
  addingToCart = signal(false);
  errorMessage = signal('');

  getProductId(): number {
    return Number(
      this.route.snapshot.paramMap.get('id')
    );
  }

  loadProduct(): void {

    const productId = this.getProductId();
    
    this.loading.set(true);

    this.productService
    .getProductById(productId)
    .subscribe({
      next: (response) => {
        this.product.set(response.data);

        this.loading.set(false);
      },
      error: (error) => {

        this.errorMessage.set('Gagal memuat produk. Silakan coba lagi.');
        this.loading.set(false);
      }
    })
  }

  async addToCart(): Promise<void> {

    const product = this.product();

    if (!product) {
      return;
    }

    this.addingToCart.set(true);

    this.cartService.addToCart(product);  

    setTimeout(() => {
      this.toastService.success('Produk ditambahkan ke keranjang');
      this.addingToCart.set(false);
    }, 1000);
  }

  isInCart(): boolean {

    const product = this.product();

    if (!product) {
      return false;
    }

    return this.cartService.isProductInCart(product.id)
  }

  ngOnInit(): void {
    this.loadProduct();
  }

}
