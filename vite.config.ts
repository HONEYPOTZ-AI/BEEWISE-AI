import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    server: {
      host: '::',
      port: 8080,
      headers: {
        // Security headers for development
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    },
    plugins: [
    react(),
    // Generate bundle analysis in production
    isProd && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    // Compress static assets for production
    isProd && compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(png|jpe?g|gif|webp)$/i],
      threshold: 10240 // Only compress files > 10kb
    }),
    // Additional gzip compression for older browsers
    isProd && compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(png|jpe?g|gif|webp)$/i],
      threshold: 10240
    })].
    filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      // Production optimizations
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProd,
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        },
        format: {
          comments: false
        }
      } : {},
      rollupOptions: {
        output: {
          // Code splitting for better caching
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Group major frameworks
              if (id.includes('react/') || id.includes('react-dom/')) {
                return 'vendor-react';
              }
              if (id.includes('react-router-dom')) {
                return 'vendor-router';
              }
              if (id.includes('@radix-ui/') || id.includes('@headlessui/')) {
                return 'vendor-ui';
              }
              if (id.includes('@tanstack/react-query')) {
                return 'vendor-query';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-animation';
              }
              // Group remaining third-party dependencies
              return 'vendor-other';
            }
          },
          // Ensure consistent chunk filenames for better caching
          entryFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          chunkFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
        }
      },
      // Increase warning limit as code splitting may create larger chunks
      chunkSizeWarningLimit: 1200
    },
    define: {
      // Replace process.env variables at build time
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode)
    },
    esbuild: {
      // Remove console logs in production
      drop: isProd ? ['console', 'debugger'] : [],
      // Improve bundle size by removing comments
      legalComments: isProd ? 'none' : 'inline'
    },
    // Cache dependencies for faster builds
    optimizeDeps: {
      include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react'],

      exclude: ['@sentry/browser'] // Sentry should be loaded separately
    }
  };
});