import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/heros/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Footer/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Header/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, require('@tailwindcss/typography')],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
}

export default config
