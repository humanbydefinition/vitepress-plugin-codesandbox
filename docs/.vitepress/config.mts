import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginPath = resolve(__dirname, '../../packages/vitepress-plugin-codesandbox/dist')

export default defineConfig({
  title: 'vp-plugin-codesandbox',
  description: 'Add "Open in CodeSandbox" buttons to VitePress code blocks',
  
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright  2025 humanbydefinition'
    }
  }
})
