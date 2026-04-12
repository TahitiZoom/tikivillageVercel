# tikivillageVercel

> **Refonte du site [www.tikivillage.pf](https://www.tikivillage.pf) sur une stack Next.js 16 + Payload CMS + Turso + Cloudflare R2 + Vercel.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Payload](https://img.shields.io/badge/Payload_CMS-3.81-000)](https://payloadcms.com)
[![Turso](https://img.shields.io/badge/Turso-libSQL-4ff8d2)](https://turso.tech)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2-f38020?logo=cloudflare)](https://www.cloudflare.com/developer-platform/products/r2/)
[![Status](https://img.shields.io/badge/phase_2-validée_%2F_phase_3_en_cours-blue)](./tikivillageVercel-cahier-des-charges-v4.md)
[![Licence](https://img.shields.io/badge/licence-MIT-blue)](./LICENSE)

---

## Contexte

**Tiki Village** est un centre culturel polynésien réel, situé à Moorea, qui propose des prestations touristiques : shows polynésiens, visites culturelles, cérémonies de mariage, hébergement. Le site actuel `www.tikivillage.pf` tourne depuis des années sous **WordPress** avec **WooCommerce**, **WooCommerce Bookings**, **WPML** (multilingue FR/EN/JA) et une passerelle de paiement **PayZen / OSB Banque de Polynésie**.

Ce projet est la **refonte complète** de ce site sur une stack moderne, entièrement maîtrisée, plus rapide et plus maintenable. Il est développé par [Stéphane Sayeb](https://tahitizoom.pf) (TahitiZoom) et sert également de **pièce de portfolio full-stack**.

Le WordPress actuel reste en production jusqu'au cutover DNS final. Le développement se fait en parallèle sur une infrastructure staging accessible publiquement via un tunnel Cloudflare.

## État actuel du projet

- ✅ Frontend multilingue actif en `fr`, `en`, `ja`
- ✅ Home page publique reliée au document `Pages > Home` dans Payload
- ✅ Header, footer et hero rapprochés visuellement du site source `tikivillage.pf`
- ✅ Switcher FR / EN / JA présent dans la navigation
- ✅ Police sans-serif frontend remplacée par **Dosis**
- ✅ **Frise bandeau** récréée avec chevrons pattern (50px height, objectFit contain, overlay pattern)
- ✅ **Formulaire de contact intégré** à la Section 8 de la home page avec :
  - FormBlock Payload (champs Nom, Email, Téléphone, Message)
  - Bouton d'envoi localisé (ENVOYER / SEND / ソウシン)
  - Texte légal RGPD avec lien vers politique de confidentialité
  - Support multilingue FR/EN/JA avec étiquettes de champs localisées
- ✅ Migration des pages éditoriales du menu démarrée à partir des exports WordPress / JSON dans `docs/migration-source`
- ✅ Workflow courant sur `staging` : vérification, build complet (`rm .next`), relance, commit, push

---

## Aperçu de la stack

| Couche | Choix | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.1 |
| CMS headless | Payload CMS | 3.81.0 |
| Template de base | [`payloadcms/templates/website`](https://github.com/payloadcms/payload/tree/main/templates/website) officiel stable | 3.81 |
| Base de données | [Turso](https://turso.tech) (libSQL serverless) | client 0.17 |
| Adapter DB Payload | `@payloadcms/db-sqlite` | 3.81.0 |
| Stockage des médias | Cloudflare R2 (compatible S3) | — |
| Plugins Payload | `plugin-seo`, `plugin-search`, `plugin-form-builder`, `plugin-redirects`, `plugin-nested-docs` | 3.81.0 |
| Éditeur riche | Lexical | `@payloadcms/richtext-lexical` 3.81 |
| Multilingue | `next-intl` 4.x + Payload localization | 4.9.x |
| UI | Tailwind CSS + Radix UI + Dosis + Lucide React | — |
| Imagerie | sharp | 0.34 |
| Runtime | Node.js | 22.22.2 LTS |
| Gestionnaire de paquets | pnpm | 10.33.0 |
| Hébergement staging | Proxmox LXC + Cloudflare Tunnel | — |
| Hébergement prod (cible) | Vercel | — |
| Catalogue prestations (phase 3) | à définir (plugin ecommerce stable BETA à éviter) | — |
| Paiement (phase 5) | PayZen / OSB Banque de Polynésie via adapter custom | — |

---

## Architecture des environnements

| Environnement | Conteneur | IP | Branche Git | Base Turso | URL | Statut |
|---|---|---|---|---|---|---|
| **DEV staging** | Proxmox LXC CT 204 `tikivillage-dev` | 192.168.1.63 | `staging` | `tikivillage-staging` | [tikivillage-staging.tahitizoom.pf](https://tikivillage-staging.tahitizoom.pf) | ✅ Actif |
| **PROD (future)** | Proxmox LXC CT 203 `tikivillage-prod` (à créer) | 192.168.1.54 | `main` | `tikivillage` | `www.tikivillage.pf` (après cutover) | ⏳ À créer |

L'environnement DEV est **accessible publiquement en HTTPS** via un tunnel Cloudflare sur la zone `tahitizoom.pf`. Aucun port n'est ouvert sur le routeur, aucune IP publique n'est exposée, aucun certificat SSL n'est à gérer — Cloudflare fournit tout ça nativement.

---

## Démarrage rapide (local ou sur un CT)

### Prérequis

- **Node.js 22.x** (via `nvm install 22`)
- **pnpm 10.x** (`npm install -g pnpm`)
- **Git**
- **Compte Turso** avec une base créée ([doc Turso](https://docs.turso.tech))
- **Compte Cloudflare** avec un bucket R2 créé et des credentials API

### Installation

```bash
# 1. Cloner le repo
git clone git@github.com:TahitiZoom/tikivillageVercel.git
cd tikivillageVercel

# 2. Se mettre sur la branche staging (DEV)
git checkout staging

# 3. Copier le .env.example en .env et remplir les valeurs
cp .env.example .env
chmod 600 .env
# Éditer .env avec tes credentials Turso + R2 + SMTP + Payload

# 4. Installer les dépendances
pnpm install --ignore-workspace

# 5. Appliquer les migrations à la base Turso (création du schéma)
pnpm payload migrate

# 6. Builder et démarrer le serveur de production
pnpm build
pnpm start
```

Le serveur tourne sur `http://localhost:3000`.

- Dashboard admin Payload : `http://localhost:3000/admin`
- Site public FR : `http://localhost:3000/fr`
- Site public EN : `http://localhost:3000/en`
- Site public JA : `http://localhost:3000/ja`

### Vérifications utiles

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

### Premier compte admin

Au premier démarrage sur une base vide, Payload affiche un écran "Create your first user". Tu y crées ton compte admin avec email + mot de passe fort.

### Alimenter avec du contenu de démo (optionnel)

Une fois connecté à l'admin, un bouton **"Seed your database"** apparaît dans le dashboard pour pré-remplir la base avec des pages, posts, catégories et médias de démonstration.

---

## Multilingue FR/EN/JA

Le site supporte trois langues avec routing URL explicite (`/fr/`, `/en/`, `/ja/`). La locale par défaut est le français.

### Architecture

| Couche | Rôle | Fichiers clés |
|---|---|---|
| **Payload localization** | Champs traduits dans l'admin (hero, title, meta, layout) | `src/payload.config.ts`, `src/collections/Pages/`, `src/heros/` |
| **next-intl routing** | URLs préfixées `/fr/` `/en/` `/ja/`, redirection `/ → /fr` | `src/i18n/routing.ts` |
| **Middleware** | Interception + redirection locale (fichier `proxy.ts`) | `src/proxy.ts` |
| **Messages UI** | Traductions des textes statiques de l'interface | `messages/fr.json`, `messages/en.json`, `messages/ja.json` |
| **LocaleSwitcher** | Switcher FR / EN / JA dans le header | `src/components/LocaleSwitcher/` |

### Routing

```
/          → 307 redirect → /fr
/fr        → 200 (page d'accueil, français)
/en        → 200 (page d'accueil, anglais)
/ja        → 200 (page d'accueil, japonais)
/fr/contact → 200
/en/contact → 200
/fr/mentions-legales → 200
/fr/confidentialite  → 200
```

### Layouts

- `src/app/(frontend)/layout.tsx` — shell HTML/body uniquement (pas de `getLocale()` pour éviter les conflits de rendu statique)
- `src/app/(frontend)/[locale]/layout.tsx` — `NextIntlClientProvider` + Header + Footer + CookieBanner

### Points d'attention

- Le fichier middleware Next.js 16 se nomme **`proxy.ts`** (convention renommée, plus `middleware.ts`)
- Le matcher du proxy **exclut `/next/`** pour ne pas intercepter les routes internes Payload (`/next/seed`, `/next/preview`, `/next/exit-preview`)
- Les fonctions `React.cache()` de Payload ne doivent **pas** appeler `draftMode()` en interne — le passer en paramètre pour éviter `DYNAMIC_SERVER_USAGE` sur les routes statiques

---

## Pages légales & Cookie Banner

### Cookie Banner (`src/components/CookieBanner/`)

Bannière de consentement cookies apparaissant au premier chargement (délai 1 seconde).

- Clé localStorage : `tv-cookie-consent` (valeurs : `accepted` / `declined`)
- Rendu uniquement côté client (`'use client'`)
- Traductions FR/EN/JA via next-intl
- Liens vers `/[locale]/confidentialite` et `/[locale]/mentions-legales`
- Couleur du bouton "Accepter" : coral `#D4504A` (couleur Tiki Village)

### Pages statiques

| Route | Description |
|---|---|
| `/[locale]/mentions-legales` | Éditeur, hébergeur Vercel, propriété intellectuelle, responsabilité, droit applicable |
| `/[locale]/confidentialite` | RGPD : responsable traitement, données collectées, cookies, conservation 3 ans, droits, sécurité |

Les textes de ces pages sont entièrement traduits en FR/EN/JA via les fichiers `messages/*.json` (namespaces `legal` et `privacy`).

> **⚠️ À compléter :** le champ `registrationValue` dans les 3 fichiers messages contient `[À compléter]` — remplacer par le numéro d'immatriculation officiel de Tiki Village Moorea.

---

## Workflow de développement

### En mode développement (hot reload)

```bash
pnpm dev
```

### En mode production (sur le staging CT 204)

```bash
# Statut du service
systemctl status tikivillage

# Logs en temps réel
journalctl -u tikivillage -f

# Redémarrer après rebuild
systemctl restart tikivillage
```

### Appliquer des modifications de code

```bash
cd /var/www/tikivillageVercel
git pull origin staging
pnpm install          # si package.json a changé
pnpm build            # prebuild applique automatiquement les migrations Payload
systemctl restart tikivillage
```

### Modifier le schéma Payload

Quand tu ajoutes un champ ou une collection dans la config Payload :

```bash
# 1. Modifier la config Payload (collections, champs, etc.)
# 2. Générer la migration (répondre N au prompt "dev mode push" si présent)
pnpm payload migrate:create --name add-hero-subtitle-field

# 3. Vérifier le fichier généré
ls src/migrations/

# 4. Commit avec le code
git add src/collections/ src/migrations/
git commit -m "feat(pages): add hero subtitle field"
git push origin staging
```

Le script `prebuild` exécute automatiquement `payload migrate` avant chaque `pnpm build`.

> **⚠️ Piège SQLite / Turso :** les noms d'index SQLite sont globaux (pas par table). Si `push` (mode dev) et `migrate` divergent, les index en conflit empêchent la migration. Solution validée : drop de toutes les tables, suppression de tous les fichiers de migration, régénération d'une migration initiale unique.

---

## Structure du repo

```
tikivillageVercel/
├── .env.example                    # Variables d'environnement (template)
├── next.config.ts                  # Config Next.js + withNextIntl + withPayload
├── package.json
├── tsconfig.json                   # Paths @/* → src/*, sans baseUrl (deprecated)
├── messages/
│   ├── fr.json                     # Traductions FR (nav, common, home, footer, cookie, legal, privacy)
│   ├── en.json                     # Traductions EN
│   └── ja.json                     # Traductions JA
├── src/
│   ├── proxy.ts                    # Middleware next-intl (Next.js 16 : proxy.ts, pas middleware.ts)
│   ├── payload.config.ts           # Config Payload avec localization FR/EN/JA + sqliteAdapter Turso
│   ├── payload-types.ts            # Types TypeScript générés automatiquement
│   ├── migrations/
│   │   └── 20260409_045012.ts      # Migration unique — schéma complet FR/EN/JA
│   ├── i18n/
│   │   ├── routing.ts              # defineRouting (locales, defaultLocale, localePrefix: always)
│   │   ├── request.ts              # getRequestConfig (charge messages/{locale}.json)
│   │   └── navigation.ts          # createNavigation (Link, redirect, usePathname, useRouter)
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx          # Shell HTML/body — sans getLocale() (évite DYNAMIC_SERVER_USAGE)
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx      # NextIntlClientProvider + Header + Footer + CookieBanner
│   │   │       ├── page.tsx        # Page d'accueil (re-export de [slug]/page)
│   │   │       ├── [slug]/page.tsx # Pages CMS avec locale
│   │   │       ├── posts/          # Archive et détail des articles avec locale
│   │   │       ├── search/         # Recherche avec locale
│   │   │       ├── mentions-legales/page.tsx   # Page légale statique
│   │   │       └── confidentialite/page.tsx    # Politique de confidentialité RGPD
│   │   └── (payload)/              # Routes admin Payload
│   ├── collections/                # Pages, Posts, Categories, Media, Users
│   ├── Header/                     # Global Header avec LocaleSwitcher
│   ├── Footer/                     # Global Footer avec liens légaux
│   ├── blocks/                     # Blocks réutilisables (Hero, Content, Form, Media…)
│   ├── components/
│   │   ├── CookieBanner/           # Bannière consentement cookies (localStorage tv-cookie-consent)
│   │   ├── LocaleSwitcher/         # Boutons FR / EN / 日
│   │   ├── BeforeLogin/            # Branding Tiki Village dans l'admin
│   │   ├── BeforeDashboard/        # Accueil admin FR avec instructions multilingue
│   │   └── Logo/                   # Logo gradient coral/orange "Tiki Village"
│   ├── providers/                  # Theme provider + ThemeSelector
│   └── utilities/                  # getURL, generateMeta, getDocument, getGlobals…
├── ressources/
│   ├── HelloTikiVillage/           # Export Elementor du site WordPress actuel
│   └── ImportTikiVillage/          # Export WordPress (pages, produits, images, XML)
└── tikivillageVercel-cahier-des-charges-v1_2.md   # ⚠️ Document de référence
```

---

## Frontend actuel

| Élément | Détail |
|---|---|
| Palette principale | Teal / bleu / doré inspirée du site source, avec adaptations par section |
| Police frontend par défaut | `Dosis` via `src/app/(frontend)/fonts/Dosis-VariableFont_wght.ttf` |
| Header | Bandeau contact + navigation blanche + switcher FR/EN/JA + vague `wave-brush.svg` |
| Hero home | Template `High Impact` adapté au site source, avec image/vidéo, CTA et vagues haute/basse |
| Footer | Bloc haut blanc + logos paiement, sous-footer bordeaux avec liens légaux et coordonnées |
| CMS home | Le rendu frontend de la home s’appuie sur `Pages > Home` dans Payload |

---

## Documentation complète

Pour le détail complet du projet — décisions architecturales, historique des versions, stratégie de migration WordPress, configuration systemd, tunnel Cloudflare, leçons apprises du bootstrap — voir le **[cahier des charges consolidé](./tikivillageVercel-cahier-des-charges-v1_2.md)**.

---

## Roadmap

| Phase | Objectif | Statut |
|---|---|---|
| **Phase 1** | Bootstrap technique (repo, Turso, R2, tunnel, admin Payload accessible) | ✅ **Terminée** (8 avril 2026) |
| **Phase 2** | Multilingue FR/EN/JA, branding initial, pages légales, cookie banner | ✅ **Validée** |
| **Phase 3** | Migration éditoriale des pages WordPress, ajustements visuels page par page | 🚧 **En cours** |
| **Phase 4** | Catalogue prestations | ⏳ |
| **Phase 5** | Système de réservation custom (collections `Bookings` + `Availability`) | ⏳ |
| **Phase 6** | Intégration paiement PayZen / OSB via adapter custom | ⏳ |
| **Phase 7** | Inventaire final des redirections 301 + préparation PROD | ⏳ |
| **Phase 8** | Création CT 203 PROD + cutover DNS Hostinger → Cloudflare + bascule en production | ⏳ |

---

## Décisions architecturales clés

1. **Template `website` officiel Payload (stable)** comme base, plutôt que le template `ecommerce` (BETA instable). Le plugin ecommerce stable sera évalué en phase 3.

2. **Turso (libSQL serverless)** à la place de MongoDB — base SQL relationnelle moderne, serverless, compatible edge runtime, gratuite jusqu'à plusieurs Go.

3. **Migrations SQL explicites** commitées dans `src/migrations/`. Le build Next.js ne peut pas fonctionner sur une base Turso vide. Sur ce projet, les scripts Payload ponctuels sont plus sûrs en `NODE_ENV=production` pour éviter les conflits entre `push` dev et migrations SQLite/Turso.

4. **Cloudflare R2** pour le stockage des médias — compatible API S3, gratuit jusqu'à 10 Go, sans frais d'egress.

5. **Cloudflare Tunnel sur la zone `tahitizoom.pf`** — expose le staging en HTTPS sans toucher au DNS de production.

6. **next-intl 4.x avec `localePrefix: 'always'`** — toutes les routes publiques sont préfixées (`/fr/`, `/en/`, `/ja/`). La racine `/` redirige vers `/fr` (307). Le fichier middleware Next.js 16 se nomme `proxy.ts`.

7. **`draftMode()` hors des `React.cache()`** — appeler `draftMode()` dans une fonction wrappée par `cache()` provoque `DYNAMIC_SERVER_USAGE` sur les routes à `generateStaticParams`. Le booléen `draft` doit être passé en paramètre.

8. **`baseUrl` retiré du `tsconfig.json`** — remplacé par les alias `@/*` vers `src/*`. Les 5 imports bare `src/...` existants ont été convertis en `@/...`.

Les décisions complètes sont documentées dans le [cahier des charges consolidé](./tikivillageVercel-cahier-des-charges-v1_2.md#2-décisions-actées).

---

## Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

Le code du template Payload dont est dérivé ce projet est également sous licence MIT, provenant du [monorepo officiel Payload](https://github.com/payloadcms/payload/tree/main/templates/website).

---

## Auteur

**Stéphane Sayeb** — [TahitiZoom](https://tahitizoom.pf)

Développeur full-stack basé en Polynésie française. Ce projet est développé dans le cadre de la refonte du site Tiki Village et sert également de démonstration technique pour son portfolio.

- GitHub : [@TahitiZoom](https://github.com/TahitiZoom)
- Site : [tahitizoom.pf](https://tahitizoom.pf)

---

## Liens utiles

- [Documentation Payload CMS](https://payloadcms.com/docs)
- [Documentation Next.js 16](https://nextjs.org/docs)
- [Documentation next-intl](https://next-intl.dev)
- [Documentation Turso](https://docs.turso.tech)
- [Documentation Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Documentation Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Template website officiel Payload](https://github.com/payloadcms/payload/tree/main/templates/website)

---

*README mis à jour au 10 avril 2026.*
