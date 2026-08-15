import { Component, inject, OnInit, signal } from '@angular/core';
import { Order as OrderService } from '../../../core/services/order/order';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

type OrderStatus = | 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

@Component({
  selector: 'app-order-detail',
  imports: [
    Loading,
    CurrencyPipe,
    EmptyState,
    DatePipe,
    RouterLink,
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

  private getOrderId(): number {
    return Number(
      this.route.snapshot.paramMap.get('id')
    );
  }

  // Order status section 
  statuses: OrderStatus[] = [
    'pending',
    'processing',
    'shipped',
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

      case 'shipped':
        return 'Shipped';

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

  ngOnInit(): void {
    this.loadOrder();
  }

}
