import { Component, inject, OnInit, signal } from '@angular/core';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { Order } from '../../../core/services/order/order';
import { Router } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  imports: [
    Loading,
    EmptyState,
    CurrencyPipe,
  ],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {

  private orderService = inject(Order);
  private router = inject(Router);

  orders = signal<OrderModel[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  statusOptions = [
    { value: 'pending',    label: 'Pending'    },
    { value: 'processing', label: 'Processing' },
    { value: 'completed',  label: 'Completed'  },
    { value: 'cancelled',  label: 'Cancelled'  },
  ];

  loadOrders(): void {

    this.loading.set(true);

    this.orderService
      .getOrders()
      .subscribe({
        next: (response) => {
          this.orders.set(response.data);
          this.loading.set(false);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set('Failed to load the order. Please try again.');

          this.loading.set(false);
        }
      });
  }

  updateStatus(orderId: number, status: string): void {
    this.orderService
      .updateStatus( orderId, { status } )
      .subscribe({
        next: (response) => {
          this.orders.update( orders => 
            orders.map( order => 
              order.id === orderId 
              ? { ...order, status: response.data.status } 
              : order
            )
          )
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set('Failed to update the order status. Please try again.');
        }
      })
  }

  goToDetailOrder(orderId: number) {
    this.router.navigate(
      [`/admin/orders/${orderId}`]
    );
  }

  ngOnInit(): void {
    this.loadOrders();
  }
}
