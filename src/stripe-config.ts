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
    priceId: 'price_1S4mL9Bu2e08097PVWyceE43',
    name: 'Paid Main Course offer',
    description: 'Komplett KongMindset-kurs med livstidsåtkomst till alla 13 moduler, Napoleon Hill AI-mentor och gratis originalbok. Transformera ditt tankesätt och lär dig Napoleon Hills beprövade framgångsprinciper.',
    mode: 'payment',
    price: 299,
    currency: 'SEK'
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};