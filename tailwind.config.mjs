/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        // Tiki Village brand colors — source: HelloTikiVillage Elementor Kit
        'tiki-primary':   '#033537', // Vert-teal foncé (primary Elementor)
        'tiki-secondary': '#10CCAE', // Turquoise vif (secondary Elementor)
        'tiki-accent':    '#FFCE47', // Jaune doré (accent Elementor)
        'tiki-overlay':   '#033537CF', // Overlay sombre (Tours BG)
        'tiki-border':    '#03353733', // Bordures subtiles
        'tiki-light':     '#F5F5F0', // Crème (fond clair)
        'tiki-dark':      '#033537', // Alias primary pour compatibilité
      },
      fontFamily: {
        // Display: Nohemi pour les grands titres (style du site source)
        display: ['Nohemi', 'Dosis', 'sans-serif'],
        // Body: Geist Sans (interface Payload + textes courants)
        sans: ['Geist Sans', 'sans-serif'],
        // Serif: Playfair Display pour les titres éditoriaux élégants
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': '#033537', // tiki-primary
              fontFamily: 'var(--font-dosis), sans-serif',
              fontSize: '25px',
              fontStyle: 'var(--e-global-typography-text-font-style, normal)',
              'h1, h2, h3, h4': {
                color: '#033537', // tiki-primary
              },
              p: {
                fontSize: 'inherit',
                fontStyle: 'inherit',
              },
              li: {
                fontSize: 'inherit',
                fontStyle: 'inherit',
              },
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
              a: {
                color: '#10CCAE', // tiki-secondary
                '&:hover': {
                  color: '#FFCE47', // tiki-accent
                },
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
