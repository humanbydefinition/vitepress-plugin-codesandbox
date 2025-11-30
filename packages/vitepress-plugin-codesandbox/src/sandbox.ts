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
  buttonPosition: 'before',
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
    buttonPosition: options.buttonPosition ?? DEFAULT_OPTIONS.buttonPosition,
  }
}

/**
 * Build the HTML content for the sandbox index.html.
 */
export function buildIndexHtml(options: ResolvedCodeSandboxOptions): string {
  const scriptTags = [
    ...options.scripts.map((src) => `<script src="${src}"></script>`),
    `<script src="./${options.filename}"></script>`,
  ].join('\n    ')

  return options.indexHtml.replace('{{SCRIPTS}}', scriptTags)
}

/**
 * Sanitize user code for the sandbox.
 */
export function sanitizeCode(raw: string): string {
  if (!raw) return ''
  return raw.replace(/^\s*\n/, '').replace(/\s+$/, '\n')
}

/**
 * Encode the sandbox payload using lz-string compression.
 */
export async function encodeSandboxPayload(payload: Record<string, unknown>): Promise<string> {
  const { compressToBase64 } = await import('lz-string')
  const json = JSON.stringify(payload)
  return compressToBase64(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Build the CodeSandbox URL for the given code.
 */
export async function buildCodeSandboxUrl(
  code: string,
  options: ResolvedCodeSandboxOptions
): Promise<string> {
  const indexHtml = buildIndexHtml(options)
  const sanitizedCode = sanitizeCode(code)

  const payload = {
    template: 'static',
    files: {
      'index.html': { content: indexHtml },
      [options.filename]: { content: sanitizedCode },
    },
  }

  const parameters = await encodeSandboxPayload(payload)
  const query = `file=${options.filename}`
  return `${CODE_SANDBOX_ENDPOINT}?parameters=${parameters}&query=${encodeURIComponent(query)}`
}
