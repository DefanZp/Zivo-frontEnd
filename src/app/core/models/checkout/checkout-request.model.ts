import { CheckoutItem } from "./checkout-item.model";

export interface CheckoutRequest {

    address_id: number;

    items: CheckoutItem[];
}