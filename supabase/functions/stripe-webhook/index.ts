import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🎯 Webhook triggas - betalning mottagen!')
    
    // Hämta Stripe event
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      console.error('❌ Ingen Stripe signature')
      return new Response('No signature', { status: 400 })
    }

    // Verifiera Stripe webhook
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET saknas')
      return new Response('No webhook secret', { status: 400 })
    }

    let event
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(body)
      
      // För denna demo, hoppa över signature verifiering (ej säkert för produktion)
      event = JSON.parse(body)
      console.log('✅ Stripe event parsed:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    // Hantera endast checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      console.log('💳 Checkout slutförd, skapar användarkonto...')
      
      const session = event.data.object
      const customerEmail = session.customer_details?.email || session.metadata?.email
      const customerPassword = session.metadata?.password
      const customerName = session.metadata?.name || session.customer_details?.name
      
      console.log('📧 Kund e-post:', customerEmail)
      console.log('👤 Kund namn:', customerName)
      
      if (!customerEmail || !customerPassword) {
        console.error('❌ Saknar e-post eller lösenord i metadata')
        return new Response('Missing email or password', { status: 400 })
      }

      // Skapa Supabase admin client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // 1. Skapa auth user
      console.log('🔐 Skapar auth användare...')
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: customerPassword,
        email_confirm: true, // Auto-bekräfta e-post
        user_metadata: {
          name: customerName || customerEmail.split('@')[0]
        }
      })

      if (authError) {
        // Om användare redan finns, hämta befintlig användare
        if (authError.message.includes('already registered')) {
          console.log('👤 Användare finns redan, hämtar befintlig...')
          
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers.users.find(u => u.email === customerEmail)
          
          if (existingUser) {
            console.log('✅ Hittade befintlig användare:', existingUser.id)
            
            // Skapa purchase record för befintlig användare
            await supabase.from('course_purchases').insert({
              user_id: existingUser.id,
              email: customerEmail,
              stripe_customer_id: session.customer,
              stripe_session_id: session.id,
              payment_status: 'completed',
              amount_paid: session.amount_total,
              currency: session.currency?.toUpperCase() || 'SEK'
            })
            
            console.log('✅ Purchase record skapad för befintlig användare')
            return new Response('Existing user updated', { status: 200, headers: corsHeaders })
          }
        } else {
          console.error('❌ Auth user creation failed:', authError)
          return new Response('Auth user creation failed', { status: 500 })
        }
      } else {
        console.log('✅ Auth användare skapad:', authUser.user.id)
        
        // 2. Skapa purchase record
        console.log('💰 Skapar purchase record...')
        const { error: purchaseError } = await supabase.from('course_purchases').insert({
          user_id: authUser.user.id,
          email: customerEmail,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          payment_status: 'completed',
          amount_paid: session.amount_total,
          currency: session.currency?.toUpperCase() || 'SEK'
        })

        if (purchaseError) {
          console.error('❌ Purchase record creation failed:', purchaseError)
        } else {
          console.log('✅ Purchase record skapad')
        }

        // 3. Verifiera att profil skapades av trigger
        console.log('👤 Kontrollerar att user_profile skapades...')
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', authUser.user.id)
          .single()

        if (profileError || !profile) {
          console.log('⚠️ Profil skapades inte av trigger, skapar manuellt...')
          
          const { error: manualProfileError } = await supabase.from('user_profiles').insert({
            user_id: authUser.user.id,
            email: customerEmail,
            display_name: customerName || customerEmail.split('@')[0],
            has_course_access: true
          })
          
          if (manualProfileError) {
            console.error('❌ Manuell profilskapning misslyckades:', manualProfileError)
          } else {
            console.log('✅ Profil skapad manuellt')
          }
        } else {
          console.log('✅ Profil skapad automatiskt av trigger')
        }

        // 4. Skicka inloggningsinformation via e-post
        console.log('📨 Skickar inloggningsinformation...')
        const emailResult = await fetch(`${supabaseUrl}/functions/v1/send-login-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: customerEmail,
            password: customerPassword,
            name: customerName || customerEmail.split('@')[0]
          }),
        })

        if (emailResult.ok) {
          console.log('✅ E-post skickad till kund')
        } else {
          console.error('⚠️ E-post kunde inte skickas, men konto är skapat')
        }
      }
    }

    console.log('🎉 Webhook bearbetad framgångsrikt!')
    return new Response('Success', { status: 200, headers: corsHeaders })
    
  } catch (error) {
    console.error('💥 Webhook fel:', error)
    return new Response('Webhook error', { status: 500, headers: corsHeaders })
  }
})