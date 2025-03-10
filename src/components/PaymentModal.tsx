'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess: (result: any) => void;
                onPending: (result: any) => void;
                onError: (result: any) => void;
                onClose: () => void;
            }) => void;
            hide: () => void;
        };
    }
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: {
        name: string;
        price: string;
        features: string[];
    };
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        platform: string;
        platformUsername: string;
    };
}

type Platform = 'telegram' | 'discord';
type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

export default function PaymentModal({ isOpen, onClose, plan, customerDetails }: PaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSnapReady, setIsSnapReady] = useState(false);

    useEffect(() => {
        const checkSnapAvailability = () => {
            if (window.snap) {
                setIsSnapReady(true);
            }
        };

        // Check immediately
        checkSnapAvailability();

        // Also check after a delay to ensure script has loaded
        const timer = setTimeout(checkSnapAvailability, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async () => {
        if (!isSnapReady) {
            setPaymentStatus('failed');
            setStatusMessage('Sistem pembayaran belum siap. Mohon tunggu sebentar atau muat ulang halaman.');
            return;
        }

        try {
            setIsLoading(true);
            setPaymentStatus('pending');
            setStatusMessage('Memproses pembayaran Anda...');

            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    plan: {
                        ...plan,
                        price: plan.price.toString()
                    },
                    customerDetails: {
                        ...customerDetails,
                        phone: customerDetails.phone || '-'
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Payment API Error:', errorText);
                throw new Error('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
            }

            const data = await response.json();

            if (!data.token) {
                throw new Error('Token pembayaran tidak ditemukan');
            }

            // Close the form dialog before showing Midtrans popup
            onClose();

            window.snap.pay(data.token, {
                onSuccess: function(result) {
                    console.log('Payment success:', result);
                    setPaymentStatus('success');
                    setStatusMessage('Pembayaran berhasil! Anda akan menerima email konfirmasi segera.');
                    setIsLoading(false);
                },
                onPending: function(result) {
                    console.log('Payment pending:', result);
                    setPaymentStatus('pending');
                    setStatusMessage('Menunggu pembayaran Anda...');
                    setIsLoading(false);
                },
                onError: function(result) {
                    console.error('Payment error:', result);
                    setPaymentStatus('failed');
                    setStatusMessage('Pembayaran gagal. Silakan coba lagi.');
                    setIsLoading(false);
                },
                onClose: function() {
                    // Only reset if payment is not completed
                    if (paymentStatus !== 'success') {
                        setPaymentStatus('idle');
                        setStatusMessage('');
                    }
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
            setStatusMessage(error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    const renderStatusAlert = () => {
        if (paymentStatus === 'idle') return null;

        const alertProps = {
            success: {
                icon: <CheckCircle2 className="h-4 w-4" />,
                title: 'Pembayaran Berhasil',
                className: 'bg-green-500/20 border-green-500/30',
                titleClass: 'text-green-400',
                descClass: 'text-green-300'
            },
            pending: {
                icon: <AlertCircle className="h-4 w-4" />,
                title: 'Memproses Pembayaran',
                className: 'bg-yellow-500/20 border-yellow-500/30',
                titleClass: 'text-yellow-400',
                descClass: 'text-yellow-300'
            },
            failed: {
                icon: <XCircle className="h-4 w-4" />,
                title: 'Pembayaran Gagal',
                className: 'bg-red-500/20 border-red-500/30',
                titleClass: 'text-red-400',
                descClass: 'text-red-300'
            }
        }[paymentStatus];

        return (
            <Alert className={`mt-4 ${alertProps.className}`}>
                <div className="flex items-center gap-2">
                    {alertProps.icon}
                    <AlertTitle className={alertProps.titleClass}>{alertProps.title}</AlertTitle>
                </div>
                <AlertDescription className={`mt-2 ${alertProps.descClass}`}>
                    {statusMessage}
                </AlertDescription>
            </Alert>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">Konfirmasi Pembayaran</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Silakan periksa detail pesanan Anda sebelum melanjutkan ke pembayaran.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-white">Detail Pesanan</h4>
                        <div className="text-sm text-gray-300">
                            <p>Paket: {plan.name}</p>
                            <p>Harga: Rp {parseInt(plan.price).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-white">Informasi Pelanggan</h4>
                        <div className="text-sm text-gray-300">
                            <p>Nama: {customerDetails.name}</p>
                            <p>Email: {customerDetails.email}</p>
                            <p>Platform: {customerDetails.platform}</p>
                            <p>Username: {customerDetails.platformUsername}</p>
                        </div>
                    </div>
                    {renderStatusAlert()}
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isLoading || paymentStatus === 'success' || !isSnapReady}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white disabled:bg-blue-800"
                    >
                        {isLoading ? 'Memproses...' : 
                         !isSnapReady ? 'Memuat sistem pembayaran...' :
                         `Bayar - Rp ${parseInt(plan.price).toLocaleString('id-ID')}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 