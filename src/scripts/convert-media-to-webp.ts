/**
 * Script de conversion des médias existants vers WebP
 *
 * Usage:
 *   npx tsx src/scripts/convert-media-to-webp.ts          # Dry-run (simulation)
 *   npx tsx src/scripts/convert-media-to-webp.ts --run    # Conversion réelle
 *   npx tsx src/scripts/convert-media-to-webp.ts --run --delete-originals  # + suppression originaux
 *
 * Prérequis:
 *   - Variables d'env TURSO_DATABASE_URL et TURSO_AUTH_TOKEN configurées
 *   - sharp installé (déjà inclus via Next.js)
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@libsql/client'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
const DRY_RUN = !process.argv.includes('--run')
const DELETE_ORIGINALS = process.argv.includes('--delete-originals')
const WEBP_QUALITY = 85

// Tailles d'images définies dans Media.ts
const IMAGE_SIZES = ['thumbnail', 'square', 'small', 'medium', 'large', 'xlarge', 'og'] as const

interface MediaRecord {
  id: number
  filename: string
  mime_type: string
  url: string
  thumbnail_u_r_l: string | null
  // Tailles individuelles
  sizes_thumbnail_filename: string | null
  sizes_square_filename: string | null
  sizes_small_filename: string | null
  sizes_medium_filename: string | null
  sizes_large_filename: string | null
  sizes_xlarge_filename: string | null
  sizes_og_filename: string | null
}

async function convertFile(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    await fs.access(inputPath)
    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath)
    return true
  } catch {
    return false
  }
}

async function main() {
  console.log('\n========================================')
  console.log('  CONVERSION MEDIA VERS WEBP')
  console.log('========================================')
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (simulation)' : 'EXECUTION REELLE'}`)
  console.log(`Suppression originaux: ${DELETE_ORIGINALS ? 'OUI' : 'NON'}`)
  console.log(`Qualité WebP: ${WEBP_QUALITY}%`)
  console.log(`Dossier: ${MEDIA_DIR}`)
  console.log('========================================\n')

  // Connexion à Turso
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  // Récupérer tous les médias JPEG/PNG
  const result = await db.execute(`
    SELECT id, filename, mime_type, url, thumbnail_u_r_l,
           sizes_thumbnail_filename, sizes_square_filename,
           sizes_small_filename, sizes_medium_filename,
           sizes_large_filename, sizes_xlarge_filename, sizes_og_filename
    FROM media
    WHERE mime_type IN ('image/jpeg', 'image/png', 'image/jpg')
    ORDER BY id
  `)

  const mediaRecords = result.rows as unknown as MediaRecord[]
  console.log(`Trouvé ${mediaRecords.length} images à convertir\n`)

  if (mediaRecords.length === 0) {
    console.log('Aucune image JPEG/PNG à convertir.')
    await db.close()
    return
  }

  let converted = 0
  let skipped = 0
  let errors = 0

  for (const media of mediaRecords) {
    console.log(`\n[${media.id}] ${media.filename}`)

    try {
      const originalPath = path.join(MEDIA_DIR, media.filename)
      const webpFilename = media.filename.replace(/\.(jpe?g|png)$/i, '.webp')
      const webpPath = path.join(MEDIA_DIR, webpFilename)

      // Vérifier si l'original existe
      try {
        await fs.access(originalPath)
      } catch {
        console.log(`  ⚠️  Fichier original introuvable: ${originalPath}`)
        skipped++
        continue
      }

      // Vérifier si WebP existe déjà
      try {
        await fs.access(webpPath)
        console.log(`  ⏭️  WebP existe déjà: ${webpFilename}`)
        skipped++
        continue
      } catch {
        // WebP n'existe pas, on continue
      }

      if (DRY_RUN) {
        console.log(`  📋 Convertirait: ${media.filename} → ${webpFilename}`)

        // Lister les tailles à convertir
        const sizeFields = {
          thumbnail: media.sizes_thumbnail_filename,
          square: media.sizes_square_filename,
          small: media.sizes_small_filename,
          medium: media.sizes_medium_filename,
          large: media.sizes_large_filename,
          xlarge: media.sizes_xlarge_filename,
          og: media.sizes_og_filename,
        }

        for (const [sizeName, sizeFilename] of Object.entries(sizeFields)) {
          if (sizeFilename) {
            const sizeWebp = sizeFilename.replace(/\.(jpe?g|png)$/i, '.webp')
            console.log(`     └─ ${sizeName}: ${sizeFilename} → ${sizeWebp}`)
          }
        }
        converted++
        continue
      }

      // === CONVERSION REELLE ===

      // 1. Convertir l'image principale
      console.log(`  🔄 Conversion: ${media.filename} → ${webpFilename}`)
      const mainConverted = await convertFile(originalPath, webpPath)
      if (!mainConverted) {
        console.log(`  ❌ Échec conversion principale`)
        errors++
        continue
      }

      // 2. Préparer les updates SQL
      const updates: string[] = [
        `filename = '${webpFilename}'`,
        `mime_type = 'image/webp'`,
        `url = '/media/${webpFilename}'`,
      ]
      const filesToDelete: string[] = [originalPath]

      // 3. Convertir les tailles
      const sizeFields = {
        thumbnail: { filename: media.sizes_thumbnail_filename, col: 'sizes_thumbnail' },
        square: { filename: media.sizes_square_filename, col: 'sizes_square' },
        small: { filename: media.sizes_small_filename, col: 'sizes_small' },
        medium: { filename: media.sizes_medium_filename, col: 'sizes_medium' },
        large: { filename: media.sizes_large_filename, col: 'sizes_large' },
        xlarge: { filename: media.sizes_xlarge_filename, col: 'sizes_xlarge' },
        og: { filename: media.sizes_og_filename, col: 'sizes_og' },
      }

      for (const [sizeName, info] of Object.entries(sizeFields)) {
        if (info.filename) {
          const sizeOriginalPath = path.join(MEDIA_DIR, info.filename)
          const sizeWebpFilename = info.filename.replace(/\.(jpe?g|png)$/i, '.webp')
          const sizeWebpPath = path.join(MEDIA_DIR, sizeWebpFilename)

          const sizeConverted = await convertFile(sizeOriginalPath, sizeWebpPath)
          if (sizeConverted) {
            console.log(`     └─ ${sizeName}: ✅`)
            updates.push(`${info.col}_filename = '${sizeWebpFilename}'`)
            updates.push(`${info.col}_mime_type = 'image/webp'`)
            updates.push(`${info.col}_url = '/media/${sizeWebpFilename}'`)
            filesToDelete.push(sizeOriginalPath)
          } else {
            console.log(`     └─ ${sizeName}: ⚠️  Fichier manquant`)
          }
        }
      }

      // Mettre à jour thumbnail_u_r_l si thumbnail a été converti
      if (media.sizes_thumbnail_filename) {
        const thumbWebp = media.sizes_thumbnail_filename.replace(/\.(jpe?g|png)$/i, '.webp')
        updates.push(`thumbnail_u_r_l = '/media/${thumbWebp}'`)
      }

      // 4. Mettre à jour la base de données
      const updateSQL = `UPDATE media SET ${updates.join(', ')} WHERE id = ${media.id}`
      await db.execute(updateSQL)
      console.log(`  ✅ BDD mise à jour`)

      // 5. Supprimer les originaux si demandé
      if (DELETE_ORIGINALS) {
        for (const file of filesToDelete) {
          try {
            await fs.unlink(file)
          } catch {
            // Ignore si le fichier n'existe pas
          }
        }
        console.log(`  🗑️  ${filesToDelete.length} fichiers originaux supprimés`)
      }

      converted++
    } catch (err) {
      console.log(`  ❌ Erreur: ${err}`)
      errors++
    }
  }

  // Résumé
  console.log('\n========================================')
  console.log('  RESUME')
  console.log('========================================')
  console.log(`Convertis: ${converted}`)
  console.log(`Ignorés:   ${skipped}`)
  console.log(`Erreurs:   ${errors}`)

  if (DRY_RUN) {
    console.log('\n💡 Pour exécuter réellement: npx tsx src/scripts/convert-media-to-webp.ts --run')
  } else {
    console.log('\n✅ Conversion terminée!')
    if (!DELETE_ORIGINALS) {
      console.log('💡 Les fichiers originaux ont été conservés.')
      console.log('   Pour les supprimer: --delete-originals')
    }
    console.log('\n⚠️  N\'oubliez pas de rsync vers prod après conversion!')
  }

  await db.close()
}

main().catch(console.error)
