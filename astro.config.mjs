// @ts-check
import { defineConfig } from 'astro/config'
import mermaid from 'astro-mermaid'
import starlight from '@astrojs/starlight'

// GitHub Pages 배포 주소. 워크플로가 SITE_URL / BASE_PATH 를 넣어 줍니다.
const site = process.env.SITE_URL || 'http://localhost:4321'
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '')

/**
 * 문서 안의 사이트 내부 링크("/docs/...")를 처리하는 rehype 플러그인입니다.
 * - /docs/... 는 이 사이트의 번역 문서이므로 base 경로를 붙입니다.
 * - 그 밖의 경로(/policies, /blog 등)는 원본(kyverno.io)으로 연결합니다.
 */
function rewriteInternalLinks() {
  const ORIGIN = 'https://kyverno.io'
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
      const href = node.properties.href
      if (href.startsWith('/') && !href.startsWith('//')) {
        node.properties.href = href === '/docs' || href.startsWith('/docs/') || href.startsWith('/docs#')
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
      customCss: ['./src/styles/custom.css'],
      components: { PageTitle: './src/components/PageTitle.astro' },
      head: [
        { tag: 'script', attrs: { src: `${base}/sidebar-toggle.js` } },
        { tag: 'script', attrs: { src: `${base}/code-highlight.js`, defer: true } },
      ],
      editLink: { baseUrl: 'https://github.com/kyverno/website/edit/main/' },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kyverno/kyverno' },
      ],
      sidebar: [
        { label: '소개', collapsed: true, items: [{ autogenerate: { directory: 'docs/introduction' } }] },
        { label: '설치', collapsed: true, items: [{ autogenerate: { directory: 'docs/installation' } }] },
        { label: '정책 유형', items: [{ autogenerate: { directory: 'docs/policy-types' } }] },
        { label: '가이드', collapsed: true, items: [{ autogenerate: { directory: 'docs/guides' } }] },
        { label: '레퍼런스', collapsed: true, items: [{ autogenerate: { directory: 'docs/reference' } }] },
        { label: 'Kyverno CLI', collapsed: true, items: [{ autogenerate: { directory: 'docs/kyverno-cli' } }] },
        { label: '서브프로젝트', collapsed: true, items: [{ autogenerate: { directory: 'docs/subprojects' } }] },
        { label: 'CRD', collapsed: true, items: [{ autogenerate: { directory: 'docs/crds' } }] },
      ],
    }),
  ],
})
