# Kyverno 한국어 가이드

[Kyverno 공식 문서](https://kyverno.io/docs/)의 `policy-types` 섹션을 한국어로 옮긴 문서 사이트입니다. Astro Starlight로 만들고 GitHub Pages로 배포합니다.

## 번역 범위

| 문서 | 파일 |
| --- | --- |
| 개요 | `overview.md` |
| ValidatingPolicy | `validating-policy.mdx` |
| MutatingPolicy | `mutating-policy.mdx` |
| GeneratingPolicy | `generating-policy.mdx` |
| DeletingPolicy | `deleting-policy.mdx` |
| ImageValidatingPolicy | `image-validating-policy.mdx` |
| CEL 라이브러리 | `cel-libraries.mdx` |
| 글로벌 컨텍스트 캐싱 | `global-context-caching.md` |

문서는 `src/content/docs/docs/policy-types/`에 있습니다. 아직 번역하지 않은 페이지(`/docs/guides/...` 등)로 가는 링크는 빌드할 때 원문(kyverno.io)으로 연결됩니다([astro.config.mjs](astro.config.mjs)의 `rewriteInternalLinks`). 새 섹션을 번역해 추가하면 그 경로를 이 함수에 등록하세요.

## 번역 원칙

[im-not-ai](https://github.com/epoko77-ai/im-not-ai)의 한국어 윤문 규칙을 따랐습니다. 번역투(`~에 대해`, `~에 의해`, 이중 피동 등)를 줄이고, 코드·명령어·필드 이름·고유명사는 원문 그대로 둡니다. 원문 기준 버전은 Kyverno v1.20입니다.

## 로컬에서 실행

```bash
npm install
npm run dev
```

## 배포

`main` 브랜치에 푸시하면 [GitHub Actions](.github/workflows/deploy.yml)가 빌드해서 GitHub Pages에 올립니다. 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 설정해야 합니다.

## 라이선스

원문은 [kyverno/website](https://github.com/kyverno/website)이며 Apache License 2.0으로 배포됩니다([LICENSE](LICENSE)). 이 저장소의 번역문도 같은 라이선스를 따릅니다.
