export default {
  build: {
    assetsDir: '',
    rollupOptions: {
      input: {
        bootstrap: 'src/bootstrap.ts',
        components: 'src/components/index.ts',
      },
      output: {
        entryFileNames: '__[name]-[hash].js',
        chunkFileNames: '__[name]-[hash].js',
        assetFileNames: '__[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'bundle';
          }
        },
      },
    },
  },
  esbuild: {
    keepNames: true,
  },
};
