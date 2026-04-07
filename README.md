# TahitiZoomWebVercel

Migration et exploitation de **Tahiti Zoom** sur **Vercel + Payload CMS + Turso + Cloudflare R2 + Meta Webhooks**.

Ce dépôt est la base de travail pour :

- `staging.tahitizoom.pf`
- `tahitizoom.pf`
- `www.tahitizoom.pf`

---

## 1. Architecture cible

### Production
- **App / CMS** : Vercel
- **Domaine public** : `https://tahitizoom.pf`
- **Domaine canonique effectif** : `https://www.tahitizoom.pf`
- **Base Turso** : `tahitizoom`
- **Bucket R2** : `tahitizoom-media-prod`
- **Domaine média** : `https://media.tahitizoom.pf`

### Staging
- **App / CMS** : Vercel
- **Domaine** : `https://staging.tahitizoom.pf`
- **Base Turso** : `tahitizoom-staging`
- **Bucket R2** : `tahitizoom-media-staging`
- **Domaine média** : `https://media-staging.tahitizoom.pf`

---

## 2. Bases Turso

### Vérifier les bases existantes

```bash
turso db list
turso db show tahitizoom
turso db show tahitizoom-staging
```

### URLs correctes

#### Production
```env
TURSO_DATABASE_URL=libsql://tahitizoom-tahitizoom.aws-us-west-2.turso.io
```

#### Staging
```env
TURSO_DATABASE_URL=libsql://tahitizoom-staging-tahitizoom.aws-us-west-2.turso.io
```

### Créer un token Turso

#### Production
```bash
turso db tokens create tahitizoom --expiration never
```

#### Staging
```bash
turso db tokens create tahitizoom-staging --expiration never
```

---

## 3. Buckets R2

### Buckets
- `tahitizoom-media-prod`
- `tahitizoom-media-staging`

### Domaines publics
- `media.tahitizoom.pf`
- `media-staging.tahitizoom.pf`

### Endpoint R2
```env
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_REGION=auto
```

---

## 4. Variables d’environnement Vercel

## Production

```env
PAYLOAD_SECRET=...
NEXT_PUBLIC_SERVER_URL=https://tahitizoom.pf

TURSO_DATABASE_URL=libsql://tahitizoom-tahitizoom.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=...

S3_BUCKET=tahitizoom-media-prod
S3_REGION=auto
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_PUBLIC_URL=https://media.tahitizoom.pf

FB_PAGE_ID=...
FB_PAGE_ACCESS_TOKEN=...
FB_VERIFY_TOKEN=...
FB_WEBHOOK_VERIFY_TOKEN=...

CRON_SECRET=...
VERCEL_AUTOMATION_BYPASS_SECRET=...

SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=contact@tahitizoom.pf
```

## Preview / Staging

```env
PAYLOAD_SECRET=...
NEXT_PUBLIC_SERVER_URL=https://staging.tahitizoom.pf

TURSO_DATABASE_URL=libsql://tahitizoom-staging-tahitizoom.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=...

S3_BUCKET=tahitizoom-media-staging
S3_REGION=auto
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_PUBLIC_URL=https://media-staging.tahitizoom.pf

FB_PAGE_ID=...
FB_PAGE_ACCESS_TOKEN=...
FB_VERIFY_TOKEN=...
FB_WEBHOOK_VERIFY_TOKEN=...

CRON_SECRET=...
VERCEL_AUTOMATION_BYPASS_SECRET=...

SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=contact@tahitizoom.pf
```

### Important
Un changement de variables Vercel **ne se versionne pas dans Git**.  
Pour garder une trace côté dépôt :

- maintenir un `.env.example` sans secrets
- maintenir ce `README.md`
- redéployer après changement de variables si l’app doit les prendre en compte

---

## 5. Mapping correct des environnements

### Production
- `tahitizoom.pf` / `www.tahitizoom.pf` doivent pointer vers :
  - base Turso `tahitizoom`
  - bucket `tahitizoom-media-prod`
  - domaine média `media.tahitizoom.pf`

### Staging
- `staging.tahitizoom.pf` doit pointer vers :
  - base Turso `tahitizoom-staging`
  - bucket `tahitizoom-media-staging`
  - domaine média `media-staging.tahitizoom.pf`

### Erreur critique rencontrée
La prod Vercel pointait par erreur sur `tahitizoom-staging`.

Symptômes observés :
- médias en prod avec URLs `staging/media`
- aperçus manquants
- incohérences entre base consultée localement et API prod

Cause racine :
- `TURSO_DATABASE_URL` de **Production** pointait encore vers `tahitizoom-staging`

---

## 6. Domaine canonique

Le domaine nu `https://tahitizoom.pf` redirige vers `https://www.tahitizoom.pf`.

Important :
- pour les tests manuels `curl` avec header `Authorization`, utiliser directement `https://www.tahitizoom.pf/...`
- sinon le header peut être perdu pendant la redirection

---

## 7. Plugin R2 / S3

Le stockage est géré via `@payloadcms/storage-s3`.

Exemple de logique active :
- `prod/media` en production
- `staging/media` en preview/staging

Vérifier `src/plugins/index.ts` :
- `S3_BUCKET`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_PUBLIC_URL`

---

## 8. Correction durable des thumbnails Payload

Le fichier `src/collections/Media.ts` contient un hook `afterRead` indispensable pour corriger les aperçus dans l’admin :

```ts
hooks: {
  afterRead: [
    ({ doc }) => {
      if (doc?.sizes?.thumbnail?.url) {
        doc.thumbnailURL = doc.sizes.thumbnail.url
      }

      if (doc?.sizes?.thumbnail?.filename && doc?.sizes?.thumbnail?.url) {
        doc.thumbnail_u_r_l = doc.sizes.thumbnail.url
      }

      if (doc?.url && typeof doc.url === 'string' && doc.url.startsWith('/api/media/file/')) {
        if (doc.filename && process.env.S3_PUBLIC_URL) {
          const base = process.env.S3_PUBLIC_URL.replace(/\/$/, '')
          const prefix = doc.prefix ? `${doc.prefix}/` : ''
          doc.url = `${base}/${prefix}${doc.filename}`
        }
      }

      return doc
    },
  ],
},
```

### Vérifier que le hook est bien présent

```bash
grep -n -A25 -B2 "hooks:" src/collections/Media.ts
grep -nE "afterRead|thumbnailURL|thumbnail_u_r_l|S3_PUBLIC_URL|startsWith\('/api/media/file/'\)" src/collections/Media.ts
```

---

## 9. Problème historique des aperçus

### Symptôme
- l’admin affichait des vignettes manquantes
- certaines URLs pointaient vers `/api/media/file/...`
- d’autres pointaient encore vers `staging/media`

### Correctif appliqué
1. correction SQL des URLs
2. hook `afterRead` dans `Media.ts`
3. hard refresh navigateur

### Requête utile de vérification

```sql
SELECT id, filename, prefix, url, thumbnail_u_r_l, sizes_thumbnail_url
FROM media
ORDER BY id DESC
LIMIT 10;
```

---

## 10. Migration des anciens médias vers R2

### Vérifier les objets dans un bucket

```bash
aws s3 ls s3://tahitizoom-media-prod/prod/media/ \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com | head
```

### Sync staging -> prod

Créer un token temporaire R2 avec accès :
- lecture sur `tahitizoom-media-staging`
- écriture sur `tahitizoom-media-prod`

Puis :

```bash
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."

aws s3 sync \
  s3://tahitizoom-media-staging/staging/media/ \
  s3://tahitizoom-media-prod/prod/media/ \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

### Nettoyage du shell

```bash
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
```

### Important
Les tokens temporaires affichés ou utilisés pour la migration doivent être supprimés / régénérés après usage.

---

## 11. SQL utiles pour la prod

### Vérifier les résidus staging en prod

```sql
SELECT COUNT(*) AS remaining_prod_staging_refs
FROM media
WHERE prefix = 'staging/media'
   OR url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR thumbnail_u_r_l LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_thumbnail_url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_square_url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_small_url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_medium_url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_large_url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_xlarge_url LIKE 'https://media.tahitizoom.pf/staging/media/%'
   OR sizes_og_url LIKE 'https://media.tahitizoom.pf/staging/media/%';
```

### Mettre à jour prod/media

```sql
UPDATE media
SET prefix = 'prod/media'
WHERE prefix = 'staging/media';

UPDATE media
SET url = REPLACE(url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET thumbnail_u_r_l = REPLACE(thumbnail_u_r_l, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE thumbnail_u_r_l LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_thumbnail_url = REPLACE(sizes_thumbnail_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_thumbnail_url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_square_url = REPLACE(sizes_square_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_square_url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_small_url = REPLACE(sizes_small_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_small_url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_medium_url = REPLACE(sizes_medium_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_medium_url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_large_url = REPLACE(sizes_large_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_large_url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_xlarge_url = REPLACE(sizes_xlarge_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_xlarge_url LIKE 'https://media.tahitizoom.pf/staging/media/%';

UPDATE media
SET sizes_og_url = REPLACE(sizes_og_url, 'https://media.tahitizoom.pf/staging/media/', 'https://media.tahitizoom.pf/prod/media/')
WHERE sizes_og_url LIKE 'https://media.tahitizoom.pf/staging/media/%';
```

---

## 12. Import map Payload

Après ajout du plugin S3/R2, il faut régénérer l’import map :

```bash
npm run generate:importmap
npm run build
```

Sinon l’admin peut casser avec une erreur de type :
- `PayloadComponent not found in importMap`

---

## 13. Refactor Facebook Sync

La logique métier Facebook est centralisée dans :

- `src/lib/facebook/syncFacebook.ts`

Elle est utilisée par :
- `src/app/api/cron/facebook-sync/route.ts`
- `src/app/(payload)/api/sync-facebook/route.ts`
- `src/app/api/webhooks/facebook/route.ts`

Cela évite les appels HTTP internes entre routes.

---

## 14. Cron Facebook sécurisé

### Route
- `/api/cron/facebook-sync`

### Sécurité
- `CRON_SECRET`
- `VERCEL_AUTOMATION_BYPASS_SECRET`

### Important
Les cron jobs Vercel s’exécutent uniquement en **Production**, pas en Preview.

### Test manuel avec bypass Vercel

Toujours utiliser le domaine final direct :

```bash
touch /tmp/vercel-cookie.txt

curl -v -L -c /tmp/vercel-cookie.txt -b /tmp/vercel-cookie.txt \
  -H "Authorization: Bearer TON_CRON_SECRET" \
  -H "x-vercel-protection-bypass: TON_BYPASS_SECRET" \
  -H "x-vercel-set-bypass-cookie: true" \
  "https://www.tahitizoom.pf/api/cron/facebook-sync"
```

Réponse attendue :

```json
{"success":true,"imported":0,"skipped":25,"errors":[]}
```

---

## 15. Webhook Facebook / Meta

### Route
- `/api/webhooks/facebook`

### Vérification
Meta appelle :

```text
GET /api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
```

La route doit répondre exactement avec la valeur de `hub.challenge`.

### Variable d’environnement

```env
FB_WEBHOOK_VERIFY_TOKEN=...
```

### Test manuel de vérification

```bash
curl "https://www.tahitizoom.pf/api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=TON_VERIFY_TOKEN&hub.challenge=123456"
```

Réponse attendue :

```text
123456
```

### Configuration Meta Developers
- **Callback URL** : `https://www.tahitizoom.pf/api/webhooks/facebook`
- **Verify token** : valeur de `FB_WEBHOOK_VERIFY_TOKEN`
- **Objet** : `Page`
- **Champ** : `feed`

### Comportement
Lorsqu’un événement `feed` est reçu, le webhook déclenche une synchro courte via la logique partagée `syncFacebook(...)`.

### Recommandation
Garder aussi le cron Vercel comme mécanisme de rattrapage.

---

## 16. Déploiement

### Staging
```bash
git add -A
git commit -m "..."
git push origin staging
```

### Production
```bash
git checkout main
git merge staging
git push origin main
```

### Forcer un redeploy prod
```bash
git checkout main
git commit --allow-empty -m "chore: force production redeploy"
git push origin main
```

---

## 17. Vérifications post-déploiement

### Staging
- `https://staging.tahitizoom.pf`
- `https://staging.tahitizoom.pf/admin`
- upload image
- import Facebook
- aperçu media

### Production
- `https://www.tahitizoom.pf`
- `https://www.tahitizoom.pf/admin`
- anciens posts avec images
- nouveaux uploads
- import Facebook
- cron Facebook
- webhook Facebook
- aperçus media

### Important
Après corrections thumbnails, favicon, branding ou URLs :
- faire un **hard refresh** du navigateur

---

## 18. Branding admin Payload

Dans `src/payload.config.ts`, `admin.meta.titleSuffix` est utilisé pour personnaliser le titre d’onglet.

Exemple :

```ts
meta: {
  titleSuffix: ' - Tahiti Zoom',
},
```

Important :
- `admin.meta.favicon` n’est pas supporté dans cette version de Payload
- le favicon doit être fourni par Next.js / le site, ici :
  - `public/favicon.ico`

Après changement de favicon :
- faire un hard refresh
- si nécessaire tester en navigation privée

---

## 19. Images frontend / cover image des posts

Le détail d’un post utilise `PostHero` puis le composant `Media`, lui-même basé sur `next/image`.

Comme les médias sont servis depuis :
- `https://media.tahitizoom.pf`
- `https://media-staging.tahitizoom.pf`

il faut les autoriser dans `next.config.ts` via `images.remotePatterns`.

Exemple attendu :

```ts
images: {
  localPatterns: [
    {
      pathname: '/api/media/file/**',
    },
  ],
  qualities: [100],
  remotePatterns: [
    ...[
      NEXT_PUBLIC_SERVER_URL,
      'https://www.tahitizoom.pf',
      'https://tahitizoom.pf',
      'https://media.tahitizoom.pf',
      'https://media-staging.tahitizoom.pf',
    ].map((item) => {
      const url = new URL(item)

      return {
        hostname: url.hostname,
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
      }
    }),
  ],
},
```

Sans cela, les images peuvent s’afficher dans les listes mais pas dans les pages détail utilisant `next/image`.

---

## 20. Pièges rencontrés

### 1. Production branchée sur la base staging
Cause :
- `TURSO_DATABASE_URL` Production pointait sur `tahitizoom-staging`

Effet :
- URLs `staging/media` en prod
- aperçus incohérents
- décalage entre base interrogée localement et API prod

### 2. Admin Payload cassé après ajout du plugin S3
Cause :
- import map non régénérée

Fix :
```bash
npm run generate:importmap
npm run build
```

### 3. Aperçus manquants
Cause :
- `thumbnailURL` / `thumbnail_u_r_l` mal renseignés
- URLs `/api/media/file/...`
- résidus staging/prod
- cache navigateur

Fix :
- SQL
- hook `afterRead`
- hard refresh

### 4. Upload en erreur “Something went wrong”
Cause observée :
- contrainte SQL sur `media.filename`
- nom déjà existant

Fix :
- utiliser un nom de fichier unique
- recharger complètement la page admin après erreur

### 5. Message “Aucun fichier n’a été téléversé”
Cause probable :
- état du formulaire admin corrompu après un premier échec

Fix :
- hard refresh
- recréer un nouveau document media
- retéléverser
- cliquer une seule fois sur `Save`

### 6. `Authorization` perdu pendant une redirection
Cause :
- test manuel fait sur `https://tahitizoom.pf/...`
- redirection vers `https://www.tahitizoom.pf/...`

Effet :
- le header `Authorization` peut disparaître au follow redirect

Fix :
- viser directement `https://www.tahitizoom.pf/...` dans les tests `curl`

### 7. `admin.meta.favicon` non supporté
Cause :
- tentative de personnalisation du favicon dans `src/payload.config.ts`

Effet :
- erreur TypeScript / build

Fix :
- garder seulement `titleSuffix`
- fournir le favicon via `public/favicon.ico`

---

## 21. Commandes utiles

### Vérifier les bases Turso
```bash
turso db list
turso db show tahitizoom
turso db show tahitizoom-staging
```

### Vérifier les buckets
```bash
aws s3 ls s3://tahitizoom-media-prod/prod/media/ \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com | head

aws s3 ls s3://tahitizoom-media-staging/staging/media/ \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com | head
```

### Vérifier le hook Media
```bash
grep -n -A25 -B2 "hooks:" src/collections/Media.ts
grep -nE "afterRead|thumbnailURL|thumbnail_u_r_l|S3_PUBLIC_URL" src/collections/Media.ts
```

### Vérifier la config Next image
```bash
sed -n '1,240p' next.config.ts
```

### Vérifier le branding admin
```bash
sed -n '39,95p' ./src/payload.config.ts
find src/app public -maxdepth 3 \( -iname "favicon.ico" -o -iname "icon.*" -o -iname "apple-icon.*" \) 2>/dev/null
```

---

## 22. État final attendu

### Production
- `www.tahitizoom.pf` sur Vercel
- base Turso `tahitizoom`
- bucket `tahitizoom-media-prod`
- domaine média `media.tahitizoom.pf`
- uploads OK
- aperçus OK
- import Facebook OK
- cron OK
- webhook OK
- branding admin OK

### Staging
- `staging.tahitizoom.pf` sur Vercel
- base Turso `tahitizoom-staging`
- bucket `tahitizoom-media-staging`
- domaine média `media-staging.tahitizoom.pf`
- tests et validation avant merge prod

---

## 23. Recommandation finale

Ne pas modifier directement la prod sans passer par :
1. `staging`
2. validation complète
3. merge `staging -> main`
4. déploiement Vercel prod
5. vérification fonctionnelle
