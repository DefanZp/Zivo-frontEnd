import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { RegionResponse } from '../../models/generic-interface/region-response.model';

@Injectable({
  providedIn: 'root',
})
export class Region {

  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  getProvinces() {
    return this.http.get<RegionResponse>
    (`${this.apiUrl}/regions/provinces`);
  }

  getCities(provinceId: number) {
    return this.http.get<RegionResponse>
    (`${this.apiUrl}/regions/cities/${provinceId}`);
  }

  getDistricts(cityId: number) {
    return this.http.get<RegionResponse>
    (`${this.apiUrl}/regions/districts/${cityId}`);
  }

  getSubDistricts(districtId: number) {
    return this.http.get<RegionResponse>
    (`${this.apiUrl}/regions/subdistricts/${districtId}`);
  }
}
