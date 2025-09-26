# 🚀 KongMindset - Enkla Setup Guide

## KOMPLETT NYTT SYSTEM - ENKEL ANVÄNDARAKTIVERING

### 🎯 Hur det fungerar nu:
1. **Kund köper kurs** → Fyller i e-post och lösenord
2. **Stripe betalning** → Betalning slutförs
3. **Webhook triggas** → Skapar automatiskt auth user
4. **Profil skapas** → Via databas trigger
5. **E-post skickas** → Med inloggningsuppgifter
6. **Omedelbar tillgång** → Kund kan logga in direkt

## 📋 SETUP STEG

### Steg 1: Supabase Setup
1. **Skapa nytt Supabase projekt**
2. **Gå till SQL Editor**
3. **Kör migrations i ordning:**
   - `cleanup_and_optimize_database.sql`
   - `create_stripe_tables.sql` (om den inte redan körts)
4. **Verifiera tabeller skapade:**
   - `course_purchases`
   - `user_profiles`
   - `simple_logins`

### Steg 2: Environment Variables
**I Supabase → Edge Functions → Environment Variables:**
```
STRIPE_SECRET_KEY=sk_test_... (eller sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://din-projekt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Steg 3: Stripe Webhook Setup
1. **Stripe Dashboard → Webhooks**
2. **Lägg till endpoint:**
   ```
   https://din-projekt.supabase.co/functions/v1/stripe-webhook
   ```
3. **Aktivera events:**
   - `checkout.session.completed`

### Steg 4: Testa systemet
**Använd test-kort:**
- Kort: `4242 4242 4242 4242`
- Datum: `12/34`
- CVC: `123`

## ✅ EFTER SETUP

**Varje köp kommer automatiskt:**
- 👤 Skapa auth user med e-post/lösenord från köpet
- 💳 Spara köpinformation  
- 👤 Skapa användarprofil
- 📧 Skicka e-post med inloggningsuppgifter
- 🔓 Ge omedelbar kurstillgång

**Kunder loggar in med samma e-post och lösenord som de använde vid köpet!**

## 🛠️ DEBUGGING

**Om köp inte skapar användare:**
1. **Kolla Edge Function logs:** Functions → stripe-webhook → Logs
2. **Kontrollera webhook delivery:** Stripe Dashboard → Webhooks
3. **Verifiera environment variables** är korrekt satta

**ENKELT OCH FUNGERAR! 🎯**