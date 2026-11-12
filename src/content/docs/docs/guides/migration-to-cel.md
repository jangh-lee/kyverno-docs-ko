---
title: CEL 정책으로 마이그레이션
weight: 10
excerpt: '`ClusterPolicy`에서 CEL 기반 정책 유형으로 마이그레이션하는 전체 가이드'
---

이 가이드는 `ClusterPolicy`에서 새로운 CEL 기반 [정책 유형](/docs/policy-types/overview/)으로 마이그레이션하는 방법을 설명한다.

:::caution[지원 중단 안내]
`ClusterPolicy`, `Policy`, `CleanupPolicy`, 그리고 레거시 `kyverno.io` PolicyException은 Kyverno v1.19부터 지원 중단(deprecated)되었으며 **v1.20에서 제거된다**. CEL 기반 정책 유형은 v1.19부터 기능이 완전히 동등하다. 지금 마이그레이션을 계획하자. [지원 중단 일정](https://release-1-18-0.kyverno.io/docs/policy-types/overview#deprecation-schedule-for-legacy-types)을 참고한다.
:::

:::note[팁]
ClusterPolicy 스키마는 `kubectl explain cpol.spec`으로 확인한다.

- ValidatingPolicy 스키마: `kubectl explain vpol.spec`
- MutatingPolicy 스키마: `kubectl explain mpol.spec`
- GeneratingPolicy 스키마: `kubectl explain gpol.spec`
- DeletingPolicy 스키마: `kubectl explain dpol.spec`
- ImageValidatingPolicy 스키마: `kubectl explain ivpol.spec`
  :::

## 주요 차이점

**ClusterPolicy 구조**

ClusterPolicy는 [순서가 있는 규칙 목록](https://release-1-18-0.kyverno.io/docs/policy-types/cluster-policy/overview/)과 [공통 설정](https://release-1-18-0.kyverno.io/docs/policy-types/cluster-policy/policy-settings/)을 담는다.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-labels
      match:
        any:
          - resources:
              kinds:
                - Pod
      validate:
        message: 'Required labels missing'
        pattern:
          metadata:
            labels:
              app: '?*'
              version: '?*'
```

**CEL 기반 정책 구조**

Kyverno의 CEL 기반 정책은 정책마다 검증, 변경, 생성, 정리 중 하나의 동작만 맡는 별도 유형으로 정의된다. CEL 기반 정책 하나에는 <span class="hl-link" tabindex="0" data-code="require-app-version-labels.yaml" data-lines="19-24">같은 유형의 동작을 순서대로 나열할 수 있다(예: `spec.validations`)</span>.

```yaml title="require-app-version-labels.yaml"
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: require-app-version-labels
spec:
  matchConstraints:
    resourceRules:
      - apiGroups:
          - ''
        apiVersions:
          - v1
        operations:
          - CREATE
          - UPDATE
        resources:
          - pods
  validationActions:
    - Deny
  validations:
    - expression: >
        ['app', 'version'].all(label, 
          object.metadata.?labels[label].orValue('') != ''
        )
      message: 'Required labels missing'
```

## 정책 설정

ClusterPolicy의 각 필드와 이에 대응하는 CEL 기반 필드는 다음과 같다.

**공통 필드**

| **ClusterPolicy**                             | **CEL 기반 정책**                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| **spec.admission**                            | `spec.evaluation.admission.enabled`                                      |
| **applyRules**                                | 해당 없음. 각 규칙을 정책으로 변환하고 `matchConditions`를 사용한다.   |
| **spec.background**                           | `spec.evaluation.background.enabled`                                     |
| **spec.emitWarning**                          | `spec.validationActions: Warn`                                           |
| **spec.useServerSideApply**                   | 참고: [#14853](https://github.com/kyverno/kyverno/issues/14853)          |
| **spec.webhookConfiguration.failurePolicy**   | `spec.failurePolicy`                                                     |
| **spec.webhookConfiguration.matchConditions** | `spec.matchConditions`                                                   |
| **spec.webhookConfiguration.timeoutSeconds**  | `spec.webhookConfiguration.timeoutSeconds`                               |

**규칙 필드**

| **ClusterPolicy**                     | **CEL 기반 정책**                                              |
| ------------------------------------- | -------------------------------------------------------------- |
| **spec.rules.match**                  | `spec.matchExpressions` 및 `spec.matchConditions`              |
| **spec.rules.exclude**                | `spec.matchConstraints.excludeResourceRules`                   |
| **spec.rules.context**                | `spec.variables`                                               |
| **spec.rules.preconditions**          | `spec.matchConditions`                                         |
| **spec.rules.celPreconditions**       | `spec.matchConditions`                                         |
| **spec.rules.skipBackgroundRequests** | 참고: [#14852](https://github.com/kyverno/kyverno/issues/14852) |
| **spec.rules.reportProperties**       | `spec.auditAnnotations`                                        |
| **spec.rules.validate**               | `ValidatingPolicy`                                             |
| **spec.rules.mutate**                 | `MutatingPolicy`                                               |
| **spec.rules.generate**               | `GeneratingPolicy`                                             |
| **spec.rules.imageExtactors**         | `variables.expressions`                                        |
| **spec.rules.verifyImages**           | `ImageValidatingPolicy`                                        |

## 검증 규칙

| **ClusterPolicy**                               | **CEL 기반 정책**                                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| **spec.rules.validate.allowExistingViolations** | 지원하지 않음. 정책 예외를 사용한다                                               |
| **spec.rules.validate.anyPattern**              | `spec.validations`                                                                  |
| **spec.rules.validate.cel**                     | `spec.validations`                                                                  |
| **spec.rules.validate.deny**                    | `spec.validations`. 논리를 반전한다                                               |
| **spec.rules.validate.failureAction**           | `spec.validationActions`                                                            |
| **spec.rules.validate.failureActionOverrides**  | 지원하지 않음. 정책 예외를 사용한다                                               |
| **spec.rules.validate.foreach**                 | `all()`, `exists()`, `exists_one()` 같은 CEL 컴프리헨션을 쓰는 `spec.validations`   |
| **spec.rules.validate.manifests**               | 지원하지 않음                                                                       |
| **spec.rules.validate.message**                 | `spec.validations.message` 또는 `spec.validations.messageExpression`                |
| **spec.rules.validate.pattern**                 | `spec.validations`                                                                  |
| **spec.rules.validate.podSecurity**             | 지원하지 않음. 파드 보안 통제마다 `spec.validations`를 사용한다                   |

**ClusterPolicy validate pattern:**

```yaml
validate:
  pattern:
    spec:
      containers:
        - name: '*'
          image: '!*:latest'
```

**ValidatingPolicy:**

```yaml
validations:
  - expression: >
      ['app', 'version'].all(label, 
        object.metadata.?labels[label].orValue('') != ''
      )
    message: "Pod must have an 'app' and 'version' labels"
```

**ClusterPolicy validate deny**

```yaml
validate:
  deny:
    conditions:
      all:
        - key: '{{ request.object.spec.replicas }}'
          operator: GreaterThan
          value: 10
  message: 'Replica count cannot exceed 10'
```

**ValidatingPolicy:**

<span class="hl-link" tabindex="0" data-code="deny-to-cel.yaml" data-lines="4">`deny` 규칙을 CEL 표현식으로 바꿀 때는 논리가 반전된다.</span>

```yaml title="deny-to-cel.yaml"
validate:
  cel:
    expressions:
      - expression: 'object.spec.replicas <= 10'
        message: 'Replica count cannot exceed 10'
```

자세한 설명과 추가 예시는 [ValidatingPolicy 문서](/docs/policy-types/validating-policy/)를 참고한다.

## 변경 규칙

| **ClusterPolicy**                         | **CEL 기반 정책**                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| **spec.rules.mutate.foreach**             | `all()`, `exists()`, `exists_one()` 같은 CEL 컴프리헨션                             |
| **spec.rules.mutate.mutateExisting**      | `spec.evaluation.mutateExisting.enabled`                                            |
| **spec.rules.mutate.patchStrategicMerge** | 지원하지 않음. `patchType: ApplyConfiguration` 또는 `patchType: JSONPatch`로 변환   |
| **spec.rules.mutate.patchesJson6902**     | `patchType: JSONPatch`                                                              |
| **spec.rules.mutate.targets**             | `spec.matchConstraints` 또는 `spec.targetMatchConstraints`                          |

자세한 설명과 예시는 [MutatingPolicy 문서](/docs/policy-types/mutating-policy/)를 참고한다.

## 생성 규칙

| **ClusterPolicy**                                      | **CEL 기반 정책**                                |
| ------------------------------------------------------ | ------------------------------------------------ |
| **spec.rules.generate.apiVersion**                     | CEL 표현식                                       |
| **spec.rules.generate.clone**                          | CEL 표현식                                       |
| **spec.rules.generate.cloneList**                      | CEL 표현식                                       |
| **spec.rules.generate.data**                           | CEL 표현식                                       |
| **spec.rules.generate.foreach**                        | CEL 표현식                                       |
| **spec.rules.generate.generateExisting**               | `spec.evaluation.generateExisting`               |
| **spec.rules.generate.kind**                           | CEL 표현식                                       |
| **spec.rules.generate.name**                           | CEL 표현식                                       |
| **spec.rules.generate.namespace**                      | CEL 표현식                                       |
| **spec.rules.generate.orphanDownstreamOnPolicyDelete** | `spec.evaluation.orphanDownstreamOnPolicyDelete` |
| **spec.rules.generate.synchronize**                    | `spec.evaluation.synchronize`                    |

생성할 리소스의 속성처럼 GeneratingPolicy의 여러 필드는 이제 CEL 표현식으로 직접 처리한다. 자세한 내용은 [GeneratingPolicy 문서](/docs/policy-types/generating-policy/)를 참고한다.

## 이미지 검증 규칙

| **ClusterPolicy**                                    | **CEL 기반 정책**                                      |
| ---------------------------------------------------- | ------------------------------------------------------ |
| **spec.rules.verifyImages.imageReferences**          | `spec.matchImageReferences`                            |
| **spec.rules.verifyImages.skipImageReferences**      | CEL 표현식을 쓰는 `spec.matchImageReferences`          |
| **spec.rules.verifyImages.type**                     | `spec.attestors[].cosign` 또는 `spec.attestors[].notary` |
| **spec.rules.verifyImages.attestors**                | `spec.attestors`                                       |
| **spec.rules.verifyImages.attestations**             | `spec.attestations` 및 `spec.validations`              |
| **spec.rules.verifyImages.imageRegistryCredentials** | `spec.credentials`                                     |
| **spec.rules.verifyImages.mutateDigest**             | `spec.validationConfigurations.mutateDigest`           |
| **spec.rules.verifyImages.verifyDigest**             | `spec.validationConfigurations.verifyDigest`           |
| **spec.rules.verifyImages.required**                 | `spec.validationConfigurations.required`               |
| **spec.rules.imageExtractors**                       | `spec.images`                                          |

자세한 설명과 예시는 [ImageValidatingPolicy 문서](/docs/policy-types/image-validating-policy/)를 참고한다.

## CleanupPolicy

| **CleanupPolicy**                  | **CEL 기반 정책**                                  |
| ---------------------------------- | -------------------------------------------------- |
| **spec.conditions**                | `spec.matchConstraints` 및 `spec.matchConditions`  |
| **spec.context**                   | `spec.variables`                                   |
| **spec.deletionPropagationPolicy** | `spec.deletionPropagationPolicy`                   |
| **spec.exclude**                   | `spec.matchConstraints.excludeResourceRules`       |
| **spec.match**                     | `spec.matchConstraints` 및 `spec.matchConditions`  |
| **spec.schedule**                  | `spec.schedule`                                    |

자세한 설명과 예시는 [DeletingPolicy 문서](/docs/policy-types/deleting-policy/)를 참고한다.

## PolicyException

레거시 `kyverno.io` PolicyException은 CEL 기반 정책 유형과 함께 동작하는 `policies.kyverno.io` PolicyException으로 마이그레이션해야 한다.

| **레거시 PolicyException (`kyverno.io`)** | **PolicyException (`policies.kyverno.io`)**               |
| ----------------------------------------- | --------------------------------------------------------- |
| **spec.exceptions.policyName**            | `spec.policyRefs.name`                                    |
| **spec.exceptions.ruleNames**             | 해당 없음. CEL 정책에는 이름이 있는 규칙이 없다       |
| **spec.match**                            | `spec.matchConditions`                                    |
| **spec.conditions**                       | `spec.matchConditions`                                    |
| **spec.podSecurity**                      | CEL 표현식을 쓰는 `spec.matchConditions`                  |

```yaml
apiVersion: policies.kyverno.io/v1
kind: PolicyException
metadata:
  name: allow-team-tool
  namespace: delta
spec:
  policyRefs:
    - name: disallow-host-namespaces
      kind: ValidatingPolicy
  matchConditions:
    - name: match-pod-name
      expression: object.metadata.name.startsWith('important-tool')
```

자세한 설명과 예시는 [정책 예외 가이드](/docs/guides/exceptions/)를 참고한다.

## 컨텍스트 변수

| 기존 Kyverno               | CEL 대응                    | 설명                                    |
| -------------------------- | --------------------------- | --------------------------------------- |
| `{{ request.object }}`     | `object`                    | 검증 대상 리소스                        |
| `{{ request.oldObject }}`  | `oldObject`                 | 이전 버전(업데이트 시)                  |
| `{{ request.operation }}`  | `request.operation`         | 작업 유형(CREATE, UPDATE, DELETE)       |
| `{{ serviceAccountName }}` | `request.userInfo.username` | 서비스어카운트(ServiceAccount) 이름        |
| `{{ request.namespace }}`  | `object.metadata.namespace` | 리소스 네임스페이스                     |

## 테스트

Kyverno CLI로 정책 문법을 검증할 수 있다.

```bash
# Test with a sample resource
kyverno apply validating-policy.yaml --resource test-pod.yaml
```

[Kyverno Playground](https://playground.kyverno.io/)를 써도 된다.

기존 [Kyverno CLI 테스트](/docs/kyverno-cli/reference/kyverno_test)가 있다면 변경 없이 새 정책에 그대로 적용해 정상 동작을 확인할 수 있다.

기존 [Kyverno Chainsaw](/docs/subprojects/chainsaw/) 테스트는 정책 유형과 상태 확인 부분을 변환해야 한다. 나머지 테스트 로직은 재사용할 수 있다.

## 레거시 정책 사용 탐지

Kyverno v1.19부터 어드미션 컨트롤러와 Kyverno CLI가 지원 중단 경고를 출력한다. 레거시 정책이 제거되기 전에 남은 정책을 찾는 데 쓴다.

**어드미션 경고**

레거시 `kyverno.io` 정책 유형을 생성하거나 업데이트하면 응답에 대체 유형을 알려 주는 경고가 포함된다.

```
Warning: kyverno.io/v1 ClusterPolicy is deprecated and will be removed in a future release; migrate to ValidatingPolicy, MutatingPolicy, GeneratingPolicy or ImageValidatingPolicy (policies.kyverno.io), see https://kyverno.io/docs/guides/migration-to-cel/
```

소문자 `enforce`/`audit` 검증 실패 동작처럼 지원 중단된 필드 값에도 경고가 반환된다.

```
Warning: spec.validationFailureAction: Validation failure actions enforce/audit are deprecated, use Enforce/Audit instead.
```

**CLI 경고**

[`kyverno apply`](/docs/kyverno-cli/reference/kyverno_apply)와 [`kyverno test`](/docs/kyverno-cli/reference/kyverno_test) 명령은 레거시 정책이나 정책 예외를 불러올 때 같은 종류(kind) 수준의 지원 중단 경고를 출력한다. 필드 수준 경고는 어드미션 컨트롤러만 낸다. CI 파이프라인에서 마이그레이션을 강제하려면 `--warnings-as-errors` 플래그를 추가한다. 지원 중단 경고가 하나라도 있으면 명령이 실패한다.

```bash
kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --warnings-as-errors
kyverno test . --warnings-as-errors
```

**메트릭으로 사용 현황 추적**

`kyverno_deprecated_api_requests_total` 카운터는 `group`, `version`, `kind`, `field` 레이블을 가지며, 지원 중단된 정책 유형이나 필드를 쓰는 어드미션 요청을 추적한다. 레거시 정책을 생성하거나 업데이트하는 곳이 클러스터에 남아 있지 않은지 업그레이드 전에 확인할 때 사용한다. 지원 중단된 kind를 쓴 요청이면 `field` 레이블은 비어 있고, 그렇지 않으면 `spec.validationFailureAction`처럼 지원 중단된 필드를 나타낸다.

최근 7일간의 지원 중단 API 요청을 kind와 version별로 집계하려면 다음과 같이 한다.

```
sum(increase(kyverno_deprecated_api_requests_total[7d])) by (kind, version)
```

이 카운터는 실제로 들어온 요청만 기록하므로, 이미 존재하지만 지금 아무도 수정하지 않는 레거시 정책은 보고하지 못한다. `group`, `kind` 레이블을 가진 `kyverno_legacy_policies_total` 게이지는 클러스터에 존재하는 레거시 정책 리소스를 그대로 보고하며, 마이그레이션하거나 삭제하면 `0`으로 돌아간다. "모두 마이그레이션했는가?"를 확인할 때 쓴다.

```
sum(kyverno_legacy_policies_total) by (kind)
```

레거시 정책이 하나라도 남아 있는 동안 알림을 보내면, 레거시 유형을 제거하는 릴리스로 업그레이드하기 전에 마이그레이션을 끝낼 수 있다.

```
sum(kyverno_legacy_policies_total) > 0
```

게이지는 스크레이프 시점에 다시 계산된다. `group` 레이블은 `kyverno.io`이고, `kind` 레이블은 `ClusterPolicy`, `Policy`, `PolicyException`, `CleanupPolicy`, `ClusterCleanupPolicy` 중 하나이다. 앞의 세 종류는 어드미션 컨트롤러가, 정리 관련 종류는 정리 컨트롤러가 노출한다. `PolicyException` 시리즈를 보려면 어드미션 컨트롤러에 `--enablePolicyException=true` 플래그가 필요하다.

**시작 시 신호**

레거시 정책이 하나라도 있으면 `kyverno-init`(`kyverno-pre` 초기화 컨테이너)가 시작할 때 오류를 로그로 남기고, 어드미션 컨트롤러 디플로이먼트(Deployment)에 `LegacyPolicyPresent` 경고 이벤트를 발생시킨다. 이 이벤트는 아직 발견되는 레거시 kind를 나열하고 이 가이드로 연결된다. 이 신호는 설치, 업그레이드, 컨트롤러 재시작 때 발생한다. 레거시 정책이 남지 않았는지는 게이지로 확인한다. 아래 이벤트 조회는 쿠버네티스가 가비지 컬렉션하기 전까지 이전 시작 점검의 경고도 보여 줄 수 있다.

```bash
kubectl get events -n <kyverno-namespace> --field-selector reason=LegacyPolicyPresent
```

## 문제 해결

**CEL 표현식 오류**

**오류:** `unknown field 'foo'`
**해결:** <span class="hl-link" tabindex="0" data-code="has-check.yaml" data-lines="1">`has()`</span> 또는 <span class="hl-link" tabindex="0" data-code="optional-field.yaml" data-lines="1">`?`</span>로 필드 존재 여부를 확인한다.

```yaml title="has-check.yaml"
expression: "has(object.metadata.labels) && has(object.metadata.labels.foo) && object.metadata.labels.foo == 'value'"
```

```yaml title="optional-field.yaml"
expression: "object.metadata.?labels.foo.orValue('') == 'value'"
```

**오류:** `index out of bounds`
**해결:** <span class="hl-link" tabindex="0" data-code="array-bounds.yaml" data-lines="1">배열에 접근하기 전에 길이를 확인한다.</span>

```yaml title="array-bounds.yaml"
expression: "size(object.spec.initContainers) > 0 && object.spec.initContainers[0].image != 'bad'"
```

**오류:** `expression of type 'any' cannot be range of a comprehension (must be list, map, or dynamic)`
**해결:** `orValue`로 JSON 타입을 `dynamic`으로 변환한다.

```yaml
"name": "deploymentList",
"expression": "resource.List('apps/v1', 'deployments', object.metadata.namespace).items.orValue([])"
```

## 추가 자료

- [CEL 언어 명세](https://github.com/google/cel-spec)
- [Kyverno CEL 함수 레퍼런스](/docs/policy-types/cel-libraries/)
- [ValidatingPolicy API 레퍼런스](/docs/policy-types/validating-policy)
- [Kyverno CLI 테스트 가이드](/docs/kyverno-cli/reference/kyverno_test)
