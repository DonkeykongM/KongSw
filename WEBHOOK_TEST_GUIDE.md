# Test Guide för Automatisk Användarskap

## ✅ Webhook är nu fixad för nya användare!

### Vad som fixades:
1. **Stripe Checkout** - Skickar nu korrekt metadata (email, password, namn)
2. **Stripe Webhook** - Skapar automatiskt:
   - Auth user i Supabase
   - Stripe customer record  
   - User profile (via trigger)
   - Order record

### Så här testar du:

#### Test 1: Ny användare
1. **Gå till landingpage**
2. **Klicka "Skaffa tillgång"**
3. **Fyll i:**
   - Email: `test@example.com`
   - Password: `Test123!`
4. **Klicka "Köp fullständig tillgång"**
5. **Använd Stripe test cards:**
   - Card: `4242 4242 4242 4242`
   - Date: `12/34`
   - CVC: `123`
6. **Slutför betalning**

**Resultat ska vara:**
- ✅ Användare automatiskt skapad i Authentication
- ✅ Stripe customer skapad med korrekt user_id
- ✅ User profile automatiskt skapad
- ✅ Order record skapad
- ✅ Omedelbar inloggning möjlig

#### Test 2: Kontrollera i Supabase
Efter testet, kolla:
1. **Authentication → Users** - Nya användaren ska finnas
2. **stripe_customers** - Ny rad med korrekt user_id
3. **user_profiles** - Automatisk profil skapad
4. **stripe_orders** - Beställningsdata sparad

### Debugging
Om något inte fungerar:
1. **Kolla Edge Function logs** för fel
2. **Kontrollera Stripe webhook endpoints** är korrekt konfigurerade
3. **Verifiera environment variables** finns (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)

### Webhook Endpoint
Se till att denna URL är konfigurerad i Stripe Dashboard:
```
https://acdwexqoonauzzjtoexx.supabase.co/functions/v1/stripe-webhook
```

Nu kommer alla nya köp automatiskt skapa användarekonton och ge omedelbar kurstillgång! 🚀