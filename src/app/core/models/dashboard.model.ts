export interface DashboardStatistic {
    total_products: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
}

export interface DashboardLatestOrder {
    id: number;
    user_id: number;
    customer_name: string;
    total_price: string;
    status: string;
    created_at: string;
}


export interface DashboardData {
    statistic_data: DashboardStatistic;
    latest_orders_data: DashboardLatestOrder[];
}