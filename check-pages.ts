import { getPayload } from 'payload'
import config from '@payload-config'

async function checkPages() {
  const payload = await getPayload({ config })

  console.log('\n📄 Checking pages in database...\n')

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        in: ['home', 'contact'],
      },
    },
    depth: 0,
  })

  if (result.docs.length === 0) {
    console.log('❌ No pages found in database!')
    console.log('\nYou need to run the seed function to create the pages.')
    console.log('Visit: http://localhost:3000/next/seed')
    process.exit(0)
  }

  result.docs.forEach((page) => {
    console.log(`\n📌 Page: ${page.slug}`)
    console.log(`   - Title (FR): ${page.title?.fr || 'N/A'}`)
    console.log(`   - Title (EN): ${page.title?.en || 'N/A'}`)
    console.log(`   - Title (JA): ${page.title?.ja || 'N/A'}`)
    console.log(`   - Status: ${page._status || 'N/A'}`)
  })

  console.log('\n✅ Database check complete!\n')
}

checkPages().catch(console.error)
