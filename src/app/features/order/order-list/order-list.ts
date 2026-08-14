import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Order as OrderService } from '../../../core/services/order/order';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-list',
  imports: [
    CurrencyPipe,
    DatePipe,
    Loading,
    EmptyState,
    StatusBadge,
    Pagination,
    RouterLink,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit{

  private orderService = inject(OrderService);

  // Order data
  orders = signal<OrderModel[]>([]);

  // Pagination
  currentPage = signal(1);
  lastPage = signal(1);

  // Loading & error
  loading = signal(false);
  errorMessage = signal('');

  loadOrders(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService
      .getUserOrders({
        page: this.currentPage()
      })
      .subscribe({
        next: (response) => {

          this.orders.set(response.data.data);

          this.currentPage.set(
            response.data.current_page
          );

          this.lastPage.set(
            response.data.last_page
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.log(error);

          this.errorMessage.set(
            'Failed to load your orders. Please try again.'
          );

          this.loading.set(false);
        }
      });
  }

  goToPage(page: number): void {

    this.currentPage.set(page);

    this.loadOrders();
    this.scrollToOrders();
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  // section untuk scroll ketika ubah pagination
  orderSection = viewChild<ElementRef>('orderSection');

  private scrollToOrders(): void {
    const element = this.orderSection()?.nativeElement;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
