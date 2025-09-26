/*
  # Sample Course Data

  1. Sample Courses
    - Insert sample course data for testing
    - Napoleon Hill Success Course with Stripe price ID

  2. Notes
    - Update the stripe_price_id with your actual Stripe price ID
    - This is sample data for development/testing
*/

-- Insert sample course
INSERT INTO courses (
  id,
  title,
  description,
  price,
  stripe_price_id
) VALUES (
  gen_random_uuid(),
  'Napoleon Hill Success Principles',
  'Master the 13 proven principles for building wealth and success from Think and Grow Rich. This comprehensive course includes interactive lessons, practical exercises, and lifetime access to transform your mindset and achieve your goals.',
  9700, -- $97.00 in cents
  'price_1234567890' -- Replace with your actual Stripe price ID
) ON CONFLICT (stripe_price_id) DO NOTHING;

-- Note: Replace 'price_1234567890' with your actual Stripe price ID from your Stripe Dashboard
-- You can find this under Products > [Your Product] > Pricing