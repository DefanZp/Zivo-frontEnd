import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product as ProductModel } from '../../models/product/product.model';
import { CreateProductRequest } from '../../models/product/create-product-request.model';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { PaginatedResponse } from '../../models/generic-interface/paginated-response.model';
import { environment } from '../../../../environments/environment';
import { GetProductsParams } from '../../models/product/get-products-params.model';

@Injectable({
  providedIn: 'root',
})
export class Product {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  getProducts(params: GetProductsParams) {

    const queryParams: Record<string, string | number> = {
      search: params.search ?? '',
      category: params.category ?? '',
      sort: params.sort ?? '',
      direction: params.direction ?? '',
      page: params.page ?? ''
    }
    
    if (params.category !== undefined) {
        queryParams['category'] = params.category;
    }

    return this.http.get<ApiResponse<PaginatedResponse<ProductModel>>>
      (
        `${this.apiUrl}/products`,
        {
          params: queryParams
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
