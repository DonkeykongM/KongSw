# KongMindset - Distributionsguide

## Projektstruktur

Detta projekt är uppdelat i två huvuddelar:

### 1. Frontend (React App) - Distribueras till Bolt Hosting
- **Mapp**: `/` (root)
- **Innehåller**: React-applikation, Tailwind CSS, frontend-logik
- **Distribution**: Bolt Hosting
- **Kommando**: Automatisk via Bolt UI

### 2. Backend (Supabase Edge Functions) - Distribueras till Supabase
- **Mapp**: `supabase/functions/`
- **Innehåller**: stripe-checkout, stripe-webhook funktioner
- **Distribution**: Supabase (hanteras separat)
- **Kommando**: `supabase functions deploy`

## Frontend Distribution (Bolt Hosting)

Frontend-applikationen distribueras automatiskt via Bolt Hosting. Följande filer ignoreras för att optimera storleken:

- PDF-filer (för stora)
- Backend-kod (Edge Functions)
- Utvecklingsfiler
- Cache och temporära filer

## Backend Distribution (Supabase Edge Functions)

Edge Functions måste distribueras separat till Supabase:

### Steg 1: Installera Supabase CLI
```bash
npm install -g @supabase/cli
```

### Steg 2: Logga in på Supabase
```bash
supabase login
```

### Steg 3: Distribuera funktionerna
```bash
# Distribuera checkout-funktion
supabase functions deploy stripe-checkout --project-ref DIN_PROJEKT_REF

# Distribuera webhook-funktion  
supabase functions deploy stripe-webhook --project-ref DIN_PROJEKT_REF
```

## Miljövariabler

### Frontend (.env)
Endast variabler som börjar med `VITE_`:
```
VITE_SUPABASE_URL=din_supabase_url
VITE_SUPABASE_ANON_KEY=din_anon_key
```

### Backend (Supabase Environment Variables)
Konfigureras i Supabase Dashboard under "Edge Functions" > "Environment Variables":
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`  
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`

## Säkerhetsaspekter

- ✅ Känsliga nycklar finns endast i Supabase-miljön
- ✅ Frontend exponerar endast publika nycklar
- ✅ PDF-filer serveras från externa källor
- ✅ Backend-kod är separerad från frontend-distribution

## Felsökning

### Problem: "Projekt för stort"
- ✅ `.bolt/ignore` fil skapad
- ✅ PDF-filer ignorerade
- ✅ Backend-kod ignorerad

### Problem: "Stripe-funktioner fungerar inte"
- Kontrollera att Edge Functions är distribuerade
- Verifiera miljövariabler i Supabase
- Kontrollera webhook-endpoints

### Problem: "AI Chatbot fungerar inte"
- Kontrollera VG_CONFIG i frontend
- Verifiera att externa scripts laddas