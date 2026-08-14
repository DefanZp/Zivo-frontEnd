import { Component, inject, OnInit, signal } from '@angular/core';
import { Order as OrderService } from '../../../core/services/order/order';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-order-detail',
  imports: [
    Loading,
    CurrencyPipe,
    EmptyState,
    DatePipe,
    StatusBadge,
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
