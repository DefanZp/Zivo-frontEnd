import { OrderItem } from "./order-item.model";
import { User } from "./user.model"


export interface Order {
    id: number;
    user_id: number;
    customer_name: string;
    phone: string;
    address: string;
    total_price: string;
    status: string;
    created_at: string;
    updated_at: string;

    user: User;

    items: OrderItem[];
}

