---
title: TTL 정리
excerpt: 수명(TTL)이 만료되면 개별 리소스를 삭제합니다.
sidebar:
  order: 80
---

정책을 만들지 않고 개별 리소스를 삭제 대상으로 표시하려면 `cleanup.kyverno.io/ttl` 레이블을 사용합니다. 일치 조건에 따라 일정대로 삭제하려면 [DeletingPolicy](/docs/policy-types/deleting-policy)를 사용하세요.

<a id="cleanup-label"></a>

## 정리 레이블

TTL 레이블에는 다음 값 중 하나를 지정할 수 있습니다.

- ISO 8601 형식의 절대 시각. 예: `2023-10-04T003000Z`, `2023-10-04`
- 레이블이 관찰된 시점부터 계산한 남은 시간. 예: `5m`, `4h`, `1d`

인식할 수 없는 형식은 경고를 발생시킵니다. 정리 컨트롤러에는 레이블이 지정된 리소스를 감시(watch)하고 삭제할 권한이 있어야 합니다. [권한 사용자 지정](/docs/installation/customization#customizing-permissions)을 참고하세요.

다음 Pod는 2분 뒤에 삭제됩니다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: temporary-job
  labels:
    cleanup.kyverno.io/ttl: 2m
spec:
  containers:
    - name: worker
      image: busybox:1.35
      args: ['sleep', '1d']
```

정리 컨트롤러는 `ttlReconciliationInterval`로 설정한 간격마다 레이블이 지정된 리소스를 확인합니다. 기본값은 `1m`입니다. [컨테이너 플래그](/docs/installation/customization#container-flags)를 참고하세요.

[MutatingPolicy](/docs/policy-types/mutating-policy)로 이 레이블을 지정하거나, [ValidatingPolicy](/docs/policy-types/validating-policy)로 이 레이블을 설정할 수 있는 주체를 제한할 수 있습니다.

## 삭제 전파

`cleanup.kyverno.io/propagation-policy` 어노테이션을 설정하면 종속 리소스의 처리 방식을 제어합니다.

```yaml
metadata:
  labels:
    cleanup.kyverno.io/ttl: 2m
  annotations:
    cleanup.kyverno.io/propagation-policy: Foreground
```

지원하는 값은 `Foreground`(종속 리소스를 먼저 삭제), `Background`(종속 리소스를 비동기로 삭제), `Orphan`(종속 리소스를 유지)입니다. 생략하면 Kubernetes의 기본 삭제 동작이 적용됩니다.
