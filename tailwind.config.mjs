/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        // Tiki Village brand colors (tropical theme)
        'tiki-primary': '#D4504A', // Coral red
        'tiki-secondary': '#FFA500', // Orange
        'tiki-accent': '#00A86B', // Jade green
        'tiki-dark': '#1A3A3A', // Deep teal
        'tiki-light': '#F5F5F0', // Cream
      },
      fontFamily: {
        // Primary: serif for headers (tropical elegance)
        serif: ['Georgia', 'serif'],
        // Secondary: sans-serif for body
        sans: ['Geist Sans', 'sans-serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': '#1A3A3A', // tiki-dark
              'h1, h2, h3, h4': {
                color: '#D4504A', // tiki-primary
              },
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
              a: {
                color: '#D4504A', // tiki-primary
                '&:hover': {
                  color: '#00A86B', // tiki-accent
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
