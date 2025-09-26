import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, name } = await req.json()
    
    console.log('📨 Skickar inloggningsinformation till:', email)

    // Här kan du integrera med en e-postleverantör som:
    // - SendGrid
    // - Mailgun  
    // - Postmark
    // - Resend
    
    // För demo, logga bara informationen
    console.log('📧 E-post innehåll:')
    console.log(`Till: ${email}`)
    console.log(`Namn: ${name}`)
    console.log(`Lösenord: ${password}`)
    
    // TODO: Implementera riktig e-postleverans här
    
    const emailContent = `
Hej ${name}!

Tack för ditt köp av KongMindset-kursen!

Dina inloggningsuppgifter:
E-post: ${email}
Lösenord: ${password}

Logga in på: https://kongmindset.se

Välkommen till din transformationsresa!

Med vänliga hälsningar,
KongMindset Team
    `.trim()

    console.log('✅ E-post "skickad" (demo mode)')
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent' }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('💥 E-post fel:', error)
    return new Response(
      JSON.stringify({ error: 'Email sending failed' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})