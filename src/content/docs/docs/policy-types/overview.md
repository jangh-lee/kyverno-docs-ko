---
title: 개요
excerpt: Kyverno 정책 유형과 보조 리소스를 소개한다.
sidebar:
  order: 1
---

Kyverno는 [CEL(Common Expression Language)](https://kubernetes.io/docs/reference/using-api/cel/)로 리소스를 검증·변경·생성·삭제하고 컨테이너 이미지를 확인한다. 정책은 쿠버네티스 클러스터에 적용할 수 있고, 지원하는 경우에는 쿠버네티스 밖의 JSON 페이로드에도 적용할 수 있다.

## 정책 유형

아래 정책 유형은 모두 `policies.kyverno.io/v1`을 사용한다.

| 정책 유형                                                           | 설명                                              |
| ------------------------------------------------------------------- | ------------------------------------------------- |
| [ValidatingPolicy](/docs/policy-types/validating-policy)            | 쿠버네티스 리소스나 JSON 페이로드를 검증한다      |
| [MutatingPolicy](/docs/policy-types/mutating-policy)                | 새 리소스나 기존 리소스를 변경한다                |
| [GeneratingPolicy](/docs/policy-types/generating-policy)            | 유연한 트리거 조건에 따라 리소스를 만들거나 복제한다 |
| [DeletingPolicy](/docs/policy-types/deleting-policy)                | 일정에 따라 조건에 맞는 리소스를 삭제한다         |
| [ImageValidatingPolicy](/docs/policy-types/image-validating-policy) | 컨테이너 이미지 서명과 증명(attestation)을 확인한다 |

정책 유형마다 네임스페이스 범위 버전도 있다. `NamespacedValidatingPolicy`, `NamespacedMutatingPolicy`, `NamespacedGeneratingPolicy`, `NamespacedDeletingPolicy`, `NamespacedImageValidatingPolicy`가 그것이며, 정책을 만든 네임스페이스의 리소스에만 적용된다.

이전 정책 API를 쓰는 기존 설치 환경은 [CEL 정책으로 마이그레이션](/docs/guides/migration-to-cel)을 참고한다. 이전 Kyverno 릴리스의 레퍼런스 문서는 버전 선택기에서 볼 수 있다.

## 보조 리소스 유형

| 리소스 유형                                                     | 설명                                                         | API 버전                  |
| --------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------- |
| [PolicyException](/docs/guides/exceptions)                      | CEL 매치 조건으로 특정 리소스를 정책에서 제외한다            | `policies.kyverno.io/v1`  |
| [GlobalContextEntry](/docs/policy-types/global-context-caching) | 정책에서 쓸 쿠버네티스 리소스나 외부 API 데이터를 캐시한다   | `kyverno.io/v2`           |
| UpdateRequest                                                   | 백그라운드 생성·변경 처리에 쓰는 내부 유형                   | `kyverno.io/v2`           |
| [PolicyReport / ClusterPolicyReport](/docs/guides/reports)      | 정책 결과를 보고한다                                         | `wgpolicyk8s.io/v1alpha2` |
| EphemeralReport / ClusterEphemeralReport                        | 내부에서 중간 단계로 쓰는 리포트 유형                        | `reports.kyverno.io/v1`   |

## API 버전

정책과 예외 매니페스트에는 `policies.kyverno.io/v1`을, GlobalContextEntry에는 `kyverno.io/v2`를 사용한다. Kyverno 버전을 바꾸기 전에 [업그레이드 가이드](/docs/installation/upgrading)를 확인한다. [`kyverno migrate`](/docs/kyverno-cli/reference/kyverno_migrate) 명령은 저장된 오브젝트를 현재 저장 버전으로 다시 쓰는 명령이며, 정책 유형 사이의 정책 로직을 변환해 주지는 않는다.
