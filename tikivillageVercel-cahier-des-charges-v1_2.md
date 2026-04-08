# Cahier des charges consolidé — `tikivillageVercel`

**Document maître unique.** Remplace et met à jour :
- `tikivillageVercel-cahier-des-charges-v1.0.md`
- `tikivillageVercel-cahier-des-charges-v1.1.md`

**Date** : 8 avril 2026
**Version** : v1.2
**Statut** : version consolidée post-bootstrap effectif. Documente le bootstrap technique complet réalisé sur CT 204 DEV le 7-8 avril 2026, incluant les décisions correctives (abandon du template ecommerce BETA au profit du template website stable, stratégie de migrations SQL pour Turso, mise en service systemd tikivillage).
**Propriétaire** : Stéphane Sayeb / TahitiZoom

---

## Historique des versions

| Version | Date | Changements |
|---|---|---|
| v1.0 | 2026-04-07 | Version consolidée initiale. Fusionne et corrige les deux documents préalables. Décisions intégrées : chemin projet `/var/www/tikivillageVercel`, SMTP Microsoft 365, Cloudflare Tunnel option C-1. |
| v1.1 | 2026-04-07 | Ajout section 11 « Bases de données Turso » : création des bases PROD (`tikivillage`) et DEV (`tikivillage-staging`), tokens, injection dans les `.env`, tests de connexion. |
| **v1.2** | **2026-04-08** | **Refonte majeure post-bootstrap.** Documente (1) l'abandon de la voie tentative clone `tahitizoomwebVercel` + template ecommerce BETA, (2) la bascule sur le template website officiel stable, (3) la stratégie de migrations Payload pour Turso (migrate:create + prebuild), (4) le fix `try/catch` dans `generateStaticParams`, (5) le service systemd `tikivillage.service`, (6) la mise en production du Cloudflare Tunnel, (7) la validation end-to-end du seed avec upload R2. Renumérotation : la section 11 Turso reste 11, nouvelles sections 12-15 ajoutées, anciennes 12-18 décalées en 16-22. |

**Convention de versionnement** : `vX.Y` où `Y` = ajustement ou ajout mineur sans refonte structurelle, `X` = refonte structurelle ou changement majeur de stratégie.

---

## Sommaire

1. Contexte et objectif
2. Décisions actées
3. Périmètre fonctionnel cible
4. Stack technique
5. Architecture du repository
6. Stratégie de migration WordPress → Payload
7. Infrastructure Proxmox
8. Procédure de bootstrap du repo GitHub (historique réel)
9. Procédure d'installation des conteneurs
10. Variables d'environnement
11. Bases de données Turso (PROD et DEV)
12. **Stratégie de migrations Payload pour Turso** (nouveau v1.2)
13. **Choix du template officiel `website`** (nouveau v1.2)
14. **Services systemd : tikivillage + cloudflared** (refonte v1.2)
15. **Validation end-to-end du bootstrap CT 204** (nouveau v1.2)
16. Workflow de développement
17. Exposition publique du staging via Cloudflare Tunnel
18. Migration domaine Hostinger → Vercel (cutover final)
19. Checklist finale
20. Annexes : commandes de rappel et diagnostic
21. Leçons apprises du bootstrap (nouveau v1.2)
22. Prochains livrables conseillés

---

## 1. Contexte et objectif

### 1.1 Contexte

Le site **`www.tikivillage.pf`** est actuellement en production chez **Hostinger** sous **WordPress**, avec la stack suivante :

- **WooCommerce** — catalogue et commandes
- **WooCommerce Bookings** — réservation de prestations
- **Passerelle de paiement OSB** (Banque OSB / PayZen) — paiement CB
- **WPML** — multilingue **FR / EN / JA**

L'objectif est de **reconstruire ce site** sur une stack moderne **Next.js + Payload CMS**, en repartant initialement du socle technique du projet existant `tahitizoomwebVercel`, mais **sans aucun contenu ni logique métier** de Tahiti Zoom.

### 1.2 Motivation réelle

Le projet `tikivillageVercel` a **deux motivations superposées** :

1. **Objectif pro direct** : remplacer le WordPress Tiki Village qui est lent (même avec LiteSpeed cache), subit beaucoup de tentatives d'intrusion/scraping, et dont la stack WooCommerce + WooCommerce Bookings + WPML + PayZen arrive à ses limites en termes de cohérence technique.
2. **Objectif portfolio** : constituer une pièce de portfolio full-stack crédible pour Stéphane Sayeb. Tiki Village est idéal pour ça car c'est un vrai projet métier, avec des besoins réels (multilingue 3 langues, réservations, paiement local polynésien), et qui permet de démontrer la maîtrise de Next.js 16, Payload 3.x, Turso, Cloudflare R2, Vercel.

Il n'y a **pas de deadline dure**. Le projet avance par phases, avec la stabilité du site WordPress actuel comme filet de sécurité.

### 1.3 Objectif technique

Livrer, en plusieurs phases étalées sur 2-3 mois, une stack **Next.js 16 + Payload CMS 3.x + Turso + Cloudflare R2 + Vercel** capable de remplacer fonctionnellement le WordPress actuel sur les points suivants :

- Site vitrine multilingue FR / EN / JA (pages éditoriales, SEO, navigation, header/footer)
- Catalogue de prestations (équivalent Products WooCommerce)
- Système de réservation custom avec calendrier de disponibilités (équivalent WooCommerce Bookings)
- Intégration paiement OSB / PayZen (équivalent passerelle OSB actuelle)
- Migration du contenu existant et redirections WordPress → Next.js
- Mise en production sur le domaine final `www.tikivillage.pf` après cutover DNS

---

## 2. Décisions actées

### 2.1 Décisions héritées des versions v1.0 et v1.1

| # | Décision | Rationale |
|---|---|---|
| D1 | Chemin projet `/var/www/tikivillageVercel` | Convention Debian/Ubuntu standard, cohérente avec les autres projets TahitiZoom |
| D2 | Domaine définitif `tikivillage.pf` (deux `l`) | Correction coquille initiale `tikivilage.pf` |
| D3 | SMTP transactionnel via Microsoft 365 / Exchange Online (`smtp.office365.com`) | Mailbox `support-stephane@tikivillage.pf` déjà existante sur plan Exchange Online 1 |
| D4 | Exposition staging via Cloudflare Tunnel option C-1 sur la zone `tahitizoom.pf` | Permet d'exposer le staging sans toucher au DNS Hostinger encore en production sur `tikivillage.pf` |
| D5 | URL staging : `tikivillage-staging.tahitizoom.pf` | Sous-domaine sur la zone Cloudflare `tahitizoom.pf` déjà active |
| D6 | URL staging post-cutover : `staging.tikivillage.pf` | À activer après la migration DNS Hostinger → Cloudflare |
| D7 | CT 203 = PROD `tikivillage-prod` 192.168.1.54 (branche `main`) | Convention Proxmox TahitiZoom |
| D8 | CT 204 = DEV `tikivillage-dev` 192.168.1.63 (branche `staging`) | Convention Proxmox TahitiZoom |
| D9 | Bases Turso : `tikivillage` (PROD, token 1 an avec rappel de rotation) et `tikivillage-staging` (DEV, token `never`) | Voir section 11 |
| D10 | Cloudflare R2 comme stockage médias | Bucket `tikivillage-media-staging` pour DEV, `tikivillage-media` à créer pour PROD |

### 2.2 Nouvelles décisions v1.2 (post-bootstrap effectif)

| # | Décision | Rationale |
|---|---|---|
| **D11** | **Abandon de la voie « clone tahitizoomwebVercel »** | La tentative de cloner `tahitizoomwebVercel` et de nettoyer le code Tahiti Zoom a révélé des dépendances profondes sur le blog Tahiti Zoom, Posts, Facebook sync, etc. Estimation du nettoyage : 1-2h avec risque élevé, pour aboutir à un « template stripped blog ». Décision : repartir d'un template Payload officiel. |
| **D12** | **Abandon du template `payload/templates/ecommerce`** | Template marqué BETA dans son propre README. Contient ~50 erreurs de typing TypeScript en mode `strict: true` dans du code frontend (CartModal, CheckoutPage, ProductItem, etc.) qui serait de toute façon jeté en phase 2 pour être remplacé par du code Tiki Village. Décision : utiliser à la place le template `website` stable. |
| **D13** | **Adoption du template `payload/templates/website`** | Template officiel Payload **stable, documenté, testé en production**. Décrit comme « the official Payload Website Template. Use it to power websites, blogs, or portfolios from small to enterprise ». Inclut nativement : Pages, Posts, Categories, Media, Users, Header, Footer, Redirects, Forms, Search. Couvre 100% des besoins de la phase 1 et 2 de Tiki Village. |
| **D14** | **Ajout ultérieur du plugin ecommerce stable `@payloadcms/plugin-ecommerce@3.81.0` par-dessus le template website** (phase 3) | Le **plugin** ecommerce (package npm `@payloadcms/plugin-ecommerce`) est stable et publié sur npm. Ce qui est BETA c'est uniquement le **template**. On installera le plugin par-dessus le template website en phase 3 pour obtenir Products / Carts / Orders / Transactions / Addresses sans dépendance Stripe forcée. |
| **D15** | **Stratégie de migrations Payload obligatoire pour Turso** | Le couple SQLite/Turso est **plus strict** que MongoDB : les requêtes sur tables inexistantes lèvent une exception `SQLITE_UNKNOWN: no such table` au lieu de retourner `[]`. Le build Next.js en mode `production` (qui lance `generateStaticParams` côté Payload) échoue donc sur une base vide. **Solution** : (a) générer une migration initiale via `pnpm payload migrate:create` et la committer, (b) exécuter `pnpm payload migrate` avant chaque build via un script `prebuild` dans `package.json`. Voir section 12. |
| **D16** | **Fix défensif `try/catch` dans les `generateStaticParams`** | Filet de sécurité supplémentaire : si une requête échoue pour n'importe quelle raison (base vide, erreur réseau Turso, etc.), les `generateStaticParams` retournent `[]` au lieu de crasher le build. Les pages concernées sont alors rendues dynamiquement au runtime plutôt que statiquement. Voir section 12. |
| **D17** | **Service systemd unique `tikivillage.service`** sur CT 204 (au lieu de deux services `tikivillage-dev` + `tikivillage-prod` initialement prévus) | Chaque CT n'héberge qu'un seul environnement : CT 204 = DEV, CT 203 = PROD. Un service systemd par CT suffit. Le nom du service est simplifié en `tikivillage.service` pour les deux LXC (le contexte LXC fait foi). |
| **D18** | **`pnpm start` (mode production) en service systemd sur CT 204** | Plutôt que `pnpm dev` qui recompile en continu et consomme plus de ressources. Le CT 204 sert de staging accessible publiquement via le tunnel Cloudflare, donc le comportement doit être proche de la prod. Les modifications de code se font via VS Code Remote-SSH + `git push` + `git pull` + `pnpm build` + `systemctl restart tikivillage`. |
| **D19** | **`NODE_ENV=production` forcé dans le service systemd** | Nécessaire pour Next.js production runtime, et pour éviter que Payload ne recrée dynamiquement le schéma (incompatible avec la stratégie de migrations). |
| **D20** | **SMTP reporté en TODO** | Le parcours Microsoft 365 (activation SMTP AUTH + Entra Conditional Access → Named locations → Configure MFA trusted IPs → service settings → app passwords + MFA enforced) s'est avéré chronophage et source d'erreurs. **Décision** : laisser `SMTP_PASSWORD=TODO_APP_PASSWORD_OR_RESEND_KEY` dans `.env`, reporter à une session dédiée. Alternative envisagée : bascule vers **Resend.com** (plus simple, `@payloadcms/email-resend`, 100 emails/jour gratuits). SMTP **n'est pas bloquant** pour le démarrage de Payload. |
| **D21** | **Security defaults Microsoft 365 déjà désactivés sur le tenant `tikivillage.pf`** | Confirmé par capture d'écran Entra → Identity → Properties → « Votre organisation n'est pas protégée par les paramètres de sécurité par défaut ». SMTP AUTH est donc techniquement viable quand on voudra activer l'envoi. |
| **D22** | **Cloudflare Tunnel opérationnel via zone `tahitizoom.pf`** | Tunnel `tikivillage-staging` créé via `cloudflared tunnel create`, route DNS `tikivillage-staging.tahitizoom.pf` auto-créée via `cloudflared tunnel route dns`. Service systemd `cloudflared.service` installé et actif. |
| **D23** | **Ordre des phases post-bootstrap** | Phase 1 (terminée) : bootstrap technique. Phase 2 : multilingue FR/EN/JA **avant** branding et contenu (activer la localisation sur base vide évite toute migration de données). Phase 3 : branding Tiki Village (couleurs, logo, fonts, Header/Footer). Phase 4 : catalogue prestations via plugin ecommerce. Phase 5 : réservations custom. Phase 6 : intégration PayZen. Phase 7 : migration contenu WordPress + cutover DNS. |

---

## 3. Périmètre fonctionnel cible

Inchangé depuis v1.0. Voir v1.1 section 3 pour le détail.

**Rappel synthétique** :
- **Partie éditoriale** : pages centre culturel, show polynésien, mariages, villages de vacances, légal (CGV, confidentialité) en FR/EN/JA
- **Catalogue prestations** : liste des prestations Tiki Village (show, visite, mariage, séjour, etc.) avec prix et disponibilités
- **Système de réservation** : sélection de date + créneau, nombre d'adultes/enfants, calcul du prix, vérification de la disponibilité, paiement CB
- **Espace client** : login, historique de réservations, profil
- **Admin** : gestion des prestations, des réservations, des contenus éditoriaux, des traductions

---

## 4. Stack technique

### 4.1 Stack cible (inchangée depuis v1.1)

| Couche | Choix | Version |
|---|---|---|
| Runtime | Node.js | 22.22.2 (LTS) |
| Gestionnaire de paquets | pnpm | 10.33.0 |
| Framework fullstack | Next.js | 16.2.1 (Turbopack) |
| CMS headless | Payload CMS | 3.81.0 |
| Base de données | libSQL / Turso | Client `@libsql/client@0.17.x` |
| Adapter Payload DB | `@payloadcms/db-sqlite` | 3.81.0 |
| Stockage médias | Cloudflare R2 (S3-compatible) | via plugin storage Payload |
| Email transactionnel | Microsoft 365 / Exchange Online (OU Resend.com à confirmer) | `@payloadcms/email-nodemailer` |
| Éditeur riche | Lexical | `@payloadcms/richtext-lexical@3.81.0` |
| Multilingue | `localization` native de Payload + `next-intl` côté frontend | (à installer en phase 2) |
| Hébergement frontend | Vercel (Hobby puis Pro si besoin) | à activer en phase de mise en prod |
| Reverse proxy staging | Cloudflare Tunnel | `cloudflared` latest |
| Domaine | `tikivillage.pf` (actuellement chez Hostinger, à migrer vers Cloudflare) | - |

### 4.2 Stack du template website officiel (dépendances héritées)

Le template `payload/templates/website` fournit nativement :

- `@payloadcms/admin-bar` — barre admin flottante pour les utilisateurs connectés
- `@payloadcms/live-preview-react` — prévisualisation en temps réel dans l'admin
- `@payloadcms/plugin-form-builder` — constructeur de formulaires
- `@payloadcms/plugin-nested-docs` — hiérarchisation des pages
- `@payloadcms/plugin-redirects` — gestion des redirections
- `@payloadcms/plugin-search` — recherche full-text
- `@payloadcms/plugin-seo` — gestion SEO (meta title, description, og:image)
- **UI** : Tailwind CSS, Radix UI (checkbox, label, select, slot), Geist, Lucide React, class-variance-authority
- **Imagerie** : `sharp` activé dans `payload.config.ts`

**Total : 32 dépendances** dans le `package.json` après adaptation (retrait de `@payloadcms/db-mongodb`, ajout de `@payloadcms/db-sqlite` et `@libsql/client`).

---

## 5. Architecture du repository

### 5.1 Structure réelle après bootstrap (template website adapté)

```
/var/www/tikivillageVercel/
├── .env                         # secrets, chmod 600, NON commité
├── .env.example                 # exemple à jour, commité
├── .git/                        # historique git, branche staging active
├── .gitignore
├── .next/                       # build Next.js, NON commité
├── .vscode/
├── AGENTS.md
├── Dockerfile
├── README.md
├── components.json
├── docker-compose.yml
├── eslint.config.mjs
├── next-sitemap.config.cjs
├── next.config.ts
├── package.json                 # 32 deps, tous Payload en ^3.81.0
├── playwright.config.ts
├── postcss.config.js
├── public/                      # assets statiques
├── redirects.ts
├── src/
│   ├── Footer/
│   │   └── config.ts            # global Footer
│   ├── Header/
│   │   └── config.ts            # global Header
│   ├── access/                  # helpers access control
│   │   ├── authenticated.ts
│   │   ├── authenticatedOrPublished.ts
│   │   └── ...
│   ├── app/
│   │   ├── (frontend)/          # pages publiques Next.js (template website)
│   │   │   ├── [slug]/page.tsx  # pages dynamiques
│   │   │   ├── posts/[slug]/page.tsx
│   │   │   ├── posts/page/[pageNumber]/page.tsx
│   │   │   └── layout.tsx
│   │   └── (payload)/           # routes admin Payload
│   │       ├── admin/[[...segments]]/page.tsx
│   │       ├── api/[...slug]/route.ts
│   │       ├── api/graphql/route.ts
│   │       └── layout.tsx
│   ├── blocks/                  # blocks Payload (Hero, Content, Media, etc.)
│   ├── collections/
│   │   ├── Categories/
│   │   ├── Media/
│   │   ├── Pages/
│   │   ├── Posts/
│   │   └── Users/
│   ├── components/              # composants React du template
│   ├── environment.d.ts
│   ├── fields/                  # champs réutilisables (defaultLexical, link, hero)
│   ├── heros/                   # types de hero (high/medium/low impact)
│   ├── hooks/                   # hooks Payload (revalidatePath, etc.)
│   ├── migrations/              # ← NOUVEAU v1.2
│   │   └── 20260408_163646.ts   # migration initiale committée
│   ├── payload.config.ts        # sqliteAdapter Turso + push:true + plugins
│   ├── payload-types.ts         # types auto-générés, commité
│   ├── plugins/                 # config des plugins Payload
│   ├── providers/               # providers React (theme, etc.)
│   ├── search/                  # composants de recherche
│   └── utilities/               # utilitaires (getURL, formatDate, etc.)
├── tailwind.config.mjs
├── test.env
├── tests/
├── tsconfig.json
├── vitest.config.mts
└── vitest.setup.ts
```

### 5.2 Collections Payload natives du template website

| Collection | Rôle | Cible Tiki Village (post-adaptation) |
|---|---|---|
| `Pages` | Pages éditoriales avec blocks | Pages centre culturel, show, mariages, légal |
| `Posts` | Articles de blog | Actualités Tiki Village (si pertinent, sinon retirer) |
| `Categories` | Catégories (tags) | Regroupement des Pages et Posts |
| `Media` | Stockage médias (images) | Médiathèque, stockée sur R2 |
| `Users` | Utilisateurs authentifiés | Admins Tiki Village + plus tard clients |
| `Redirects` | Redirections 301/302 | Redirections WordPress → Next.js au cutover |
| `Forms` | Formulaires (via plugin-form-builder) | Contact, demande de devis |
| `Form Submissions` | Soumissions des formulaires | Historique des envois |
| `Search Results` | Index de recherche (via plugin-search) | Recherche full-text du site |

**Collections à ajouter en phases suivantes** (ces collections ne sont PAS dans le template website par défaut) :

| Collection | Phase | Origine |
|---|---|---|
| `Products` | Phase 4 | Plugin `@payloadcms/plugin-ecommerce@3.81.0` (ajouté par-dessus) |
| `Carts`, `Orders`, `Transactions`, `Addresses`, `Variants` | Phase 4 | Idem, injectées dynamiquement par le plugin |
| `Bookings` (custom) | Phase 5 | Collection custom Tiki Village |
| `Availability` (custom) | Phase 5 | Collection custom Tiki Village |
| `Testimonials` (optionnel) | Phase 2+ | Collection custom éditoriale |
| `Coupons` (optionnel) | Phase 6+ | Plugin ecommerce ou custom |

### 5.3 Globals Payload natifs

| Global | Rôle |
|---|---|
| `Header` | Navigation principale, CTA, logo, liens |
| `Footer` | Coordonnées, liens légaux, réseaux sociaux, copyright |

Globals supplémentaires à ajouter en phase 2 : `SiteSettings` (nom, contacts, SEO global), `Homepage` (si on veut découpler la homepage des pages).

---

## 6. Stratégie de migration WordPress → Payload

Inchangée depuis v1.0. Voir v1.1 section 6 pour le détail.

**Principe** : pas de migration automatique. WordPress reste source de vérité de référence pendant le développement. On ré-alimente Payload manuellement ou via scripts d'import ciblés.

---

## 7. Infrastructure Proxmox

### 7.1 État actuel (au 8 avril 2026)

| CT | Nom | IP | Rôle | Statut | Branche Git |
|---|---|---|---|---|---|
| 200 | `tahitizoom-prod` | 192.168.1.52 | PROD Tahiti Zoom | Actif (hors scope) | `main` |
| 201 | `tahitizoom-dev` | 192.168.1.53 | DEV Tahiti Zoom | Actif (hors scope) | `staging` |
| 203 | `tikivillage-prod` | 192.168.1.54 | PROD Tiki Village | **À créer** | `main` |
| **204** | **`tikivillage-dev`** | **192.168.1.63** | **DEV Tiki Village** | **✅ Actif, bootstrapé** | **`staging`** |

### 7.2 Spécifications CT 204 (DEV, opérationnel)

- **OS** : Debian 12
- **CPU** : 4 cores
- **RAM** : 4 Go
- **Disque** : 20 Go
- **Réseau** : bridged sur `vmbr0`, IP statique `192.168.1.63`
- **Services actifs** : `tikivillage.service`, `cloudflared.service`, `ssh`
- **Ports écoutés en interne** : 3000 (Next.js), 22 (SSH)
- **Accès** : SSH depuis le LAN, HTTPS public via Cloudflare Tunnel

### 7.3 Spécifications CT 203 (PROD, à créer)

Identique au CT 204 sauf :
- **Nom** : `tikivillage-prod`
- **IP** : 192.168.1.54
- **Branche Git** : `main`
- **Base Turso** : `tikivillage` (et non `tikivillage-staging`)
- **Tunnel Cloudflare** : séparé, à créer plus tard
- **URL publique** : `www.tikivillage.pf` après cutover DNS (section 18)

---

## 8. Procédure de bootstrap du repo GitHub (historique réel)

Cette section **remplace** la procédure théorique de la v1.1 par l'historique réel du bootstrap effectué le 7-8 avril 2026.

### 8.1 Chronologie synthétique

1. **Tentative voie A (abandonnée)** : clone du repo `tahitizoomwebVercel`, archivage de l'état initial en branche `archive/tahitizoom-clone-pre-bootstrap` + tag `archive-tahitizoom-pre-bootstrap`, puis tentative de nettoyage du code Tahiti Zoom. Abandonnée à cause des dépendances profondes sur le blog Tahiti Zoom.

2. **Tentative voie B (abandonnée)** : copie du template `payload/templates/ecommerce` via rsync par-dessus l'état nettoyé. Adaptation du `package.json` (toutes les deps Payload en `^3.81.0`, suppression de `db-mongodb`, ajout de `db-sqlite` + `libsql/client`). Adaptation du `payload.config.ts` (`mongooseAdapter` → `sqliteAdapter` Turso, activation de `sharp`). Réécriture propre du `.env.example`. Création de collections custom `Bookings` et `Availability`. `pnpm install` réussi (895 packages). `pnpm build` échoué sur 50+ erreurs de typing TypeScript dans le code frontend du template ecommerce (BETA). **Abandonnée.**

3. **Voie C (retenue) : template website officiel** — Bloc RESET : suppression complète du working tree sauf `.git` et `.env`, copie du template `payload/templates/website` via Python (`shutil.copytree`). Adaptation minimale : B1 = `package.json` (11 packages Payload `workspace:*` → `^3.81.0`, suppression de `db-mongodb`, ajout de `db-sqlite` + `libsql/client`), B2 = `payload.config.ts` (import et bloc `db` adaptés pour Turso). **Total des modifications : 2 fichiers, 14 lignes.**

4. **Installation** : `pnpm install --ignore-workspace` réussi en 43 secondes, 895 packages, `sharp` compilé, aucun conflit de peer deps.

5. **Première tentative de build** : échec à l'étape « Collecting page data » avec `SQLITE_UNKNOWN: no such table: posts` puis `no such table: pages`. Cause : la base Turso est vide, le `generateStaticParams` du template website échoue sur les requêtes SQL. Le `push: true` de Payload ne s'exécute pas dans le contexte Next.js build (`NODE_ENV=production` forcé par Next).

6. **Fix via Claude Code** : génération de la migration initiale avec `pnpm payload migrate:create --name initial`, application avec `pnpm payload migrate` (60+ tables créées en 46 secondes dans `tikivillage-staging`), ajout d'un script `prebuild` dans `package.json` qui exécute automatiquement `payload migrate` avant chaque build, ajout d'un `try/catch` dans les 3 `generateStaticParams` pour retourner `[]` en cas d'erreur (filet de sécurité). `push: true` rendu inconditionnel dans `payload.config.ts` (sans la garde `NODE_ENV !== 'production'`).

7. **Build réussi** : `pnpm build` génère 12 pages statiques, tout compile, type-check passe.

8. **Admin Payload opérationnel** : premier compte admin créé, seed de la base lancé depuis le dashboard Payload (clic sur « Seed your database »), création automatique de pages, posts, catégories, médias. Uploads R2 validés sans erreur.

9. **Tunnel Cloudflare** : installation de `cloudflared` via `.deb`, `cloudflared tunnel login` avec sélection de la zone `tahitizoom.pf`, création du tunnel `tikivillage-staging`, route DNS auto-créée vers `tikivillage-staging.tahitizoom.pf`, fichier de config YAML dans `/etc/cloudflared/config.yml`, installation en service systemd.

10. **Service systemd `tikivillage.service`** : création du fichier unit, `ExecStart=pnpm start`, `EnvironmentFile=.env`, `NODE_ENV=production`, `Restart=on-failure`. Enable + start. Accès HTTPS public validé via `https://tikivillage-staging.tahitizoom.pf/admin`.

11. **Commit + push** : un commit `feat(bootstrap): switch to Payload website template + Turso` pushé sur la branche `staging` de `github.com/TahitiZoom/tikivillageVercel`.

### 8.2 Commandes clés (pour reproduction future sur CT 203 PROD)

```bash
# Prérequis : CT 203 créé, Node 22 + pnpm installés, repo cloné
cd /var/www/tikivillageVercel
git checkout main
git pull origin main
pnpm install --ignore-workspace

# Appliquer les migrations (crée le schéma dans la base Turso PROD)
pnpm payload migrate

# Builder
pnpm build

# Le build va automatiquement relancer migrate via le script prebuild
# Si la base est déjà à jour, migrate retourne immédiatement
```

---

## 9. Procédure d'installation des conteneurs

Inchangée depuis v1.1. Voir v1.1 section 9 pour le détail des étapes Proxmox (création du CT, installation Debian 12, configuration réseau, installation nvm + Node 22 + pnpm, création de l'utilisateur root avec mot de passe, configuration SSH pour VS Code Remote).

**Note v1.2** : l'accès SSH root sur CT 204 utilise actuellement `PermitRootLogin yes` + mot de passe, à remplacer par une clé SSH + `PermitRootLogin prohibit-password` dès qu'on a un moment (voir section 21, leçon n°4).

---

## 10. Variables d'environnement

### 10.1 Fichier `.env` sur CT 204 (état au 8 avril 2026)

Le fichier `.env` est en `chmod 600` sur CT 204 et **n'est pas commité** (`.gitignore` ligne 2 : `.env`).

**Contenu actuel** (secrets masqués) :

```bash
# ============================================================================
# tikivillageVercel — Variables d'environnement DEV (CT 204)
# ============================================================================

# --- Environnement ---
APP_ENV=development
NODE_ENV=development   # (overridé à 'production' par systemd pour tikivillage.service)

# --- Payload ---
PAYLOAD_SECRET=<généré via openssl rand -base64 32>
NEXT_PUBLIC_SERVER_URL=https://tikivillage-staging.tahitizoom.pf
PAYLOAD_PUBLIC_SERVER_URL=https://tikivillage-staging.tahitizoom.pf
PREVIEW_SECRET=<à compléter>
CRON_SECRET=<à compléter si jobs activés>

# --- Turso (DEV) ---
TURSO_DATABASE_URL=libsql://tikivillage-staging-<org>.turso.io
TURSO_AUTH_TOKEN=<JWT Turso, expiration never>

# --- Cloudflare R2 (staging) ---
S3_BUCKET=tikivillage-media-staging
S3_REGION=auto
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=<R2 API token access key, scoped au bucket>
S3_SECRET_ACCESS_KEY=<R2 API token secret key>
S3_PUBLIC_URL=https://media-staging.tikivillage.pf   # à créer quand DNS Cloudflare actif

# --- SMTP (TODO) ---
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=support-stephane@tikivillage.pf
SMTP_PASSWORD=TODO_APP_PASSWORD_OR_RESEND_KEY   # à compléter quand parcours Microsoft 365 finalisé OU basculer sur Resend
SMTP_FROM=accueil@tikivillage.pf
SMTP_ADMIN_EMAIL=accueil@tikivillage.pf

# --- PayZen / OSB (phase 6) ---
PAYZEN_SHOP_ID=A_REMPLACER
PAYZEN_MODE=TEST
PAYZEN_TEST_KEY=A_REMPLACER
PAYZEN_PROD_KEY=A_REMPLACER
PAYZEN_HMAC_TEST_KEY=A_REMPLACER
PAYZEN_HMAC_PROD_KEY=A_REMPLACER
PAYZEN_PUBLIC_TEST_KEY=A_REMPLACER
PAYZEN_PUBLIC_PROD_KEY=A_REMPLACER

# --- Branding ---
COMPANY_NAME="Tiki Village"
SITE_NAME="Tiki Village"
```

### 10.2 Placeholders restants (état au 8 avril 2026)

**Au total : 8 placeholders à compléter dans le futur** :

| Variable | Phase | Action |
|---|---|---|
| `SMTP_PASSWORD` | Quand disponible | Soit app password Microsoft 365, soit clé API Resend |
| `PAYZEN_SHOP_ID` | Phase 6 | Identifiant boutique OSB/PayZen (PROD et TEST) |
| `PAYZEN_TEST_KEY` | Phase 6 | Clé privée de test OSB |
| `PAYZEN_PROD_KEY` | Phase 6 | Clé privée de production OSB |
| `PAYZEN_HMAC_TEST_KEY` | Phase 6 | Clé HMAC de test pour la signature IPN |
| `PAYZEN_HMAC_PROD_KEY` | Phase 6 | Clé HMAC de production |
| `PAYZEN_PUBLIC_TEST_KEY` | Phase 6 | Clé publique JavaScript SDK (test) |
| `PAYZEN_PUBLIC_PROD_KEY` | Phase 6 | Clé publique JavaScript SDK (prod) |

---

## 11. Bases de données Turso

### 11.1 Bases créées (inchangé depuis v1.1)

| Base | Environnement | Token expiration | Statut |
|---|---|---|---|
| `tikivillage` | PROD (CT 203) | 1 an avec rappel de rotation annuel | ✅ Créée |
| `tikivillage-staging` | DEV (CT 204) | `never` | ✅ Créée, **schéma actif** |

### 11.2 URLs et auth

Les URLs et tokens complets sont dans les `.env` respectifs (voir section 10). Récupérables via :

```bash
turso db show tikivillage --url                  # URL de la base PROD
turso db tokens create tikivillage --expiration 1y
turso db show tikivillage-staging --url
turso db tokens create tikivillage-staging --expiration never
```

### 11.3 État du schéma Turso (DEV `tikivillage-staging`)

**Au 8 avril 2026** : **60+ tables** créées par la migration initiale `20260408_163646.ts`, alimentées par le seed du dashboard Payload (Pages, Posts, Categories, Media, Users, Header, Footer + tables versionnées `_v`).

**Pour inspecter** :

```bash
turso db shell tikivillage-staging "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

### 11.4 État du schéma Turso (PROD `tikivillage`)

**Vide** au 8 avril 2026. À initialiser quand le CT 203 PROD sera créé et bootstrapé, via `pnpm payload migrate` exécuté sur CT 203 avec le `.env` pointant vers `tikivillage` (PROD).

---

## 12. Stratégie de migrations Payload pour Turso (NOUVEAU v1.2)

### 12.1 Le problème découvert au bootstrap

Le couple **Payload + SQLite/Turso** se comporte différemment de **Payload + MongoDB** lors du build Next.js en mode production :

- **MongoDB** : si une collection n'existe pas, MongoDB la crée à la volée à la première écriture, et les requêtes sur une collection vide retournent `[]`. Le build Next.js passe sans problème.
- **SQLite/Turso (libSQL)** : les requêtes sur une table qui n'existe pas lèvent immédiatement une exception `SQLITE_UNKNOWN: no such table: <nom>`. Le build Next.js échoue.

**Et** : l'option `push: process.env.NODE_ENV !== 'production'` de `sqliteAdapter`, qui synchronise le schéma au démarrage de Payload en dev, **ne s'exécute pas** dans le contexte du build Next.js — parce que Next.js force `NODE_ENV=production` au build, et parce que le `push` est lié au démarrage du serveur Payload, pas à son initialisation en mode batch.

**Résultat constaté** : le `pnpm build` échoue à l'étape « Collecting page data » si la base Turso est vide, avec des erreurs successives `no such table: posts` puis `no such table: pages`.

### 12.2 La solution retenue : migrations SQL + script prebuild

**Trois éléments combinés** :

#### (1) Migration initiale générée et commitée

```bash
cd /var/www/tikivillageVercel
pnpm payload migrate:create --name initial
```

Payload inspecte sa config (collections, champs, globals), calcule le schéma SQL correspondant, et écrit un fichier TypeScript dans `src/migrations/`. Le nom du fichier contient un timestamp pour garantir l'ordre d'exécution.

**Exemple** : `src/migrations/20260408_163646.ts`

Ce fichier est **commité dans Git** et fait désormais partie du code source. À chaque modification de la config Payload qui affecte le schéma (nouveau champ, nouvelle collection, changement de type), il faudra générer une nouvelle migration avec `pnpm payload migrate:create --name <description>`.

#### (2) Script `prebuild` dans `package.json`

Ajout dans `scripts` :

```json
{
  "scripts": {
    "prebuild": "cross-env NODE_OPTIONS=--no-deprecation payload migrate",
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build"
  }
}
```

npm/pnpm exécute automatiquement le script `prebuild` **avant** le script `build`. Donc chaque `pnpm build` déclenche d'abord `payload migrate`, qui applique les migrations pending à la base Turso avant que Next.js ne démarre la compilation.

**Avantage** : fonctionne sur CT 204, CT 203 (PROD future), Vercel CI, GitHub Actions — n'importe quel environnement où on lance `pnpm build` a le schéma à jour automatiquement.

**Inconvénient local** : si on a lancé `pnpm dev` entre-temps et que Payload a « poussé » dynamiquement des modifications de schéma qui ne sont pas encore dans une migration, `payload migrate` va afficher un warning et demander confirmation. En cas de doute, répondre `N` et regénérer une migration propre avec `migrate:create`.

#### (3) Fix défensif `try/catch` dans les `generateStaticParams`

Filet de sécurité pour les pages qui utilisent `generateStaticParams` (pré-rendering statique au build). Pattern appliqué dans les 3 pages concernées du template website :

```typescript
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })
    return result.docs
      ?.filter((doc) => doc.slug !== 'home')
      .map(({ slug }) => ({ slug })) ?? []
  } catch (error) {
    console.warn('generateStaticParams failed, falling back to dynamic rendering:', error)
    return []
  }
}
```

**Effet** : si la base est vide ou si une requête échoue pour n'importe quelle raison (erreur réseau Turso, timeout, table inexistante malgré les migrations), `generateStaticParams` retourne `[]` et Next.js bascule automatiquement la route en rendu dynamique (SSR à la demande) au lieu de crasher le build.

**Performance** : légère dégradation (pas de pré-rendering statique pour ces routes), mais **acceptable** pour un site à trafic modéré comme Tiki Village. En pratique, une fois la base peuplée, le pré-rendering statique fonctionnera normalement.

### 12.3 Workflow de modifications de schéma

À partir de maintenant, chaque modification de la config Payload qui affecte le schéma (nouveau champ dans une collection, nouvelle collection, changement de type, etc.) suit ce workflow :

```bash
# 1. Modifier la config Payload (collections, champs, etc.)
vim src/collections/Pages/index.ts

# 2. Générer une nouvelle migration
pnpm payload migrate:create --name add-hero-subtitle-field

# 3. Vérifier le fichier généré
cat src/migrations/<timestamp>_add-hero-subtitle-field.ts

# 4. Committer la migration avec le code qui l'accompagne
git add src/collections/Pages/index.ts src/migrations/
git commit -m "feat(pages): add hero subtitle field with migration"
git push origin staging

# 5. Sur le serveur cible, pnpm build applique automatiquement la migration
ssh root@192.168.1.63
cd /var/www/tikivillageVercel
git pull origin staging
pnpm build  # ← le prebuild exécute payload migrate automatiquement
systemctl restart tikivillage
```

### 12.4 Commandes de diagnostic migrations

```bash
# Voir les migrations appliquées
pnpm payload migrate:status

# Annuler la dernière migration (rollback)
pnpm payload migrate:down

# Tout remettre à zéro (DESTRUCTIF, ne jamais faire en prod sans backup)
pnpm payload migrate:fresh --force-accept-warning
```

---

## 13. Choix du template officiel `website` (NOUVEAU v1.2)

### 13.1 Les 3 templates Payload évalués

Le monorepo `github.com/payloadcms/payload` propose plusieurs templates dans `templates/` :

| Template | Statut | Usage cible | Verdict pour Tiki Village |
|---|---|---|---|
| `blank` | Stable | Projet vide, à construire from scratch | Trop minimal, manquerait trop de plomberie |
| `website` | ✅ **Stable, production-ready** | Sites vitrine, blogs, portfolios | **✅ Retenu** |
| `with-vercel-website` | Stable | Variante optimisée Vercel (MongoDB Atlas + Vercel Blob Storage) | Non retenu (on veut Turso pas MongoDB) |
| `ecommerce` | ⚠️ BETA | Boutique en ligne | **❌ Rejeté** (cause : voir D12) |
| `with-postgres`, `with-cloudflare-d1`, etc. | Variantes spécialisées | Selon l'adapter DB | Non pertinent (on veut Turso) |

### 13.2 Ce que fournit le template `website`

**Collections natives** : Pages, Posts, Categories, Media, Users
**Globals natifs** : Header, Footer
**Plugins préinstallés** :
- `@payloadcms/plugin-seo` — gestion meta title, description, og:image, Twitter cards
- `@payloadcms/plugin-search` — index de recherche full-text
- `@payloadcms/plugin-form-builder` — constructeur de formulaires no-code
- `@payloadcms/plugin-redirects` — gestion de redirections 301/302
- `@payloadcms/plugin-nested-docs` — hiérarchie de pages

**Frontend Next.js** :
- Pages dynamiques `/[slug]` rendues depuis la collection `Pages`
- Blog `/posts/[slug]` avec pagination
- Pré-rendering statique des pages publiées (avec fallback dynamique pour les nouvelles)
- Live preview depuis l'admin Payload
- Dashboard d'admin avec composants personnalisés `BeforeLogin` et `BeforeDashboard`
- Bouton « Seed your database » dans le dashboard pour alimenter la base de démonstration
- Sitemap automatique via `next-sitemap`
- Intégration `sharp` pour le traitement d'images

**Stack UI** : Tailwind CSS, Radix UI, Geist fonts, Lucide React icons.

### 13.3 Adaptations minimales pour Tiki Village (phase 1 terminée)

**Uniquement 2 fichiers modifiés** par rapport au template vanilla :

1. **`package.json`** :
   - 11 packages `@payloadcms/*` passés de `workspace:*` à `^3.81.0`
   - Suppression de `@payloadcms/db-mongodb`
   - Ajout de `@payloadcms/db-sqlite@^3.81.0`
   - Ajout de `@libsql/client@^0.17.0`
   - Ajout du script `prebuild: "cross-env NODE_OPTIONS=--no-deprecation payload migrate"`

2. **`src/payload.config.ts`** :
   - Import `mongooseAdapter` remplacé par `sqliteAdapter`
   - Bloc `db: mongooseAdapter({ url: process.env.DATABASE_URL })` remplacé par :
     ```typescript
     db: sqliteAdapter({
       client: {
         url: process.env.TURSO_DATABASE_URL || 'file:./tikivillage.db',
         authToken: process.env.TURSO_AUTH_TOKEN,
       },
       push: true,
     }),
     ```
   - Le reste du fichier (collections, globals, editor, plugins, admin, jobs) est **inchangé**.

**Total : 2 fichiers, environ 20 lignes modifiées.** C'est le strict minimum pour faire tourner Turso à la place de MongoDB.

3. **Fichiers supplémentaires créés** (phase de fix migrations) :
   - `src/migrations/20260408_163646.ts` — migration initiale auto-générée par `pnpm payload migrate:create`
   - Modifications dans les 3 pages avec `generateStaticParams` pour ajouter le `try/catch` défensif (`src/app/(frontend)/[slug]/page.tsx`, `src/app/(frontend)/posts/[slug]/page.tsx`, `src/app/(frontend)/posts/page/[pageNumber]/page.tsx`)

### 13.4 Ajouts prévus phase 3-4 (plugin ecommerce par-dessus)

Quand on arrivera en phase 3, on ajoutera **le plugin `@payloadcms/plugin-ecommerce@3.81.0` par-dessus** le template website, sans remplacer quoi que ce soit.

Le plugin (qui lui est **stable**, contrairement au template du même nom qui est BETA) injecte dynamiquement les collections `Products`, `Carts`, `Orders`, `Transactions`, `Addresses`, `Variants`, `VariantOptions`, `VariantTypes` via la mécanique des plugins Payload. Aucune modification du template website ne sera nécessaire à part l'ajout de l'appel au plugin dans la config.

Exemple attendu de l'appel du plugin :

```typescript
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { payzenAdapter } from '@/lib/payments/payzen' // custom adapter à écrire en phase 6

export const plugins = [
  // ... plugins existants du template website
  ecommercePlugin({
    access: { /* ... */ },
    customers: { slug: 'users' },
    products: { /* override avec champs Tiki Village */ },
    payments: {
      paymentMethods: [payzenAdapter({ /* ... */ })]
    },
  }),
]
```

---

## 14. Services systemd : tikivillage + cloudflared (REFONTE v1.2)

### 14.1 Service `tikivillage.service` (serveur Next.js + Payload)

**Fichier** : `/etc/systemd/system/tikivillage.service`

```ini
[Unit]
Description=Tiki Village - Payload CMS + Next.js staging server
Documentation=https://github.com/TahitiZoom/tikivillageVercel
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/tikivillageVercel

EnvironmentFile=/var/www/tikivillageVercel/.env
Environment=NODE_ENV=production
Environment=PATH=/root/.nvm/versions/node/v22.22.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ExecStart=/root/.nvm/versions/node/v22.22.2/bin/pnpm start

Restart=on-failure
RestartSec=5s
StartLimitIntervalSec=60
StartLimitBurst=3

StandardOutput=journal
StandardError=journal
SyslogIdentifier=tikivillage

NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

**Commandes de gestion** :

```bash
# Statut
systemctl status tikivillage

# Logs en temps réel
journalctl -u tikivillage -f

# Logs des 100 dernières lignes
journalctl -u tikivillage -n 100 --no-pager

# Redémarrer (après git pull + pnpm build)
systemctl restart tikivillage

# Arrêter
systemctl stop tikivillage

# Activer au boot
systemctl enable tikivillage
```

**Particularités** :

- `EnvironmentFile=.env` : charge automatiquement toutes les variables du `.env` à chaque démarrage
- `Environment=NODE_ENV=production` : force le mode production, override de la valeur `NODE_ENV=development` du `.env`
- `Environment=PATH=...` : ajoute le chemin de `node` et `pnpm` au PATH (important, sinon systemd n'a pas accès aux binaires de nvm)
- `Restart=on-failure` + `StartLimitBurst=3` : redémarre au max 3 fois en 60 secondes avant d'abandonner (évite les boucles infinies en cas de bug bloquant)
- `User=root` : acceptable sur CT 204 isolé, à remplacer par un utilisateur dédié `tikivillage` en phase de mise en prod sur CT 203

### 14.2 Service `cloudflared.service` (tunnel Cloudflare)

**Fichier** : `/etc/systemd/system/cloudflared.service`

Créé automatiquement par `cloudflared service install` après création du tunnel. Pointe vers `/etc/cloudflared/config.yml` qui contient :

```yaml
tunnel: <UUID-du-tunnel-tikivillage-staging>
credentials-file: /root/.cloudflared/<UUID>.json

ingress:
  - hostname: tikivillage-staging.tahitizoom.pf
    service: http://localhost:3000
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

**Commandes de gestion** :

```bash
systemctl status cloudflared
journalctl -u cloudflared -f
systemctl restart cloudflared
cloudflared tunnel list
cloudflared tunnel info tikivillage-staging
```

### 14.3 Chaîne de démarrage au boot du CT 204

À chaque démarrage du CT 204 :

1. systemd démarre `network-online.target`
2. `cloudflared.service` démarre → établit le tunnel vers les edge servers Cloudflare
3. `tikivillage.service` démarre → lance `pnpm start` → Next.js sert le build production sur `localhost:3000`
4. Le tunnel Cloudflare route les requêtes HTTPS entrantes sur `tikivillage-staging.tahitizoom.pf` vers `localhost:3000`
5. L'admin Payload est accessible depuis n'importe où dans le monde

**Temps de démarrage total** : ~10 à 20 secondes après le boot du CT.

---

## 15. Validation end-to-end du bootstrap CT 204 (NOUVEAU v1.2)

### 15.1 Liste des validations effectuées le 8 avril 2026

| # | Test | Résultat |
|---|---|---|
| 1 | `pnpm install` (895 packages) | ✅ 43s, aucun conflit |
| 2 | `pnpm payload migrate:create --name initial` | ✅ Migration générée |
| 3 | `pnpm payload migrate` (60+ tables créées dans Turso) | ✅ 46s |
| 4 | `pnpm build` (compilation + type-check + génération statique) | ✅ 12 pages statiques générées |
| 5 | `pnpm start` (serveur production sur port 3000) | ✅ Démarrage en ~3s |
| 6 | Accès admin local `http://192.168.1.63:3000/admin` | ✅ Écran de login Payload affiché |
| 7 | Création du premier compte admin (Payload) | ✅ Redirect vers dashboard |
| 8 | Dashboard admin : affichage des 9 collections + 2 globals | ✅ Toutes présentes |
| 9 | « Seed your database » depuis le dashboard | ✅ Pages, Posts, Categories, Media, Users créés |
| 10 | Upload d'image vers R2 (via le seed) | ✅ Aucune erreur, fichiers visibles dans le bucket Cloudflare |
| 11 | Installation `cloudflared` sur CT 204 | ✅ Binaire `.deb` officiel Cloudflare |
| 12 | `cloudflared tunnel login` sur la zone `tahitizoom.pf` | ✅ Authentification réussie |
| 13 | `cloudflared tunnel create tikivillage-staging` | ✅ Tunnel créé avec UUID |
| 14 | `cloudflared tunnel route dns` vers `tikivillage-staging.tahitizoom.pf` | ✅ CNAME créé automatiquement |
| 15 | Fichier `/etc/cloudflared/config.yml` | ✅ Ingress routing localhost:3000 |
| 16 | `cloudflared tunnel ingress validate` | ✅ Config valide |
| 17 | Test tunnel en foreground 10 secondes | ✅ 4 connexions edge registered |
| 18 | `cloudflared service install` | ✅ Service systemd créé |
| 19 | `systemctl enable cloudflared` + `start` | ✅ Actif et running |
| 20 | Création service `tikivillage.service` | ✅ Fichier unit créé |
| 21 | `systemctl enable tikivillage` + `start` | ✅ Actif et running |
| 22 | `curl https://tikivillage-staging.tahitizoom.pf/admin` | ✅ Réponse 307 → redirect vers `/admin/login` |
| 23 | Accès admin via HTTPS public depuis navigateur Mac | ✅ Écran de login Payload affiché en HTTPS |
| 24 | Création/suppression de Page depuis l'admin via HTTPS | ✅ CRUD fonctionnel |
| 25 | Commit + push GitHub (branche `staging`) | ✅ Historique propre |

**Taux de validation : 25/25 tests passés.**

### 15.2 Périmètre hors validation (reporté)

| Sujet | Raison | Phase prévue |
|---|---|---|
| Envoi d'email SMTP | `SMTP_PASSWORD` en placeholder | Quand parcours Microsoft 365 finalisé, ou bascule Resend |
| Clé SSH root à la place du mot de passe | Non critique pour un LAN privé | À faire dès que possible (voir section 21) |
| Multilingue FR/EN/JA | Pas encore configuré | Phase 2 |
| Branding Tiki Village | Toujours le branding « Payload Website Template » | Phase 2 |
| Catalogue prestations | Plugin ecommerce pas encore installé | Phase 3 |
| Système de réservation | Collections custom pas créées | Phase 4 |
| Intégration PayZen | Placeholders `.env` | Phase 5 |
| Migration contenu WordPress | Pas commencée | Phase 6 |
| CT 203 PROD | Pas encore créé | Phase 7 (cutover) |
| DNS `tikivillage.pf` sur Cloudflare | Toujours chez Hostinger | Phase 7 (cutover) |

---

## 16. Workflow de développement

### 16.1 Workflow typique (développement local)

```bash
# 1. Sur ton Mac, connexion SSH via VS Code Remote ou terminal
ssh root@192.168.1.63

# 2. Aller dans le repo
cd /var/www/tikivillageVercel

# 3. Récupérer les dernières modifs
git pull origin staging

# 4. Installer les nouvelles deps (si package.json a changé)
pnpm install

# 5. Modifier le code avec VS Code Remote-SSH

# 6. Si modification de schéma Payload, générer une migration
pnpm payload migrate:create --name <description>

# 7. Builder
pnpm build
# (prebuild exécute automatiquement payload migrate)

# 8. Redémarrer le service pour prendre en compte le nouveau build
systemctl restart tikivillage

# 9. Tester
curl -sI https://tikivillage-staging.tahitizoom.pf/admin
# ou ouvrir l'URL dans le navigateur

# 10. Consulter les logs en cas de problème
journalctl -u tikivillage -f

# 11. Si tout fonctionne, commit et push
git add -A
git commit -m "feat(scope): description de la modif"
git push origin staging
```

### 16.2 Workflow alternatif : dev mode avec hot reload

Si on préfère développer avec rechargement à chaud (plus lent au premier load mais plus interactif pour écrire du code) :

```bash
# Arrêter le service production
systemctl stop tikivillage

# Lancer en dev
cd /var/www/tikivillageVercel
pnpm dev
# (Ctrl+C pour arrêter quand on a fini)

# Une fois le travail terminé, relancer le service production
pnpm build
systemctl start tikivillage
```

**Attention** : en mode `pnpm dev`, `push: true` peut modifier le schéma Turso dynamiquement. Si on lance ensuite `pnpm build` qui veut faire tourner `payload migrate`, il va détecter une divergence et afficher un prompt de confirmation. Dans ce cas, il faut **soit** générer une nouvelle migration propre avec `pnpm payload migrate:create`, **soit** répondre N au prompt et regénérer proprement.

---

## 17. Exposition publique du staging via Cloudflare Tunnel

### 17.1 Configuration en place (CT 204)

- **Tunnel** : `tikivillage-staging` (créé via `cloudflared tunnel create`)
- **Credentials** : `/root/.cloudflared/<UUID>.json`
- **Cert** : `/root/.cloudflared/cert.pem`
- **Config** : `/etc/cloudflared/config.yml`
- **Service systemd** : `cloudflared.service` (actif au boot)
- **Hostname public** : `tikivillage-staging.tahitizoom.pf`
- **Route interne** : `http://localhost:3000`
- **Zone Cloudflare utilisée** : `tahitizoom.pf` (et non `tikivillage.pf`, qui reste chez Hostinger)

### 17.2 Protection par Cloudflare Access (optionnel, à activer plus tard)

Actuellement le tunnel est **ouvert** (n'importe qui avec l'URL y accède). Pour ajouter une protection Cloudflare Access (SSO, mot de passe, OTP, etc.), aller dans le dashboard Cloudflare :

1. Zero Trust → Access → Applications
2. Add an application → Self-hosted
3. Application name : `Tiki Village Staging`
4. Session duration : `24 hours`
5. Application domain : `tikivillage-staging.tahitizoom.pf`
6. Créer une policy « Only authorized emails » avec la liste des emails autorisés
7. Save

Après ça, toute requête vers `tikivillage-staging.tahitizoom.pf` sera interceptée par une page de login Cloudflare Access avant d'atteindre Payload.

**À faire dès que le staging aura du contenu sensible**, pas nécessaire tant que c'est du contenu seed public.

---

## 18. Migration domaine Hostinger → Vercel / Cloudflare (cutover final)

Inchangé depuis v1.1. Voir v1.1 section 15 pour le plan complet de cutover DNS (Hostinger → Cloudflare → Vercel pour le frontend, Cloudflare pour le DNS et les redirections).

**Rappel synthétique** :
1. Phase 7 : décision de cutover
2. Snapshot WordPress complet
3. Test du site Next.js en staging sur `staging.tikivillage.pf`
4. Export des nameservers `tikivillage.pf` de Hostinger vers Cloudflare
5. Création des enregistrements DNS `tikivillage.pf` côté Cloudflare (A/CNAME vers Vercel, MX pour Exchange Online, TXT SPF/DKIM/DMARC)
6. Propagation DNS (24-48h)
7. Vérification de la résolution DNS mondiale
8. Bascule du trafic effective
9. Désactivation du site WordPress chez Hostinger (mais garder l'hébergement quelques semaines pour rollback éventuel)

---

## 19. Checklist finale

### 19.1 Phase 1 — Bootstrap technique (✅ TERMINÉE)

- [x] CT 204 créé sur Proxmox (192.168.1.63)
- [x] Debian 12 + Node 22.22.2 + pnpm 10.33.0 + Git + SSH
- [x] Repo GitHub `TahitiZoom/tikivillageVercel` cloné sur CT 204
- [x] Branches `main` (PROD) et `staging` (DEV) en place
- [x] Bases Turso créées (`tikivillage` et `tikivillage-staging`)
- [x] Bucket R2 Cloudflare créé (`tikivillage-media-staging`)
- [x] Credentials R2 injectés dans `.env`
- [x] Template Payload `website` copié dans le repo
- [x] `package.json` adapté (Turso, pnpm, plus de workspace:*)
- [x] `payload.config.ts` adapté pour Turso
- [x] `pnpm install` réussi
- [x] Migration initiale générée et commitée (`src/migrations/20260408_163646.ts`)
- [x] Script `prebuild` ajouté dans `package.json`
- [x] `try/catch` défensif dans les `generateStaticParams`
- [x] `pnpm build` réussi (12 pages statiques)
- [x] Premier compte admin Payload créé
- [x] Seed de la base Turso (dashboard Payload)
- [x] Upload R2 validé (via le seed)
- [x] Cloudflare Tunnel installé et configuré
- [x] Service systemd `cloudflared.service` actif
- [x] Service systemd `tikivillage.service` actif
- [x] Accès HTTPS public validé via `https://tikivillage-staging.tahitizoom.pf/admin`
- [x] Commit + push du travail complet sur `staging`
- [x] Cahier des charges v1.2 documenté

### 19.2 Phase 2 — Multilingue + branding (🔜 À COMMENCER)

- [ ] Installation et configuration `localization` Payload (FR/EN/JA)
- [ ] Configuration `next-intl` côté frontend
- [ ] Mise à jour du `.env.example` et du `.env` avec les nouvelles variables
- [ ] Dictionnaires FR/EN/JA (`src/i18n/dictionaries/`)
- [ ] Routes `/[locale]/...` dans Next.js
- [ ] Composant LanguageSwitcher dans le Header
- [ ] Marquage des champs traduisibles dans toutes les collections (Pages, Posts, Categories, Header, Footer)
- [ ] Branding : logo Tiki Village dans l'admin Payload (custom avatar + BeforeLogin)
- [ ] Branding : couleurs + fonts du site vitrine (Tailwind config)
- [ ] Branding : favicon et images d'OG
- [ ] Nettoyage du contenu seed du template
- [ ] Création du contenu éditorial réel de la homepage (seulement structure, pas encore les textes finaux)
- [ ] Test du build multilingue
- [ ] Test du rendering frontend en 3 langues
- [ ] Commit + push

### 19.3 Phase 3 — Catalogue prestations (plugin ecommerce)

- [ ] Ajout de `@payloadcms/plugin-ecommerce@3.81.0` dans `package.json`
- [ ] Configuration du plugin dans `src/plugins/index.ts`
- [ ] Override de la collection `Products` avec les champs Tiki Village (durée, capacité, langues disponibles, etc.)
- [ ] Pas de payment method en phase 3 (`payments: undefined`)
- [ ] Migration du schéma (`pnpm payload migrate:create --name add-ecommerce`)
- [ ] Création de quelques prestations de test dans l'admin
- [ ] Frontend : page `/prestations` qui liste les products
- [ ] Frontend : page détail `/prestations/[slug]`
- [ ] Test du build et des performances
- [ ] Commit + push

### 19.4 Phase 4 — Système de réservation custom

(À détailler en début de phase 4)

### 19.5 Phase 5 — Intégration PayZen / OSB

(À détailler en début de phase 5)

### 19.6 Phase 6 — Migration contenu WordPress

(À détailler en début de phase 6)

### 19.7 Phase 7 — Création CT 203 PROD et cutover

(À détailler en début de phase 7)

---

## 20. Annexes : commandes de rappel et diagnostic

### 20.1 Commandes de rappel — CT 204 DEV

```bash
# SSH depuis Mac
ssh root@192.168.1.63

# Aller dans le repo
cd /var/www/tikivillageVercel

# État du service
systemctl status tikivillage
systemctl status cloudflared

# Logs
journalctl -u tikivillage -f
journalctl -u cloudflared -f

# Workflow de déploiement local
git pull origin staging
pnpm install              # si package.json a changé
pnpm build                # prebuild applique les migrations automatiquement
systemctl restart tikivillage

# Test d'accès HTTPS public
curl -sI https://tikivillage-staging.tahitizoom.pf/admin
```

### 20.2 Commandes de rappel — CT 203 PROD (futur)

```bash
ssh root@192.168.1.54
cd /var/www/tikivillageVercel
git checkout main
git pull origin main
pnpm install
pnpm build
systemctl restart tikivillage
```

### 20.3 Diagnostic Turso

```bash
# Lister les tables
turso db shell tikivillage-staging "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

# Vérifier la taille de la base
turso db shell tikivillage-staging "SELECT COUNT(*) FROM pages;"

# Statut du schéma Payload
pnpm payload migrate:status
```

### 20.4 Diagnostic Cloudflare Tunnel

```bash
# État du tunnel
cloudflared tunnel list
cloudflared tunnel info tikivillage-staging

# Valider la config
cloudflared tunnel ingress validate

# Tester une route localement via le tunnel
cloudflared tunnel ingress url http://localhost:3000/admin
```

### 20.5 Diagnostic Next.js / Payload

```bash
# Qui écoute sur le port 3000 ?
ss -tlnp | grep ":3000"

# Test local direct (bypass tunnel)
curl -sI http://localhost:3000/admin

# Régénérer les types Payload après modification de config
pnpm payload generate:types

# Lancer Payload en mode CLI (déclenche le push schema en dev)
pnpm payload
```

### 20.6 Diagnostic Git

```bash
# État
git status
git log --oneline -10

# Vérifier les stashes (filet de sécurité des sessions précédentes)
git stash list

# Voir le diff d'un commit
git show HEAD
```

---

## 21. Leçons apprises du bootstrap (NOUVEAU v1.2)

Cette session de bootstrap a révélé plusieurs enseignements utiles pour les prochaines phases et pour d'autres projets similaires.

### 21.1 Ne pas choisir un template BETA comme base de projet

Le template `payload/templates/ecommerce` est **explicitement marqué BETA** dans son propre README. Malgré cette mention, on a passé plusieurs heures à essayer de l'adapter avant de se rendre compte que son code frontend contenait ~50 erreurs de typing TypeScript en mode strict, dans des composants (CartModal, CheckoutPage, ProductItem, etc.) qu'on allait de toute façon jeter en phase 2.

**Leçon** : toujours vérifier le statut de maturité d'un template officiel avant de construire dessus. Les mentions BETA ne sont pas décoratives. Pour un projet de production, n'utiliser que des templates marqués stable / production-ready.

### 21.2 Ne pas faire `git stash` sur du travail non committé en cours

Pendant le bootstrap, un bloc de nettoyage a utilisé `git stash push` comme « filet de sécurité » avant de supprimer des fichiers. Mais comme le travail en cours n'avait **jamais été committé depuis le début du bootstrap**, le `git stash` a embarqué **tout** le travail de plusieurs heures et le working tree est retombé sur l'état `HEAD` de la branche, qui était… l'ancien clone de `tahitizoomwebVercel`. Le script `rm -rf` s'est ensuite exécuté sur l'ancien code au lieu du nouveau, créant une situation très confuse qui a fini par nécessiter un redémarrage complet du bootstrap (voie C).

**Leçon** : **toujours committer** le travail avant de faire des opérations destructives. Un commit WIP protège, un stash peut cacher et faire disparaître si le working tree est instable. Avant toute opération risquée : `git add -A && git commit -m "wip: avant <nom de l'opération>"`, puis procéder.

### 21.3 SQLite/Turso n'est pas un drop-in replacement pour MongoDB dans un build Next.js + Payload

Le choix de Turso plutôt que MongoDB est stratégiquement excellent (SQL relationnel, serverless, compatible Vercel). Mais le passage de Mongo à SQLite a révélé une différence **non documentée** dans les templates officiels : SQLite/Turso **lève une exception** au lieu de retourner `[]` sur une table inexistante, ce qui casse les `generateStaticParams` du template website au build.

**Leçon** : quand on change l'adapter DB d'un template Payload, il faut **anticiper les différences sémantiques** entre les databases, pas seulement les différences d'API. Et il faut **toujours générer une migration initiale et la committer** (`pnpm payload migrate:create`) plutôt que de se reposer sur `push: true`.

### 21.4 Ne pas laisser `PermitRootLogin yes` + mot de passe en place plus de quelques heures

Pour débloquer l'accès VS Code Remote-SSH sur CT 204, on a activé temporairement `PermitRootLogin yes` + `PasswordAuthentication yes`. C'est une ouverture de sécurité qui est **acceptable sur un LAN privé isolé** comme ton réseau Proxmox, mais c'est à corriger dès qu'on a un moment :

```bash
# Sur ton Mac
ssh-keygen -t ed25519 -C "stephane@mac"

# Copier la clé publique
cat ~/.ssh/id_ed25519.pub

# Sur CT 204
mkdir -p /root/.ssh
chmod 700 /root/.ssh
echo "ssh-ed25519 AAAA... stephane@mac" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# Tester la connexion par clé depuis le Mac sans mot de passe
ssh root@192.168.1.63 "echo ok"

# Si ok, repasser sshd_config en mode sécurisé
# Remplacer PermitRootLogin yes par PermitRootLogin prohibit-password
# Remplacer PasswordAuthentication yes par PasswordAuthentication no
# Puis : systemctl reload ssh
```

### 21.5 Outil Claude Code pour les opérations complexes sur le serveur

Pendant la phase de résolution du problème de migrations Turso, Claude Code a été **beaucoup plus efficace** que moi pour diagnostiquer et appliquer la solution, parce qu'il a un accès direct au filesystem et peut itérer rapidement sans nécessiter de copier-coller bilatéral.

**Leçon** : pour les phases futures qui nécessitent de manipuler plusieurs fichiers, de lancer des commandes et d'itérer rapidement (par exemple la phase 2 multilingue, qui va toucher beaucoup de fichiers), **utiliser Claude Code directement sur le CT 204** plutôt que de passer par l'interface web. Réserver l'interface web pour les décisions stratégiques, le cahier des charges, et les questions conceptuelles.

### 21.6 Séparer les phases de décision et les phases d'exécution

Pendant la session de bootstrap, trop de temps a été passé à enchaîner des actions sans pause réflexive, ce qui a conduit à des choix sous-optimaux (ecommerce BETA au lieu de website, `git stash` intempestif, SMTP Microsoft 365 démarré sans vérifier que c'était viable, etc.).

**Leçon** : avant chaque phase majeure, **prendre 5 minutes pour décider** : quel est l'objectif exact, quel est le statut de maturité des outils utilisés, quelles sont les alternatives, quel est le plan B si ça plante ? Ces 5 minutes économisent souvent des heures.

---

## 22. Prochains livrables conseillés

Dans l'ordre chronologique logique :

1. **Sécurisation SSH CT 204** : génération d'une clé SSH sur le Mac, ajout à `authorized_keys` du CT 204, puis retrait de `PermitRootLogin yes`. 10 minutes.

2. **Activation du multilingue Payload + next-intl** : configurer la `localization` dans `payload.config.ts` (locales `['fr', 'en', 'ja']`, defaultLocale `'fr'`), marquer les champs traduisibles, configurer `next-intl` côté frontend, créer les dictionnaires, tester. **Phase 2 complète, ~2h**.

3. **Branding Tiki Village** : logo, favicon, couleurs Tailwind, fonts, composants `BeforeLogin` et `BeforeDashboard` personnalisés, meta title global. **Phase 2 complète, ~1-2h**.

4. **Création de la homepage Tiki Village** : structure avec Hero + blocs (présentation, services, call-to-action, témoignages). Contenu placeholder en attendant phase 6. **Phase 2 complète, ~1-2h**.

5. **Ajout du plugin ecommerce stable** : `@payloadcms/plugin-ecommerce@3.81.0` par-dessus le template website, configuration sans payment method, création de la collection Products override avec champs Tiki Village. **Phase 3 complète, ~2-3h**.

6. **Catalogue des prestations** : définir la vraie liste des prestations Tiki Village (show, visite, mariage, etc.), les ajouter dans l'admin, créer les pages `/prestations` et `/prestations/[slug]`. **Phase 3 complète, ~2h**.

7. **Collections custom Bookings + Availability** : modéliser les réservations Tiki Village, hooks de synchronisation. **Phase 4 début, ~3-4h**.

8. **Interface de réservation côté frontend** : composant calendrier, formulaire de réservation, gestion du panier, tunnel de checkout. **Phase 4 complète, ~1 semaine**.

9. **Custom PayZen adapter** : écrire un adaptateur de paiement compatible avec l'interface du plugin ecommerce, gérer les endpoints `initiate-payment`, `confirm-order`, `webhook`. **Phase 5 complète, ~1 semaine**.

10. **Création CT 203 PROD** : cloner la configuration du CT 204, avec la base Turso PROD et le tunnel Cloudflare PROD. **Phase 7 début, ~2h**.

11. **Inventaire WordPress complet et plan de redirections** : lister toutes les pages, prestations, médias, traductions du site actuel, créer la table de correspondance d'URLs pour le cutover. **Phase 6 / 7, ~1 journée**.

12. **Cutover DNS final** : migration des nameservers Hostinger → Cloudflare, bascule du trafic, activation des redirections 301, monitoring post-cutover. **Phase 7 fin, ~2-3h + 48h de surveillance**.

---

**Fin du cahier des charges v1.2 consolidé.**

**Dernière mise à jour** : 8 avril 2026, post-bootstrap CT 204 opérationnel.
