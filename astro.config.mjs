// @ts-check
import { defineConfig } from 'astro/config'
import mermaid from 'astro-mermaid'
import starlight from '@astrojs/starlight'

// GitHub Pages 배포 주소. 워크플로가 SITE_URL / BASE_PATH 를 넣어 줍니다.
const site = process.env.SITE_URL || 'http://localhost:4321'
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '')

/**
 * 문서 안의 사이트 내부 링크("/docs/...")를 처리하는 rehype 플러그인입니다.
 * - 번역해서 이 사이트에 있는 페이지(policy-types)는 base 경로를 붙입니다.
 * - 아직 번역하지 않은 페이지는 원본(kyverno.io)으로 연결합니다.
 */
function rewriteInternalLinks() {
  const ORIGIN = 'https://kyverno.io'
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
      const href = node.properties.href
      if (href.startsWith('/') && !href.startsWith('//')) {
        node.properties.href = href.startsWith('/docs/policy-types')
          ? base + href
          : ORIGIN + href
      }
    }
    node.children?.forEach(visit)
  }
  return (tree) => visit(tree)
}

export default defineConfig({
  site,
  base: base || '/',
  markdown: { rehypePlugins: [rewriteInternalLinks] },
  integrations: [
    mermaid(),
    starlight({
      title: 'Kyverno 한국어 가이드',
      description: 'Kyverno 공식 문서(policy-types)의 한국어 번역입니다.',
      defaultLocale: 'root',
      locales: { root: { label: '한국어', lang: 'ko' } },
      favicon: '/favicon.svg',
      editLink: { baseUrl: 'https://github.com/kyverno/website/edit/main/' },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kyverno/kyverno' },
      ],
      sidebar: [
        { label: '정책 유형', items: [{ autogenerate: { directory: 'docs/policy-types' } }] },
      ],
    }),
  ],
})
