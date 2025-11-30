# vitepress-plugin-codesandbox

Add "Open in CodeSandbox" buttons to VitePress code blocks.

## Installation

```bash
npm install vitepress-plugin-codesandbox
```

## Usage

In your VitePress theme setup (`.vitepress/theme/index.ts`):

```typescript
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

## Options

```typescript
useCodeSandbox({
  // Languages to enable the button for (default: ['javascript', 'typescript'])
  languages: ['javascript', 'typescript'],

  // Custom HTML template (use {{SCRIPTS}} for script placeholder)
  indexHtml: '<!DOCTYPE html>...',

  // Additional scripts to load before user code
  scripts: ['https://unpkg.com/lodash@4.17.21/lodash.min.js'],

  // Filename for user code in sandbox (default: 'index.js')
  filename: 'index.js',

  // Button text (default: 'Open in CodeSandbox')
  buttonText: 'Open in CodeSandbox',

  // Button CSS class (default: 'code-sandbox-btn')
  buttonClass: 'code-sandbox-btn',

  // Button position relative to copy button (default: 'before')
  buttonPosition: 'before'
})
```

## License

MIT
