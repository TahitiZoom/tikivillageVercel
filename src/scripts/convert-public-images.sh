#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
#  convert-public-images.sh
#  Convertit les images statiques public/images en WebP
#  et met à jour les références dans le code source
#  Pour tahitizoom.pf
# ═══════════════════════════════════════════════════════════════════
#
#  USAGE :
#    chmod +x src/scripts/convert-public-images.sh
#
#    # Dry-run (défaut) — montre ce qui sera fait
#    ./src/scripts/convert-public-images.sh
#
#    # Conversion réelle
#    ./src/scripts/convert-public-images.sh --run
#
#  PRÉREQUIS :
#    - cwebp (apt install webp) OU ImageMagick (déjà installé)
# ═══════════════════════════════════════════════════════════════════

set -e

PROJECT_DIR="/var/www/tahitizoom"
IMAGES_DIR="$PROJECT_DIR/public/images"
BACKUP_DIR="$PROJECT_DIR/public/images-backup-originals"
QUALITY=80
DRY_RUN=true
CONVERTED=0
TOTAL_BEFORE=0
TOTAL_AFTER=0

# Parse args
if [[ "$1" == "--run" ]]; then
  DRY_RUN=false
fi

echo "═══════════════════════════════════════════════════════════"
echo "  Conversion public/images → WebP"
echo "═══════════════════════════════════════════════════════════"
if $DRY_RUN; then
  echo "  Mode : 🔍 DRY-RUN (aucune modification)"
else
  echo "  Mode : 🚀 CONVERSION RÉELLE"
fi
echo "  Qualité : $QUALITY"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier l'outil de conversion disponible
if command -v cwebp &> /dev/null; then
  CONVERTER="cwebp"
  echo "✓ Convertisseur : cwebp"
elif command -v convert &> /dev/null; then
  CONVERTER="magick"
  echo "✓ Convertisseur : ImageMagick"
else
  echo "✗ Aucun convertisseur trouvé. Installer avec :"
  echo "  apt install webp"
  echo "  ou : apt install imagemagick"
  exit 1
fi
echo ""

# ─── Étape 1 : Convertir les fichiers ────────────────────────────

echo "─── Conversion des fichiers ───"
echo ""

# Trouver tous les JPG, JPEG, PNG (pas les DNG — trop lourds, pas affichés sur le web)
while IFS= read -r file; do
  filename=$(basename "$file")
  dirpath=$(dirname "$file")
  extension="${filename##*.}"
  basename="${filename%.*}"
  webp_file="$dirpath/$basename.webp"

  # Taille originale
  size_before=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
  size_before_h=$(numfmt --to=iec $size_before 2>/dev/null || echo "${size_before}B")

  if $DRY_RUN; then
    echo "  📄 $file ($size_before_h) → $webp_file"
  else
    # Backup
    rel_path="${file#$IMAGES_DIR/}"
    backup_path="$BACKUP_DIR/$rel_path"
    mkdir -p "$(dirname "$backup_path")"
    cp -n "$file" "$backup_path" 2>/dev/null || true

    # Convertir
    if [[ "$CONVERTER" == "cwebp" ]]; then
      cwebp -q $QUALITY "$file" -o "$webp_file" -quiet
    else
      convert "$file" -quality $QUALITY "$webp_file"
    fi

    size_after=$(stat -c%s "$webp_file" 2>/dev/null || stat -f%z "$webp_file" 2>/dev/null)
    size_after_h=$(numfmt --to=iec $size_after 2>/dev/null || echo "${size_after}B")
    savings=$(( (size_before - size_after) * 100 / size_before ))

    echo "  ✓ $file ($size_before_h → $size_after_h, -${savings}%)"

    # Supprimer l'original
    rm "$file"

    TOTAL_AFTER=$((TOTAL_AFTER + size_after))
  fi

  TOTAL_BEFORE=$((TOTAL_BEFORE + size_before))
  CONVERTED=$((CONVERTED + 1))

done < <(find "$IMAGES_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \))

echo ""
echo "  Fichiers : $CONVERTED"
echo "  Taille avant : $(numfmt --to=iec $TOTAL_BEFORE 2>/dev/null || echo $TOTAL_BEFORE)"
if ! $DRY_RUN; then
  echo "  Taille après : $(numfmt --to=iec $TOTAL_AFTER 2>/dev/null || echo $TOTAL_AFTER)"
fi
echo ""

# ─── Étape 2 : Mettre à jour les références dans le code ─────────

echo "─── Mise à jour des références dans le code ───"
echo ""

# Liste des fichiers source à modifier
SRC_FILES=(
  "src/app/(frontend)/contact/page.tsx"
  "src/app/(frontend)/a-propos/page.tsx"
  "src/components/ClientsCarousel.tsx"
  "src/components/ServicesMenu.tsx"
)

# Remplacements d'extensions
declare -a REPLACEMENTS=(
  ".jpg"
  ".jpeg"
  ".png"
)

for src_file in "${SRC_FILES[@]}"; do
  full_path="$PROJECT_DIR/$src_file"
  if [[ ! -f "$full_path" ]]; then
    echo "  ⚠ Fichier introuvable : $src_file"
    continue
  fi

  changes=0
  for ext in "${REPLACEMENTS[@]}"; do
    count=$(grep -c "/images/.*\\${ext}" "$full_path" 2>/dev/null || echo 0)
    if [[ "$count" -gt 0 ]]; then
      changes=$((changes + count))
      if ! $DRY_RUN; then
        # Remplacer .jpg/.jpeg/.png par .webp dans les chemins /images/
        sed -i "s|\(/images/[^'\"]*\)\\${ext}|\1.webp|g" "$full_path"
      fi
    fi
  done

  if [[ "$changes" -gt 0 ]]; then
    echo "  ✓ $src_file ($changes référence(s))"
  fi
done

echo ""

# ─── Résumé ──────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════════════════"
if $DRY_RUN; then
  echo "  Mode DRY-RUN : aucune modification effectuée."
  echo "  Pour lancer : ./src/scripts/convert-public-images.sh --run"
else
  echo "  ✓ Conversion terminée"
  echo "  ✓ Références mises à jour"
  echo "  ✓ Originaux sauvegardés dans : $BACKUP_DIR"
  echo ""
  echo "  Prochaines étapes :"
  echo "    1. npm run build"
  echo "    2. Tester le site en local"
  echo "    3. git add -A && git commit -m 'perf: convert public/images to WebP'"
  echo "    4. git push → déployer en prod"
fi
echo "═══════════════════════════════════════════════════════════"
