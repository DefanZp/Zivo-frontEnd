import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { Address as AddressModel } from '../../models/user-settings/address/address.model';
import { CreateAddressRequest } from '../../models/user-settings/address/create-address-request.model';

@Injectable({
  providedIn: 'root',
})
export class Address {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAddresses() {
    return this.http.get<ApiResponse<AddressModel[]>>(
      `${this.apiUrl}/user/addresses`
    );
  }

  createAddress(data: CreateAddressRequest) {
    return this.http.post<ApiResponse<AddressModel>>(
      `${this.apiUrl}/user/addresses`,
      data
    );
  }

  updateAddress(addressId: number,data: CreateAddressRequest) {
    return this.http.put<ApiResponse<AddressModel>>(
      `${this.apiUrl}/user/addresses/${addressId}`,
      data
    );
  }

  setDefaultAddress(addressId: number) {
    return this.http.patch<ApiResponse<AddressModel>>(
      `${this.apiUrl}/user/addresses/${addressId}/default`,
      {}
    );
  }

  deleteAddress(addressId: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/user/addresses/${addressId}`
    );
  }
}
