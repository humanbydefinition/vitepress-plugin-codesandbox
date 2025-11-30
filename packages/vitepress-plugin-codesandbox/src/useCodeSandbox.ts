import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import type { CodeSandboxOptions, ResolvedCodeSandboxOptions } from './types'
import { resolveOptions, buildCodeSandboxUrl } from './sandbox'

/**
 * Vue composable that automatically adds "Open in CodeSandbox" buttons to code blocks.
 * Uses MutationObserver to detect DOM changes during HMR.
 *
 * @param options - Configuration options for the plugin
 */
export function useCodeSandbox(options: CodeSandboxOptions = {}): void {
  if (typeof window === 'undefined') return

  const route = useRoute()
  const resolvedOptions = resolveOptions(options)

  let observer: MutationObserver | null = null

  const queueEnhancement = () => {
    nextTick(() => enhanceCodeBlocks(resolvedOptions))
  }

  const setupObserver = () => {
    // Disconnect existing observer if any
    observer?.disconnect()

    const doc = document.querySelector<HTMLElement>('.vp-doc')
    if (!doc) return

    // Create a MutationObserver to detect DOM changes (including HMR updates)
    observer = new MutationObserver((mutations) => {
      // Check if any mutation affects code blocks
      const hasRelevantChanges = mutations.some((mutation) => {
        // Check added nodes for code blocks
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (
              node.matches?.('div[class*="language-"]') ||
              node.querySelector?.('div[class*="language-"]')
            ) {
              return true
            }
          }
        }
        // Check if attributes changed on code blocks (e.g., language class change)
        if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
          if (mutation.target.matches?.('div[class*="language-"]')) {
            return true
          }
        }
        return false
      })

      if (hasRelevantChanges) {
        queueEnhancement()
      }
    })

    observer.observe(doc, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
  }

  onMounted(() => {
    queueEnhancement()
    setupObserver()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  // Re-setup observer when navigating to a new page
  watch(
    () => route.path,
    () => {
      queueEnhancement()
      nextTick(setupObserver)
    }
  )
}

/**
 * Enhance all code blocks on the page with CodeSandbox buttons.
 */
async function enhanceCodeBlocks(options: ResolvedCodeSandboxOptions): Promise<boolean> {
  if (typeof window === 'undefined') return false

  const doc = document.querySelector<HTMLElement>('.vp-doc')
  if (!doc) return false

  const codeBlocks = Array.from(doc.querySelectorAll<HTMLElement>('div[class*="language-"]'))
  let added = 0

  for (const block of codeBlocks) {
    if (block.dataset.codesandboxReady === 'true') continue

    const language = getCodeBlockLanguage(block)
    if (!language || !options.languages.has(language)) continue

    const copyButton = block.querySelector<HTMLButtonElement>('button.copy')
    const codeElement = block.querySelector<HTMLElement>('code')
    if (!copyButton || !codeElement) continue

    const codeText = codeElement.textContent ?? ''
    if (!codeText.trim()) continue

    const openButton = await createCodeSandboxButton(codeText, language, options)
    if (!openButton) continue

    // Insert button before the copy button (as a sibling)
    const parent = copyButton.parentElement ?? block
    parent.insertBefore(openButton, copyButton)

    block.dataset.codesandboxReady = 'true'
    added += 1
  }

  return added > 0
}

/**
 * Extract the language from a code block element.
 */
function getCodeBlockLanguage(block: HTMLElement): string | null {
  const dataLang = (
    block.getAttribute('data-ext') || block.getAttribute('data-lang')
  )?.toLowerCase()
  if (dataLang) return dataLang

  const className = Array.from(block.classList).find((cls) => cls.startsWith('language-'))
  if (!className) return null
  return className.replace('language-', '').toLowerCase()
}

/**
 * Create a CodeSandbox button element.
 */
async function createCodeSandboxButton(
  rawCode: string,
  language: string,
  options: ResolvedCodeSandboxOptions
): Promise<HTMLAnchorElement | null> {
  const sandboxUrl = await buildCodeSandboxUrl(rawCode, options, language)

  const button = document.createElement('a')
  button.className = options.buttonClass
  button.title = options.buttonText
  button.setAttribute('aria-label', options.buttonText)
  button.textContent = options.buttonText
  button.href = sandboxUrl
  button.target = '_blank'
  button.rel = 'noopener noreferrer'
  button.addEventListener('click', (event) => {
    event.stopPropagation()
  })

  return button
}
