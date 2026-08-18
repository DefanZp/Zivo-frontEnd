import { OrderItem } from "./order-item.model";
import { User } from "../auth/user.model"
import { Payment } from "../payment/payment.model";


export interface Order {
    id: number;
    user_id: number;
    
     // Address snapshot
    recipient_name: string;
    phone: string;
    full_address: string;

    province_id: string;
    province_name: string;

    city_id: string;
    city_name: string;

    district_id: string;
    district_name: string;

    subdistrict_id: string | null;
    subdistrict_name: string | null;

    postal_code: string;

    latitude: number | null;
    longitude: number | null;

    // Order
    total_price: string;
    status: string;

    created_at: string;
    updated_at: string;

    user: User;

    items: OrderItem[];

    payment: Payment;
}

