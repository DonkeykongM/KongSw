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

        // Fetch subscription data
        const { data: subData, error: subError } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (subError) {
          console.error('Error fetching subscription:', subError);
          setError('Failed to load subscription data');
        } else {
          setSubscription(subData);
        }

        // Fetch order data
        const { data: orderData, error: orderError } = await supabase
          .from('stripe_user_orders')
          .select('*')
          .order('order_date', { ascending: false });

        if (orderError) {
          console.error('Error fetching orders:', orderError);
          setError('Failed to load order data');
        } else {
          setOrders(orderData || []);
        }
      } catch (err) {
        console.error('Error in fetchSubscriptionData:', err);
        setError('An unexpected error occurred');
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
      // For one-time payments, return the main course product
      const mainCourseProduct = getProductByPriceId('price_1S4mL9Bu2e08097PVWyceE43');
      if (mainCourseProduct) {
        return mainCourseProduct;
      }
    }
    
    // Check for active subscription (fallback)
    if (subscription?.price_id) {
      return getProductByPriceId(subscription.price_id);
    }
    
    return null;
  };

  const hasActiveAccess = () => {
    // Check for completed one-time payment
    const completedOrder = orders.find(order => 
      order.payment_status === 'paid' && order.order_status === 'completed'
    );
    
    if (completedOrder) {
      return true;
    }
    
    // Check for active subscription (fallback)
    if (subscription?.subscription_status === 'active') {
      return true;
    }
    
    return false;
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