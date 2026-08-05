import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth/auth";

export const authGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    const router = inject(Router);


    if (!authService.isLoggedIn()) {
        router.navigate(['/auth/login']);
        return false;
    }

    return true;
}