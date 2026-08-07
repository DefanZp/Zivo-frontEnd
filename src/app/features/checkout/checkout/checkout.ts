import { Component, inject, signal } from '@angular/core';
import { Cart } from '../../../core/services/cart/cart';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkout as CheckoutService } from '../../../core/services/checkout/checkout';
import { Router } from '@angular/router';
import { CheckoutRequest } from '../../../core/models/checkout/checkout-request.model';
import { CheckoutItem } from '../../../core/models/checkout/checkout-item.model';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';
import { Toast } from '../../../core/services/toast';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    LoadingButton,
    TextInput,
    ValidationMessage,
    CurrencyPipe,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {

  private cartService = inject(Cart);
  private checkoutService = inject(CheckoutService);
  private toastService = inject(Toast);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);

  // error and loading state
  loading = signal(false);
  errorMessage = signal('');

  cartItems = this.cartService.cartItems();

  cartTotal = this.cartService.cartTotal;

  checkoutForm = this.formBuilder.group({

    customer_name:['', [Validators.required, Validators.maxLength(255)]],

    phone: ['', [Validators.required, Validators.maxLength(20)]],

    address: ['', [Validators.required, Validators.maxLength(500)]],

  });

  private buildCheckoutItems (): CheckoutItem[] {

    return this.cartItems().map( item => {

      return {

        product_id: item.product.id,

        quantity: item.quantity

      }
    })
  }

  private buildCheckoutRequest (): CheckoutRequest {
    
    const formData = this.checkoutForm.getRawValue();

    return {

      customer_name: formData.customer_name,

      phone: formData.phone,

      address: formData.address,

      items: this.buildCheckoutItems()
    }
  }

  submitCheckout(): void {

    if (this.checkoutForm.invalid) {
    return;
    }

    const request = this.buildCheckoutRequest();

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

}
