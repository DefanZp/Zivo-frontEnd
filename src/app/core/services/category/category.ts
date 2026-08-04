import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { Category as CategoryModel } from '../../models/product/category.model';

@Injectable({
  providedIn: 'root',
})
export class Category {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  getCategories() {
    return this.http.get<ApiResponse<CategoryModel[]>>
    (`${this.apiUrl}/categories`);
  }
  
}
