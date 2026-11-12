---
title: 개요
excerpt: Kyverno 정책 유형과 보조 리소스를 소개합니다.
sidebar:
  order: 1
---

Kyverno는 [CEL(Common Expression Language)](https://kubernetes.io/docs/reference/using-api/cel/)로 리소스를 검증·변경·생성·삭제하고 컨테이너 이미지를 확인합니다. 정책은 Kubernetes 클러스터에 적용할 수 있고, 지원하는 경우에는 Kubernetes 밖의 JSON 페이로드에도 적용할 수 있습니다.

## 정책 유형

아래 정책 유형은 모두 `policies.kyverno.io/v1`을 사용합니다.

| 정책 유형                                                           | 설명                                              |
| ------------------------------------------------------------------- | ------------------------------------------------- |
| [ValidatingPolicy](/docs/policy-types/validating-policy)            | Kubernetes 리소스나 JSON 페이로드를 검증합니다    |
| [MutatingPolicy](/docs/policy-types/mutating-policy)                | 새 리소스나 기존 리소스를 변경합니다              |
| [GeneratingPolicy](/docs/policy-types/generating-policy)            | 유연한 트리거 조건에 따라 리소스를 만들거나 복제합니다 |
| [DeletingPolicy](/docs/policy-types/deleting-policy)                | 일정에 따라 조건에 맞는 리소스를 삭제합니다       |
| [ImageValidatingPolicy](/docs/policy-types/image-validating-policy) | 컨테이너 이미지 서명과 증명(attestation)을 확인합니다 |

정책 유형마다 네임스페이스 범위 버전도 있습니다. `NamespacedValidatingPolicy`, `NamespacedMutatingPolicy`, `NamespacedGeneratingPolicy`, `NamespacedDeletingPolicy`, `NamespacedImageValidatingPolicy`가 그것이며, 정책을 만든 네임스페이스의 리소스에만 적용됩니다.

이전 정책 API를 쓰는 기존 설치 환경은 [CEL 정책으로 마이그레이션](/docs/guides/migration-to-cel)을 참고하세요. 이전 Kyverno 릴리스의 레퍼런스 문서는 버전 선택기에서 볼 수 있습니다.

## 보조 리소스 유형

| 리소스 유형                                                     | 설명                                                         | API 버전                  |
| --------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------- |
| [PolicyException](/docs/guides/exceptions)                      | CEL 매치 조건으로 특정 리소스를 정책에서 제외합니다          | `policies.kyverno.io/v1`  |
| [GlobalContextEntry](/docs/policy-types/global-context-caching) | 정책에서 쓸 Kubernetes 리소스나 외부 API 데이터를 캐시합니다 | `kyverno.io/v2`           |
| UpdateRequest                                                   | 백그라운드 생성·변경 처리에 쓰는 내부 유형입니다             | `kyverno.io/v2`           |
| [PolicyReport / ClusterPolicyReport](/docs/guides/reports)      | 정책 결과를 보고합니다                                       | `wgpolicyk8s.io/v1alpha2` |
| EphemeralReport / ClusterEphemeralReport                        | 내부에서 중간 단계로 쓰는 리포트 유형입니다                  | `reports.kyverno.io/v1`   |

## API 버전

정책과 예외 매니페스트에는 `policies.kyverno.io/v1`을, GlobalContextEntry에는 `kyverno.io/v2`를 사용합니다. Kyverno 버전을 바꾸기 전에 [업그레이드 가이드](/docs/installation/upgrading)를 확인하세요. [`kyverno migrate`](/docs/kyverno-cli/reference/kyverno_migrate) 명령은 저장된 객체를 현재 저장 버전으로 다시 쓰는 명령이며, 정책 유형 사이의 정책 로직을 변환해 주지는 않습니다.
