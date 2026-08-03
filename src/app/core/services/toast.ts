import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Toast {

  success(message: string) {
    toast.success(message);
  }

  error(message: string) {
    toast.error(message);
  }

  info(message: string) {
    toast.info(message);
  }

  warning(message: string) {
    toast.warning(message);
  }

  loading(message: string) {
    toast.loading(message);
  }

  dismiss(id?: string | number) {
    toast.dismiss(id);
  }

  promise<T>(
    request: Observable<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T> {
    
    const promise = firstValueFrom(request);

    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error
    });

    return promise;
  }
}
