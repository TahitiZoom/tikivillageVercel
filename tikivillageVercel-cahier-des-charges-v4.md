# Cahier des charges consolidé — `tikivillageVercel`

**Document maître unique.** Version v4 remplace tous les cahiers de charges antérieurs.

**Date** : 12 avril 2026  
**Version** : **v4** — Intégration formulaire contact + frise bandeau  
**Statut** : version consolidée post-bootstrap effectif, enrichie des avancées du 10-12 avril 2026 : intégration du formulaire de contact complet (FormBlock Payload) dans la section d'accueil, récréation de la frise bandeau avec décoration (pattern chevrons), validation du workflow de rebuild complet (`rm .next && pnpm build`).  
**Propriétaire** : Stéphane Sayeb / TahitiZoom

---

## Historique des versions

| Version | Date | Changements |
|---|---|---|
| v1.0 | 2026-04-07 | Version consolidée initiale. Fusionne et corrige deux documents préalables. Décisions : chemin `/var/www/tikivillageVercel`, SMTP Microsoft 365, Cloudflare Tunnel option C-1. |
| v1.1 | 2026-04-07 | Ajout section Turso : création des bases PROD (`tikivillage`) et DEV (`tikivillage-staging`), tokens, injection `.env`, tests connexion. |
| v1.2 | 2026-04-08 | **Refonte majeure post-bootstrap.** Abandonne clone `tahitizoomwebVercel` + template ecommerce BETA. Bascule sur template website officiel stable. Stratégie migrations Payload pour Turso (migrate:create + prebuild). Fix `try/catch` dans `generateStaticParams`. Service systemd `tikivillage.service`. Cloudflare Tunnel en prod. |
| v1.3 | 2026-04-10 | **Addendum opérationnel.** Multilingue FR/EN/JA actif. Adaptation header/footer/hero selon site source. Geist Sans → Dosis. Home reconnectée au document `Pages > Home`. Migration pages menu. Workflow formalisé. |
| **v4** | **2026-04-12** | **Avancées UX/frontend majeures.** (1) **Frise bandeau** : récréation SVG + pattern chevrons overlay (50px, objectFit contain, 108px logo). (2) **Formulaire contact** : FormBlock Payload + FR/EN/JA + RGPD + lien confidentialité, Section 8 home. (3) **Workflow rebuild** : `rm .next && pnpm build && pnpm start` validé et committable. |

**Convention de versionnement** : À partir de v4, numérotation simple (v4, v5, ...) pour la clarté.

---

## NOUVELLES AVANCEES V4 (12 avril 2026)

### Frise bandeau

**État antérieur** : simple SVG statique sans décoration, proportions incorrectes.

**Mise à jour** :
- Récréation du composant `FriezeBand` dans `HomePageContent` (lignes 93-116)
- Base SVG : `/public/images/bg-frise-horiz-v2-1280.svg` (854.6 × 36.3 viewBox original)
- Overlay pattern chevrons : `/public/images/chevrons-pattern.svg?v=4` (121 × 26 viewBox, motif exact site source)
- Styling CSS :
  - Conteneur : `relative`, `width: 100%`, `max-width: 520px`, `height: 50px`
  - Base SVG : `position: absolute`, `objectFit: contain`, `objectPosition: left center`
  - Chevrons : `position: absolute`, `left: 0`, `top: 50%`, `transform: translateY(-50%)`, `width: 120px`, `height: 26px`, `z-index: 5`, `opacity: 0.7`
- Intégration : utilisée sur Section 1 (Intro) de la home avec les paramètres `width={620}`, `height={50}`

### Formulaire de contact

**État antérieur** : bloc contact simple avec texte riche et lien button, pas de formulaire.

**Mise à jour** :
- **Import** : `FormBlock` depuis `@/blocks/Form/Component`, `Link` depuis `next/link`, types `Form`, `FormBlockType`, formulaire seed `contactForm`
- **Localisations** : objet `contactFormCopy` avec textes FR/EN/JA :
  - Titre : "N'HESITEZ PAS A NOUS CONTACTER POUR PLUS D'INFORMATIONS."
  - Champs : Nom Prenom, Telephone, E-mail, Message
  - Bouton : ENVOYER / SEND / ソウシン
  - RGPD : texte légal + lien "Politique de protection des données personnelles"
- **Fonction localizeForm** : adapte les labels des champs du FormBlock selon la locale
- **Section 8 complètement refactorisée** :
  - Media background (contactMedia) avec opacity full, `object-[22%_center]`
  - Conteneur blanc : `bg-white px-8 py-8 md:px-14 md:py-10` (Tailwind)
  - Frise 108px
  - Titre h2 : styles Dosis, uppercase, color `#0e4850`
  - **FormBlock rendu** : `<FormBlock {...populatedFormBlock} appearance="contact" enableIntro={false} />`
  - Texte légal RGPD + Link vers `/{locale}/confidentialite`
  - Support multilingue complet (FR/EN/JA)
- **Props ajoutée à HomePageContent** : `locale?: string` passée depuis la page `[locale]/page.tsx`
- **Commit** : `06d1965` — "feat: intégrer formulaire contact complet dans section home page avec FormBlock, localisations et texte RGPD"

### Workflow rebuild validé

**Commande adoptée** : `rm -rf .next && pnpm build && pnpm start`

**Étapes** :
1. Suppression du `.next` (cache build précédent)
2. `pnpm build` : 
   - Prélude automatique : `payload migrate` (script prebuild)
   - Compilation Turbopack : 18.7s
   - TypeScript check : 7.9s
   - Page generation : 24/24 pages en 1551ms
   - Sitemap generation : complétée
3. `pnpm start` : serveur prêt en 129ms sur http://localhost:3000

**Git workflow** :
- Modifications apportées + testées localement
- `git add -A && git commit -m "..."` 
- `git push origin staging`
- État final du working tree : `clean`

---

## Prochain chantier recommandé (phases 3+)

1. **Pages éditoriales** : poursuivre migration contenu WordPress → Payload (Pages du menu FR/EN/JA)
2. **Collections métier** : 
   - Collection `Products` pour le catalogue prestations (phase 4)
   - Collection custom `Bookings` + `Availability` pour réservations (phase 5)
3. **Paiement PayZen** : adapter la passerelle OSB/PayZen pour Payload (phase 6)
4. **CT PROD** : création du conteneur `tikivillage-prod` (CT 203) et synchronisation branche `main` (phase 7)

