<?php
// Load environment variables from .env file
function loadEnv() {
    $envFile = __DIR__ . '/.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
            }
        }
    }
}

loadEnv();

// Set headers
header('Content-Type: application/json');

// Get the API path from URL
$path = $_GET['path'] ?? '';

// Handle different API routes
switch ($path) {
    case 'payment':
        handlePayment();
        break;
    case 'webhook':
        handleWebhook();
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
        break;
}

function handlePayment() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    // Get request body
    $body = json_decode(file_get_contents('php://input'), true);
    
    // Validate request
    if (!isset($body['plan']) || !isset($body['customerDetails'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request data']);
        return;
    }

    try {
        // Initialize Midtrans
        require_once 'vendor/autoload.php';

        $snap = new Midtrans\Snap([
            'isProduction' => $_ENV['NEXT_PUBLIC_MIDTRANS_ENVIRONMENT'] === 'production',
            'serverKey' => $_ENV['MIDTRANS_SERVER_KEY'],
            'clientKey' => $_ENV['NEXT_PUBLIC_MIDTRANS_CLIENT_KEY']
        ]);

        // Generate order ID
        $timestamp = substr(time(), -6);
        $shortUuid = substr(uniqid(), -4);
        $orderId = "TID{$timestamp}{$shortUuid}";

        // Prepare transaction data
        $transactionData = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int)$body['plan']['price']
            ],
            'customer_details' => [
                'first_name' => $body['customerDetails']['name'],
                'email' => $body['customerDetails']['email'],
                'phone' => $body['customerDetails']['phone'] ?? '-'
            ],
            'callbacks' => [
                'finish' => $_ENV['NEXT_PUBLIC_BASE_URL'] . '/payment/finish',
                'error' => $_ENV['NEXT_PUBLIC_BASE_URL'] . '/payment/error',
                'pending' => $_ENV['NEXT_PUBLIC_BASE_URL'] . '/payment/pending'
            ],
            'metadata' => [
                'order_id' => $orderId,
                'plan_name' => $body['plan']['name'],
                'customer_name' => $body['customerDetails']['name'],
                'customer_email' => $body['customerDetails']['email'],
                'platform' => $body['customerDetails']['platform'],
                'platform_username' => $body['customerDetails']['platformUsername']
            ]
        ];

        // Create Midtrans transaction
        $snapToken = $snap->createTransaction($transactionData);

        echo json_encode([
            'success' => true,
            'token' => $snapToken->token,
            'orderId' => $orderId,
            'orderData' => [
                'plan' => $body['plan'],
                'customerDetails' => $body['customerDetails']
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function handleWebhook() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    try {
        $body = json_decode(file_get_contents('php://input'), true);
        $transaction_status = $body['transaction_status'] ?? '';

        if ($transaction_status === 'settlement' || $transaction_status === 'capture') {
            // Send email
            $metadata = $body['metadata'] ?? [];
            sendEmail($body, $transaction_status);
            sendDiscordNotification($body, $transaction_status);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Webhook processed successfully'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function sendEmail($orderData, $transactionStatus) {
    $metadata = $orderData['metadata'] ?? [];
    
    // Admin email
    $adminHtml = "
        <h2>New Payment {$transactionStatus}</h2>
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> {$metadata['customer_name']}</p>
        <p><strong>Email:</strong> {$metadata['customer_email']}</p>
        <p><strong>Platform:</strong> {$metadata['platform']}</p>
        <p><strong>Username:</strong> {$metadata['platform_username']}</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> {$metadata['order_id']}</p>
        <p><strong>Plan:</strong> {$metadata['plan_name']}</p>
        <p><strong>Amount:</strong> Rp " . number_format($orderData['gross_amount']) . "</p>
        <p><strong>Payment Type:</strong> {$orderData['payment_type']}</p>
        <p><strong>Transaction Time:</strong> {$orderData['transaction_time']}</p>
        <p><strong>Transaction ID:</strong> {$orderData['transaction_id']}</p>
        <p><strong>Status:</strong> {$transactionStatus}</p>
    ";

    // Customer email
    $customerHtml = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;'>
            <div style='text-align: center; margin-bottom: 30px;'>
                <h1 style='color: #1a1a1a; margin: 0;'>The Trader ID</h1>
                <p style='color: #666; margin: 5px 0;'>Payment Confirmation</p>
            </div>

            <div style='background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                <div style='text-align: center; margin-bottom: 30px;'>
                    <div style='font-size: 24px; color: #00b074; margin-bottom: 10px;'>✅ Payment Successful</div>
                    <div style='font-size: 32px; font-weight: bold; color: #1a1a1a;'>Rp " . number_format($orderData['gross_amount']) . "</div>
                </div>

                <div style='margin-bottom: 30px;'>
                    <p style='color: #1a1a1a; font-size: 16px; margin-bottom: 20px;'>Dear <strong>{$metadata['customer_name']}</strong>,</p>
                    <p style='color: #444; line-height: 1.5;'>Thank you for your purchase! Your payment has been successfully processed.</p>
                </div>

                <div style='background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;'>
                    <table style='width: 100%; border-collapse: collapse;'>
                        <tr>
                            <td style='padding: 8px 0; color: #666;'>Order ID:</td>
                            <td style='padding: 8px 0; color: #1a1a1a; font-weight: bold;'>{$metadata['order_id']}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px 0; color: #666;'>Plan:</td>
                            <td style='padding: 8px 0; color: #1a1a1a; font-weight: bold;'>{$metadata['plan_name']}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px 0; color: #666;'>Platform:</td>
                            <td style='padding: 8px 0; color: #1a1a1a; font-weight: bold;'>{$metadata['platform']}</td>
                        </tr>
                        <tr>
                            <td style='padding: 8px 0; color: #666;'>Username:</td>
                            <td style='padding: 8px 0; color: #1a1a1a; font-weight: bold;'>{$metadata['platform_username']}</td>
                        </tr>
                    </table>
                </div>

                <div style='text-align: center; margin-bottom: 30px;'>
                    <p style='color: #444; margin-bottom: 20px;'>Click the button below to join our {$metadata['platform']} community:</p>
                    <a href='" . getPlatformLink($metadata['platform']) . "' style='display: inline-block; background-color: #00b074; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Join {$metadata['platform']}</a>
                </div>
            </div>

            <div style='text-align: center; margin-top: 30px;'>
                <p style='color: #666; font-size: 12px; margin: 5px 0;'>The Trader ID</p>
                <p style='color: #666; font-size: 12px; margin: 5px 0;'>Copyright © " . date('Y') . ". All rights reserved.</p>
            </div>
        </div>
    ";

    // Send emails using PHP mail function
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$_ENV['SMTP_USER']}\r\n";

    // Send to admin
    mail(
        $_ENV['SMTP_USER'],
        "[Admin] New Payment {$transactionStatus} - Order {$metadata['order_id']}",
        $adminHtml,
        $headers
    );

    // Send to customer
    mail(
        $metadata['customer_email'],
        "Payment {$transactionStatus} - The Trader ID",
        $customerHtml,
        $headers
    );
}

function sendDiscordNotification($orderData, $transactionStatus) {
    $metadata = $orderData['metadata'] ?? [];
    $webhookUrl = $_ENV['DISCORD_WEBHOOK_URL'];

    if (!$webhookUrl) {
        throw new Exception('Discord webhook URL is not configured');
    }

    // Set color based on status
    $color = match($transactionStatus) {
        'settlement', 'capture' => 0x00FF00,
        'pending' => 0xFFA500,
        'deny', 'cancel', 'expire' => 0xFF0000,
        default => 0x808080
    };

    // Get payment method details
    $paymentDetails = $orderData['payment_type'];
    if (isset($orderData['va_numbers'][0])) {
        $paymentDetails .= " (VA: {$orderData['va_numbers'][0]['bank']} - {$orderData['va_numbers'][0]['va_number']})";
    }

    $embed = [
        'title' => "🔔 New Payment {$transactionStatus}",
        'description' => "**{$metadata['plan_name']}**\nRp " . number_format($orderData['gross_amount']),
        'color' => $color,
        'fields' => [
            [
                'name' => '👤 Customer Information',
                'value' => "**Name:** {$metadata['customer_name']}\n**Email:** {$metadata['customer_email']}\n**Platform:** {$metadata['platform']}\n**Username:** {$metadata['platform_username']}",
                'inline' => false
            ],
            [
                'name' => '💳 Payment Details',
                'value' => "**Method:** {$paymentDetails}\n**Order ID:** {$metadata['order_id']}\n**Transaction ID:** {$orderData['transaction_id']}",
                'inline' => false
            ],
            [
                'name' => '⏰ Timestamps',
                'value' => "**Transaction:** {$orderData['transaction_time']}" . 
                    (isset($orderData['settlement_time']) ? "\n**Settlement:** {$orderData['settlement_time']}" : ''),
                'inline' => false
            ]
        ],
        'footer' => [
            'text' => "Status: {$transactionStatus} | Fraud Status: {$orderData['fraud_status']}"
        ],
        'timestamp' => date('c')
    ];

    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['embeds' => [$embed]]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}

function getPlatformLink($platform) {
    return match(strtolower($platform)) {
        'discord' => 'https://discord.gg/pFAnhSGvXr',
        'telegram' => 'https://t.me/+hIPGExXU2Bg2ZjY1',
        default => ''
    };
} 