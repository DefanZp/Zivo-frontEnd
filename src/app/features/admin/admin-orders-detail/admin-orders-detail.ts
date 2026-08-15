import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../core/services/order/order';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { Toast } from '../../../core/services/toast';

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
  private toastService = inject(Toast);

  private route = inject(ActivatedRoute);

  order = signal<OrderModel | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  updatingStatus = signal(false);
  

  private getOrderId(): number {
    return Number(
      this.route.snapshot.paramMap.get('id')
    )
  }

  orderId = this.getOrderId();

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

  updateStatus(status: string): void {

  this.updatingStatus.set(true);

  this.orderService
    .updateStatus(this.orderId, { status })
    .subscribe({
      next: (response) => {
        this.order.update(order  => {

          if (!order) return null;
          
          return {
            ...order,
            status: response.data.status,
          };
        })
        this.toastService.success('Order status updated successfully.');
        this.updatingStatus.set(false);
      },
      error: () => {  
        this.errorMessage.set(
          'Failed to update the order status. Please try again.'
        );
        this.toastService.error('Failed to update the order status. Please try again.');
        this.updatingStatus.set(false);
      }
    });
}

  ngOnInit(): void {
    this.loadOrders();
  }
}
