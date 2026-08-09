import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UpdateProfileRequest } from '../../models/user-settings/profile/update-profile-request';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { User as UserModel } from '../../models/auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class User {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  updateProfile(data: UpdateProfileRequest) {

    return this.http.put<ApiResponse<UserModel>>(
      `${this.apiUrl}/user/profile`,
      data
    );
    
  }
  
}
