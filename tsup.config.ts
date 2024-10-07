import { type Options, defineConfig } from 'tsup'

const sharedConfig: Options = {
  entry: ['src/index.ts', 'src/actions.ts'],
  clean: true
}

export default defineConfig([
  {
    ...sharedConfig,
    format: 'esm',
    dts: true
  },
  {
    ...sharedConfig,
    format: 'cjs'
  }
])
