import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import midtransClient from 'midtrans-client';

// Create Snap API instance
const snap = new midtransClient.Snap({
    isProduction: process.env.NEXT_PUBLIC_MIDTRANS_ENVIRONMENT === 'production',
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});

// Configure the route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Get base URL dynamically
const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

interface Plan {
    name: string;
    price: number;
}

interface CustomerDetails {
    name: string;
    email: string;
    phone?: string;
    platform: string;
    platformUsername: string;
}

interface PaymentRequest {
    plan: Plan;
    customerDetails: CustomerDetails;
}

export async function POST(req: Request) {
    try {
        // Log environment
        console.log('Environment:', {
            isProduction: process.env.NEXT_PUBLIC_MIDTRANS_ENVIRONMENT === 'production',
            baseUrl: getBaseUrl(),
            hasServerKey: !!process.env.MIDTRANS_SERVER_KEY,
            hasClientKey: !!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
        });

        // Validate content type
        const contentType = req.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            return NextResponse.json({
                success: false,
                message: 'Content-Type must be application/json'
            }, { status: 415 });
        }

        const body = await req.json() as PaymentRequest;
        const { plan, customerDetails } = body;

        // Log request data
        console.log('Payment Request:', {
            plan,
            customerDetails: {
                ...customerDetails,
                email: customerDetails.email ? '****' : undefined // Hide email in logs
            }
        });

        if (!plan?.price || !customerDetails?.name || !customerDetails?.email) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: plan.price, customerDetails.name, customerDetails.email'
            }, { status: 400 });
        }

        // Generate shorter order ID (timestamp + 4 chars of UUID)
        const timestamp = Date.now().toString().slice(-6);
        const shortUuid = uuid().split('-')[0].slice(0, 4);
        const orderId = `TID${timestamp}${shortUuid}`;

        // Get base URL
        const baseUrl = getBaseUrl();

        // Prepare transaction data
        const transactionData = {
            transaction_details: {
                order_id: orderId,
                gross_amount: parseInt(plan.price.toString())
            },
            customer_details: {
                first_name: customerDetails.name,
                email: customerDetails.email,
                phone: customerDetails.phone || '-'
            },
            callbacks: {
                finish: `${baseUrl}/payment/finish`,
                error: `${baseUrl}/payment/error`,
                pending: `${baseUrl}/payment/pending`
            },
            notification_urls: [`${baseUrl}/api/webhook`],
            metadata: {
                order_id: orderId,
                plan_name: plan.name,
                customer_name: customerDetails.name,
                customer_email: customerDetails.email,
                platform: customerDetails.platform,
                platform_username: customerDetails.platformUsername
            },
            credit_card: {
                secure: true
            }
        };

        // Log transaction data
        console.log('Transaction Data:', {
            ...transactionData,
            customer_details: {
                ...transactionData.customer_details,
                email: '****' // Hide email in logs
            }
        });

        // Create transaction
        const transaction = await snap.createTransaction(transactionData);

        // Log success
        console.log('Transaction created successfully:', {
            token: transaction.token,
            orderId
        });

        return NextResponse.json({
            success: true,
            token: transaction.token,
            orderId,
            orderData: {
                plan,
                customerDetails
            }
        });
    } catch (error) {
        console.error('Payment error:', error);
        
        // Handle Midtrans specific errors
        if (error instanceof Error && 'ApiResponse' in error) {
            const midtransError = error as any;
            console.error('Midtrans API Error Details:', {
                statusCode: midtransError.httpStatusCode,
                response: midtransError.ApiResponse,
                rawData: midtransError.rawHttpClientData
            });
            
            return NextResponse.json({
                success: false,
                message: 'Midtrans API Error',
                details: midtransError.ApiResponse?.error_messages || midtransError.message,
                code: midtransError.httpStatusCode
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
        }, { status: 500 });
    }
} 