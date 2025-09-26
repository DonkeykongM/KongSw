# 🚨 KRITISK FIX: Webhook-konfiguration för automatisk användarskapande

## PROBLEMDIAGNOS ✅
- **Problem:** Webhook triggras INTE för nya köp
- **Bevis:** bahkostudi@gmail.com köpte idag (26/9) men finns inte i stripe_customers
- **Orsak:** Webhook endpoint inte korrekt konfigurerad i Stripe Dashboard

## SNABBFIX (GÖR DETTA NU!)

### Steg 1: Kontrollera Stripe Dashboard
1. **Gå till https://dashboard.stripe.com**
2. **Developers → Webhooks**
3. **Kontrollera endpoint URL:**
   ```
   https://acdwexqoonauzzjtoexx.supabase.co/functions/v1/stripe-webhook
   ```

### Steg 2: Konfigurera webhook events
Webhook MÅSTE lyssna på dessa events:
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`

### Steg 3: Kopiera webhook secret
1. **Klicka på webhook endpoint**
2. **Kopiera "Signing secret"**
3. **Gå till Supabase → Edge Functions → Environment Variables**
4. **Lägg till:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...din_secret_här
   ```

### Steg 4: Testa webhook
1. **Stripe Dashboard → Webhooks → Send test webhook**
2. **Välj `checkout.session.completed`**
3. **Kontrollera logs i Supabase Edge Functions**

## VERIFIERING

### Test med ny e-post:
1. **Använd test@kongmindset.se**
2. **Gör ett testkӧp**
3. **Kontrollera att följande skapas automatiskt:**
   - ✅ Auth user i Authentication
   - ✅ stripe_customers rad med korrekt user_id
   - ✅ user_profiles rad (via trigger)
   - ✅ stripe_orders rad

### Förväntade resultat efter fix:
```
stripe_customers tabellen:
id  | user_id | customer_id | created_at
1   | abc123  | cus_old1   | 2025-08-16... 
2   | def456  | cus_old2   | 2025-08-17...
3   | ghi789  | cus_old3   | 2025-08-17... 
4   | NEW_ID  | cus_NEW    | 2025-09-26... ← NY FRÅN IDAG!
```

## WEBHOOK ENVIRONMENT VARIABLES (KOLLA DESSA!)

Gå till **Supabase → Edge Functions → Environment Variables**:

```bash
STRIPE_SECRET_KEY=sk_live_... eller sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://acdwexqoonauzzjtoexx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## EFTER FIX: Automatisk användarflow

**Innan fix:** 
🛒 Köp → ❌ Inget händer → Användare kan inte logga in

**Efter fix:**
🛒 Köp → 🔄 Webhook → ✅ Auth user → ✅ Customer record → ✅ Profile → ✅ Omedelbar inloggning

**Nu kommer alla nya kunder automatiskt få full kurstillgång! 🚀**