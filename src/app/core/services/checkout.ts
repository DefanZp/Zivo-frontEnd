import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CheckoutRequest } from '../models/checkout-request.model';
import { ApiResponse } from '../models/generic-interface/api-response.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class Checkout {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  checkout(data: CheckoutRequest) {

    return this.http.post<ApiResponse<Order>>(
      `${this.apiUrl}/orders`,
      data
    );
  }

}
