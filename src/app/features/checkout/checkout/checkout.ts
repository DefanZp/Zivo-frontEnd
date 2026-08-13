import { Component, inject, OnInit, signal } from '@angular/core';
import { Cart } from '../../../core/services/cart/cart';
import { Checkout as CheckoutService } from '../../../core/services/checkout/checkout';
import { Router, RouterLink } from '@angular/router';
import { CheckoutRequest } from '../../../core/models/checkout/checkout-request.model';
import { CheckoutItem } from '../../../core/models/checkout/checkout-item.model';
import { Toast } from '../../../core/services/toast';
import { CurrencyPipe } from '@angular/common';
import { Address as AddressModel } from '../../../core/models/user-settings/address/address.model';
import { Address } from '../../../core/services/address/address';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';
import { Loading } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-checkout',
  imports: [  
    CurrencyPipe,
    RouterLink,
    LoadingButton,
    Loading
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit{

  private cartService = inject(Cart);
  private checkoutService = inject(CheckoutService);
  private toastService = inject(Toast);
  private router = inject(Router);

  // error and loading state
  loading = signal(false);
  errorMessage = signal('');

  // section address
  addressService = inject(Address);
  addresses = signal<AddressModel[]>([]);
  selectedAddressId = signal<number | null>(null);
  loadingAddresses = signal(false);

  cartItems = this.cartService.cartItems();
  cartTotal = this.cartService.cartTotal;

  private buildCheckoutItems (): CheckoutItem[] {

    return this.cartItems().map( item => {

      return {

        product_id: item.product.id,

        quantity: item.quantity

      }
    })
  }

  private buildCheckoutRequest (addressId: number): CheckoutRequest {

    return {
      
      address_id: addressId,

      items: this.buildCheckoutItems()

    }
  }

  loadAddresses(): void {

    this.loadingAddresses.set(true);

    this.addressService
      .getAddresses()
      .subscribe({
        next: (response) => {
          
          const address = response.data;
          this.addresses.set(address);

          // cari alamat utama
          const defaultAddress = address.find(
            address => address.is_default
          );

          if (defaultAddress) {
            this.selectedAddressId.set(defaultAddress.id);
          }

          this.loadingAddresses.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load the address. Please try again.');
          this.loadingAddresses.set(false);
        }
      })
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId.set(addressId);
  }

  submitCheckout(): void {

    const addressId = this.selectedAddressId();

    if (!addressId) {
      this.toastService.error('Please select a shipping address');
      return;
    }

    const request = this.buildCheckoutRequest(addressId);

    this.loading.set(true);
    
    this.checkoutService
      .checkout(request)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toastService.success('Checkout successful!');
          this.cartService.clearCart();
          this.router.navigate(['/']);
        }, 
        error: () => {
          this.errorMessage.set('An error occurred during checkout.');
          this.loading.set(false);
        }
      });
  }

  ngOnInit(): void {
    this.loadAddresses();
  }
}
