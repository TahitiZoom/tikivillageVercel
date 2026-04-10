import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin } from '@/access/isAdmin'

export const Users: CollectionConfig<'users'> = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Client', value: 'customer' },
      ],
      access: {
        update: ({ req }) => isAdmin({ req }),
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bookings',
      type: 'join',
      collection: 'bookings',
      on: 'customer',
      label: 'Réservations',
    },
  ],
  timestamps: true,
}
