import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, password, loginUrl } = await req.json()

    console.log(`📧 Sending welcome email to: ${email}`)

    // Create email content
    const emailContent = `
Hej ${name}!

🎉 Välkommen till KongMindset! Din betalning har genomförts och ditt konto är nu aktivt.

🔑 DINA INLOGGNINGSUPPGIFTER:
E-post: ${email}
Lösenord: ${password}

🎯 NÄSTA STEG:
1. Gå till: ${loginUrl}
2. Klicka på "Logga in" 
3. Använd uppgifterna ovan
4. Börja med Modul 1: "Önskans kraft"

🎁 VAD DU FÅR:
✅ 13 interaktiva moduler (livstidsåtkomst)
✅ Napoleon Hill AI-mentor 24/7
✅ GRATIS originalbok "Tänk och Bli Rik"
✅ Reflektionsövningar och kunskapsquiz
✅ 30 dagars pengarna-tillbaka-garanti

💡 TIPS: Spara detta e-postmeddelande för framtida referens.

🧠 NAPOLEON HILL AI-MENTOR:
Din personliga framgångscoach väntar på dig! Klicka på den blå hjärnikonen när du är inloggad för att få personlig vägledning.

Lycka till på din transformationsresa!

Med vänliga hälsningar,
KongMindset-teamet

📧 Support: support@kongmindset.se
🌐 Webbplats: ${loginUrl}
    `

    // In a real implementation, you would use a proper email service
    // For now, we'll just log the email content
    console.log('📧 Email content prepared for:', email)
    console.log('Email body:', emailContent)

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // Example with a webhook to Make.com or similar:
    /*
    const emailResponse = await fetch('YOUR_EMAIL_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: '🎉 Välkommen till KongMindset - Dina inloggningsuppgifter',
        text: emailContent,
        from: 'noreply@kongmindset.se'
      })
    })
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email prepared successfully',
        recipient: email
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Email sending error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})