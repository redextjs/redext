import { defineConfig } from 'tsup'

export default defineConfig({
  dts: true,
  clean: true,
  splitting: false,
  // treeshake: false,
  target: 'es2019',
  format: ['cjs', 'esm'],
  external: [
    'react'
  ],
  sourcemap: false
})