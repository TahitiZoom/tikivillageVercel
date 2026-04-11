// @ts-nocheck
import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  labels: {
    singular: 'Prestation',
    plural: 'Prestations',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'sortOrder'],
    group: 'Commerce',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nom de la prestation',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Dîner-spectacle', value: 'diner_spectacle' },
        { label: 'Spectacle seul', value: 'spectacle_seul' },
        { label: 'Atelier', value: 'atelier' },
        { label: 'Mariage', value: 'mariage' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Soirée', value: 'soiree' },
        { label: 'Artisanat', value: 'artisanat' },
        { label: 'Mariages', value: 'mariages' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
        { label: 'Archivé', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      label: 'Description courte',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description complète',
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Tarification',
      fields: [
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'XPF',
          admin: { readOnly: true },
        },
        {
          name: 'hasPersonTypes',
          type: 'checkbox',
          defaultValue: true,
          label: 'Distingue adulte/enfant',
        },
        {
          name: 'priceAdult',
          type: 'number',
          required: true,
          label: 'Prix adulte (XPF)',
        },
        {
          name: 'priceChild',
          type: 'number',
          label: 'Prix enfant <12 ans (XPF)',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasPersonTypes),
          },
        },
        {
          name: 'promoAdult',
          type: 'number',
          label: 'Prix promo adulte (XPF)',
        },
        {
          name: 'promoChild',
          type: 'number',
          label: 'Prix promo enfant (XPF)',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasPersonTypes),
          },
        },
        {
          name: 'displayPrice',
          type: 'number',
          label: 'Prix affiché (XPF)',
        },
      ],
    },
    {
      name: 'transferOptions',
      type: 'group',
      label: 'Options de transfert',
      admin: {
        condition: (data) =>
          data?.type === 'diner_spectacle' ||
          data?.type === 'spectacle_seul' ||
          data?.type === 'atelier',
      },
      fields: [
        {
          name: 'hasTransfer',
          type: 'checkbox',
          label: 'Propose le transfert aller-retour',
          defaultValue: false,
        },
        {
          name: 'transferPriceAdult',
          type: 'number',
          defaultValue: 2600,
          label: 'Transfert A/R adulte (XPF)',
        },
        {
          name: 'transferPriceChild',
          type: 'number',
          defaultValue: 1600,
          label: 'Transfert A/R enfant (XPF)',
        },
      ],
    },
    {
      name: 'booking',
      type: 'group',
      label: 'Paramètres de réservation',
      fields: [
        {
          name: 'isBookable',
          type: 'checkbox',
          label: 'Réservable en ligne',
          defaultValue: false,
        },
        {
          name: 'minPersons',
          type: 'number',
          defaultValue: 1,
          label: 'Minimum de personnes',
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
        },
        {
          name: 'maxPersons',
          type: 'number',
          defaultValue: 25,
          label: 'Maximum de personnes',
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
        },
        {
          name: 'minAdvanceDays',
          type: 'number',
          defaultValue: 0,
          label: 'Délai minimum de réservation (jours)',
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
        },
        {
          name: 'maxAdvanceMonths',
          type: 'number',
          defaultValue: 12,
          label: 'Fenêtre max de réservation (mois)',
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
        },
        {
          name: 'availableDays',
          type: 'select',
          hasMany: true,
          label: 'Jours disponibles',
          options: [
            { label: 'Lundi', value: 'monday' },
            { label: 'Mardi', value: 'tuesday' },
            { label: 'Mercredi', value: 'wednesday' },
            { label: 'Jeudi', value: 'thursday' },
            { label: 'Vendredi', value: 'friday' },
            { label: 'Samedi', value: 'saturday' },
            { label: 'Dimanche', value: 'sunday' },
          ],
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
        },
        {
          name: 'timeSlot',
          type: 'text',
          label: 'Créneau horaire',
          localized: true,
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
        },
        {
          name: 'blockedDates',
          type: 'array',
          label: 'Dates bloquées',
          admin: {
            condition: (data) => Boolean(data?.booking?.isBookable),
          },
          fields: [
            { name: 'date', type: 'date', required: true },
            { name: 'reason', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'cancellation',
      type: 'group',
      label: "Politique d'annulation",
      fields: [
        { name: 'fee24h', type: 'number', defaultValue: 100, label: 'Frais <24h avant (%)' },
        { name: 'fee7days', type: 'number', defaultValue: 30, label: 'Frais <7 jours avant (%)' },
        { name: 'feeOver8days', type: 'number', defaultValue: 0, label: 'Frais ≥8 jours avant (%)' },
      ],
    },
    {
      name: 'weddingOptions',
      type: 'array',
      label: 'Options mariage',
      admin: {
        condition: (data) => data?.type === 'mariage',
      },
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'price', type: 'number', required: true, label: 'Prix (XPF)' },
      ],
    },
    {
      name: 'externalBookingUrl',
      type: 'text',
      label: 'URL de réservation externe',
      admin: {
        condition: (data) => data?.type === 'mariage',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image principale',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
