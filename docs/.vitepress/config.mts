import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginPath = resolve(__dirname, '../../packages/vitepress-plugin-codesandbox/dist')

export default defineConfig({
  base: '/vitepress-plugin-codesandbox/',
  title: 'vp-plugin-codesandbox',
  description: 'Add "Open in CodeSandbox" buttons to VitePress code blocks',

  head: [
    [
      'script',
      {
        defer: '',
        src: 'https://analytics.textmode.art/script.js',
        'data-website-id': '57d79ecc-9136-4091-94f6-2e8cea7161ea'
      }
    ]
  ],

  vite: {
    resolve: {
      alias: [
        {
          find: /^vitepress-plugin-codesandbox\/style\.css$/,
          replacement: resolve(pluginPath, 'style.css'),
        },
        {
          find: /^vitepress-plugin-codesandbox$/,
          replacement: resolve(pluginPath, 'index.js'),
        },
      ],
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/humanbydefinition/vitepress-plugin-codesandbox' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' },
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Usage', link: '/examples/' },
            { text: 'Custom Scripts', link: '/examples/custom-scripts' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/humanbydefinition/vitepress-plugin-codesandbox' }
    ],

    footer: {
      message: '<a href="/vitepress-plugin-codesandbox/legal/imprint">Imprint</a> | <a href="/vitepress-plugin-codesandbox/legal/data-protection-policy">Data Protection Policy</a>',
      copyright: 'Copyright © 2025 humanbydefinition. Released under the MIT License.'
    }
  }
})
