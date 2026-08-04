import { Product } from "../product/product.model"

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
    product: Product;
}