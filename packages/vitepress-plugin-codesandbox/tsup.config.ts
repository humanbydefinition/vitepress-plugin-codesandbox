import { defineConfig } from 'tsup'
import { copyFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vue', 'vitepress'],
  treeshake: true,
  onSuccess: async () => {
    // Copy CSS file to dist
    mkdirSync('dist', { recursive: true })
    copyFileSync('src/style.css', 'dist/style.css')
    console.log('✓ Copied style.css to dist/')
  },
})
