# Plan d'import CT 204 DEV

## Objectif
Reprendre uniquement :
- design et structure
- contenus FR / EN / JA
- produits réservables et options
- logique de calendrier
- configuration fonctionnelle PayZen/OSB

Exclure complètement :
- clients
- commandes
- réservations historiques
- comptes utilisateurs
- logs et données personnelles

## Ordre d'import recommandé

### Phase 1 — préparation
1. Copier les exports sources dans `docs/migration-source/`.
2. Normaliser les noms de fichiers et dossiers.
3. Faire un inventaire final :
   - pages
   - médias
   - produits
   - options
   - règles de booking
   - paiements
4. Rédiger les mappings manquants manuellement si un export WP est incomplet.

### Phase 2 — design system
1. Extraire palette, typographies, espacements, rayons, ombres.
2. Produire un fichier de tokens UI dans le projet :
   - `src/styles/tokens.css` ou équivalent
3. Lister les composants à reconstruire :
   - Header
   - Footer
   - Hero
   - Cards
   - Galleries
   - CTA
   - Booking widgets
4. Réintégrer logos, favicon et assets essentiels dans `public/`.

### Phase 3 — médias
1. Importer dans la collection `media` uniquement les assets utiles.
2. Renommer proprement les fichiers.
3. Compléter les champs :
   - alt
   - caption
   - tags
4. Exclure les doublons et médias obsolètes.

### Phase 4 — pages et contenu
1. Créer les pages institutionnelles dans `pages`.
2. Pour chaque page source :
   - mapper le slug
   - assigner la langue
   - reconstruire les blocs de contenu
   - reporter le SEO utile
3. Refaire les menus `header`, `footer`, `legal` par langue.
4. Vérifier les liens internes et ancres.

### Phase 5 — produits réservables
1. Nettoyer le CSV WooCommerce.
2. Conserver uniquement :
   - produits vendables utiles
   - variantes utiles
   - attributs utiles
   - options utiles
3. Transformer chaque produit source en `bookableProduct`.
4. Convertir les options WooCommerce en structure métier :
   - checkbox
   - select
   - radio
   - quantity
5. Éliminer tout champ strictement technique WordPress/WooCommerce.

### Phase 6 — règles de réservation
1. Identifier le plugin d'origine et la source des règles.
2. Reconstituer des `bookingRuleSets` sans historiques.
3. Migrer seulement :
   - jours ouverts
   - créneaux
   - capacités
   - dates bloquées structurelles
   - délais et contraintes
4. Ne pas importer les réservations déjà effectuées.

### Phase 7 — paiement PayZen
1. Relever les paramètres fonctionnels de WooCommerce/PayZen.
2. Stocker les secrets en `.env`.
3. Créer la collection `paymentSettings` pour la structure non sensible.
4. Définir les routes applicatives Next.js/API nécessaires :
   - init payment
   - return success
   - return failure
   - notify/webhook

### Phase 8 — reconstruction front
1. Refaire layout et composants.
2. Brancher le contenu Payload.
3. Brancher les produits réservables.
4. Brancher le calendrier.
5. Brancher le paiement.
6. Vérifier le multilingue FR/EN/JA.

## Stratégie d'automatisation

### Ce qui peut être semi-automatisé
- import médias
- import pages simples
- import produits via script de transformation CSV -> JSON
- import menus à partir d'un mapping propre

### Ce qui doit être revu manuellement
- blocs Elementor complexes
- styles fins
- options booking ambiguës
- contenus multilingues mal reliés
- tunnels de paiement et retour utilisateur

## Scripts à prévoir dans le projet
- `scripts/import-media.ts`
- `scripts/import-pages.ts`
- `scripts/import-products.ts`
- `scripts/import-booking-rules.ts`
- `scripts/validate-links.ts`

## Definition of done
Le lot est considéré migré quand :
- la page existe dans Next.js
- le contenu est éditable dans Payload
- les assets sont propres
- la langue est correcte
- le design est suffisamment fidèle
- les produits réservables fonctionnent
- le calendrier fonctionne
- le paiement PayZen est reconnecté
- aucune donnée client historique n'a été reprise
