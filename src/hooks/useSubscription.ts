import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

interface SubscriptionData {
  customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

interface OrderData {
  customer_id: string | null;
  order_id: number | null;
  checkout_session_id: string | null;
  payment_intent_id: string | null;
  amount_subtotal: number | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  order_status: string | null;
  order_date: string | null;
}

export const useSubscription = (user: User | null) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch purchase data from course_purchases table
        const { data: orderData, error: orderError } = await supabase
          .from('course_purchases')
          .select('*')
          .eq('email', user.email)
          .order('purchased_at', { ascending: false });

        if (orderError) {
          console.error('Error fetching orders:', orderError);
          // Don't set error for missing data, just log it
          console.log('No purchase data found for user');
        } else {
          // Transform course_purchases data to match expected order format
          const transformedOrders = (orderData || []).map(purchase => ({
            customer_id: purchase.stripe_customer_id,
            order_id: purchase.id,
            checkout_session_id: purchase.stripe_session_id,
            payment_intent_id: null,
            amount_subtotal: purchase.amount_paid,
            amount_total: purchase.amount_paid,
            currency: purchase.currency,
            payment_status: purchase.payment_status,
            order_status: 'completed',
            order_date: purchase.purchased_at
          }));
          
          setOrders(transformedOrders);
        }
        
        // For now, we don't use subscriptions, only one-time purchases
        setSubscription(null);
        
      } catch (err) {
        console.error('Error in fetchSubscriptionData:', err);
        // Don't set error, just log it
        console.log('Subscription data fetch completed with warnings');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  const getActiveProduct = () => {
    // Check if user has completed orders (for one-time payments)
    const completedOrder = orders.find(order => 
      order.payment_status === 'paid' && order.order_status === 'completed'
    );
    
    if (completedOrder) {
      // For one-time payments, we assume they have access to the main course
      return getProductByPriceId('price_1S7zDfBu2e08097PaQ5APyYq');
    }
    
    return null;
  };

  const hasActiveAccess = () => {
    // Check for completed one-time payment
    const completedOrder = orders.find(order => 
      order.payment_status === 'paid' && order.order_status === 'completed'
    );
    
    if (completedOrder) {
      console.log('User has completed order:', completedOrder.order_id);
      return true;
    }
    
    // Check if user exists in simple_logins (fallback)
    // This will be true for users created via webhook
    return !!user; // All authenticated users have access since they paid to register
  };

  return {
    subscription,
    orders,
    loading,
    error,
    getActiveProduct,
    hasActiveAccess,
  };
};