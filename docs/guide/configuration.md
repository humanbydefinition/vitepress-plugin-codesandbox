# Configuration

The `useCodeSandbox` function accepts an options object to customize behavior.

## Options

```ts
interface CodeSandboxOptions {
  // Languages to enable the button for
  languages?: string[]

  // Additional scripts to load before user code
  scripts?: string[]

  // Button text
  buttonText?: string

  // Button CSS class
  buttonClass?: string
}
```

## Examples

### Default configuration

```ts
useCodeSandbox({
  languages: ['javascript', 'typescript'],
  buttonText: 'Open in CodeSandbox',
  buttonClass: 'code-sandbox-btn',
})
```

### Add external libraries

Load libraries like Lodash or Three.js before your code runs:

```ts
useCodeSandbox({
  scripts: [
    'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    'https://unpkg.com/three@0.160.0/build/three.min.js',
  ],
})
```

### Language matching

The `languages` option uses **exact matching**. This allows you to selectively enable the button for specific code blocks:

```ts
// Only enable for 'javascript' - not 'js'
useCodeSandbox({
  languages: ['javascript']
})
```

With this configuration:
- ` ```javascript ` blocks → **will have** the button
- ` ```js ` blocks → **will not have** the button

This is useful when you want some code blocks to be openable in CodeSandbox, while others are just for display.

### Custom button styling

Use a custom CSS class and import your own styles:

```ts
useCodeSandbox({
  buttonClass: 'my-custom-btn',
  buttonText: '🚀 Run in Sandbox',
})
```

```css
/* In your custom CSS */
.my-custom-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
}
```

## How the Sandbox Works

When a user clicks "Open in CodeSandbox", the plugin creates a sandbox with:

- **JavaScript blocks** → `vanilla` template with Parcel bundler
- **TypeScript blocks** → `vanilla-ts` template with Parcel bundler and TypeScript configured

The generated sandbox includes:
- An `index.html` with basic styling and a `<div id="app">` element
- Your code in `src/index.js` or `src/index.ts` (loaded as a module)
- A `package.json` configured with Parcel as the bundler
- For TypeScript: a `tsconfig.json` with sensible defaults