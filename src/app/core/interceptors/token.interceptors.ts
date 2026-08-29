import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "../services/auth/auth";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(Auth)

    const token = authService.currentToken();

    // untuk mengatasi cors ngrok karena menggunakan laptop sebagai server
    const headers: Record<string, string> = {
        'ngrok-skip-browser-warning': 'true'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const request = req.clone({
        setHeaders: headers
    });

    return next(request);
}