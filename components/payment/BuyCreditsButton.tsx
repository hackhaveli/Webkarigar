'use client';

import { useState, useEffect } from 'react';
import { Zap, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BuyCreditsButtonProps {
  userEmail: string;
  userName?: string;
}

export function BuyCreditsButton({ userEmail, userName }: BuyCreditsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState<{ label: string; isIntro: boolean } | null>(null);
  const router = useRouter();

  // Pre-fetch plan info to show correct price on button
  useEffect(() => {
    fetch('/api/payment/plan-info')
      .then(r => r.json())
      .then(d => setPlanInfo({ label: d.label || '₹99', isIntro: d.isIntroOffer }))
      .catch(() => setPlanInfo({ label: '₹99', isIntro: false }));
  }, []);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script if not already loaded
      await loadRazorpayScript();

      // Create order on server
      const orderRes = await fetch('/api/payment/create-order', { method: 'POST' });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || 'Failed to create order');
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'WebKarigar',
        description: `Pro Monthly — ${orderData.plan.credits} Credits`,
        order_id: orderData.orderId,
        prefill: {
          email: userEmail,
          name: userName || '',
        },
        theme: {
          color: '#6366f1',
          backdrop_color: 'rgba(0,0,0,0.8)',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify on server
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            // Always parse response safely
            let verifyData: any = {};
            const text = await verifyRes.text();
            try {
              verifyData = JSON.parse(text);
            } catch {
              console.error('Failed to parse verify response:', text);
            }

            if (verifyData.success) {
              const expiryStr = verifyData.expiresAt
                ? new Date(verifyData.expiresAt).toLocaleDateString('en-IN')
                : '30 days';
              toast.success(`🎉 ${verifyData.credits ?? 2000} credits added! Pro plan active for ${expiryStr}`);
              // Use window.location.href instead of router.push to force a hard page reload.
              // This guarantees the global dashboard layout fetches the new credit balance from the database.
              window.location.href = '/dashboard/pricing/success';
            } else {
              toast.error(verifyData.error || 'Payment verification failed. Please contact support.');
              setLoading(false);
            }
          } catch (err) {
            console.error('Verify handler error:', err);
            toast.error('Payment received but verification timed out. Please refresh — your credits should appear.');
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {planInfo?.isIntro && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
          <Tag className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-xs text-amber-300 font-semibold">🎁 First-time offer — Get 2,000 credits for just ₹1!</span>
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-sm hover:opacity-90 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:scale-100 shadow-lg shadow-primary/30"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : (
          <><Zap className="w-4 h-4" fill="currentColor" /> Get 2,000 Credits — {planInfo?.label ?? '...'}</>
        )}
      </button>
    </div>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}
