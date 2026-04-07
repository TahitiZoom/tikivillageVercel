import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Paramètres du site',
  admin: { group: 'Paramètres' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      label: 'Mode maintenance activé',
      defaultValue: false,
      admin: {
        description: 'Cochez pour afficher la page "Bientôt disponible" aux visiteurs.',
      },
    },
  ],
}
