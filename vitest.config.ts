import { defineConfig } from 'vitest/config'

// Only the plugin's own sources are tests; the default glob would also walk
// stray dependency trees (node_modules.broken, vendored packages).
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
