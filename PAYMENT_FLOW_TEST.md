# KongMindset - Komplett Testguide för Betalning-till-Tillgång

## 🧪 LIVE TEST AV NYA ANVÄNDARFLÖDET

### FÖRE TEST - Kontrollera nuvarande tillstånd
1. **Gå till Supabase → Table Editor → stripe_customers**
   - Anteckna antal rader (för närvarande: 3 från augusti)
   - Senaste `created_at` borde vara från augusti

2. **Gå till Authentication → Users**
   - Anteckna antal användare
   - Kolla senaste `created_at`

### 🎯 TEST SCENARIO

**Test-användare:**
- **Email:** `testuser@kongmindset.se`
- **Password:** `TestUser2025!`
- **Namn:** `Test User`

### STEG-FÖR-STEG TEST

#### Steg 1: Börja köpprocessen
1. **Öppna:** https://kongmindset.se
2. **Klicka:** "🔑 Logga in" knappen (högst upp till höger)
3. **Växla till:** "Skaffa tillgång" tab
4. **Fyll i:**
   - E-postadress: `testuser@kongmindset.se`
   - Lösenord: `TestUser2025!`
   - Bekräfta lösenord: `TestUser2025!`

#### Steg 2: Initiera Stripe Checkout
5. **Klicka:** "🛒 Köp fullständig tillgång - 299 kr"
6. **Förväntat resultat:** 
   - ✅ Meddelande: "🎯 Omdirigerar till säker betalning..."
   - ✅ Stripe Checkout-sida öppnas

#### Steg 3: Slutför testbetalning
7. **I Stripe Checkout använd test-kort:**
   - Kort: `4242 4242 4242 4242`
   - Datum: `12/34`
   - CVC: `123`
   - Namn: `Test User`
8. **Klicka:** "Pay"

#### Steg 4: Verifiera webhook-trigger
9. **Förväntat resultat:**
   - ✅ Omdirigering till success-sida
   - ✅ Meddelande: "🎉 Grattis! Betalning genomförd!"

#### Steg 5: Kontrollera databasskapande
10. **Gå till Supabase → Table Editor → stripe_customers**
    - ✅ **NY RAD** ska finnas med dagens datum (26/9)
    - ✅ `customer_id` börjar med "cus_"
    - ✅ `user_id` ska INTE vara NULL (detta är kritiskt!)

11. **Gå till Authentication → Users**
    - ✅ **NY ANVÄNDARE** `testuser@kongmindset.se` ska finnas
    - ✅ `created_at` ska vara från idag

12. **Gå till Table Editor → user_profiles**
    - ✅ **NY PROFIL** ska finnas med samma user_id
    - ✅ `display_name` ska vara "testuser"

#### Steg 6: Testa inloggning
13. **Från success-sidan, klicka:** "Logga in och börja"
14. **Eller gå till:** https://kongmindset.se
15. **Klicka:** "🔑 Logga in"
16. **Fyll i:**
    - E-postadress: `testuser@kongmindset.se`
    - Lösenord: `TestUser2025!`
17. **Klicka:** "Logga in på ditt konto"

#### Steg 7: Verifiera kurstillgång
18. **Förväntat resultat:**
    - ✅ Automatisk inloggning till kursdashboard
    - ✅ Alla 13 moduler synliga
    - ✅ Napoleon Hill AI-mentor tillgänglig
    - ✅ Användarprofil korrekt skapad

## 🔍 FELSÖKNING OM NÅGOT MISSLYCKAS

### Om användare inte skapas i Authentication:
- **Kontrollera:** Edge Function logs för "stripe-webhook"
- **Verifiera:** Webhook secret är korrekt konfigurerat
- **Kolla:** Stripe Dashboard → Webhooks för delivery status

### Om stripe_customers inte skapas:
- **Kontrollera:** Webhook-endpointens URL i Stripe Dashboard
- **Verifiera:** Events `checkout.session.completed` är aktiverat
- **Kolla:** Edge Function logs för fel

### Om inloggning misslyckas:
- **Kontrollera:** user_id länkning mellan stripe_customers och Authentication
- **Verifiera:** user_profiles skapades korrekt av trigger
- **Testa:** Lösenord är korrekt (TestUser2025!)

## ✅ FÖRVÄNTADE RESULTAT EFTER LYCKAD TEST

### Database State (efter test):
```sql
-- Authentication table
users: 
- Ny user_id för testuser@kongmindset.se
- created_at från idag (26/9)

-- stripe_customers table
4 rader totalt:
- 3 gamla från augusti (user_id = NULL)
- 1 NY från idag med korrekt user_id ✅

-- user_profiles table  
- Ny profil för testuser@kongmindset.se
- display_name: "testuser"
- Automatiskt skapad av trigger ✅

-- stripe_orders table
- Ny order record för testtransaktionen
- payment_status: "paid"
- order_status: "completed" ✅
```

### User Experience:
- ✅ Smidig köpprocess
- ✅ Automatisk kontoskapande
- ✅ Omedelbar kurstillgång
- ✅ Ingen manuell intervention behövs

## 🚀 KÖR DETTA TEST NU!

Följ stegen ovan med `testuser@kongmindset.se` och rapportera tillbaka vad som händer vid varje steg.

**Om allt fungerar kommer vi att ha löst problemet för alla framtida användare! 🎯**