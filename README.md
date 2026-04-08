# tikivillageVercel

> **Refonte du site [www.tikivillage.pf](https://www.tikivillage.pf) sur une stack Next.js 16 + Payload CMS + Turso + Cloudflare R2 + Vercel.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Payload](https://img.shields.io/badge/Payload_CMS-3.81-000)](https://payloadcms.com)
[![Turso](https://img.shields.io/badge/Turso-libSQL-4ff8d2)](https://turso.tech)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2-f38020?logo=cloudflare)](https://www.cloudflare.com/developer-platform/products/r2/)
[![Status](https://img.shields.io/badge/bootstrap-complete-success)](./tikivillageVercel-cahier-des-charges-v1_2.md)
[![Licence](https://img.shields.io/badge/licence-MIT-blue)](./LICENSE)

---

## Contexte

**Tiki Village** est un centre culturel polynésien réel, situé à Moorea, qui propose des prestations touristiques : shows polynésiens, visites culturelles, cérémonies de mariage, hébergement. Le site actuel `www.tikivillage.pf` tourne depuis des années sous **WordPress** avec **WooCommerce**, **WooCommerce Bookings**, **WPML** (multilingue FR/EN/JA) et une passerelle de paiement **PayZen / OSB Banque de Polynésie**.

Ce projet est la **refonte complète** de ce site sur une stack moderne, entièrement maîtrisée, plus rapide et plus maintenable. Il est développé par [Stéphane Sayeb](https://tahitizoom.pf) (TahitiZoom) et sert également de **pièce de portfolio full-stack**.

Le WordPress actuel reste en production jusqu'au cutover DNS final prévu en phase 7. Le développement se fait en parallèle sur une infrastructure staging accessible publiquement via un tunnel Cloudflare.

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
| UI | Tailwind CSS + Radix UI + Geist + Lucide React | — |
| Imagerie | sharp | 0.34 |
| Runtime | Node.js | 22.22.2 LTS |
| Gestionnaire de paquets | pnpm | 10.33.0 |
| Hébergement staging | Proxmox LXC + Cloudflare Tunnel | — |
| Hébergement prod (cible) | Vercel | — |
| Multilingue (phase 2) | `localization` Payload + `next-intl` | à installer |
| Catalogue prestations (phase 3) | `@payloadcms/plugin-ecommerce` stable | 3.81.0 |
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
- Site public : `http://localhost:3000`

### Premier compte admin

Au premier démarrage sur une base vide, Payload affiche un écran "Create your first user". Tu y crées ton compte admin avec email + mot de passe fort.

### Alimenter avec du contenu de démo (optionnel)

Une fois connecté à l'admin, un bouton **"Seed your database"** apparaît dans le dashboard pour pré-remplir la base avec des pages, posts, catégories et médias de démonstration.

---

## Workflow de développement

### En mode développement (hot reload)

```bash
pnpm dev
```

Le serveur démarre en mode développement avec rechargement automatique des modifications du code. Plus lent au premier load, plus interactif pour le développement.

### En mode production (sur le staging)

Sur le CT 204, le serveur tourne en permanence en mode production via un **service systemd** :

```bash
# Statut du service
systemctl status tikivillage

# Logs en temps réel
journalctl -u tikivillage -f

# Redémarrer après modifications
systemctl restart tikivillage
```

### Appliquer des modifications de code

```bash
# Sur le CT 204 (via SSH ou VS Code Remote)
cd /var/www/tikivillageVercel
git pull origin staging
pnpm install          # si package.json a changé
pnpm build            # prebuild applique automatiquement les migrations Payload
systemctl restart tikivillage
```

### Modifier le schéma Payload

Quand tu ajoutes un champ ou une collection dans la config Payload, il faut **générer une migration** et la committer avec le code :

```bash
# 1. Modifier la config Payload (collections, champs, etc.)
# 2. Générer la migration
pnpm payload migrate:create --name add-hero-subtitle-field

# 3. Vérifier le fichier généré
ls src/migrations/

# 4. Commit avec le code
git add src/collections/ src/migrations/
git commit -m "feat(pages): add hero subtitle field"
git push origin staging
```

Le script `prebuild` (dans `package.json`) exécute automatiquement `payload migrate` avant chaque `pnpm build`, ce qui garantit que la base cible a toujours le schéma à jour.

---

## Structure du repo

```
tikivillageVercel/
├── .env.example              # Variables d'environnement (template)
├── next.config.ts            # Config Next.js
├── package.json              # 32 dépendances, Payload ^3.81.0
├── src/
│   ├── payload.config.ts     # Config Payload avec sqliteAdapter Turso
│   ├── payload-types.ts      # Types TypeScript générés automatiquement
│   ├── migrations/           # Migrations SQL Payload (commitées)
│   │   └── 20260408_163646.ts
│   ├── app/
│   │   ├── (frontend)/       # Routes publiques Next.js
│   │   └── (payload)/        # Routes admin Payload
│   ├── collections/          # Pages, Posts, Categories, Media, Users
│   ├── Header/               # Global Header
│   ├── Footer/               # Global Footer
│   ├── blocks/               # Blocks réutilisables (Hero, Content, Media, etc.)
│   ├── fields/               # Champs réutilisables (defaultLexical, link, hero)
│   ├── plugins/              # Config des plugins Payload
│   ├── access/               # Helpers d'access control
│   ├── components/           # Composants React du template
│   ├── hooks/                # Hooks Payload
│   └── utilities/            # Utilitaires (getURL, formatDate, etc.)
├── public/                   # Assets statiques
└── tikivillageVercel-cahier-des-charges-v1_2.md   # ⚠️ Document de référence
```

---

## Documentation complète

Pour le détail complet du projet — décisions architecturales, historique des versions, stratégie de migration WordPress, configuration systemd, tunnel Cloudflare, leçons apprises du bootstrap — voir le **[cahier des charges v1.2](./tikivillageVercel-cahier-des-charges-v1_2.md)**.

C'est le document de référence interne, tenu à jour à chaque phase majeure. Il est à la racine du repo et versionné dans Git.

---

## Roadmap

| Phase | Objectif | Statut |
|---|---|---|
| **Phase 1** | Bootstrap technique (repo, Turso, R2, tunnel, admin Payload accessible) | ✅ **Terminée** (8 avril 2026) |
| **Phase 2** | Multilingue FR/EN/JA + branding Tiki Village + contenu éditorial initial | 🔜 À commencer |
| **Phase 3** | Catalogue prestations via plugin ecommerce stable | ⏳ |
| **Phase 4** | Système de réservation custom (collections `Bookings` + `Availability`) | ⏳ |
| **Phase 5** | Intégration paiement PayZen / OSB via adapter custom | ⏳ |
| **Phase 6** | Migration contenu WordPress + inventaire des redirections 301 | ⏳ |
| **Phase 7** | Création CT 203 PROD + cutover DNS Hostinger → Cloudflare + bascule en production | ⏳ |

---

## Décisions architecturales clés

1. **Template `website` officiel Payload (stable)** comme base, plutôt que le template `ecommerce` (BETA) qui s'est avéré trop fragile pour servir de socle pérenne. Le plugin ecommerce stable sera ajouté **par-dessus** en phase 3 sans remplacer quoi que ce soit.

2. **Turso (libSQL serverless)** à la place de MongoDB, pour bénéficier d'une base SQL relationnelle moderne, serverless, compatible edge runtime et 100% gratuite jusqu'à plusieurs Go de données.

3. **Migrations SQL explicites** (commitées dans `src/migrations/`) plutôt que `push: true` dynamique. Le build Next.js ne peut pas fonctionner sur une base Turso vide — chaque modification de schéma doit être migrée explicitement via `pnpm payload migrate:create`.

4. **Cloudflare R2** pour le stockage des médias, compatible API S3, gratuit jusqu'à 10 Go et sans frais d'egress. Les images sont uploadées directement depuis l'admin Payload vers R2 via le plugin de storage Payload.

5. **Cloudflare Tunnel sur la zone `tahitizoom.pf`** (et non `tikivillage.pf` qui reste chez Hostinger pendant le dev). Permet d'exposer le staging en HTTPS sans toucher au DNS de production et sans ouvrir de port sur le routeur.

6. **Services systemd unifiés** (`tikivillage.service` + `cloudflared.service`) pour une gestion propre au niveau OS, cohérente avec le reste de l'infra Proxmox TahitiZoom.

Les 23 décisions actées du projet sont documentées dans la section 2 du [cahier des charges v1.2](./tikivillageVercel-cahier-des-charges-v1_2.md#2-décisions-actées).

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
- [Documentation Turso](https://docs.turso.tech)
- [Documentation Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Documentation Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Template website officiel Payload](https://github.com/payloadcms/payload/tree/main/templates/website)

---

*Bootstrap complet validé le 8 avril 2026. Phase 2 à venir.*
