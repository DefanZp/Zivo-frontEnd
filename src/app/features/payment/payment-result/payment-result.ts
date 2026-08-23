import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Payment } from '../../../core/services/payment/payment';
import { firstValueFrom } from 'rxjs';
import { Payment as PaymentModel } from '../../../core/models/payment/payment.model';
import { Loading } from '../../../shared/components/loading/loading';


@Component({
  selector: 'app-payment-result',
  imports: [
    RouterLink,
    Loading,
  ],
  templateUrl: './payment-result.html',
  styleUrl: './payment-result.css',
})
export class PaymentResult implements OnInit {

  private route = inject(ActivatedRoute);
  private paymentService = inject(Payment);

  orderId = '';
  payment = signal<PaymentModel | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  getResultParams(): void {
    this.route.queryParams.subscribe(params => {

      this.orderId = params['payment_order_id'] ?? '';
      
      if (!this.orderId) {
        this.errorMessage.set('Payment information was not found.');
        return;
      }

      this.loadPayment();

    })
  }

  async loadPayment(): Promise<void> {

    this.loading.set(true);
    this.errorMessage.set('');

    try {

      const response = await firstValueFrom(
        this.paymentService.getPaymentByGatewayOrderId(this.orderId)
      );

      this.payment.set(response.data);  
      
    } catch(error) {

      console.log(error);
      this.errorMessage.set('Failed to load payment information.');

    } finally {

      this.loading.set(false);

    }
  }

  getStatusTitle(): string {

    const status = this.payment()?.payment_status;

    switch (status) {

      case 'paid':
        return 'Payment Successful';

      case 'unpaid':
        return 'Payment Pending';

      case 'expired':
        return 'Payment Expired';

      case 'cancelled':
        return 'Payment Cancelled';

      case 'failed':
        return 'Payment Failed';

      default:
        return 'Payment Status';
    }
  }

  getStatusMessage(): string {

    const status = this.payment()?.payment_status;

    switch (status) {

      case 'paid':
        return 'Your payment has been submitted successfully and your order is being processed.';

      case 'unpaid':
        return 'Your payment is still pending. Please check your order for the latest status.';

      case 'expired':
        return 'Your payment session has expired and the order has been cancelled.';

      case 'cancelled':
        return 'Your payment was cancelled before completion.';

      case 'failed':
        return 'Your payment could not be completed. Please try again.';

      default:
        return 'Your payment status is being verified.';
    }
  }

  getStatusIcon(): string {

    const status = this.payment()?.payment_status;

    switch (status) {

      case 'paid':
        return 'success';

      case 'unpaid':
        return 'pending';

      case 'expired':
        return 'expired';

      case 'cancelled':
        return 'cancelled';

      case 'failed':
        return 'failed';

      default:
        return 'unknown';
    }
  }

  ngOnInit(): void {
    this.getResultParams();
  }
}
