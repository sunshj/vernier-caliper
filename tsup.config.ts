import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx', 'src/actions.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true
})
