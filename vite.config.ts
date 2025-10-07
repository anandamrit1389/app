import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

const SEO_TAGS = `
    <!-- Essential Open Graph Tags (Facebook, LinkedIn, WhatsApp, etc.) -->
    <meta property="og:title" content="Inabit.ai - AI-Powered Presentations">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://www.inabit.ai/images/logoword.jpg">
    <meta property="og:url" content="https://wwww.inabit.ai">

    <!-- Essential Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Inabit.ai - Create Stunning AI-Generated Presentations">
    <meta name="twitter:description" content="Generate professional presentations in seconds using AI. Simply enter your topic, and let Inabit.ai do the rest.">
    <meta name="twitter:image" content="https://www.inabit.ai/images/logoword.jpg">

    <!-- Recommended Open Graph Tags -->
    <meta property="og:description" content="Inabit.ai lets you create professional presentations in seconds with AI. Fast, efficient, and stunning results every time.">
    <meta property="og:site_name" content="Inabit.ai">
    <meta property="og:locale" content="en_US"> <!-- Default language -->
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- SEO & Search Engine Optimization -->
    <meta name="description" content="Create AI-powered presentations in seconds. Just enter your topic, and let Inabit.ai generate stunning slides for you. Perfect for business, education, and more.">
    <meta name="keywords" content="AI presentations, AI slide generator, automated presentations, smart slides, business presentations, pitch decks">
    <meta name="author" content="Inabit.ai">
    <meta name="robots" content="index, follow"> <!-- Ensures search engines index and follow links -->
    <link rel="canonical" href="https://www.inabit.ai"> <!-- Prevents duplicate content issues -->

    <!-- Pinterest -->
    <meta name="pinterest-rich-pin" content="true">

    <!-- Whatsapp -->
    <meta name="title" content="Inabit.ai - Stunning AI-Powered Presentation">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Inabit.ai",
        "url": "https://www.inabit.ai",
        "hasPart": [
          {
            "@type": "WebPage",
            "url": "https://www.inabit.ai/pricing",
            "name": "Pricing"
          }
        ]
      }
    </script>
`;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Inabit',
        short_name: 'Inabit',
        description: 'Everything can be done in a bit',
        theme_color: '#000000',
        icons: [
          {
            src: '/icons/icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        if (mode === 'production') {
          return html.replace('%SEO_TAGS%', SEO_TAGS);
        } else {
          return html.replace('%SEO_TAGS%', '');
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const HugeLibraries = [
            '@firebase',
            'googleapis',
            'react-pdf',
            'xlsx',
            'draft-js',
            'socket.io-client',
            'swiper',
            'docxtemplater',
            'recharts',
            'react-dnd',
            'pptxgenjs',
            'html2canvas',
            'jspdf',
            'docx',
          ];
          if (HugeLibraries.some((libName) => id.includes(`node_modules/${libName}`))) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
}));
