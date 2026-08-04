import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { Order as OrderModel } from '../../models/order/order.model';

@Injectable({
  providedIn: 'root',
})
export class Order {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  getOrders() {
    return this.http.get<ApiResponse<OrderModel[]>>
    (`${this.apiUrl}/admin/orders`);
  }

  getOrderById(id: number) {
    return this.http.get<ApiResponse<OrderModel>>
    (`${this.apiUrl}/admin/orders/${id}`);
  }

  updateStatus(id: number, data: { status: string }) {
    return this.http.patch<ApiResponse<OrderModel>>
    (`${this.apiUrl}/admin/orders/${id}`, data);
  }

}
