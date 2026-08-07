import { Component, inject } from '@angular/core';
import { Cart as cartService } from '../../../core/services/cart/cart';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-cart',
  imports: [
    CurrencyPipe,
    EmptyState,
    RouterLink,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  private cartService = inject(cartService);

  private router = inject(Router);

  cartItems = this.cartService.cartItems();
  
  cartTotal = this.cartService.cartTotal;

  removeFromCart(productId: number): void {

    this.cartService.removeFromCart(productId);
  }

  increaseQuantity(productId: number): void {

    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {

    this.cartService.decreaseQuantity(productId);
  }

  navigateToCheckout(): void {
    
    this.router.navigate(['/checkout']);
  }
  
}
