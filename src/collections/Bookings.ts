// @ts-nocheck
import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Bookings: CollectionConfig<'bookings'> = {
  slug: 'bookings',
  labels: {
    singular: 'Réservation',
    plural: 'Réservations',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'bookingReference',
    defaultColumns: ['bookingReference', 'product', 'date', 'status', 'totalAmount'],
    group: 'Commerce',
  },
  fields: [
    {
      name: 'bookingReference',
      type: 'text',
      required: true,
      unique: true,
      label: 'Référence',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Prestation',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date de réservation',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'participants',
      type: 'group',
      label: 'Participants',
      fields: [
        { name: 'adults', type: 'number', required: true, defaultValue: 1, min: 0, label: 'Adultes' },
        { name: 'children', type: 'number', defaultValue: 0, min: 0, label: 'Enfants (-12 ans)' },
      ],
    },
    {
      name: 'options',
      type: 'group',
      label: 'Options',
      fields: [
        { name: 'transferAdults', type: 'number', defaultValue: 0, min: 0, label: 'Transferts A/R adulte' },
        { name: 'transferChildren', type: 'number', defaultValue: 0, min: 0, label: 'Transferts A/R enfant' },
      ],
    },
    { name: 'promoCode', type: 'text', label: 'Code promo appliqué' },
    { name: 'isPromoApplied', type: 'checkbox', defaultValue: false },
    {
      name: 'breakdown',
      type: 'group',
      label: 'Détail du calcul',
      admin: { readOnly: true },
      fields: [
        { name: 'subtotalPersons', type: 'number', label: 'Sous-total participants (XPF)' },
        { name: 'subtotalTransfer', type: 'number', label: 'Sous-total transferts (XPF)' },
        { name: 'discount', type: 'number', label: 'Remise promo (XPF)' },
        { name: 'totalAmount', type: 'number', label: 'Total (XPF)' },
      ],
    },
    { name: 'totalAmount', type: 'number', required: true, label: 'Montant total (XPF)' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Payée', value: 'paid' },
        { label: 'Annulée', value: 'cancelled' },
        { label: 'Remboursée', value: 'refunded' },
        { label: 'No-show', value: 'noshow' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Client',
    },
    {
      name: 'guestInfo',
      type: 'group',
      label: 'Infos client invité',
      admin: {
        condition: (data) => !data?.customer,
      },
      fields: [
        { name: 'firstName', type: 'text', label: 'Prénom' },
        { name: 'lastName', type: 'text', label: 'Nom' },
        { name: 'email', type: 'email', required: true, label: 'Email' },
        { name: 'phone', type: 'text', label: 'Téléphone' },
        { name: 'country', type: 'text', label: 'Pays' },
      ],
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Commande liée',
    },
    { name: 'notes', type: 'textarea', label: 'Notes internes' },
    { name: 'customerNotes', type: 'textarea', label: 'Notes du client' },
  ],
  timestamps: true,
}
