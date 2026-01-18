"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('templateId');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/client/check-session');
        if (response.data.authenticated) {
          setAuthenticated(true);
          if (templateId) {
            loadTemplate();
          } else {
            setLoading(false);
          }
        } else {
          // Not authenticated, redirect to login
          router.push(`/login?redirect=${encodeURIComponent(`/checkout?templateId=${templateId || ''}`)}`);
        }
      } catch (error) {
        // Not authenticated
        router.push(`/login?redirect=${encodeURIComponent(`/checkout?templateId=${templateId || ''}`)}`);
      }
    };

    checkAuth();
  }, [templateId, router]);

  const loadTemplate = async () => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/catalog/templates/${templateId}`);
      setTemplate(response.data);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!templateId) {
      toast.error('Template ID is missing');
      return;
    }

    setProcessing(true);
    try {
      // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
      // For now, simulate payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const response = await axios.post('/api/orders', {
        templateId,
        clientData: {}, // TODO: Get from clientStore
      });

      toast.success('Payment successful!');
      router.push(`/orders/${response.data.orderId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {template ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{template.name}</p>
                        <p className="text-sm text-gray-600">Wedding Card Template</p>
                      </div>
                      <p className="font-bold text-lg">RM 99.00</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No template selected</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Pay securely with your card</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  {/* TODO: Add more payment methods */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Total & Checkout */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>RM 99.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>RM 0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>RM 99.00</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handlePayment}
              disabled={!template || processing}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12 text-lg"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Pay Now
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your payment is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
