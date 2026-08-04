import { CheckoutItem } from "./checkout-item.model";

export interface CheckoutRequest {

    customer_name: string;

    phone: string;

    address: string;

    items: CheckoutItem[];
}