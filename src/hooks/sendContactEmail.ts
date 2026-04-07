import nodemailer from 'nodemailer'
import type { CollectionAfterChangeHook } from 'payload'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendContactEmail: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  if (operation !== 'create') return doc

  const data: Record<string, string> = {}
  if (doc.submissionData && Array.isArray(doc.submissionData)) {
    doc.submissionData.forEach((item: { field: string; value: string }) => {
      data[item.field] = item.value
    })
  }

  const name = data['full-name'] || 'Inconnu'
  const email = data['email'] || 'Non renseigné'
  const phone = data['phone'] || 'Non renseigné'
  const message = data['message'] || 'Aucun message'

  try {
    // Email de notification à l'admin
    await transporter.sendMail({
      from: `"Tahiti Zoom" <${process.env.SMTP_FROM || 'contact@tahitizoom.pf'}>`,
      to: 'ssayeb@icloud.com',
      replyTo: email,
      subject: `Nouveau message de contact - ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    })

    // Email de confirmation au visiteur
    await transporter.sendMail({
      from: `"Tahiti Zoom" <${process.env.SMTP_FROM || 'contact@tahitizoom.pf'}>`,
      to: email,
      subject: 'Votre message a bien été reçu - Tahiti Zoom',
      html: `
        <h2>Mauruuru pour votre message !</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message et reviendrons vers vous dans les plus brefs délais.</p>
        <p>À bientôt,<br/>L'équipe Tahiti Zoom</p>
      `,
    })

    console.log('[Contact] Emails envoyés avec succès à', email)
  } catch (error) {
    console.error('[Contact] Erreur envoi email:', error)
  }

  return doc
}
