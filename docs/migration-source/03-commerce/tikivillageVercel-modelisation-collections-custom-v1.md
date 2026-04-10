# Modélisation des Collections Custom — `tikivillageVercel`

**Version** : v1.0
**Date** : 9 avril 2026
**Statut** : Prêt pour implémentation (phase 3)
**Basé sur** : Analyse du catalogue WordPress production `tikivillage.pf` (export CSV WooCommerce, XML ressources réservables, XML types de personnes, code snippet tarification v16, captures d'écran du site)

---

## 1. Inventaire complet du catalogue WordPress source

### 1.1 Produits réservables en ligne (type `booking, virtual`)

4 prestations actives (Publié=1), chacune déclinée en 3 langues via WPML (FR/EN/JA) :

| Prestation | Catégorie | Type tarif | Prix adulte (XPF) | Prix enfant <12 ans (XPF) | Prix promo adulte | Prix promo enfant | Capacité max |
|---|---|---|---|---|---|---|---|
| **Dîner-spectacle** | Soirée | Par personne (adulte/enfant) | 12 500 | 5 950 | 10 500 | 4 950 | 25 |
| **Spectacle seul** | Soirée | Par personne (adulte/enfant) | 6 200 | 2 950 | 4 950 | 2 500 | 25 |
| **1 Atelier culturel** | Artisanat | Par personne (tarif unique) | 3 500 | 3 500 (=adulte) | 2 800 | — | 25 |
| **3 Ateliers culturels** | Artisanat | Par personne (tarif unique) | 7 000 | 7 000 (=adulte) | 5 600 | — | 25 |

**Règles de disponibilité** (extraites des captures et XML) :
- Dîner-spectacle : mardi et vendredi soir (18h–22h)
- Spectacle seul : mardi et vendredi soir (21h30)
- Ateliers : du mardi au vendredi en journée (selon dispos)
- Fenêtre de réservation : minimum 0 jour avant, maximum 12 mois

**Options additionnelles** (visibles sur les captures) :
- Transfert aller-retour adulte : +2 600 XPF
- Transfert aller-retour enfant : +1 600 XPF

### 1.2 Mariages (type `external`, redirection vers formulaire de contact)

4 formules de mariage à prix fixe, **non réservables en ligne** (bouton « Réservation sur demande ») :

| Formule | Prix (XPF) | Prix (EUR approx) | Artistes | Éléments distinctifs |
|---|---|---|---|---|
| **Mariage Maeva** | 70 000 | 587 € | 5 | Cérémonie basique + dîner-spectacle inclus |
| **Mariage Natihere** | 120 000 | 1 006 € | 11 | + procession royale sur fauteuil |
| **Mariage Vaiarii** | 165 000 | 1 391 € | troupe complète | + arrivée en pirogue + champagne |
| **Mariage Herenui** | 205 000 | 1 718 € | troupe complète | Formule premium complète |

**Options mariage** (communes aux 4 formules) :
- DVD vidéo cérémonie : 30 000 XPF
- CD photos cérémonie : 25 000 XPF
- Package photo/vidéo : 50 000 XPF
- Massage couple 1h : 15 000 XPF
- Invités supplémentaires : 10 500 XPF/adulte, 4 950 XPF/enfant
- Bouquet mariée : 12 000 XPF

**Politique d'annulation** (commune) :
- < 24h : 100%
- < 7 jours : 30%
- ≥ 8 jours : 0%

### 1.3 Anciens produits (Publié=-1, archivés)

3 versions précédentes des produits réservables (`Diner-spectacle-old`, `1 Atelier Culturel-old`, `3 Ateliers Culturels-old`). Historiques uniquement, pas à migrer.

### 1.4 Ressources réservables (XML `bookable_resource`)

- `vendredi VS` / `Friday VS` / `金曜日 VS` — créneaux du vendredi (trilingue)
- `Transfert Aller-Retour Adulte` — option transfert adulte
- `Transfert Aller-Retour Enfant` — option transfert enfant

### 1.5 Types de personnes (XML `bookable_person`)

Chaque produit réservable a 2 types de personnes :
- **Adulte** : min=1, max=25, coût variable par produit
- **Enfant -12 ans** : min=0, max=20-25, coût variable par produit

Pour les ateliers, il n'y a **pas de distinction adulte/enfant** : le coût est le même par personne (le code PHP utilise un simple compteur `$persons` au lieu de `$adults + $children`).

---

## 2. Décision stratégique : Collections custom vs Plugin ecommerce

### 2.1 Verdict : Collections 100% custom

Le plugin `@payloadcms/plugin-ecommerce` est **rejeté** pour ce projet car :

1. **BETA** avec des bugs actifs (confirmOrder, subtotal hardcodé)
2. **Aucune notion de booking** (date, créneau, disponibilité, capacité)
3. **Adapter Stripe uniquement** alors que Tiki Village utilise PayZen/OSB
4. **Surdimensionné** pour 4 produits + 4 mariages — le plugin injecte ~8 collections (Products, Variants, VariantTypes, VariantOptions, Carts, Orders, Transactions, Addresses) dont 5 sont inutiles ici
5. **Override massif nécessaire** pour adapter Products aux prestations réservables, ce qui annule l'intérêt du plugin

### 2.2 Ce qu'on crée à la place

3 collections custom + 1 collection existante étendue :

| Collection | Rôle | Équivalent WordPress |
|---|---|---|
| `Products` | Catalogue des prestations | WooCommerce Products |
| `Bookings` | Réservations clients | WooCommerce Bookings |
| `Orders` | Commandes / paiements | WooCommerce Orders |
| `Users` (étendu) | Admins + clients | WooCommerce Customers |

Plus 2 routes API custom et 1 adapter PayZen (détaillés en section 5).

---

## 3. Collection `Products` — Catalogue des prestations

### 3.1 Rôle

Stocke les 8 prestations Tiki Village (4 réservables + 4 mariages). C'est la source de vérité pour les noms, descriptions, prix, disponibilités et règles de réservation.

### 3.2 Slug Payload

```
products
```

### 3.3 Champs

```typescript
// src/collections/Products.ts

import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Prestation', plural: 'Prestations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'priceAdult', 'isBookable', 'status'],
    group: 'Commerce',
  },
  fields: [
    // ─── Identité ───
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

    // ─── Description ───
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

    // ─── Tarification ───
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
          admin: {
            description:
              'Décocher pour les ateliers (tarif unique par personne)',
          },
        },
        {
          name: 'priceAdult',
          type: 'number',
          required: true,
          label: 'Prix adulte (XPF)',
          admin: { description: 'ou prix par personne si pas de distinction' },
        },
        {
          name: 'priceChild',
          type: 'number',
          label: 'Prix enfant <12 ans (XPF)',
          admin: {
            condition: (data, siblingData) => siblingData?.hasPersonTypes,
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
            condition: (data, siblingData) => siblingData?.hasPersonTypes,
          },
        },
        {
          name: 'displayPrice',
          type: 'number',
          label: 'Prix affiché (XPF)',
          admin: {
            description: 'Prix minimum affiché sur la page catalogue ("À partir de")',
          },
        },
      ],
    },

    // ─── Options de transfert ───
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

    // ─── Booking (réservation en ligne) ───
    {
      name: 'booking',
      type: 'group',
      label: 'Paramètres de réservation',
      fields: [
        {
          name: 'isBookable',
          type: 'checkbox',
          label: 'Réservable en ligne',
          admin: {
            description:
              'Les mariages = non réservables (sur demande). Les soirées et ateliers = réservables.',
          },
        },
        {
          name: 'minPersons',
          type: 'number',
          defaultValue: 1,
          label: 'Minimum de personnes',
          admin: { condition: (data) => data?.booking?.isBookable },
        },
        {
          name: 'maxPersons',
          type: 'number',
          defaultValue: 25,
          label: 'Maximum de personnes',
          admin: { condition: (data) => data?.booking?.isBookable },
        },
        {
          name: 'minAdvanceDays',
          type: 'number',
          defaultValue: 0,
          label: 'Délai minimum de réservation (jours)',
          admin: { condition: (data) => data?.booking?.isBookable },
        },
        {
          name: 'maxAdvanceMonths',
          type: 'number',
          defaultValue: 12,
          label: 'Fenêtre max de réservation (mois)',
          admin: { condition: (data) => data?.booking?.isBookable },
        },
        {
          name: 'availableDays',
          type: 'select',
          hasMany: true,
          label: 'Jours de la semaine disponibles',
          options: [
            { label: 'Lundi', value: 'monday' },
            { label: 'Mardi', value: 'tuesday' },
            { label: 'Mercredi', value: 'wednesday' },
            { label: 'Jeudi', value: 'thursday' },
            { label: 'Vendredi', value: 'friday' },
            { label: 'Samedi', value: 'saturday' },
            { label: 'Dimanche', value: 'sunday' },
          ],
          admin: { condition: (data) => data?.booking?.isBookable },
        },
        {
          name: 'timeSlot',
          type: 'text',
          label: 'Créneau horaire (ex: 18h-22h)',
          localized: true,
          admin: { condition: (data) => data?.booking?.isBookable },
        },
        {
          name: 'blockedDates',
          type: 'array',
          label: 'Dates bloquées (fermetures exceptionnelles)',
          fields: [
            { name: 'date', type: 'date', required: true },
            { name: 'reason', type: 'text' },
          ],
          admin: { condition: (data) => data?.booking?.isBookable },
        },
      ],
    },

    // ─── Politique d'annulation ───
    {
      name: 'cancellation',
      type: 'group',
      label: "Politique d'annulation",
      fields: [
        {
          name: 'fee24h',
          type: 'number',
          defaultValue: 100,
          label: 'Frais <24h avant (%)',
        },
        {
          name: 'fee7days',
          type: 'number',
          defaultValue: 30,
          label: 'Frais <7 jours avant (%)',
        },
        {
          name: 'feeOver8days',
          type: 'number',
          defaultValue: 0,
          label: 'Frais ≥8 jours avant (%)',
        },
      ],
    },

    // ─── Options mariage ───
    {
      name: 'weddingOptions',
      type: 'array',
      label: 'Options complémentaires (mariages)',
      admin: { condition: (data) => data?.type === 'mariage' },
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'price', type: 'number', required: true, label: 'Prix (XPF)' },
      ],
    },

    // ─── Mariage : lien externe ───
    {
      name: 'externalBookingUrl',
      type: 'text',
      label: 'URL de réservation externe (mariages)',
      admin: { condition: (data) => data?.type === 'mariage' },
    },

    // ─── Médias ───
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

    // ─── SEO ───
    // (via plugin-seo déjà installé)

    // ─── Ordre d'affichage ───
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
```

### 3.4 Données initiales à saisir (seed)

| slug | type | name (FR) | priceAdult | priceChild | hasPersonTypes | isBookable | availableDays |
|---|---|---|---|---|---|---|---|
| `diner-spectacle` | `diner_spectacle` | Dîner-spectacle | 12500 | 5950 | ✅ | ✅ | `tuesday, friday` |
| `spectacle-seul` | `spectacle_seul` | Spectacle seul | 6200 | 2950 | ✅ | ✅ | `tuesday, friday` |
| `1-atelier-culturel` | `atelier` | 1 Atelier culturel | 3500 | — | ❌ | ✅ | `tuesday, wednesday, thursday, friday` |
| `3-ateliers-culturels` | `atelier` | 3 Ateliers culturels | 7000 | — | ❌ | ✅ | `tuesday, wednesday, thursday, friday` |
| `mariage-maeva` | `mariage` | Mariage Maeva | 70000 | — | ❌ | ❌ | — |
| `mariage-natihere` | `mariage` | Mariage Natihere | 120000 | — | ❌ | ❌ | — |
| `mariage-vaiarii` | `mariage` | Mariage Vaiarii | 165000 | — | ❌ | ❌ | — |
| `mariage-herenui` | `mariage` | Mariage Herenui | 205000 | — | ❌ | ❌ | — |

---

## 4. Collection `Bookings` — Réservations

### 4.1 Rôle

Chaque entrée représente une réservation faite par un client pour une prestation à une date donnée.

### 4.2 Slug Payload

```
bookings
```

### 4.3 Champs

```typescript
// src/collections/Bookings.ts

import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Réservation', plural: 'Réservations' },
  admin: {
    useAsTitle: 'bookingReference',
    defaultColumns: ['bookingReference', 'product', 'date', 'status', 'totalAmount'],
    group: 'Commerce',
  },
  fields: [
    // ─── Référence unique ───
    {
      name: 'bookingReference',
      type: 'text',
      required: true,
      unique: true,
      label: 'Référence',
      admin: { description: 'Auto-générée : TV-YYYYMMDD-XXXX' },
    },

    // ─── Prestation réservée ───
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Prestation',
    },

    // ─── Date et créneau ───
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date de réservation',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },

    // ─── Participants ───
    {
      name: 'participants',
      type: 'group',
      label: 'Participants',
      fields: [
        { name: 'adults', type: 'number', required: true, min: 0, defaultValue: 1, label: 'Adultes' },
        { name: 'children', type: 'number', min: 0, defaultValue: 0, label: 'Enfants (-12 ans)' },
      ],
    },

    // ─── Options ───
    {
      name: 'options',
      type: 'group',
      label: 'Options',
      fields: [
        { name: 'transferAdults', type: 'number', min: 0, defaultValue: 0, label: 'Transferts A/R adulte' },
        { name: 'transferChildren', type: 'number', min: 0, defaultValue: 0, label: 'Transferts A/R enfant' },
      ],
    },

    // ─── Code promo ───
    {
      name: 'promoCode',
      type: 'text',
      label: 'Code promo appliqué',
    },
    {
      name: 'isPromoApplied',
      type: 'checkbox',
      defaultValue: false,
    },

    // ─── Calcul financier ───
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
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      label: 'Montant total (XPF)',
    },

    // ─── Statut ───
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

    // ─── Client ───
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Client',
    },
    {
      name: 'guestInfo',
      type: 'group',
      label: 'Info client (sans compte)',
      admin: { condition: (data) => !data?.customer },
      fields: [
        { name: 'firstName', type: 'text', label: 'Prénom' },
        { name: 'lastName', type: 'text', label: 'Nom' },
        { name: 'email', type: 'email', required: true, label: 'Email' },
        { name: 'phone', type: 'text', label: 'Téléphone' },
        { name: 'country', type: 'text', label: 'Pays' },
      ],
    },

    // ─── Lien vers la commande ───
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Commande liée',
    },

    // ─── Notes ───
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes internes',
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      label: 'Notes du client',
    },
  ],

  timestamps: true,
}
```

---

## 5. Collection `Orders` — Commandes / Paiements

### 5.1 Rôle

Chaque entrée représente une commande avec son état de paiement PayZen/OSB.

### 5.2 Slug Payload

```
orders
```

### 5.3 Champs

```typescript
// src/collections/Orders.ts

import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Commande', plural: 'Commandes' },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'booking', 'totalAmount', 'paymentStatus', 'createdAt'],
    group: 'Commerce',
  },
  fields: [
    // ─── Numéro de commande ───
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Numéro de commande',
      admin: { description: 'Auto-généré : CMD-YYYYMMDD-XXXX' },
    },

    // ─── Réservation liée ───
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      label: 'Réservation',
    },

    // ─── Client ───
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Client',
    },

    // ─── Facturation ───
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

    // ─── Montants ───
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      label: 'Montant total (XPF)',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'XPF',
      admin: { readOnly: true },
    },

    // ─── Détail des lignes ───
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

    // ─── Paiement PayZen ───
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
        { name: 'payzenOrderId', type: 'text', label: 'Order ID PayZen (vads_order_id)' },
        { name: 'payzenTransStatus', type: 'text', label: 'Statut brut PayZen (vads_trans_status)' },
        { name: 'payzenAuthResult', type: 'text', label: 'Code auth PayZen' },
        { name: 'payzenRawResponse', type: 'json', label: 'Réponse brute IPN (debug)' },
        { name: 'paidAt', type: 'date', label: 'Date de paiement' },
      ],
    },

    // ─── Notes ───
    {
      name: 'orderNotes',
      type: 'textarea',
      label: 'Notes de commande (client)',
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Notes internes',
    },
  ],

  timestamps: true,
}
```

---

## 6. Logique de tarification — `src/lib/booking/pricing.ts`

Transposition directe du code PHP `tiki_calculate_price` (snippet v16) en TypeScript.

```typescript
// src/lib/booking/pricing.ts

type ProductType = 'diner_spectacle' | 'spectacle_seul' | 'atelier' | 'mariage'

interface PricingInput {
  productType: ProductType
  priceAdult: number
  priceChild: number
  promoAdult?: number
  promoChild?: number
  hasPersonTypes: boolean
  adults: number
  children: number
  transferAdults: number
  transferChildren: number
  transferPriceAdult: number
  transferPriceChild: number
  promoCode?: string
  validPromoCodes?: string[] // codes actifs
}

interface PricingResult {
  subtotalPersons: number
  subtotalTransfer: number
  discount: number
  total: number
  breakdown: {
    label: string
    quantity: number
    unitPrice: number
    subtotal: number
  }[]
}

export function calculateBookingPrice(input: PricingInput): PricingResult {
  const breakdown: PricingResult['breakdown'] = []
  const isPromo = input.promoCode && input.validPromoCodes?.includes(input.promoCode)

  let subtotalPersons = 0

  if (input.productType === 'atelier') {
    // Ateliers : tarif unique par personne (adulte + enfant = total personnes)
    const totalPersons = input.adults + input.children
    const unitPrice = isPromo && input.promoAdult ? input.promoAdult : input.priceAdult
    subtotalPersons = totalPersons * unitPrice
    breakdown.push({
      label: 'Participants',
      quantity: totalPersons,
      unitPrice,
      subtotal: subtotalPersons,
    })
  } else {
    // Dîner-spectacle / Spectacle seul : tarif adulte + tarif enfant
    const adultPrice = isPromo && input.promoAdult ? input.promoAdult : input.priceAdult
    const childPrice = isPromo && input.promoChild ? input.promoChild : input.priceChild

    const adultTotal = input.adults * adultPrice
    const childTotal = input.children * childPrice
    subtotalPersons = adultTotal + childTotal

    if (input.adults > 0) {
      breakdown.push({ label: 'Adulte', quantity: input.adults, unitPrice: adultPrice, subtotal: adultTotal })
    }
    if (input.children > 0) {
      breakdown.push({ label: 'Enfant (-12 ans)', quantity: input.children, unitPrice: childPrice, subtotal: childTotal })
    }
  }

  // Transferts
  let subtotalTransfer = 0
  if (input.transferAdults > 0) {
    const t = input.transferAdults * input.transferPriceAdult
    subtotalTransfer += t
    breakdown.push({ label: 'Transfert A/R adulte', quantity: input.transferAdults, unitPrice: input.transferPriceAdult, subtotal: t })
  }
  if (input.transferChildren > 0) {
    const t = input.transferChildren * input.transferPriceChild
    subtotalTransfer += t
    breakdown.push({ label: 'Transfert A/R enfant', quantity: input.transferChildren, unitPrice: input.transferPriceChild, subtotal: t })
  }

  const total = subtotalPersons + subtotalTransfer

  return {
    subtotalPersons,
    subtotalTransfer,
    discount: 0, // la remise est déjà intégrée via le prix promo
    total,
    breakdown,
  }
}
```

---

## 7. Routes API à créer

### 7.1 `POST /api/booking/quote`

Reçoit un produit + participants + options, retourne le prix calculé (appelé par le frontend avant le checkout).

### 7.2 `POST /api/booking/availability`

Reçoit un produit + un mois, retourne les dates disponibles (basé sur `availableDays` + `blockedDates` + capacité restante par date).

### 7.3 `POST /api/checkout/create-order`

Crée la réservation + la commande, initie le paiement PayZen, retourne le formulaire de redirection PayZen.

### 7.4 `POST /api/payzen/notify`

Webhook IPN PayZen — reçoit la notification de paiement, vérifie la signature HMAC, met à jour le statut de l'ordre et de la réservation.

### 7.5 `GET /api/payzen/return`

Page de retour après paiement (succès, erreur, annulation).

---

## 8. Extension de la collection `Users`

Ajouter un champ `role` à la collection Users existante du template website :

```typescript
{
  name: 'role',
  type: 'select',
  defaultValue: 'customer',
  options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Client', value: 'customer' },
  ],
  access: { update: isAdmin },
  admin: { position: 'sidebar' },
}
```

Et un join field pour voir les réservations du client :

```typescript
{
  name: 'bookings',
  type: 'join',
  collection: 'bookings',
  on: 'customer',
  label: 'Réservations',
}
```

---

## 9. Ordre d'implémentation

### Phase 3a — Collections (2-3h)

1. Créer `src/collections/Products.ts`
2. Créer `src/collections/Bookings.ts`
3. Créer `src/collections/Orders.ts`
4. Étendre `src/collections/Users/index.ts`
5. Enregistrer dans `payload.config.ts`
6. Générer la migration : `pnpm payload migrate:create --name add-commerce-collections`
7. Builder et tester : `pnpm build && systemctl restart tikivillage`
8. Saisir les 8 produits dans l'admin Payload

### Phase 3b — Logique métier (2-3h)

1. Créer `src/lib/booking/pricing.ts`
2. Créer `src/lib/booking/availability.ts`
3. Créer `src/app/api/booking/quote/route.ts`
4. Créer `src/app/api/booking/availability/route.ts`
5. Tester via curl / Postman

### Phase 4 — Frontend réservation (1 semaine)

1. Page `/prestations` (liste des produits)
2. Page `/prestations/[slug]` (détail + calendrier + formulaire)
3. Composant `BookingForm` (sélection participants + date + options)
4. Composant `AvailabilityCalendar`
5. Page `/checkout` (formulaire facturation)
6. Pages `/checkout/succes`, `/checkout/erreur`, `/checkout/annulation`

### Phase 5 — PayZen (1 semaine)

1. Créer `src/lib/payzen/` (client, config, signature HMAC, payload)
2. Créer `src/app/api/checkout/create-order/route.ts`
3. Créer `src/app/api/payzen/notify/route.ts`
4. Créer `src/app/api/payzen/return/route.ts`
5. Tester en mode TEST avec les clés PayZen

---

## 10. Correspondance WordPress → Payload

| Concept WordPress | Concept Payload |
|---|---|
| WooCommerce Product (type booking) | Collection `Products` |
| WooCommerce Bookings (bookable_person) | Champs `participants` dans `Bookings` |
| WooCommerce Bookings (bookable_resource) | Champs `booking.availableDays` + `booking.blockedDates` dans `Products` |
| Code snippet tarification v16 PHP | `src/lib/booking/pricing.ts` |
| WooCommerce Order | Collection `Orders` |
| WooCommerce Cart | State React côté client (pas de collection — le panier est en mémoire jusqu'au checkout) |
| WPML (3 langues) | `localized: true` sur les champs texte de `Products` |
| Passerelle PayZen/OSB | `src/lib/payzen/` + routes API custom |
| WooCommerce Customer | Collection `Users` étendue avec `role: customer` |

---

**Fin de la modélisation v1.0.**

Prochaine étape : implémenter la phase 3a (création des collections) sur CT 204 via Claude Code.
