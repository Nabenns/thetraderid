import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Configure route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper function to format currency
function formatCurrency(amount: string | number): string {
    return `Rp ${parseInt(amount.toString()).toLocaleString('id-ID')}`;
}

// Helper function to format date
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}

// Get platform invite link
function getPlatformLink(platform: string): string {
    switch (platform.toLowerCase()) {
        case 'discord':
            return 'https://discord.gg/pFAnhSGvXr';
        case 'telegram':
            return 'https://t.me/+hIPGExXU2Bg2ZjY1';
        default:
            return '';
    }
}

async function sendEmail(orderData: any, transactionStatus: string) {
    try {
        const { metadata } = orderData;
        
        if (!metadata?.customer_email) {
            console.error('Customer email is missing or invalid');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(metadata.customer_email)) {
            console.error('Invalid email format:', metadata.customer_email);
            return;
        }
        
        // Email to admin
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Admin email
            subject: `[Admin] New Payment ${transactionStatus} - Order ${metadata.order_id}`,
            html: `
                <h2>New Payment ${transactionStatus}</h2>
                <h3>Customer Details:</h3>
                <p><strong>Name:</strong> ${metadata.customer_name}</p>
                <p><strong>Email:</strong> ${metadata.customer_email}</p>
                <p><strong>Platform:</strong> ${metadata.platform}</p>
                <p><strong>Username:</strong> ${metadata.platform_username}</p>
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${metadata.order_id}</p>
                <p><strong>Plan:</strong> ${metadata.plan_name}</p>
                <p><strong>Amount:</strong> ${formatCurrency(orderData.gross_amount)}</p>
                <p><strong>Payment Type:</strong> ${orderData.payment_type}</p>
                <p><strong>Transaction Time:</strong> ${formatDate(orderData.transaction_time)}</p>
                <p><strong>Transaction ID:</strong> ${orderData.transaction_id}</p>
                <p><strong>Status:</strong> ${transactionStatus}</p>
            `
        });

        const platformLink = getPlatformLink(metadata.platform);

        // Email to customer
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: metadata.customer_email,
            subject: `Payment ${transactionStatus} - The Trader ID`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1a1a1a; margin: 0;">The Trader ID</h1>
                        <p style="color: #666; margin: 5px 0;">Payment Confirmation</p>
                    </div>

                    <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="font-size: 24px; color: #00b074; margin-bottom: 10px;">✅ Payment Successful</div>
                            <div style="font-size: 32px; font-weight: bold; color: #1a1a1a;">${formatCurrency(orderData.gross_amount)}</div>
                        </div>

                        <div style="margin-bottom: 30px;">
                            <p style="color: #1a1a1a; font-size: 16px; margin-bottom: 20px;">Dear <strong>${metadata.customer_name}</strong>,</p>
                            <p style="color: #444; line-height: 1.5;">Thank you for your purchase! Your payment has been successfully processed. Here are your order details:</p>
                        </div>

                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Order ID:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${metadata.order_id}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Plan:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${metadata.plan_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Payment Method:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${orderData.payment_type.toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Date:</td>
                                    <td style="padding: 8px 0; color: #1a1a1a; font-weight: bold;">${formatDate(orderData.transaction_time)}</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center; margin-bottom: 30px;">
                            <p style="color: #444; margin-bottom: 20px;">Click the button below to join our ${metadata.platform} community:</p>
                            <a href="${platformLink}" style="display: inline-block; background-color: #00b074; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join ${metadata.platform}</a>
                        </div>

                        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
                            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">Need help? Contact us at:</p>
                            <p style="color: #666; font-size: 14px; margin-top: 0;">${process.env.SMTP_USER}</p>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #666; font-size: 12px; margin: 5px 0;">The Trader ID</p>
                        <p style="color: #666; font-size: 12px; margin: 5px 0;">Copyright © ${new Date().getFullYear()}. All rights reserved.</p>
                    </div>
                </div>
            `
        });

        console.log('Email notifications sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function sendDiscordNotification(orderData: any, transactionStatus: string) {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            throw new Error('Discord webhook URL is not configured');
        }

        const { metadata } = orderData;

        // Set color based on status
        let color;
        switch (transactionStatus.toLowerCase()) {
            case 'settlement':
            case 'capture':
                color = 0x00FF00; // Green
                break;
            case 'pending':
                color = 0xFFA500; // Orange
                break;
            case 'deny':
            case 'cancel':
            case 'expire':
                color = 0xFF0000; // Red
                break;
            default:
                color = 0x808080; // Grey
        }

        // Get payment method details
        let paymentDetails = orderData.payment_type;
        if (orderData.va_numbers?.[0]) {
            paymentDetails += ` (VA: ${orderData.va_numbers[0].bank.toUpperCase()} - ${orderData.va_numbers[0].va_number})`;
        }

        const embed = {
            title: `🔔 New Payment ${transactionStatus}`,
            description: `**${metadata.plan_name}**\n${formatCurrency(orderData.gross_amount)}`,
            color: color,
            fields: [
                {
                    name: '👤 Customer Information',
                    value: `**Name:** ${metadata.customer_name}\n**Email:** ${metadata.customer_email}\n**Platform:** ${metadata.platform}\n**Username:** ${metadata.platform_username}`,
                    inline: false
                },
                {
                    name: '💳 Payment Details',
                    value: `**Method:** ${paymentDetails}\n**Order ID:** ${metadata.order_id}\n**Transaction ID:** ${orderData.transaction_id}`,
                    inline: false
                },
                {
                    name: '⏰ Timestamps',
                    value: `**Transaction:** ${formatDate(orderData.transaction_time)}\n${orderData.settlement_time ? `**Settlement:** ${formatDate(orderData.settlement_time)}` : ''}`,
                    inline: false
                }
            ],
            footer: {
                text: `Status: ${transactionStatus} | Fraud Status: ${orderData.fraud_status}`
            },
            timestamp: new Date().toISOString()
        };

        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] })
        });

        console.log('Discord notification sent successfully');
    } catch (error) {
        console.error('Error sending Discord notification:', error);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        console.log('Received webhook notification');
        
        const body = await req.json();
        console.log('Webhook payload:', JSON.stringify(body, null, 2));

        const { transaction_status } = body;

        // Only process successful payments
        if (transaction_status === 'settlement' || transaction_status === 'capture') {
            console.log('Processing successful payment:', body.order_id);

            // Send notifications in parallel
            await Promise.all([
                sendEmail(body, transaction_status),
                sendDiscordNotification(body, transaction_status)
            ]);

            return NextResponse.json({
                success: true,
                message: 'Webhook processed successfully'
            });
        }

        // For other statuses, just log and acknowledge
        console.log(`Payment status ${transaction_status} for order ${body.order_id}`);
        return NextResponse.json({
            success: true,
            message: 'Webhook acknowledged'
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
} 