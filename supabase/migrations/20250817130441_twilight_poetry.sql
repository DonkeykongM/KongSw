/*
  # Fix Stripe Integration Tables

  This migration ensures all Stripe tables exist with proper structure and constraints.

  1. New Tables (if not exists)
    - `stripe_customers`: Links Supabase users to Stripe customers
    - `stripe_orders`: Stores order/purchase information

  2. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users to view their own data
*/

-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

-- Enable RLS on stripe_customers
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Create policy for stripe_customers if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stripe_customers' AND policyname = 'Users can view their own customer data'
  ) THEN
    CREATE POLICY "Users can view their own customer data"
      ON stripe_customers
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() AND deleted_at IS NULL);
  END IF;
END $$;

-- Create order status enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_order_status') THEN
    CREATE TYPE stripe_order_status AS ENUM (
      'pending',
      'completed',
      'canceled'
    );
  END IF;
END $$;

-- Create stripe_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint primary key generated always as identity,
  checkout_session_id text not null,
  payment_intent_id text not null,
  customer_id text not null,
  amount_subtotal bigint not null,
  amount_total bigint not null,
  currency text not null,
  payment_status text not null,
  status stripe_order_status not null default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

-- Enable RLS on stripe_orders
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create policy for stripe_orders if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stripe_orders' AND policyname = 'Users can view their own order data'
  ) THEN
    CREATE POLICY "Users can view their own order data"
      ON stripe_orders
      FOR SELECT
      TO authenticated
      USING (
        customer_id IN (
          SELECT customer_id
          FROM stripe_customers
          WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
      );
  END IF;
END $$;

-- Create or replace view for user orders
CREATE OR REPLACE VIEW stripe_user_orders WITH (security_invoker) AS
SELECT
  c.customer_id,
  o.id as order_id,
  o.checkout_session_id,
  o.payment_intent_id,
  o.amount_subtotal,
  o.amount_total,
  o.currency,
  o.payment_status,
  o.status as order_status,
  o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;

-- Grant permissions
GRANT SELECT ON stripe_user_orders TO authenticated;