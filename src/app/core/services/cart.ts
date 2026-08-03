import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product as ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private cartItemSignal = signal<CartItem[]>(

    // ambil dari localstorage kalau ada
    this.loadCart()
  );

  cartItems() {
    return this.cartItemSignal;
  }

  addToCart(product: ProductModel) {

    const currentItems = this.cartItemSignal();

    const existingItem = currentItems.find(
      item => item.product.id === product.id
    );

    if (existingItem) {

      existingItem.quantity++;

      this.cartItemSignal.update(items => [...items]);

      return;
    }

    this.cartItemSignal.update( items => [

      ...items,

      {
        product: product,
        quantity: 1
      }
    ]);
    
    // save ke localstorage
    this.saveCart();

  }

  increaseQuantity(productId: number): void {

    this.cartItemSignal.update( items => {

      return items.map(item => {

        if (item.product.id === productId) {

          return {

            ...item,

            quantity: item.quantity + 1

          }
        }

        return item;
      })

    });

    // save ke localstorage
    this.saveCart();
  }

  decreaseQuantity(productId: number): void {

    this.cartItemSignal.update( items => {

      return items.map(item => {
        
        if (item.product.id !== productId) {
          return item;
        }
        if (item.quantity === 1) {
          return item;
        }
        
        if (item.product.id === productId) {

          return {
            ...item,

            quantity: item.quantity - 1
          }

        }

        return item;
      })
    });

    // save ke localstorage
    this.saveCart();
  }

  removeFromCart(productId: number): void {

    this.cartItemSignal.update( items => 
      items.filter(item => item.product.id !== productId)
    );

    // save ke localstorage
    this.saveCart();

  }

  cartTotal = computed(() => {

    return this.cartItemSignal().reduce(
      // callback atau fungsi
      (total, item) => 
        total + 
        Number(item.product.price) * item.quantity,

      // initial state
      0
    );

  });

  clearCart(): void {
    this.cartItemSignal.set([]);

    // hapus dari localstorage
    this.clearCartStorage();
  }

  // save ke localstorage
  private saveCart(): void {

    localStorage.setItem(

      'cart',

      JSON.stringify(this.cartItemSignal())

    );
  }

  private loadCart(): CartItem[] {

    const cart = localStorage.getItem('cart');

    if (!cart) {
      return [];
    }

    return JSON.parse(cart);

  }

  private clearCartStorage(): void {

    localStorage.removeItem('cart');
  }

  isProductInCart(productId: number): boolean {

    return this.cartItemSignal().some( 
        items => items.product.id === productId
    );
  }
}
