import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'node-fetch': 'isomorphic-fetch'
      }
    },
    server: {
      port: 3000
    },
    base: env.NODE_ENV === 'production' ? '/github-repo-list/' : '/'
  }
})
