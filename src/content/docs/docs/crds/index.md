---
title: 리소스 정의
sidebar:
  order: 120
excerpt: Kyverno 정책과 보조 타입을 위한 커스텀리소스데피니션(CustomResourceDefinition, CRD)이다.
---

Kyverno는 [정책과 보조 리소스](/docs/policy-types/overview)에 쿠버네티스 커스텀리소스데피니션(CustomResourceDefinition, CRD)을 사용한다.

전체 [Kyverno CRD 레퍼런스](https://htmlpreview.github.io/?https://github.com/kyverno/kyverno/blob/main/docs/user/crd/index.html)는 [API 타입 정의](https://github.com/kyverno/kyverno/tree/main/api)에서 생성된다. 이전 릴리스의 스키마가 필요하면 문서 버전 선택기를 사용한다.

## kubectl explain

클러스터에 설치된 스키마는 `kubectl explain`으로 확인할 수 있다.

```sh
kubectl explain validatingpolicy.spec --api-version=policies.kyverno.io/v1
kubectl explain mutatingpolicy.spec --api-version=policies.kyverno.io/v1
kubectl explain generatingpolicy.spec --api-version=policies.kyverno.io/v1
kubectl explain deletingpolicy.spec --api-version=policies.kyverno.io/v1
kubectl explain imagevalidatingpolicy.spec --api-version=policies.kyverno.io/v1
kubectl explain policyexception.spec --api-version=policies.kyverno.io/v1
kubectl explain globalcontextentry.spec --api-version=kyverno.io/v2
```

개별 필드를 확인하려면 다음과 같이 필드 경로를 덧붙인다.

```sh
kubectl explain validatingpolicy.spec.validationActions --api-version=policies.kyverno.io/v1
```

Kyverno의 구조적 스키마 덕분에 [쿠버네티스 확장](https://code.visualstudio.com/docs/azure/kubernetes#_install-the-kubernetes-extension)을 설치한 [VS Code](https://code.visualstudio.com/) 같은 쿠버네티스 지원 IDE에서도 통합 도움말을 볼 수 있다.
