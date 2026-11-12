---
title: 고가용성
linkTitle: 고가용성
sidebar:
  order: 140
excerpt: Kyverno의 구성 요소와 각 요소가 고가용성에 미치는 영향을 설명합니다.
---

Kyverno는 여러 기능을 별도의 컨트롤러로 분리해 두었고, 각 컨트롤러는 자체 Kubernetes Deployment로 실행됩니다. 따라서 Kyverno를 고가용성으로 설치하려면 사용할 컨트롤러마다 레플리카를 추가해야 합니다.

<a id="controllers-in-kyverno"></a>

## Kyverno의 컨트롤러

Kyverno는 네 개의 Deployment로 구성되며, 각 Deployment는 한 가지 유형의 컨트롤러를 실행합니다. 컨트롤러는 Kyverno의 주요 기능 중 하나와 이를 지원하는 관련 컨트롤러를 맡습니다.

### 어드미션 컨트롤러

- 검증 웹훅과 변경 웹훅을 통해 Kubernetes API 서버에서 AdmissionReview 요청을 받습니다.
- 검증, 변경, 이미지 검증 규칙을 처리합니다.
- 내장된 Cert Renewer로 웹훅에 쓰는 인증서를 Kubernetes 시크릿으로 관리하고 갱신합니다.
- 내장된 Webhook Controller로 설치된 정책에 따라 웹훅 규칙을 동적으로 관리하고 구성합니다.
- `ValidatingPolicy`, `ImageValidatingPolicy`, `MutatingPolicy`, `GeneratingPolicy`, `DeletingPolicy`, `PolicyException` 커스텀 리소스와 네임스페이스 범위 변형의 정책 검증을 수행합니다.
- 정책 예외를 처리합니다.
- 리포트 컨트롤러가 이어서 처리하도록 `EphemeralReport`와 `ClusterEphemeralReport` 중간 리소스를 생성합니다.
- 백그라운드 컨트롤러가 이어서 처리하도록 `UpdateRequest` 중간 리소스를 생성합니다.

### 리포트 컨트롤러

- 최종 `PolicyReport`와 `ClusterPolicyReport` 커스텀 리소스의 생성과 조정을 맡습니다.
- 백그라운드 스캔을 수행하고, `EphemeralReport`와 `ClusterEphemeralReport` 중간 리소스를 생성·처리해 최종 정책 리포트 리소스로 변환합니다.

### 백그라운드 컨트롤러

- `GeneratingPolicy`의 리소스 생성과 `MutatingPolicy`의 기존 리소스 변경을 처리합니다.
- 정책 추가, 업데이트, 삭제 이벤트를 처리합니다.
- 최종 리소스를 생성하거나 변경하기 위한 `UpdateRequest` 중간 리소스를 처리하고 생성합니다.
- 리포트 컨트롤러가 이어서 처리하도록 `EphemeralReport`와 `ClusterEphemeralReport` 중간 리소스를 생성합니다.
- 백그라운드 스캔에서는 리포트 컨트롤러와 관계가 없습니다.

### 정리 컨트롤러

- [DeletingPolicy](/docs/policy-types/deleting-policy)에 예약된 리소스 삭제를 처리합니다.
- 레이블이 지정된 리소스의 [TTL 정리](/docs/guides/ttl-cleanup)를 처리합니다.
- 컨트롤러 권한 범위에서 Kubernetes API로 일치하는 리소스를 삭제합니다.

## Kyverno의 고가용성 동작 방식

이 절에서는 Kyverno가 고가용성 시나리오를 어떻게 처리하는지 설명합니다.

### 어드미션 컨트롤러

어드미션 컨트롤러는 설치 유형이나 규모와 상관없이 모든 Kyverno 설치에 필요한 구성 요소입니다. 예를 들어 정책 리포트 기능만 필요하더라도 어드미션 컨트롤러는 설치해야 합니다.

어드미션 컨트롤러는 들어오는 웹훅 요청에 리더 선출을 사용하지 않습니다. 따라서 AdmissionReview 요청은 사용 가능한 모든 레플리카에 분산되어 처리됩니다. 고가용성 어드미션 컨트롤러 Deployment를 지원하는 최소 레플리카 수는 3개입니다. 인증서와 웹훅 관리 기능에는 리더 선출이 필요하므로, 이 작업은 한 번에 한 레플리카만 처리합니다.

어드미션 컨트롤러에 레플리카를 여러 개 구성하면 가용성과 확장성을 모두 얻을 수 있습니다. 개별 레플리카의 리소스를 수직으로 늘려 전체 처리량을 높일 수도 있습니다.

### 리포트 컨트롤러

리포트 컨트롤러는 모든 리포트 처리 로직을 맡습니다. 상태를 유지하는 서비스이므로 리포트 컨트롤러에는 리더 선출이 필요합니다. 레플리카 수와 관계없이 리포트 처리는 한 번에 한 레플리카만 수행합니다.

리포트 컨트롤러에 레플리카를 여러 개 구성하면 가용성만 높아집니다. 개별 레플리카의 리소스를 수직으로 늘려 처리량을 높일 수도 있지만, 리더가 수행하는 처리에만 영향을 줍니다.

### 백그라운드 컨트롤러

백그라운드 컨트롤러는 생성 규칙과 기존 리소스 변경(mutate-existing) 규칙을 처리합니다. 이 컨트롤러도 상태를 유지하는 서비스이므로 리더 선출이 필요합니다. 어드미션 컨트롤러는 UpdateRequest를 여러 개 동시에 생성할 수 있지만, 레플리카 수와 관계없이 최종 리소스를 생성하거나 기존 리소스를 변경하는 일은 백그라운드 컨트롤러의 한 레플리카만 처리합니다.

백그라운드 컨트롤러에 레플리카를 여러 개 구성하면 가용성만 높아집니다. 레플리카의 리소스를 수직으로 늘리거나 이 프로세스가 사용하는 내부 워커 수(`--genWorkers`)를 늘릴 수 있습니다. 자세한 내용은 [컨테이너 플래그 절](/docs/installation/customization#container-flags)을 참고하세요.

### 정리 컨트롤러

정리 컨트롤러는 Kubernetes API를 대상으로 예약된 삭제와 TTL 정리를 처리합니다. 가용성을 위해 레플리카를 구성하고, 이 컴포넌트의 크기를 정할 때는 삭제 지연 시간과 컨트롤러의 리소스 사용량을 모니터링하세요. 레플리카를 추가한다고 해서 같은 예약 삭제가 두 번 이상 실행된다는 뜻은 아닙니다.

## 고가용성 모드로 Kyverno 설치

프로덕션 수준의 고가용성으로 Kyverno를 설치할 때는 Helm 차트를 권장합니다. Helm 차트가 대부분의 프로덕션 요구를 충족하는 데 필요한 Kubernetes 리소스와 구성 옵션을 모두 제공하기 때문입니다. 고가용성 설치에 관한 자세한 내용은 해당 [설치 절](/docs/installation/installation#고가용성-설치)을 참고하세요.
