import { defineConfig } from '@sunshj/eslint-config'

export default defineConfig({
  files: ['playground/**/layout.tsx'],
  rules: {
    'react-refresh/only-export-components': 'off'
  }
})
