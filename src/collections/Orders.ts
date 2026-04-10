import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Orders: CollectionConfig<'orders'> = {
  slug: 'orders',
  labels: {
    singular: 'Commande',
    plural: 'Commandes',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'booking', 'totalAmount', 'createdAt'],
    group: 'Commerce',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Numéro de commande',
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      label: 'Réservation',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Client',
    },
    {
      name: 'billing',
      type: 'group',
      label: 'Facturation',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'phone', type: 'text' },
        { name: 'company', type: 'text' },
        { name: 'address1', type: 'text', label: 'Adresse' },
        { name: 'address2', type: 'text', label: 'Complément' },
        { name: 'city', type: 'text', label: 'Ville' },
        { name: 'region', type: 'text', label: 'Région / Département' },
        { name: 'postalCode', type: 'text', label: 'Code postal' },
        { name: 'country', type: 'text', defaultValue: 'PF', label: 'Pays' },
      ],
    },
    { name: 'totalAmount', type: 'number', required: true, label: 'Montant total (XPF)' },
    { name: 'currency', type: 'text', defaultValue: 'XPF', admin: { readOnly: true } },
    {
      name: 'lineItems',
      type: 'array',
      label: 'Lignes de commande',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'unitPrice', type: 'number', required: true, label: 'Prix unitaire (XPF)' },
        { name: 'subtotal', type: 'number', required: true, label: 'Sous-total (XPF)' },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      label: 'Paiement PayZen / OSB',
      fields: [
        {
          name: 'paymentStatus',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'En attente', value: 'pending' },
            { label: 'Initié', value: 'initiated' },
            { label: 'Payé', value: 'paid' },
            { label: 'Refusé', value: 'refused' },
            { label: 'Annulé', value: 'cancelled' },
            { label: 'Remboursé', value: 'refunded' },
            { label: 'Erreur', value: 'error' },
          ],
        },
        { name: 'payzenTransactionId', type: 'text', label: 'Transaction ID PayZen' },
        { name: 'payzenOrderId', type: 'text', label: 'Order ID PayZen' },
        { name: 'payzenTransStatus', type: 'text', label: 'Statut brut PayZen' },
        { name: 'payzenAuthResult', type: 'text', label: 'Code auth PayZen' },
        { name: 'payzenRawResponse', type: 'json', label: 'Réponse brute IPN' },
        { name: 'paidAt', type: 'date', label: 'Date de paiement' },
      ],
    },
    { name: 'orderNotes', type: 'textarea', label: 'Notes de commande (client)' },
    { name: 'adminNotes', type: 'textarea', label: 'Notes internes' },
  ],
  timestamps: true,
}
