import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
});
