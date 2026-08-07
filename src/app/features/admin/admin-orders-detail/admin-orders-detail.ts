import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../core/services/order/order';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-orders-detail',
  imports: [
    CommonModule,
    Loading,
    EmptyState,
    StatusBadge,
    CurrencyPipe,
  ],
  templateUrl: './admin-orders-detail.html',
  styleUrl: './admin-orders-detail.css',
})
export class AdminOrdersDetail implements OnInit {

  private orderService = inject(Order);

  private route = inject(ActivatedRoute);

  orderId = this.getOrderId();

  order = signal<OrderModel | null>(null);
  loading = signal(false);
  errorMessage = signal('');
  

  private getOrderId(): number {
    return Number(
      this.route.snapshot.paramMap.get('id')
    )
  }

  loadOrders(): void {

    this.loading.set(true);

    this.orderService
      .getOrderById(this.orderId)
      .subscribe({
        next: (response) => {
          this.order.set(response.data);

          this.loading.set(false);
        },

        error: (error) => {
          this.errorMessage.set('Failed to load order details. Please try again.');

          this.loading.set(false);
        }
      });
  }

  ngOnInit(): void {
    this.loadOrders();
  }
}
