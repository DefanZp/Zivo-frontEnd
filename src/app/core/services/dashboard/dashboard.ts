import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DashboardData } from '../../models/dashboard.model';
import { ApiResponse } from '../../models/generic-interface/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  // Api 
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  getDashboard() {
    return this.http.get<ApiResponse<DashboardData>>(
      `${this.apiUrl}/admin/dashboard`
    )
  }
}
