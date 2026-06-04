import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    printWidth: 120,
    singleQuote: true,
    sortImports: true,
    sortTailwindcss: true,
    semi: false,
  },
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'vue', 'vitest', 'promise'],
    categories: {
      correctness: 'error',
      pedantic: 'error',
      suspicious: 'error',
    },
    rules: {
      'import/no-unassigned-import': 'allow',
      // App.vue is the root aggregator; it legitimately wires up many child components.
      'import/max-dependencies': ['error', { max: 13 }],
      // DitherCanvas bundles the render loop, viewport-fit, drag/keyboard resize and dither math.
      'max-lines': ['error', { max: 360, skipBlankLines: true, skipComments: true }],
    },
    env: {
      builtin: true,
    },
    options: {
      typeAware: true,
      typeCheck: true,
      maxWarnings: 10,
    },
    ignorePatterns: ['src/env.d.ts'],
  },
  plugins: [vue(), tailwindcss()],
})
