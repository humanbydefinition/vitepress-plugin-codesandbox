# vitepress-plugin-codesandbox

[![npm version](https://img.shields.io/npm/v/vitepress-plugin-codesandbox.svg)](https://www.npmjs.com/package/vitepress-plugin-codesandbox)
[![license](https://img.shields.io/npm/l/vitepress-plugin-codesandbox.svg)](https://github.com/humanbydefinition/vitepress-plugin-codesandbox/blob/main/LICENSE)

Add "Open in CodeSandbox" buttons to your VitePress documentation code blocks.

## Features

- **Zero Config** - Works out of the box with sensible defaults
- **HMR Support** - Full hot module replacement support
- **Customizable** - Configure languages, button text, templates, and external scripts
- **Lightweight** - Minimal dependencies (only lz-string for URL compression)

## Installation

```bash
npm install vitepress-plugin-codesandbox
```

## Usage

Add the plugin to your VitePress theme:

```typescript
// .vitepress/theme/index.ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useCodeSandbox } from 'vitepress-plugin-codesandbox'
import 'vitepress-plugin-codesandbox/style.css'

export default {
  extends: DefaultTheme,
  setup() {
    useCodeSandbox()
  },
} satisfies Theme
```

That is it! Your JavaScript and TypeScript code blocks now have "Open in CodeSandbox" buttons.

## Configuration

```typescript
useCodeSandbox({
  // Languages to enable the button for (default: ['javascript', 'typescript'])
  languages: ['javascript', 'typescript'],

  // Additional scripts to load in the sandbox
  scripts: ['https://unpkg.com/lodash@4.17.21/lodash.min.js'],

  // Custom HTML template (use {{SCRIPTS}} as placeholder)
  indexHtml: '<!DOCTYPE html>...',

  // Button text (default: 'Open in CodeSandbox')
  buttonText: 'Open in CodeSandbox',

  // Button CSS class (default: 'code-sandbox-btn')
  buttonClass: 'code-sandbox-btn',
})
```

## Development

```bash
# Install dependencies
npm install

# Build the plugin and start docs dev server
npm run dev

# Build everything for production
npm run build
```