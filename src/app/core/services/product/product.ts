import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product as ProductModel } from '../../models/product/product.model';
import { CreateProductRequest } from '../../models/product/create-product-request.model';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { PaginatedResponse } from '../../models/generic-interface/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class Product {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  getProducts(
    search: string = '', 
    category?: number, 
    sort: string = '', 
    direction: string = '', 
    page: number = 1
  ) {

    const params: Record<string, string | number> = {
      search,
      sort,
      direction,
      page
    }
    
    if (category !== undefined) {
      params['category'] = category;
    }

    return this.http.get<ApiResponse<PaginatedResponse<ProductModel>>>
      (
        `${this.apiUrl}/products`,
        {
          params
        }
      );
  }

  getProductById(id: number) {
    return this.http.get<ApiResponse<ProductModel>>
      (`${this.apiUrl}/products/${id}`);
  }

  createProduct(data: CreateProductRequest) {
    return this.http.post<ProductModel>
      (`${this.apiUrl}/admin/products`, 
        data
      );
  }

  updateProduct(productId: number, data: CreateProductRequest) {
    return this.http.put<ProductModel>
      (`${this.apiUrl}/admin/products/${productId}`, 
        data
      );
  }

  deleteProduct(productId: number) {
    return this.http.delete<ProductModel>
      (`${this.apiUrl}/admin/products/${productId}`);
  }
}
