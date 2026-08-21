import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/generic-interface/api-response.model';
import { SnapToken } from '../../models/payment/snap-token.model';

@Injectable({
  providedIn: 'root',
})
export class Payment {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSnapToken(paymentId: number) {
    return this.http.post<ApiResponse<SnapToken>>(
      `${this.apiUrl}/payments/${paymentId}/snap-token`,
      {}
    );
  }

  loadSnapScript(): Promise<void> {

    // Jika snap sudah dimuat tidak perlu membuat script lagi
    if (window.snap) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

      // buat elemen script
      const script = document.createElement('script');

      // source script(sanbox) dari midtrans
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';

      // masukkan client key 
      script.setAttribute(
        'data-client-key',
        environment.midtransClientKey
      );

      // jika script berhasil dimuat
      script.onload = () => {
        resolve();
      };

      // jika script gagal dimuat
      script.onerror = () => {
        reject();
      };

      // masukkan script ke page
      document.body.appendChild(script);
    });
  }

  openPayment(
    snapToken: string,
    onSuccess?: (result: unknown) => void,
    onPending?: (result: unknown) => void,
    onError?: (result: unknown) => void,
    onClose?: () => void
  ) {

    // Buka popup payment midtrans
    window.snap.pay(snapToken, {
      onSuccess,
      onPending,
      onError,
      onClose
    });
  }
}
