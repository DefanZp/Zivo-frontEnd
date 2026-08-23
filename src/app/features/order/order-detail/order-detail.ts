import { Component, inject, OnInit, signal } from '@angular/core';
import { Order as OrderService } from '../../../core/services/order/order';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Payment as PaymentService } from '../../../core/services/payment/payment';
import { firstValueFrom } from 'rxjs';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

type OrderStatus = | 'pending' | 'processing'  | 'completed' | 'cancelled';

@Component({
  selector: 'app-order-detail',
  imports: [
    Loading,
    CurrencyPipe,
    EmptyState,
    DatePipe,
    RouterLink,
    LoadingButton,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit{

  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  // order data
  order = signal<OrderModel | null>(null);

  // loading & error state
  loading = signal(false);
  errorMessage = signal('');

  // dapatkan order id 
  orderId = this.getOrderId();
  
  // payment section 
  paymentService = inject(PaymentService);

  // loading payment
  paymentLoading = signal(false);

  private getOrderId(): number {
    return Number(
      this.route.snapshot.paramMap.get('id')
    );
  }

  // Order status section 
  statuses: OrderStatus[] = [
    'pending',
    'processing',
    'completed',
  ];

  isStatusCompleted(status: OrderStatus): boolean {

    const currentStatus = this.order()?.status;

    if (!currentStatus) {
      return false;
    }

    const currentIndex = this.statuses.indexOf(
      currentStatus as OrderStatus
    );

    const statusIndex = this.statuses.indexOf(status);

    return statusIndex <= currentIndex;
  }

  isCancelled(): boolean {
    return this.order()?.status === 'cancelled';
  }

  isCurrentStatus(status: OrderStatus): boolean {
    return this.order()?.status === status;
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {

      case 'pending':
        return 'Order Placed';

      case 'processing':
        return 'Processing';

      case 'completed':
        return 'Completed';

      default:
        return status;
    }
  }

  loadOrder(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService
      .getUserOrderById(this.orderId)
      .subscribe({
        next: (response) => {
          this.order.set(response.data);
          console.log(this.order());
          this.loading.set(false);
        },
        error: (error) => {
          this.errorMessage.set('Failed to load order details. Please try again.');

          this.loading.set(false);
        }
      })
  }

  // fitur untuk user yang inginmembayar order yang unpaid
  async payNow(): Promise<void> {

    const payment = this.order()?.payment;

    // pastikan payment tersedia
    if (!payment) {
      this.errorMessage.set('Payment information is not available.');
      return;
    }

    // pastikan hanya payment unpaid yang bisa dibayar
    if (payment.payment_status !== 'unpaid') {
      return;
    }

    this.paymentLoading.set(true);
    this.errorMessage.set('');

    try {

      // ambil snap token dari backend
      const response = await firstValueFrom(
        this.paymentService.getSnapToken(payment.id)
      );

      // pastikan snap js sudah dimuat
      await this.paymentService.loadSnapScript();

      // buka midtrans snap
      this.paymentService.openPayment(
          response.data.snap_token,

          // Payment sudah success di sisi midtrans
          () => {
            this.paymentLoading.set(false);
            this.loadOrder();
          },

          // Payment masih pending
          () => {
            this.paymentLoading.set(false);
            this.loadOrder();
          },

          // Payment gagal
          () => {
            this.paymentLoading.set(false);
            
            this.errorMessage.set(
              'Payment failed. Please try again.'
            );
          },

          // User menutup pop up
          () => {
            this.paymentLoading.set(false);
          }
      )
    } catch (error) {

      console.log(error);

      this.errorMessage.set(
      'Failed to start payment. Please try again.'
      );

    } finally {
      this.paymentLoading.set(false);
    }
  }

  ngOnInit(): void {
    this.loadOrder();
  }

}
