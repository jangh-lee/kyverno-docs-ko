# Kyverno 한국어 가이드

> 📖 **[번역 규칙과 용어집](번역규칙.md)** — 번역 전에 먼저 확인하세요. 용어는 쿠버네티스 한글화 가이드를 최우선으로 따릅니다.

[Kyverno 공식 문서](https://kyverno.io/docs/)(`docs` 전체)를 한국어로 옮긴 문서 사이트입니다. Astro Starlight로 만들고 GitHub Pages로 배포합니다.

## 번역 범위

원문 저장소 [kyverno/website](https://github.com/kyverno/website)의 `src/content/docs/docs/` 아래 문서 전체(텍스트 62개)와 그 이미지입니다. 같은 상대 경로에 번역문이 있습니다: `introduction`, `installation`, `policy-types`, `guides`, `reference`, `kyverno-cli`, `subprojects`, `crds`.

문서는 `src/content/docs/docs/`에 있습니다. `/docs/...` 링크는 이 사이트의 번역문으로 연결되고, 블로그나 정책 라이브러리처럼 docs 밖의 링크는 빌드할 때 원문(kyverno.io)으로 연결됩니다([astro.config.mjs](astro.config.mjs)의 `rewriteInternalLinks`). 제목을 번역하면 원문의 영어 앵커(`#container-flags` 등)가 사라지므로, 그런 곳에는 `<a id="..."></a>`를 제목 앞에 넣어 두었습니다.

## 번역 원칙

[번역규칙.md](번역규칙.md)를 따릅니다. 용어는 쿠버네티스 한글화 가이드를, 문장은 [im-not-ai](https://github.com/epoko77-ai/im-not-ai)의 한국어 윤문 규칙을 기준으로 합니다. 번역투(`~에 대해`, `~에 의해`, 이중 피동 등)를 줄이고, 코드·명령어·필드 이름·고유명사는 원문 그대로 둡니다. 원문 기준 버전은 Kyverno v1.20입니다.

## 로컬에서 실행

```bash
npm install
npm run dev
```

## 배포

`main` 브랜치에 푸시하면 [GitHub Actions](.github/workflows/deploy.yml)가 빌드해서 GitHub Pages에 올립니다. 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 설정해야 합니다.

## 라이선스

원문은 [kyverno/website](https://github.com/kyverno/website)이며 Apache License 2.0으로 배포됩니다([LICENSE](LICENSE)). 이 저장소의 번역문도 같은 라이선스를 따릅니다.
