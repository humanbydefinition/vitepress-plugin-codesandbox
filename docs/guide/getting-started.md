# Getting Started

## Installation

Install `vitepress-plugin-codesandbox` using npm:

```bash
npm install vitepress-plugin-codesandbox
```

## Setup

### 1. Create or update your theme

Create a theme file at `.vitepress/theme/index.ts`:

```ts
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

### 2. Start using it

Any JavaScript or TypeScript code block in your markdown will now have an "Open in CodeSandbox" button:

```javascript
// Try clicking "Open in CodeSandbox" when hovering!
console.log('Hello from CodeSandbox!')

document.body.innerHTML = `
  <h1>Hello World</h1>
  <p>This code is running in CodeSandbox!</p>
`
```

## How it works

The plugin:

1. Scans your page for code blocks with supported languages
2. Compresses the code using lz-string
3. Generates a CodeSandbox URL with the embedded code
4. Adds a button that opens the sandbox in a new tab

The sandbox is created on-the-fly when the user clicks the button - no API keys or accounts needed!
