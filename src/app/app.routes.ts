import { Routes } from '@angular/router';
import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/checkout/checkout/checkout';
import { AdminProducts } from './features/admin/admin-products/admin-products';
import { AdminProductForm } from './features/admin/admin-product-form/admin-product-form';
import { AdminOrders } from './features/admin/admin-orders/admin-orders';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { authGuard } from './core/guard/auth.guard';
import { adminGuard } from './core/guard/admin.guard';
import { AdminOrdersDetail } from './features/admin/admin-orders-detail/admin-orders-detail';
import { BlankLayout } from './shared/layouts/blank-layout/blank-layout';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: 'auth',
        component: BlankLayout,
        children: [
            {
                path: 'login',
                component: Login,
            },
            {
                path: 'register',
                component: Register,
            },
        ]
    },
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: ProductList
            },
            {
                path: 'product/:id',
                component: ProductDetail
            },
            {
                path: 'cart',
                component: Cart,
                canActivate: [
                    authGuard
                ]
            },
            {
                path: 'checkout',
                component: Checkout,
                canActivate: [
                    authGuard
                ]
            },
            {
                path: 'admin/dashboard',
                component: AdminDashboard,
                canActivate: [
                    adminGuard
                ]
            },
            {
                path: 'admin/products',
                component: AdminProducts,
                canActivate: [
                    adminGuard
                ]
            },
            {
                path: 'admin/products/create',
                component: AdminProductForm,
                canActivate: [
                    adminGuard
                ]
            },
            {
                path: 'admin/products/:id/edit',
                component: AdminProductForm,
                canActivate: [
                    adminGuard
                ]
            },
            {
                path: 'admin/orders',
                component: AdminOrders,
                canActivate: [
                    adminGuard
                ]
            },
            {
                path: 'admin/orders/:id',
                component: AdminOrdersDetail,
                canActivate: [
                    adminGuard
                ]
            },
        ]
    },
];
