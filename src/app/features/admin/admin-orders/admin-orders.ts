import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Order as OrderModel } from '../../../core/models/order/order.model';
import { Order } from '../../../core/services/order/order';
import { Router } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { CurrencyPipe } from '@angular/common';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-admin-orders',
  imports: [
    Loading,
    EmptyState,
    CurrencyPipe,
    Pagination,
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

  // state pagination
  currentPage = signal(1);
  lastPage = signal(1);


  statusOptions = [
    { value: 'pending',    label: 'Pending'    },
    { value: 'processing', label: 'Processing' },
    { value: 'completed',  label: 'Completed'  },
    { value: 'cancelled',  label: 'Cancelled'  },
  ];

  loadOrders(): void {

    this.loading.set(true);

    this.orderService
      .getOrders({
        page: this.currentPage(),
      })
      .subscribe({
        next: (response) => {
          this.orders.set(response.data.data);
          this.currentPage.set(response.data.current_page);
          this.lastPage.set(response.data.last_page);
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

  // untuk pagination
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
