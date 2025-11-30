---
layout: home

hero:
  name: vitepress-plugin-codesandbox
  tagline: Add "Open in CodeSandbox" buttons to your VitePress documentation code blocks
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/humanbydefinition/vitepress-plugin-codesandbox

features:
  - title: Zero Config
    details: Works out of the box with sensible defaults. Just install and use.
  - title: Vanilla Templates
    details: Uses CodeSandbox's vanilla and vanilla-ts templates with Parcel bundler for a seamless experience.
  - title: HMR Support
    details: Full hot module replacement support - buttons update as you edit your docs.
  - title: Lightweight
    details: Minimal dependencies. Only lz-string for URL compression.
---

## Quick Start

Install the plugin:

```bash
npm install vitepress-plugin-codesandbox
```

Add it to your theme:

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { useCodeSandbox } from 'vitepress-plugin-codesandbox'
import 'vitepress-plugin-codesandbox/style.css'

export default {
  extends: DefaultTheme,
  setup() {
    useCodeSandbox()
  }
}
```

That's it! Your JavaScript and TypeScript code blocks now have "Open in CodeSandbox" buttons.

## Try It Out

Hover over the code block below and click "Open in CodeSandbox":

```javascript
// Create a simple interactive greeting
const app = document.createElement('div')
app.style.cssText = `
  font-family: system-ui;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`

const title = document.createElement('h1')
title.textContent = '👋 Hello from CodeSandbox!'
title.style.fontSize = '2.5rem'

const subtitle = document.createElement('p')
subtitle.textContent = 'This code was opened directly from VitePress!'
subtitle.style.opacity = '0.9'

app.appendChild(title)
app.appendChild(subtitle)
document.body.style.margin = '0'
document.body.appendChild(app)
```

## Language Matching

The `languages` option uses **exact matching**, giving you fine-grained control:

```ts
useCodeSandbox({
  languages: ['javascript'] // Only 'javascript', not 'js'
})
```

With this configuration, ` ```javascript ` blocks will have the button, but ` ```js ` blocks will not. This is useful when you want some code blocks to be openable in CodeSandbox while others remain display-only.
