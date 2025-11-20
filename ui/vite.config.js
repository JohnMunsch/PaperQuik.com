/// <reference types="vitest/config" />
export default {
  server: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:6080',
    },
  },
  build: {
    target: 'esnext',
  },
};
