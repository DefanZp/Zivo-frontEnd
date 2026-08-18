export interface  Payment {
    id: number;
    order_id: number;
    payment_method: string;
    payment_status: string;
    amount: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
}