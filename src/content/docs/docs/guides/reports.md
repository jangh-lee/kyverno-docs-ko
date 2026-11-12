---
title: 정책 리포트
excerpt: 리포트로 Kyverno 정책 결과를 확인하고 감사한다.
sidebar:
  order: 1
---

정책 리포트는 Kyverno가 생성하고 관리하는 쿠버네티스 사용자 정의 리소스이다. [정책](/docs/policy-types/overview)을 리소스에 적용한 결과를 기록한다. 리포트는 클러스터에 있는 리소스의 현재 상태를 나타낼 뿐 과거 이력을 남기는 감사 로그가 아니다. 리소스를 삭제하면 해당 리포트도 함께 삭제된다.

`PolicyReport`는 네임스페이스 범위 리소스를 설명하며 그 리소스의 네임스페이스에 만들어진다. `ClusterPolicyReport`는 클러스터 범위 리소스를 설명한다. 두 리포트 유형은 정책 API와 별개로 `wgpolicyk8s.io/v1alpha2` API를 사용한다.

## 어드미션 결과와 백그라운드 결과

`validationActions: [Audit]`인 [ValidatingPolicy](/docs/policy-types/validating-policy)는 규칙을 위반한 리소스의 생성을 허용하고 그 실패를 리포트에 기록한다. `validationActions: [Deny]`이면 규칙을 위반한 어드미션 요청을 차단한다. 리포트는 클러스터에 존재하는 리소스만 다룬다. 차단된 요청을 조사하려면 [메트릭](/docs/guides/monitoring)과 쿠버네티스 이벤트(Event)를 사용한다.

정책을 `Deny`로 전환하기 전에 감사 결과로 정책의 영향을 평가할 수 있다. 리포트는 별도의 리소스이므로 쿠버네티스 RBAC로 정책을 수정할 권한 없이 리포트 접근 권한만 사용자에게 부여할 수 있다.

리포트에는 어드미션 처리 결과와 백그라운드 스캔 결과가 들어갈 수 있다. 활성화한 리포트 기능에 따라 변경, 생성, 이미지 검증, [정책 예외](/docs/guides/exceptions)의 결과도 포함될 수 있다.

## 리포트 결과 판정

| 결과    | 설명                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| `pass`  | 정책이 리소스를 정상적으로 평가함                                                              |
| `skip`  | 평가를 건너뜀. 예를 들어 일치하는 PolicyException이 있을 때                                   |
| `fail`  | 리소스가 정책을 충족하지 못함                                                                         |
| `warn`  | 규칙 위반 결과를 경고로 보고. 예를 들어 `policies.kyverno.io/scored`가 `"false"`일 때           |
| `error` | 평가 오류 때문에 정책이 정상적인 결과를 내지 못함                                                     |

정책의 적용 여부는 CEL `matchConditions`가 결정한다. 정책과 일치하지 않는 리소스는 정책 위반이 아니다. 예외가 리포트 동작을 바꾸기도 한다. 자세한 내용은 [정책 예외](/docs/guides/exceptions#interpreting-policyreport-results)를 참고한다.

## 리포트 요약 보기

여러 네임스페이스의 리포트를 확인한다.

```sh
kubectl get policyreport -A
kubectl get clusterpolicyreport
```

`-o wide`를 사용하면 리포트에 연결된 리소스를 확인할 수 있다.

```sh
kubectl get policyreport -n default -o wide
```

리포트를 자세히 살펴본다.

```sh
kubectl describe policyreport <report-name> -n default
kubectl get policyreport <report-name> -n default -o yaml
```

각 리포트에는 리소스를 식별하는 `scope`, 평가된 정책을 식별하는 `results` 배열, 결과 개수를 집계한 `summary`가 들어 있다. 그래픽 화면으로 보려면 [Policy Reporter](/docs/subprojects/policy-reporter)를 참고한다.

## 정책 위반 보기

예를 들어 `jq`로 네임스페이스 안 리소스의 실패 결과를 나열할 수 있다.

```sh
kubectl get policyreport -n default -o json \
  | jq '.items[] | {scope, failures: [.results[]? | select(.result == "fail")]}'
```

## 백그라운드 스캔

리포트 컨트롤러는 정책을 설치하기 전에 만들어진 리소스를 포함해 기존 리소스를 평가할 수 있다. 정책이 `validationActions: [Deny]`를 사용하더라도 백그라운드 스캔은 기존 리소스를 차단하거나 삭제하지 않는다.

백그라운드 평가를 지원하는 정책에서는 `spec.evaluation.background.enabled`로 이를 제어한다.

```yaml
spec:
  evaluation:
    admission:
      enabled: true
    background:
      enabled: true
```

백그라운드 스캔은 주기적으로 실행되며 실행 간격은 [리포트 컨트롤러 플래그](/docs/installation/customization#container-flags)로 설정한다. 스캔은 리포트 컨트롤러가 처리하며, 리소스 생성과 변경을 맡는 백그라운드 컨트롤러는 처리하지 않는다.

요청한 사용자의 신원처럼 어드미션에서만 얻을 수 있는 정보에 의존하는 정책은 백그라운드 평가를 비활성화해야 한다.

```yaml
spec:
  evaluation:
    background:
      enabled: false
```

백그라운드 스캔에는 원래 AdmissionReview 요청의 사용자 정보가 없다. 어드미션 평가와 백그라운드 평가 양쪽에 적용해야 하는 정책은 리소스 데이터를 기준으로 작성한다.

## 예시: PolicyReport 만들기

파드에 `team` 레이블을 요구하는 정책을 적용한다. 이 예시는 `Audit`를 사용하므로 규칙을 위반한 파드도 생성되고 리포트에 기록된다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: require-team-label
spec:
  validationActions: [Audit]
  evaluation:
    background:
      enabled: true
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  validations:
    - expression: has(object.metadata.labels) && has(object.metadata.labels.team)
      message: 'Pods must have a team label.'
```

정책 평가 대상에 포함된 네임스페이스에 필수 레이블이 없는 파드를 만든다.

```sh
kubectl run report-example --image=nginx -n default
kubectl get policyreport -n default -o wide
```

리포트가 작성되면 `report-example`의 리포트를 확인한다. 결과에 `require-team-label`이 `result: fail`과 검증 메시지와 함께 나타난다. 레이블을 추가한 뒤 리포트를 다시 확인한다.

```sh
kubectl label pod report-example team=platform -n default
```

다시 평가되면 정책 결과가 `pass`로 바뀐다. 끝나면 예시 리소스를 삭제한다.

```sh
kubectl delete pod report-example -n default
kubectl delete validatingpolicy require-team-label
```

## 리포트 내부 동작

Kyverno는 `reports.kyverno.io/v1` API 그룹의 `EphemeralReport`와 `ClusterEphemeralReport` 리소스를 중간 결과로 사용한다. 리포트 컨트롤러가 이를 취합해 최종 `PolicyReport` 또는 `ClusterPolicyReport`를 만든다. 중간 리소스는 자동으로 관리되므로 보통 직접 다룰 필요가 없다.

구현 세부 사항은 [개발자용 리포트 문서](https://github.com/kyverno/kyverno/tree/main/docs/dev/reports)를 참고한다.

## 리포트 설정

리포트 옵션은 [컨테이너 플래그](/docs/installation/customization#container-flags)에 설명되어 있다.

- `--enableReporting`은 `validate`, `mutate`, `mutateExisting`, `generate`, `imageVerify` 같은 리포트 기능을 선택한다.
- `--allowedResults`는 저장할 결과를 선택한다. 기본값은 `pass,fail,error,warn,skip`이며, 결과를 제한하면 etcd 사용량을 줄일 수 있다.
- 리포트 컨트롤러에는 평가할 리소스의 `get`, `list`, `watch` 권한이 필요하다.

개별 정책의 리포트를 비활성화하려면 값에 상관없이 `reports.kyverno.io/disabled` 레이블을 추가한다.

```yaml
metadata:
  labels:
    reports.kyverno.io/disabled: 'true'
```

:::caution[주의]
백그라운드 리포트는 어드미션 웹훅의 [네임스페이스 셀렉터](/docs/installation/customization#namespace-selectors)를 사용하지 않는다. 정책 매칭과 리포트 제외 설정은 따로 구성한다.
:::

## OpenReports

Kyverno는 `wgpolicyk8s` 리포트의 대안으로 `openreports.io/v1alpha1` API도 지원한다. 리포트 컨트롤러에서 `--openreportsEnabled` 플래그를 활성화하거나 Helm 값 `openreports.enabled=true`를 설정한다.

OpenReports를 활성화해도 위의 CEL 정책 예시를 그대로 사용할 수 있다. 생성된 리포트는 다음 명령으로 확인한다.

```sh
kubectl get reports.openreports.io -A
```

OpenReports 통합은 Kyverno 1.15에서 알파 기능으로 도입되었다.

## ValidatingAdmissionPolicy 리포트

Kyverno는 쿠버네티스 `ValidatingAdmissionPolicy` 리소스와 바인딩의 결과도 리포트할 수 있다. 리포트 컨트롤러에서 `--validatingAdmissionPolicyReports=true`를 활성화한다. 이 플래그는 기본적으로 비활성화되어 있다.

예를 들어 디플로이먼트(Deployment)의 레플리카 수를 검사하는 정책과 바인딩을 적용한다.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: check-deployment-replicas
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['apps']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['deployments']
  validations:
    - expression: object.spec.replicas <= 5
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: check-deployment-replicas
spec:
  policyName: check-deployment-replicas
  validationActions: [Audit]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: staging
```


일치하는 리소스를 만들고 해당 리포트를 확인한다.

```sh
kubectl create namespace staging
kubectl label namespace staging environment=staging
kubectl create deployment deployment-example --image=nginx --replicas=7 -n staging
kubectl get policyreport -n staging -o yaml
```

백그라운드 스캔이 끝나면 리포트에 `check-deployment-replicas` 실패 결과가 기록된다. 해당 디플로이먼트의 레플리카가 5개를 넘기 때문이다.
