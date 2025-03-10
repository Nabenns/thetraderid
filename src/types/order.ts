export interface OrderData {
    order_id: string;
    plan_name: string;
    customer_name: string;
    customer_email: string;
    platform: string;
    platform_username: string;
}

export interface WebhookData {
    transaction_status: string;
    order_id: string;
    metadata: OrderData;
} 