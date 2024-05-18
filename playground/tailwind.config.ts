import type { Config } from 'tailwindcss'

export default {
  content: [
    './node_modules/vernier-caliper/dist/*.js',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ]
} satisfies Config
