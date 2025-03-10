'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentPendingPage() {
    useEffect(() => {
        // Close Midtrans popup if it exists
        if (typeof window !== 'undefined' && window.snap) {
            window.snap.hide();
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <AlertCircle className="h-12 w-12 text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold mb-4 text-yellow-500">
                    Pembayaran Pending
                </h1>
                <p className="text-yellow-400 mb-6">
                    Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi selanjutnya.
                </p>
                <Link href="/">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500">
                        Kembali ke Beranda
                    </Button>
                </Link>
            </div>
        </div>
    );
} 