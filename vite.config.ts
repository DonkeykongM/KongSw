@@ .. @@
 import { defineConfig } from 'vite';
 import react from '@vitejs/plugin-react';

 // https://vitejs.dev/config/
 export default defineConfig({
   plugins: [react()],
+  build: {
+    rollupOptions: {
+      output: {
+        manualChunks: {
+          'vendor': ['react', 'react-dom'],
+          'auth': ['@supabase/supabase-js'],
+          'icons': ['lucide-react']
+        }
+      }
+    },
+    minify: 'terser',
+    cssCodeSplit: true
+  },
+  server: {
+    headers: {
+      'Cache-Control': 'public, max-age=31536000',
+      'X-Content-Type-Options': 'nosniff'
+    }
+  }
 });