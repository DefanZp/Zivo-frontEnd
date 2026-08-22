import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  imports: [
    RouterLink,
  ],
  templateUrl: './payment-result.html',
  styleUrl: './payment-result.css',
})
export class PaymentResult implements OnInit {

  private route = inject(ActivatedRoute);

  orderId = '';
  transactionStatus = '';

  getResultParams(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['order_id'] ?? '';
      this.transactionStatus = params['transaction_status'] ?? '';
    })
  }

  getStatusTitle(): string {
    switch (this.transactionStatus) {

      case 'settlement':
      case 'capture':
        return 'Payment Successful';
      
      case 'pending':
        return 'Payment Pending'
      
      case 'expire':
        return 'Payment Expired';
      
      case 'cancel':
        return 'Payment Canceled';
      
      case 'deny':
        return 'Payment Failed';
      
      default:
        return 'Payment Status';
    }
  }

  getStatusMessage(): string {

    switch (this.transactionStatus) {

      case 'settlement':
      case 'capture':
        return 'Your payment has been submitted successfully and your order is being processed.';

      case 'pending':
        return 'Your payment is still being processed. Please wait while we verify your payment.';

      case 'expire':
        return 'Your payment session has expired and the order has been cancelled.';

      case 'cancel':
        return 'Your payment was cancelled before completion.';

      case 'deny':
        return 'Your payment was declined. Please try again with another payment method.';

      default:
        return 'Your payment status is being verified.';
    }
  }

  getStatusIcon(): string {

    switch (this.transactionStatus) {

      case 'settlement':
      case 'capture':
        return 'success';

      case 'pending':
        return 'pending';

      case 'expire':
        return 'expired';

      case 'cancel':
        return 'cancelled';

      case 'deny':
        return 'failed';

      default:
        return 'unknown';
    }
  }

  ngOnInit(): void {
    this.getResultParams();
  }
}
