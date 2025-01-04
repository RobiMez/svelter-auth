import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    console.log(to, subject, html);
    const data = await resend.emails.send({
      from: 'Verify <verify@svelter-auth.robi.work>',
      to,
      subject,
      html
    });

    console.log(data);

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
} 