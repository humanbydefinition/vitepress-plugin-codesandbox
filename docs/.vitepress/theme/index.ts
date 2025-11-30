import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useCodeSandbox } from 'vitepress-plugin-codesandbox'
import 'vitepress-plugin-codesandbox/style.css'

export default {
  extends: DefaultTheme,
  setup() {
    useCodeSandbox({
      // Example: customize for your needs
      languages: ['javascript', 'typescript'],
      buttonText: 'Open in CodeSandbox',
    })
  },
} satisfies Theme
