'use client';

import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

// Dynamically import Three.js components with no SSR
const ThreeScene = dynamic(() => import('@/components/ThreeScene'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
    ),
});

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

interface Plan {
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    featured?: boolean;
    savings?: string;
    badge?: string;
}

interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
    platform: string;
    platformUsername: string;
}

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    platform: 'telegram',
    platformUsername: ''
  });

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDetailsForm(false);
    setShowPaymentModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ThreeScene />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        </div>
        
        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium">
              Next-Generation Trading Platform
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
          >
            TheTraderID
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Experience the future of trading with our AI-powered platform. Make smarter decisions with real-time analytics and automated strategies.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20">
              Get Started
            </button>
            <button className="border border-indigo-600 text-indigo-400 hover:bg-indigo-600/10 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#0A0F1C]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Fitur Unggulan</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="relative group bg-gradient-to-br from-gray-900/80 to-gray-800/50 p-8 rounded-2xl backdrop-blur-xl border border-gray-800/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/40 transition-all duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.content}</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-[#0A0F1C]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Pilih Paket Anda
            </h2>
            <p className="mt-4 text-gray-400">
              Investasi terbaik adalah investasi pada diri sendiri
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mt-6"></div>
          </motion.div>
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-sm ${
                  plan.featured 
                    ? 'bg-gradient-to-br from-blue-600/90 to-indigo-600/90 border-2 border-blue-400/50'
                    : 'bg-gray-900/90 border border-gray-700/50'
                } p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl ${
                  plan.featured ? 'hover:shadow-blue-500/20' : 'hover:shadow-indigo-500/10'
                }`}
              >
                {plan.featured && plan.savings && (
                  <div className="absolute -top-4 -right-12 rotate-45 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-12 py-1 text-sm font-medium shadow-lg">
                    Hemat {plan.savings}
                  </div>
                )}
                <div className="space-y-6">
                  <h3 className={`text-2xl font-bold ${plan.featured ? 'text-white' : 'text-gray-100'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-x-2">
                    <span className={`text-5xl font-extrabold tracking-tight ${plan.featured ? 'text-white' : 'text-gray-100'}`}>
                      Rp {parseInt(plan.price).toLocaleString('id-ID')}
                    </span>
                    <span className={`text-sm font-medium ${plan.featured ? 'text-blue-200' : 'text-gray-400'}`}>
                      / {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.featured ? 'text-blue-100' : 'text-gray-400'}`}>
                    {plan.description}
                  </p>
                  <div className={`h-px w-full ${plan.featured ? 'bg-blue-400/30' : 'bg-gray-800'}`} />
                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-x-3">
                        <svg 
                          className={`w-5 h-5 flex-shrink-0 ${plan.featured ? 'text-blue-200' : 'text-blue-500'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className={`text-sm ${plan.featured ? 'text-blue-100' : 'text-gray-400'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      plan.featured
                        ? 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:shadow-white/10'
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    Pilih Paket
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Dialog open={showDetailsForm} onOpenChange={setShowDetailsForm}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">Informasi Pelanggan</DialogTitle>
              <DialogDescription className="text-gray-400">
                Mohon lengkapi informasi berikut untuk melanjutkan pembayaran
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name" className="text-gray-200">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone" className="text-gray-200">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label className="text-gray-200">Platform</Label>
                <RadioGroup
                  value={customerDetails.platform}
                  onValueChange={(value) => setCustomerDetails(prev => ({ ...prev, platform: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="telegram" id="telegram" className="border-gray-600" />
                    <Label htmlFor="telegram" className="text-gray-200">Telegram</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="discord" id="discord" className="border-gray-600" />
                    <Label htmlFor="discord" className="text-gray-200">Discord</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="platformUsername" className="text-gray-200">
                  {customerDetails.platform === 'telegram' ? 'Username Telegram' : 'Username Discord'}
                </Label>
                <Input
                  id="platformUsername"
                  value={customerDetails.platformUsername}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, platformUsername: e.target.value }))}
                  placeholder={customerDetails.platform === 'telegram' ? '@username' : 'username#0000'}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                  Lanjutkan ke Pembayaran
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {selectedPlan && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            plan={selectedPlan}
            customerDetails={customerDetails}
          />
        )}
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-[#0A0F1C]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">FAQ (Frequently Asked Questions)</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"></div>
          </motion.div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0B1222] p-6 rounded-2xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      Q
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-4">{faq.question}</h3>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-tr from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          A
                        </div>
                      </div>
                      <p className="flex-1 text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0F1C] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">The Trader</h3>
              <p className="text-gray-400 leading-relaxed">
                Komunitas trading terpercaya dengan layanan signal dan edukasi trading profesional. Bergabung bersama kami dan raih kesuksesan financial Anda.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <a href="https://t.me/thetraderid" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.745-3.734 15.714-3.734 15.714s-.239.577-.904.577c-.316 0-.605-.129-.85-.374l-4.198-3.426-2.364 1.481s-.405.257-.905.257c-.578 0-.819-.397-.819-.397l-1.891-6.145s-.168-.446.168-.819c.335-.373 6.417-5.744 6.417-5.744s.167-.169.669-.169c.223 0 .446.065.669.169.223.103 14.951 5.373 14.951 5.373s.892.374.669 1.503z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/thetrader_id" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@TheTrader_id" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Fitur Unggulan</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pilihan Paket</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@thetrader.id</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Jakarta, Indonesia</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+62 812-3456-7890</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} The Trader. All rights reserved.
              <span className="block md:inline md:ml-2">Developed with ❤️ by The Trader Team</span>
            </p>
          </div>
        </div>
      </footer>

      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          customerDetails={customerDetails}
        />
      )}
    </main>
  );
}

const features = [
  {
    title: "24/7 News Update",
    description: "Dapatkan berita terupdate mengenai Berita Ekonomi dan Global Event",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
      </svg>
    ),
  },
  {
    title: "Trading Signal With High Winrate Probability",
    description: "The Trader memberikan sinyal trading dengan probabilitas dan manajemen risiko yang baik di setiap tradenya",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Community Discussion",
    description: "Memberikan wadah diskusi antar member dan tim The Trader",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    title: "Educational Webinar",
    description: "Edukasi Webinar setiap minggu dilakukan via Zoom",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "John Doe",
    role: "Professional Trader",
    content: "TheTraderID has revolutionized my trading experience. The real-time analytics and AI-powered signals have helped me make better decisions.",
  },
  {
    name: "Jane Smith",
    role: "Investment Manager",
    content: "As an investment manager, I appreciate the platform's security and reliability. It's become an essential tool in my daily operations.",
  },
  {
    name: "Mike Johnson",
    role: "Day Trader",
    content: "The automated trading strategies have saved me countless hours. The platform's performance is exceptional.",
  },
];

const pricingPlans: Plan[] = [
  {
    name: "Essential Bundle",
    description: "Perfect for beginners who want to start their trading journey",
    price: "350000",
    period: "1 Bulan",
    features: [
      "Akses ke Grup VIP",
      "Daily Market Updates",
      "Basic Trading Education",
      "Trading Signals"
    ]
  },
  {
    name: "The Trader Bundle",
    description: "Most popular choice for serious traders",
    price: "750000",
    period: "3 Bulan",
    featured: true,
    savings: "300.000",
    features: [
      "Semua fitur Essential Bundle",
      "Premium Trading Signals",
      "Advanced Trading Strategies",
      "Weekly Market Analysis",
      "Priority Support"
    ]
  },
  {
    name: "Ultimate Bundle",
    description: "For committed traders who want lifetime access",
    price: "7500000",
    period: "Lifetime",
    features: [
      "Akses Selamanya",
      "Semua fitur The Trader Bundle",
      "One-on-One Mentoring",
      "Exclusive Webinars",
      "Custom Trading Plans",
      "24/7 VIP Support"
    ]
  }
];

const faqs = [
  {
    question: "Apa yang dimaksud dengan komunitas trading yang ditawarkan?",
    answer: "Komunitas trading kami adalah tempat di mana para trader, baik pemula maupun profesional, dapat berdiskusi, berbagi strategi, serta mendapatkan wawasan terbaru mengenai forex, crypto, dan saham. Kami juga menyelenggarakan webinar, diskusi online, dan analisis pasar bersama.",
  },
  {
    question: "Layanan apa saja yang tersedia di platform ini?",
    answer: "Kami menyediakan informasi terkini mengenai pasar forex, crypto, dan saham, analisis teknikal dan fundamental, sinyal trading, serta materi edukasi trading. Anda juga dapat mengikuti kelas, webinar, dan grup diskusi untuk meningkatkan kemampuan trading Anda.",
  },
  {
    question: "Apakah saya bisa mendapatkan sinyal trading melalui platform ini?",
    answer: "Ya, kami menyediakan sinyal trading berkualitas yang dapat membantu Anda dalam mengambil keputusan trading di pasar forex, crypto, dan saham. Sinyal ini dibuat berdasarkan analisis teknikal dari para ahli.",
  },
  {
    question: "Bagaimana cara bergabung dengan komunitas trading?",
    answer: "Anda dapat bergabung dengan komunitas kami melalui pendaftaran di website. Setelah mendaftar, Anda akan memiliki akses ke berbagai fitur komunitas seperti forum diskusi, webinar, dan grup belajar.",
  },
  {
    question: "Apakah informasi yang disediakan di platform ini bisa diandalkan?",
    answer: "Kami berkomitmen untuk memberikan informasi yang akurat dan terbaru, namun karena sifat pasar yang selalu berubah, semua keputusan trading tetap merupakan tanggung jawab pribadi. Kami selalu menyarankan pengguna untuk melakukan riset tambahan sebelum membuat keputusan investasi.",
  },
  {
    question: "Bagaimana cara mengikuti webinar atau kelas yang tersedia?",
    answer: "Anda dapat melihat jadwal webinar dan kelas melalui halaman acara di website kami. Pendaftaran untuk setiap acara bisa dilakukan langsung dari halaman tersebut.",
  },
  {
    question: "Apakah layanan ini berbayar?",
    answer: "Kami menawarkan beberapa paket layanan yang dapat disesuaikan dengan kebutuhan Anda, mulai dari akses dasar hingga keanggotaan premium yang mencakup sinyal trading, kelas eksklusif, dan analisis pasar mendalam.",
  },
];
