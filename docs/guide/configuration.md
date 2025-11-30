# Configuration

The `useCodeSandbox` function accepts an options object to customize behavior.

## Options

```ts
interface CodeSandboxOptions {
  // Languages to enable the button for
  languages?: string[]
  
  // Custom HTML template (use {{SCRIPTS}} for script placeholder)
  indexHtml?: string
  
  // Additional scripts to load before user code
  scripts?: string[]
  
  // Filename for user code in sandbox
  filename?: string
  
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
  filename: 'index.js',
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

### Custom HTML template

Provide a complete custom HTML template:

```ts
useCodeSandbox({
  indexHtml: `<!DOCTYPE html>
<html>
  <head>
    <title>My Sandbox</title>
    <style>
      body { 
        margin: 0; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        min-height: 100vh;
      }
    </style>
  </head>
  <body>
    {{SCRIPTS}}
  </body>
</html>`,
})
```

### Custom button styling

Use a custom CSS class and import your own styles:

```ts
useCodeSandbox({
  buttonClass: 'my-custom-btn',
  buttonText: ' Run in Sandbox',
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
