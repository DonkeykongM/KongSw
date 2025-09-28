import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

interface PurchaseRecord {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_session_id: string | null;
  amount_paid: number | null;
  currency: string | null;
  payment_status: string | null;
  purchased_at: string | null;
}

export const useSubscription = (user: User | null) => {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPurchases([]);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      // Demo mode - assume user has access
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch purchase data from secure purchase_records table
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('purchase_records')
          .select('*')
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false });

        if (purchaseError) {
          console.error('Error fetching purchases:', purchaseError);
          setError('Kunde inte ladda köphistorik');
        } else {
          setPurchases(purchaseData || []);
        }
        
      } catch (err) {
        console.error('Error in fetchPurchases:', err);
        setError('Tekniskt fel vid laddning av data');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  const getActiveProduct = () => {
    // Check if user has completed purchases
    const completedPurchase = purchases.find(purchase => 
      purchase.payment_status === 'completed'
    );
    
    if (completedPurchase) {
      // Return the main course product
      return getProductByPriceId('price_1S7zDfBu2e08097PaQ5APyYq');
    }
    
    return null;
  };

  const hasActiveAccess = () => {
    // In demo mode, all authenticated users have access
    if (!isSupabaseConfigured) {
      return !!user;
    }

    // Check for completed purchase
    const completedPurchase = purchases.find(purchase => 
      purchase.payment_status === 'completed'
    );
    
    if (completedPurchase) {
      console.log('User has completed purchase:', completedPurchase.id);
      return true;
    }
    
    // All authenticated users have access since they paid to register
    return !!user;
  };

  return {
    purchases,
    loading,
    error,
    getActiveProduct,
    hasActiveAccess,
  };
};