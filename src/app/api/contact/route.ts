import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Tahiti Zoom" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contact] ${subject || 'Nouveau message'} — ${name}`,
      html: `
        <h2>Nouveau message depuis tahitizoom.pf</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject || '—'}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ message: 'Email envoyé' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ message: 'Erreur envoi email' }, { status: 500 })
  }
}
