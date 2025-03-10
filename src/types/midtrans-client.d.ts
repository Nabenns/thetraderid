declare module 'midtrans-client' {
    interface Config {
        isProduction: boolean;
        serverKey: string;
        clientKey: string;
    }

    interface TransactionDetails {
        order_id: string;
        gross_amount: number;
    }

    interface CustomerDetails {
        first_name: string;
        last_name?: string;
        email: string;
        phone?: string;
    }

    interface TransactionOptions {
        transaction_details: TransactionDetails;
        customer_details?: CustomerDetails;
        credit_card?: {
            secure?: boolean;
        };
    }

    class Snap {
        constructor(config: Config);
        createTransaction(options: TransactionOptions): Promise<{ token: string }>;
    }

    class CoreApi {
        constructor(config: Config);
        charge(options: TransactionOptions): Promise<any>;
    }

    export { Snap, CoreApi };
} 