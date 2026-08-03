import { Component, inject } from '@angular/core';
import { Cart as cartService } from '../../../core/services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
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
