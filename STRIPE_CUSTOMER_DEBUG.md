# Debug Guide för bahkostudi@gmail.com

## Problem identifierat ✅
Du har rätt! Stripe customers skapas men AUTH USERS skapas inte.

## Nuvarande situation:
- ✅ 3 st `stripe_customers` finns
- ❌ Dessa har troligtvis `user_id = NULL` 
- ❌ Därför kan folk inte logga in trots att de betalat

## SNABBFIX för bahkostudi@gmail.com:

### Steg 1: Identifiera rätt customer
1. Kolla `stripe_customers` tabellen
2. Den med senast `created_at` borde vara bahkostudi@gmail.com
3. Anteckna `customer_id` (börjar med "cus_")

### Steg 2: Skapa Auth User
1. **Authentication** → **Users** → **Add User**
2. Email: `bahkostudi@gmail.com`
3. Password: `Bahko2025!`
4. ✅ **Email Confirm** (viktigt!)
5. **Kopiera User ID** från listan

### Steg 3: Länka ihop
1. **Table Editor** → **stripe_customers**
2. **Hitta bahkostudi's rad** (senaste created_at)
3. **Klicka Edit** på den raden
4. **Uppdatera user_id** med User ID från steg 2
5. **Save**

### Steg 4: Profil skapas automatiskt
- Min trigger kommer skapa `user_profiles` automatiskt
- När du uppdaterar `user_id` i stripe_customers

## Resultat:
✅ bahkostudi@gmail.com kan logga in
✅ Får full kurstillgång
✅ Framtida köp fixeras av webhook

## Kontrollera framtida webhook:
Se till att webhook använder rätt endpoint i Stripe Dashboard:
```
https://acdwexqoonauzzjtoexx.supabase.co/functions/v1/stripe-webhook
```