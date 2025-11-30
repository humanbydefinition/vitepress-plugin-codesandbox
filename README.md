# vitepress-plugin-codesandbox

[![npm version](https://img.shields.io/npm/v/vitepress-plugin-codesandbox.svg)](https://www.npmjs.com/package/vitepress-plugin-codesandbox)
[![license](https://img.shields.io/npm/l/vitepress-plugin-codesandbox.svg)](https://github.com/humanbydefinition/vitepress-plugin-codesandbox/blob/main/LICENSE)

Add "Open in CodeSandbox" buttons to your VitePress documentation code blocks.

## Features

- **Zero Config** - Works out of the box with sensible defaults
- **Vanilla Templates** - Uses CodeSandbox's `vanilla` and `vanilla-ts` templates with Parcel bundler
- **HMR Support** - Full hot module replacement support during development
- **Customizable** - Configure languages, button text, and external scripts, and more
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

That's it! Your JavaScript and TypeScript code blocks now have "Open in CodeSandbox" buttons.

## How It Works

The plugin:

1. Scans your page for code blocks with supported languages
2. Compresses the code using lz-string
3. Generates a CodeSandbox URL with embedded files (using `vanilla` or `vanilla-ts` template)
4. Adds a button that opens the sandbox in a new tab

The sandbox includes:
- An `index.html` with basic styling and an `#app` div
- Your code in `src/index.js` or `src/index.ts`
- A `package.json` configured with Parcel bundler
- For TypeScript: a `tsconfig.json` with sensible defaults

## Configuration

```typescript
useCodeSandbox({
  // Languages to enable the button for (default: ['javascript', 'typescript'])
  languages: ['javascript', 'typescript'],

  // Additional scripts to load in the sandbox (before your code)
  scripts: ['https://unpkg.com/lodash@4.17.21/lodash.min.js'],

  // Button text (default: 'Open in CodeSandbox')
  buttonText: 'Open in CodeSandbox',

  // Button CSS class (default: 'code-sandbox-btn')
  buttonClass: 'code-sandbox-btn',
})
```

### Language Matching

The `languages` option uses **exact matching**. This allows you to selectively enable the button:

```typescript
// Only enable for 'javascript' - not 'js'
useCodeSandbox({
  languages: ['javascript']
})
```

With this configuration:
- ` ```javascript ` blocks → **will have** the button
- ` ```js ` blocks → **will not have** the button

This is useful when you want some code blocks to be openable in CodeSandbox, while others are just for display.

## Development

```bash
# Install dependencies
npm install

# Build the plugin and start docs dev server
npm run dev

# Build everything for production
npm run build
```