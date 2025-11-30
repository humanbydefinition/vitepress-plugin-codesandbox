/**
 * Configuration options for the CodeSandbox plugin.
 */
export interface CodeSandboxOptions {
  /**
   * Languages to enable the "Open in CodeSandbox" button for.
   * @default ['javascript', 'typescript']
   */
  languages?: string[]

  /**
   * Custom HTML template for the sandbox's index.html file.
   * Use `{{SCRIPTS}}` as a placeholder for where script tags should be inserted.
   */
  indexHtml?: string

  /**
   * Additional script URLs to include in the sandbox (loaded before user code).
   * @example ['https://unpkg.com/lodash@4.17.21/lodash.min.js']
   */
  scripts?: string[]

  /**
   * The filename to use for the user's code in the sandbox.
   * @default 'index.js'
   */
  filename?: string

  /**
   * Text to display on the button.
   * @default 'Open in CodeSandbox'
   */
  buttonText?: string

  /**
   * CSS class name for the button.
   * @default 'code-sandbox-btn'
   */
  buttonClass?: string
}

/**
 * Internal resolved configuration with all defaults applied.
 */
export interface ResolvedCodeSandboxOptions {
  languages: Set<string>
  indexHtml: string
  scripts: string[]
  filename: string
  buttonText: string
  buttonClass: string
}
