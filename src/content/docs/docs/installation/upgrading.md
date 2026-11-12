---
title: Kyverno 업그레이드
excerpt: Kyverno를 업그레이드한다.
sidebar:
  order: 55
---

## Kyverno 업그레이드

Kyverno는 설치 때 지원하는 방법과 같은 방법으로 업그레이드할 수 있다. 아래 절에서 Helm과 YAML 매니페스트를 모두 다룬다. Kyverno 새 버전에서는 CRD를 비롯한 지원 리소스가 여럿 바뀌는 경우가 많으므로, 이미지 태그만 올려서는 업그레이드할 수 없다.

Kyverno 1.10에는 호환성이 깨지는 변경이 있어, 1.10 이상 버전으로의 업그레이드는 제한적이다. 업그레이드하기 전에 해당 버전의 [릴리스 노트](https://github.com/kyverno/kyverno/releases)를 반드시 끝까지 읽는다. MINOR 버전을 건너뛰는 경우에는 그 사이의 모든 MINOR 버전 릴리스 노트도 읽어야 한다.

### YAML로 Kyverno 업그레이드

YAML 매니페스트 방식에서는 이전 버전에서 바로 업그레이드하는 것을 지원하지 않는다. 설치에 사용한 태그 릴리스의 해당 릴리스 매니페스트로 제거를 수행한다. Kyverno를 제거한 뒤 [설치 안내](/docs/installation/installation#yaml로-kyverno-설치)에 따라 Kyverno를 설치한다.

### Helm으로 Kyverno 업그레이드

Kyverno 1.10 이전 버전에서 1.10 이상 버전으로 Helm으로 업그레이드하려면 수동 작업이 필요하며, 바로 업그레이드할 수 없다. 자세한 내용은 Helm 차트 v2에서 v3로의 [마이그레이션 가이드](https://github.com/kyverno/kyverno/blob/release-1.13/charts/kyverno/README.md#migrating-from-v2-to-v3)를 참고한다.

## Kyverno v1.19로 업그레이드

### 정책 API

`policies.kyverno.io/v1`에서 지원하는 [CEL 기반 정책 유형](/docs/policy-types/overview)과 [PolicyException](/docs/guides/exceptions)을 사용한다. 기존 정책 API를 더 이상 제공하지 않는 릴리스로 업그레이드하기 전에 [정책 마이그레이션](/docs/guides/migration-to-cel)을 끝내야 한다. 버전별 마이그레이션 안내는 버전 선택기를 사용한다.

GlobalContextEntry, UpdateRequest, PolicyReport, ClusterPolicyReport 같은 지원 리소스는 계속 지원한다. GlobalContextEntry와 UpdateRequest에는 `kyverno.io/v2`를 사용한다.

### 스토리지 버전

v1.19에서 `policies.kyverno.io` 정책 유형의 스토리지 버전은 계속 `v1beta1`이다. v1.20에서 `v1`로 바뀐다. 업그레이드한 뒤에는 [`kyverno migrate`](/docs/kyverno-cli/reference/kyverno_migrate) CLI 명령으로 저장된 기존 오브젝트를 현재 스토리지 버전으로 다시 쓸 수 있다. 예를 들면 다음과 같다.

```sh
kyverno migrate --resource validatingpolicies.policies.kyverno.io
```

### Helm 차트 변경 사항

v1.19부터 Kyverno CRD는 전용 `kyverno-api` 차트 의존성으로 관리되며, 기존 `crds.install` 값으로 제어한다. CRD를 따로 설치하거나 `crds.install: false`로 설정했다면 업그레이드하기 전에 CRD 관리 워크플로를 검토한다.

### CLI 변경 사항

실험적 기능이던 `kyverno json scan` 명령은 v1.19에서 Kyverno CLI에서 제거되었다. JSON 페이로드(payload)를 검증하려면 [`kyverno apply`](/docs/kyverno-cli/reference/kyverno_apply) 명령과 [ValidatingPolicy](/docs/policy-types/validating-policy)를 사용하거나 [kyverno-json](https://kyverno.github.io/kyverno-json/) 하위 프로젝트를 직접 사용한다.

이전 릴리스에서 업그레이드한다면 해당 문서 버전을 선택해 릴리스별 업그레이드 안내를 따른다.

## Kyverno v1.20으로 업그레이드

Kyverno v1.20은 사용 중단(deprecated)된 `ClusterPolicy`, `Policy`, `CleanupPolicy`, `ClusterCleanupPolicy`, 레거시 `kyverno.io` `PolicyException` 유형을 실행하지 않는다. 이 유형의 API는 기존 리소스를 읽고, 나열하고, 내보내고, 삭제하는 용도로는 계속 제공되지만 해당 리소스는 강제되지 않는다. 업그레이드하기 전에 정책을 지원되는 `policies.kyverno.io` 유형으로 마이그레이션한다. [CEL 정책 마이그레이션 가이드](/docs/guides/migration-to-cel)를 참고한다.

### Helm으로 업그레이드

사용 중단된 정책 리소스가 없으면 평소처럼 업그레이드한다. 하나라도 있으면 Kyverno Helm 차트가 업그레이드를 차단하고 발견한 종류와 리소스를 보고한다. 해당 정책이 조용히 강제되지 않게 되는 업그레이드를 막기 위해서이다.

레거시 정책이 더 이상 강제되지 않는다는 점을 검토하고 받아들였다면, 이 동작을 확인했음을 표시하고 진행할 수 있다.

```sh
helm upgrade kyverno kyverno/kyverno -n kyverno \
  --set upgrade.acknowledgeLegacyPoliciesNotEnforced=true
```

이 확인 표시는 레거시 리소스를 마이그레이션하거나 삭제하지 않으며, 계속 강제되게 하지도 않는다. 레거시 리소스는 조회, 내보내기, 삭제 용도로 남아 있다. 리소스가 보존되므로 레거시 유형을 계속 지원하는 릴리스로 다운그레이드할 수 있다.

### YAML 매니페스트로 설치 또는 업그레이드

사용 중단된 정책 리소스가 있는 클러스터에 v1.20 YAML 설치 매니페스트를 적용해도 설치가 차단되지 않으며 리소스도 삭제되지 않는다. 레거시 `ClusterPolicy`와 `Policy` 리소스는 `NotReady`로 표시되고, 설치 중과 사용 중단된 정책을 가져올 때 경고도 출력된다. Kyverno는 v1.20에서 사용 중단된 정책 유형을 실행하지 않는다. 리소스를 보존하므로 레거시 유형을 지원하는 릴리스로 다운그레이드할 수 있다.

이 동작은 위에서 설명한 YAML 업그레이드의 일반 지침을 바꾸지 않는다. YAML을 사용해 이전 버전에서 바로 업그레이드하는 것은 지원하지 않는다. 제거 후 재설치 워크플로를 쓰고 다운그레이드할 가능성이 있다면 먼저 레거시 정책 리소스를 내보내거나 백업한다. 정책 CRD를 삭제하면 저장된 리소스도 함께 삭제된다.
