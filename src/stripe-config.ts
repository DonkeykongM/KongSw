export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_R5drGXUdEEyZmu',
    priceId: 'price_1S4mL9Bu2e08097PVWyceE44',
    name: 'Paid Main Course offer',
    description: 'Komplett tillgång till Napoleon Hills Tänk och Bli Rik kurs med 13 interaktiva moduler, Napoleon Hill AI-mentor och gratis originalbok nedladdning.',
    mode: 'payment',
    price: 299.00,
    currency: 'sek'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};