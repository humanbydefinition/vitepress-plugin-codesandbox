import type { CodeSandboxOptions, ResolvedCodeSandboxOptions } from './types'

const CODE_SANDBOX_ENDPOINT = 'https://codesandbox.io/api/v1/sandboxes/define'

const DEFAULT_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CodeSandbox</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    </style>
  </head>
  <body>
    {{SCRIPTS}}
  </body>
</html>
`

const DEFAULT_OPTIONS: ResolvedCodeSandboxOptions = {
  languages: new Set(['javascript', 'typescript']),
  indexHtml: DEFAULT_INDEX_HTML,
  scripts: [],
  filename: 'index.js',
  buttonText: 'Open in CodeSandbox',
  buttonClass: 'code-sandbox-btn',
}

/**
 * Resolve user options with defaults.
 */
export function resolveOptions(options: CodeSandboxOptions = {}): ResolvedCodeSandboxOptions {
  return {
    languages: new Set(options.languages ?? DEFAULT_OPTIONS.languages),
    indexHtml: options.indexHtml ?? DEFAULT_OPTIONS.indexHtml,
    scripts: options.scripts ?? DEFAULT_OPTIONS.scripts,
    filename: options.filename ?? DEFAULT_OPTIONS.filename,
    buttonText: options.buttonText ?? DEFAULT_OPTIONS.buttonText,
    buttonClass: options.buttonClass ?? DEFAULT_OPTIONS.buttonClass,
  }
}

/**
 * Build the HTML content for the sandbox index.html.
 */
export function buildIndexHtml(filename: string, scripts: string[]): string {
  const scriptTags = [
    ...scripts.map((src) => `<script src="${src}"></script>`),
    `<script src="./${filename}"></script>`,
  ].join('\n    ')

  return DEFAULT_INDEX_HTML.replace('{{SCRIPTS}}', scriptTags)
}

/**
 * Sanitize user code for the sandbox.
 */
export function sanitizeCode(raw: string): string {
  if (!raw) return ''
  return raw.replace(/^\s*\n/, '').replace(/\s+$/, '\n')
}

/**
 * Compress the sandbox payload using lz-string.
 * This matches the format expected by CodeSandbox's define API.
 */
export async function getParameters(parameters: {
  files: { [key: string]: { content: string; isBinary?: boolean } }
}): Promise<string> {
  const lzStringModule = await import('lz-string')
  
  // Handle both ESM named exports and CJS default export patterns
  const compressToBase64: (input: string) => string = 
    lzStringModule.compressToBase64 ?? 
    (lzStringModule.default as typeof lzStringModule)?.compressToBase64
  
  if (typeof compressToBase64 !== 'function') {
    throw new Error(
      'Failed to load compressToBase64 from lz-string. ' +
      'Please ensure lz-string is properly installed.'
    )
  }
  
  const json = JSON.stringify(parameters)
  return compressToBase64(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Get the appropriate filename extension for a language.
 */
export function getFilenameForLanguage(language: string, defaultFilename: string): string {
  const isTypeScript = language === 'typescript' || language === 'ts'
  const ext = isTypeScript ? 'ts' : 'js'
  
  if (defaultFilename.match(/\.[jt]sx?$/)) {
    return defaultFilename.replace(/\.[jt]sx?$/, `.${ext}`)
  }
  return `index.${ext}`
}

/**
 * Strip TypeScript type annotations for use in static sandbox.
 * Uses a careful approach to avoid breaking CSS and object values.
 */
export function stripTypeAnnotations(code: string): string {
  // Split code into parts: template literals, strings, and regular code
  // We only want to strip types from regular code, not from strings
  const result: string[] = []
  let i = 0
  
  while (i < code.length) {
    // Check for template literal
    if (code[i] === '`') {
      const start = i
      i++
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') i++ // Skip escaped characters
        i++
      }
      i++ // Include closing backtick
      result.push(code.slice(start, i))
      continue
    }
    
    // Check for single or double quoted strings
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i]
      const start = i
      i++
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') i++ // Skip escaped characters
        i++
      }
      i++ // Include closing quote
      result.push(code.slice(start, i))
      continue
    }
    
    // Check for comments
    if (code[i] === '/' && code[i + 1] === '/') {
      const start = i
      while (i < code.length && code[i] !== '\n') i++
      result.push(code.slice(start, i))
      continue
    }
    if (code[i] === '/' && code[i + 1] === '*') {
      const start = i
      i += 2
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++
      i += 2
      result.push(code.slice(start, i))
      continue
    }
    
    // Regular code - accumulate until we hit a string/template/comment
    const start = i
    while (i < code.length && 
           code[i] !== '`' && 
           code[i] !== '"' && 
           code[i] !== "'" &&
           !(code[i] === '/' && (code[i + 1] === '/' || code[i + 1] === '*'))) {
      i++
    }
    
    if (i > start) {
      let chunk = code.slice(start, i)
      
      // Now safely strip TypeScript from this code chunk
      chunk = chunk
        // Remove interface declarations
        .replace(/\binterface\s+\w+\s*\{[^}]*\}/g, '')
        // Remove type aliases
        .replace(/\btype\s+\w+\s*=\s*[^;]+;/g, '')
        // Remove function return type annotations: ): Type {  or ): Type =>
        .replace(/\)\s*:\s*\w+(?:<[^>]+>)?(?:\[\])?\s*(?=[{=])/g, ') ')
        // Remove parameter type annotations: (param: Type) or (param: Type,
        .replace(/(\w+)\s*:\s*\w+(?:<[^>]+>)?(?:\[\])?\s*(?=[,\)])/g, '$1')
        // Remove variable type annotations: const x: Type = or let x: Type =
        .replace(/(const|let|var)\s+(\w+)\s*:\s*\w+(?:<[^>]+>)?(?:\[\])?\s*=/g, '$1 $2 =')
        // Remove 'as Type' assertions
        .replace(/\s+as\s+\w+(?:<[^>]+>)?(?:\[\])?/g, '')
      
      result.push(chunk)
    }
  }
  
  return result.join('')
    // Clean up multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Clean up leading blank lines
    .replace(/^\s*\n/, '')
}

/**
 * Build the CodeSandbox URL for the given code.
 * Uses 'vanilla' template for JavaScript and 'vanilla-ts' for TypeScript.
 */
export async function buildCodeSandboxUrl(
  code: string,
  options: ResolvedCodeSandboxOptions,
  language: string = 'javascript'
): Promise<string> {
  const sanitizedCode = sanitizeCode(code)
  const isTypeScript = language === 'typescript' || language === 'ts'
  
  // Use appropriate template based on language
  const mainFile = isTypeScript ? 'src/index.ts' : 'src/index.js'
  
  // Build the index.html that imports the main file as a module
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeSandbox</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    </style>
  </head>
  <body>
    <div id="app"></div>
${options.scripts.map((src) => `    <script src="${src}"></script>`).join('\n')}
    <script type="module" src="/${mainFile}"></script>
  </body>
</html>
`

  // Build files object with the correct structure
  const files: { [key: string]: { content: string; isBinary: boolean } } = {
    'index.html': { content: indexHtmlContent, isBinary: false },
    [mainFile]: { content: sanitizedCode, isBinary: false },
  }

  // Add package.json for proper bundling
  if (isTypeScript) {
    files['package.json'] = {
      content: JSON.stringify({
        name: 'typescript-sandbox',
        version: '1.0.0',
        description: '',
        main: 'src/index.ts',
        scripts: {
          start: 'parcel index.html',
          build: 'parcel build index.html'
        },
        dependencies: {},
        devDependencies: {
          'parcel-bundler': '^1.12.5',
          'typescript': '^5.0.0'
        }
      }, null, 2),
      isBinary: false
    }
    files['tsconfig.json'] = {
      content: JSON.stringify({
        compilerOptions: {
          strict: true,
          module: 'ESNext',
          target: 'ESNext',
          moduleResolution: 'node',
          esModuleInterop: true,
          skipLibCheck: true
        },
        include: ['src/**/*']
      }, null, 2),
      isBinary: false
    }
  } else {
    files['package.json'] = {
      content: JSON.stringify({
        name: 'javascript-sandbox',
        version: '1.0.0',
        description: '',
        main: 'src/index.js',
        scripts: {
          start: 'parcel index.html',
          build: 'parcel build index.html'
        },
        dependencies: {},
        devDependencies: {
          'parcel-bundler': '^1.12.5'
        }
      }, null, 2),
      isBinary: false
    }
  }

  const parameters = await getParameters({ files })
  const query = `file=/${mainFile}`
  return `${CODE_SANDBOX_ENDPOINT}?parameters=${parameters}&query=${encodeURIComponent(query)}`
}
