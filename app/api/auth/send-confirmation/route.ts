import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.NEXT_RESEND_API_KEY);

export async function POST(req: NextRequest) {
      try {
            const { email, token } = await req.json();

            if (!email || !token) {
                  return NextResponse.json(
                        { error: 'Email and token required' },
                        { status: 400 }
                  );
            }

            const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?token=${token}&type=signup`;

            const result = await resend.emails.send({
                  from: 'onboarding@resend.dev', // Update this
                  to: email,
                  subject: 'Confirm your email',
                  html: `
        <h2>Confirm your email</h2>
        <p>Click the link below to confirm your email address:</p>
        <a href="${confirmLink}">Confirm Email</a>
        <p>Or copy this link: ${confirmLink}</p>
      `,
            });

            if (result.error) {
                  return NextResponse.json({ error: result.error }, { status: 400 });
            }

            return NextResponse.json({ success: true });
      } catch (error) {
            console.error('Email send error:', error);
            return NextResponse.json(
                  { error: 'Failed to send email' },
                  { status: 500 }
            );
      }
}
