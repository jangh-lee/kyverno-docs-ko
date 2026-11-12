---
title: 커뮤니티 및 도입 사례
linkTitle: 커뮤니티 및 도입 사례
sidebar:
  order: 40
excerpt: Kyverno의 프로덕션 도입 기업, 사례 연구, 커뮤니티 피드백 채널
---

이 페이지는 Kyverno의 프로덕션 도입, 사용자 피드백, 생태계 평가에 관해 공개된 자료를 한데 모았습니다. 링크로 확인할 수 있는 사용자 조사 및 도입 데이터를 요구하는 CNCF TOC의 요건을 충족하기 위해 관리합니다(참고: [issue #15473](https://github.com/kyverno/kyverno/issues/15473)).

## 프로덕션 도입 기업

금융, 통신, 정부, 클라우드 제공업체, 전자상거래 등 여러 분야의 조직이 Kyverno를 프로덕션에서 사용합니다. 사용 사례를 공개한 조직의 전체 목록은 프로젝트 저장소의 [ADOPTERS.md](https://github.com/kyverno/kyverno/blob/main/ADOPTERS.md)에서 관리합니다.

주요 도입 기업은 다음과 같습니다.

- **Spotify** — 모범 사례와 환경별 데이터를 포함한 어드미션 컨트롤러 기능에 Kyverno를 폭넓게 사용합니다. Spotify는 이 작업을 일부 인정받아 [CNCF Top End User Award 2023](https://www.cncf.io/announcements/2023/11/08/cloud-native-computing-foundation-presents-the-top-end-user-award-to-spotify/)을 받았습니다.
- **US DoD Platform One** — 미국 국방부 Platform One은 Kyverno를 Kubernetes의 기본 정책 엔진으로 사용합니다.
- **Deutsche Telekom** — 관리형 클러스터에 Kyverno로 정책을 강제해 권한 상승을 막고 보안 규칙을 적용합니다.
- **Bloomberg** — 내부 Kubernetes 기반 플랫폼에서 Kyverno로 사용자 정의 검증 및 변경 웹훅을 대체합니다.
- **Vodafone** — 내부 Kubernetes 서비스에서 정책 강제와 자동화를 수행합니다.
- **LinkedIn** — 온프레미스 Kubernetes 클러스터에서 정책을 강제합니다.

## 도입 사례 연구 및 블로그 글

다음 Kyverno 블로그 글에서 실제 사용 패턴과 도입 기업의 경험을 볼 수 있습니다.

- **[Policy-as-Code on Alibaba Cloud ACK](https://kyverno.io/blog/2026/02/13/policy-as-code-on-alibaba-cloud-container-service-for-kubernetes-flexible-kubernetes-governance-with-kyverno/)** (2026) — Alibaba Cloud Container Service for Kubernetes에서 Kyverno로 유연하게 Kubernetes를 거버넌스하는 방법을 다룹니다. Alibaba Cloud와 Nirmata의 엔지니어가 공동으로 작성했습니다.
- **[Automating EKS CIS Compliance with Kyverno and KubeBench](https://kyverno.io/blog/2025/06/11/automating-eks-cis-compliance-with-kyverno-and-kubebench/)** (2025) — Amazon EKS의 CIS 컴플라이언스를 대규모로 자동화하는 실용적인 접근법을 설명합니다.
- **[PodSecurityPolicy Migration with Kyverno](https://kyverno.io/blog/2023/05/24/podsecuritypolicy-migration-with-kyverno/)** (2023) — Kubernetes v1.25 이후로 업그레이드하는 여러 조직이 널리 참고한 마이그레이션 가이드입니다.
- **[Simplifying OpenShift MachineSet Management Using Kyverno](https://kyverno.io/blog/2023/07/28/simplifying-openshift-machineset-management-using-kyverno/)** (2023) — Red Hat 엔지니어가 OpenShift에서 변경(mutate) 사용 사례를 시연합니다.

## CNCF 연례 설문 데이터

Kyverno는 CNCF 연례 설문에서 정책 관리/보안 도구 범주에 포함됩니다. 다음 설문 보고서가 공개돼 있습니다.

- [CNCF Annual Survey 2022](https://www.cncf.io/reports/cncf-annual-survey-2022/)
- [CNCF Annual Survey 2023](https://www.cncf.io/reports/cncf-annual-survey-2023/)
- [CNCF Annual Survey 2024](https://www.cncf.io/reports/cncf-annual-survey-2024/)

## 커뮤니티 피드백 채널

사용자 피드백은 다음 공개 채널로 수집합니다.

- **[GitHub Issues](https://github.com/kyverno/kyverno/issues)** — 기능 요청, 버그 리포트, 사용 관련 질문
- **[Slack (#kyverno)](https://slack.k8s.io/)** — Kubernetes Slack 워크스페이스의 실시간 커뮤니티 토론
- **[Kyverno Community Meetings](https://kyverno.io/community/)** — 누구나 참여할 수 있는 격주 회의로, 도입 기업이 사용 사례를 공유하고 기능을 요청하기도 합니다.
- **[CNCF End User Survey](https://www.cncf.io/enduser/)** — Kyverno는 최종 사용자 대상 CNCF 연례 설문에 포함됩니다.

공식 UX 연구와 체계적인 도입 기업 인터뷰는 아직 진행하지 않았습니다. 이는 인지하고 있는 공백이며 [issue #15473](https://github.com/kyverno/kyverno/issues/15473)에서 추적합니다.
