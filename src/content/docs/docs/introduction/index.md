---
title: 소개
linkTitle: 소개
sidebar:
  order: 10
excerpt: Kyverno와 그 기능을 알아봅니다
---

## 정책 관리란?

클라우드 네이티브 시스템에서 정책은 다른 구성이나 런타임 동작을 관리하는 구성입니다.

정책의 역할과 구현 방식은 <a href="https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy/CNCF_Kubernetes_Policy_Management_WhitePaper_v1.pdf" target="_blank" rel="noopener">Kubernetes Policy Management</a> 백서를 참고하면 이해하기 좋습니다.

## 정책 관리가 필요한 이유

Kubernetes 같은 클라우드 네이티브 시스템은 선언적 구성을 사용합니다. 이런 시스템은 매우 유연하고 많은 사용 사례를 지원하므로 상세한 구성도 폭넓게 지원합니다. 또한 개발자, 운영, 플랫폼 팀 등 여러 역할이 구성을 함께 작성하고 공유합니다. 그래서 이런 시스템은 유연성이 높은 대신 직접 구성하고 관리하기가 복잡합니다.

정책은 클라우드 네이티브 인프라와 애플리케이션에 알맞은 수준의 추상화와 관심사 분리를 제공합니다.

## Kyverno 소개

Kyverno(그리스어로 "통치하다")는 클라우드 네이티브 정책 엔진입니다. 처음에는 Kubernetes용으로 만들었으며, 지금은 Kubernetes 클러스터 밖에서도 통합 정책 언어로 쓸 수 있습니다.

Kyverno로 플랫폼 엔지니어는 보안, 컴플라이언스, 모범 사례 검증을 자동화하고 애플리케이션 팀에 안전한 셀프 서비스를 제공할 수 있습니다.

주요 기능은 다음과 같습니다.

- YAML과 CEL(Common Expressions Language)로 정책을 작성하므로 새로운 언어를 배울 필요가 없습니다.
- 정책을 선언적 Kubernetes 리소스로 관리합니다.
- Kubernetes 어드미션 컨트롤러, CLI 기반 스캐너, 런타임에서 정책을 강제합니다.
- 모든 Kubernetes 리소스를 검증, 변경, 생성하거나 정리(삭제)합니다.
- 소프트웨어 공급망 보안을 위해 컨테이너 이미지와 메타데이터를 검증합니다.
- Terraform 리소스, 클라우드 리소스, 서비스 인가를 포함한 모든 JSON 페이로드에 정책을 적용합니다.
- [OpenReport](https://openreports.io) 형식으로 정책 리포트를 작성합니다.
- 유연한 정책 예외 관리를 제공합니다.
- 정책의 단위 테스트와 e2e 테스트를 위한 포괄적인 도구를 제공합니다.
- `git`, `kustomize` 같은 익숙한 도구로 정책을 코드 리소스로 관리합니다.
