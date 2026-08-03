import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "../services/auth";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(Auth)

    const token = authService.currentToken();

    if (!token) {
        return next(req);
    }

    const requestWithToken = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })

    return next(requestWithToken);
}