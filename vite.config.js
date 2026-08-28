import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import { createSmartMatcher } from './functions/api/search_fuzzy.js';

function localApiDevPlugin() {
  let cache = {};
  let cacheMtime = {};

  const getPublicDataPath = (file) => path.resolve(process.cwd(), 'public/data', file);

  const loadJson = (key, file) => {
    const fullPath = getPublicDataPath(file);
    if (!fs.existsSync(fullPath)) return null;
    const mtime = fs.statSync(fullPath).mtimeMs;
    if (!cache[key] || cacheMtime[key] !== mtime) {
      cache[key] = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      cacheMtime[key] = mtime;
    }
    return cache[key];
  };

  return {
    name: 'local-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        try {
          if (pathname === '/api/metadata') {
            const stats = loadJson('stats', 'stats.json') || {};
            const asatidzah = loadJson('asatidzah', 'asatidzah.json') || [];
            const authors = loadJson('bookAuthors', 'book_authors.json') || [];
            
            const categories = [
              'Semua', 'Akidah', 'Fiqh', 'Hadits', 'Tafsir', 
              'Adab & Akhlak', 'Manhaj', 'Sirah', 'Dauroh', 
              'Khutbah Jum\'at', 'Tanya Jawab', 'Tematik'
            ];

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              categories,
              asatidzah,
              authors,
              stats
            }));
          }

          if (pathname === '/api/audio') {
            const audioData = loadJson('audioCatalog', 'audio_catalog.json') || [];
            const q = (url.searchParams.get('q') || '').trim();
            const category = url.searchParams.get('category') || 'Semua';
            const ustadz = url.searchParams.get('ustadz') || 'Semua';
            const sortBy = url.searchParams.get('sortBy') || 'msg_desc';
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 24;

            let filtered = audioData;

            if (category !== 'Semua') {
              filtered = filtered.filter(item => item.c === category);
            }

            if (ustadz !== 'Semua') {
              filtered = filtered.filter(item => item.u === ustadz);
            }

            if (q) {
              const matcher = createSmartMatcher(q);
              filtered = filtered.filter(item => {
                const searchTarget = `${item.t || ''} ${item.u || ''} ${item.k || ''} ${item.c || ''}`;
                return matcher(searchTarget);
              });
            }

            if (sortBy === 'msg_asc') {
              filtered = [...filtered].sort((a, b) => (a.m || 0) - (b.m || 0));
            } else if (sortBy === 'title_asc') {
              filtered = [...filtered].sort((a, b) => (a.t || '').localeCompare(b.t || ''));
            } else if (sortBy === 'title_desc') {
              filtered = [...filtered].sort((a, b) => (b.t || '').localeCompare(a.t || ''));
            } else if (sortBy === 'duration_desc') {
              filtered = [...filtered].sort((a, b) => (b.d || 0) - (a.d || 0));
            } else if (sortBy === 'duration_asc') {
              filtered = [...filtered].sort((a, b) => (a.d || 0) - (b.d || 0));
            } else {
              // default msg_desc
              filtered = [...filtered].sort((a, b) => (b.m || 0) - (a.m || 0));
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / limit);
            const offset = (page - 1) * limit;
            const items = filtered.slice(offset, offset + limit);

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              items,
              total,
              page,
              limit,
              totalPages
            }));
          }

          if (pathname === '/api/library') {
            const booksData = loadJson('books', 'books.json') || [];
            const q = (url.searchParams.get('q') || '').trim();
            const category = url.searchParams.get('category') || 'Semua';
            const author = url.searchParams.get('author') || 'Semua';
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 12;

            let filtered = booksData;

            if (category !== 'Semua') {
              filtered = filtered.filter(item => item.category === category);
            }

            if (author !== 'Semua') {
              filtered = filtered.filter(item => item.author === author);
            }

            if (q) {
              const matcher = createSmartMatcher(q);
              filtered = filtered.filter(item => {
                const volTitles = (item.volumes || []).map(v => v.title || '').join(' ');
                const searchTarget = `${item.title || ''} ${item.author || ''} ${item.category || ''} ${volTitles}`;
                return matcher(searchTarget);
              });
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / limit);
            const offset = (page - 1) * limit;
            const items = filtered.slice(offset, offset + limit);

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              items,
              total,
              page,
              limit,
              totalPages
            }));
          }

          if (pathname === '/api/series') {
            const seriesData = loadJson('series', 'series.json') || [];
            const q = (url.searchParams.get('q') || '').trim();
            const ustadz = url.searchParams.get('ustadz') || 'Semua';
            const page = parseInt(url.searchParams.get('page')) || 1;
            const limit = parseInt(url.searchParams.get('limit')) || 12;

            let filtered = seriesData;

            if (ustadz !== 'Semua') {
              filtered = filtered.filter(item => item.ustadz === ustadz);
            }

            if (q) {
              const matcher = createSmartMatcher(q);
              filtered = filtered.filter(item => {
                const searchTarget = `${item.name || item.title || ''} ${item.ustadz || ''} ${item.category || ''}`;
                return matcher(searchTarget);
              });
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / limit);
            const offset = (page - 1) * limit;
            const items = filtered.slice(offset, offset + limit);

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              items,
              total,
              page,
              limit,
              totalPages
            }));
          }

          if (pathname === '/api/khutbah') {
            const khutbahData = loadJson('khutbahTexts', 'khutbah_texts.json') || [];
            const q = (url.searchParams.get('q') || '').trim();
            const category = url.searchParams.get('category') || 'Semua';
            const id = url.searchParams.get('id');

            if (id) {
              const item = khutbahData.find(k => String(k.id) === String(id) || String(k.msg_id) === String(id));
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(item || { error: 'Not found' }));
            }

            let filtered = khutbahData;

            if (category !== 'Semua') {
              filtered = filtered.filter(item => item.category === category);
            }

            if (q) {
              const matcher = createSmartMatcher(q);
              filtered = filtered.filter(item => {
                const searchTarget = `${item.title_ar || ''} ${item.title_id || ''} ${item.summary_id || ''} ${item.full_arabic_text || ''} ${item.full_indonesian_text || ''}`;
                return matcher(searchTarget);
              });
            }

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              items: filtered,
              total: filtered.length
            }));
          }

          next();
        } catch (err) {
          console.error("Local API Dev Error:", err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    localApiDevPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Daftar Kajian Salafy - Audio & Kitab Ulama',
        short_name: 'Daftar Kajian',
        description: 'Khazanah dan Arsip Digital Audio Kajian serta Perpustakaan Kitab Ulama Ahlussunnah',
        theme_color: '#059669',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
