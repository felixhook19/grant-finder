import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0B1220',
        'midnight-80': 'rgba(11,18,32,0.8)',
        spark: '#19E88F',
        'spark-dim': 'rgba(25,232,143,0.12)',
        chalk: '#F4F1EA',
        slate: '#8892A0',
        ink: '#1E2A3A',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
export default config
