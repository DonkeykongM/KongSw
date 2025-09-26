import { corsHeaders } from '../_shared/cors.ts';

interface EmailRequest {
  to: string;
  name: string;
  email: string;
  password: string;
}

// You can use any email service here - this example uses a simple SMTP approach
// In production, consider using services like SendGrid, Mailgun, or AWS SES

const SMTP_CONFIG = {
  host: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
  port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
  username: Deno.env.get('SMTP_USERNAME'),
  password: Deno.env.get('SMTP_PASSWORD'),
  from: Deno.env.get('SMTP_FROM') || 'noreply@coursehub.com',
};

function generateEmailHTML(name: string, email: string, password: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CourseHub - Your Login Credentials</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .credentials-box { background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { background-color: #f1f5f9; padding: 20px 30px; text-align: center; font-size: 14px; color: #64748b; }
    .warning { background-color: #fef3cd; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0; color: #92400e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to CourseHub!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Your account is ready</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      
      <p>Congratulations on your purchase! Your account has been created automatically and you now have immediate access to the complete Napoleon Hill Success Course.</p>
      
      <div class="credentials-box">
        <h3 style="margin-top: 0; color: #1e40af;">🔑 Your Login Credentials</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
      </div>
      
      <div class="warning">
        <p style="margin: 0;"><strong>⚠️ Important:</strong> Please save these credentials in a secure location and consider changing your password after your first login for enhanced security.</p>
      </div>
      
      <p>You can now access:</p>
      <ul>
        <li>✅ All 13 interactive course modules</li>
        <li>✅ Practical exercises and worksheets</li>
        <li>✅ Progress tracking and completion certificates</li>
        <li>✅ Lifetime access to all content and updates</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="https://coursehub.com/login" class="button">Access Your Course Now</a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@coursehub.com">support@coursehub.com</a>.</p>
      
      <p>Welcome to your transformation journey!</p>
      
      <p>Best regards,<br>
      <strong>The CourseHub Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This email was sent because you recently purchased a course from CourseHub.</p>
      <p>© ${new Date().getFullYear()} CourseHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, name, email, password }: EmailRequest = await req.json();

    if (!to || !name || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // For this example, we'll use a simple fetch to a email service
    // In production, integrate with your preferred email service (SendGrid, Mailgun, etc.)
    
    console.log('Preparing to send login credentials to:', to);
    console.log('Generated password for user:', password.substring(0, 2) + '***');

    // Generate email content
    const htmlContent = generateEmailHTML(name, email, password);
    
    // Here you would typically call your email service API
    // For this example, we'll log the email content and return success
    console.log('Email HTML generated successfully');
    console.log('Email would be sent to:', to);
    console.log('Subject: Welcome to CourseHub - Your Login Credentials');

    // Example with a generic SMTP service (you'd need to implement actual SMTP)
    /*
    const emailResult = await fetch('YOUR_EMAIL_SERVICE_API', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_EMAIL_API_KEY`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        subject: 'Welcome to CourseHub - Your Login Credentials',
        html: htmlContent,
        from: SMTP_CONFIG.from,
      }),
    });
    */

    // For now, we'll simulate successful email sending
    // In production, replace this with actual email service integration
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login credentials prepared for delivery',
        // In development, include credentials for testing
        debugInfo: {
          email: email,
          password: password,
          note: 'In production, this would be sent via email only'
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Send email error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});