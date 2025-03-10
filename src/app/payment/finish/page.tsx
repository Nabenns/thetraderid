'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentStatus() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('pending');
    const [message, setMessage] = useState('Verifying payment status...');

    useEffect(() => {
        const transaction_status = searchParams.get('transaction_status');
        const status_code = searchParams.get('status_code');

        // Close Midtrans popup if it exists
        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage('CLOSE_POPUP', '*');
        }

        if (status_code === '200' && (transaction_status === 'settlement' || transaction_status === 'capture')) {
            setStatus('success');
            setMessage('Payment successful! Thank you for your purchase.');
        } else if (transaction_status === 'pending') {
            setStatus('pending');
            setMessage('Payment is pending. Please complete your payment.');
        } else {
            setStatus('error');
            setMessage('Payment failed or was cancelled.');
        }
    }, [searchParams]);

    const statusConfig = {
        success: {
            icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
            title: 'Payment Successful',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700'
        },
        pending: {
            icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
            title: 'Payment Pending',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-700'
        },
        error: {
            icon: <XCircle className="w-16 h-16 text-red-500" />,
            title: 'Payment Failed',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-700'
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className={`max-w-md w-full ${config.bgColor} border ${config.borderColor} rounded-lg p-8 text-center`}>
                <div className="flex justify-center mb-4">
                    {config.icon}
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${config.textColor}`}>
                    {config.title}
                </h2>
                <p className="text-gray-600 mb-8">{message}</p>
                <Link
                    href="/"
                    className="inline-block bg-white border border-gray-300 rounded-md px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}

export default function PaymentFinishPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <PaymentStatus />
        </Suspense>
    );
} 