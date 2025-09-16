export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  features?: string[];
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_R5drGXUdEEyZmu',
    priceId: 'price_1S4mL9Bu2e08097PVWyceE43',
    name: 'Paid Main Course offer',
    description: 'Komplett KongMindset-kurs med livstidsåtkomst till alla 13 interaktiva moduler baserade på Napoleon Hills "Tänk och Bli Rik". Inkluderar personlig AI-mentor tillgänglig 24/7 och gratis nedladdning av originalboken. Transformera ditt tankesätt och bemästra de 13 framgångsprinciperna som har skapat fler miljonärer än något annat system i historien.',
    mode: 'payment',
    price: 299,
    currency: 'SEK',
    features: [
      '13 interaktiva moduler (12 veckors program)',
      'Napoleon Hill AI-mentor 24/7',
      'Gratis originalbok "Tänk och Bli Rik"',
      'Livstidsåtkomst till allt innehåll',
      'Reflektionsövningar och kunskapsquiz',
      'Progressspårning och certifiering',
      '30 dagars pengarna-tillbaka-garanti'
    ]
  }
];

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};