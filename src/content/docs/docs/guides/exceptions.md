---
title: 정책 예외
excerpt: PolicyException으로 기존 정책에 대한 예외를 만듭니다.
sidebar:
  order: 110
---

:::caution[주의]
PolicyException은 기본적으로 비활성화되어 있습니다. 활성화하려면 `enablePolicyException` 플래그를 `true`로 설정합니다. PolicyException을 활성화할 때는 `exceptionNamespace` 플래그로 예외를 사용할 수 있는 네임스페이스도 지정해야 합니다.
자세한 내용은 [컨테이너 플래그](/docs/installation/customization#container-flags)를 참고하세요.
:::

Kyverno 정책에는 정책이 적용될 리소스를 세밀하게 제어하는 방법이 여러 가지 있습니다. 그러나 모두 제외할 리소스를 같은 규칙 정의 안에 적어야 합니다. 정책을 직접 수정할 수 없거나 수정하는 데 운영 부담이 클 때는 이 방식이 제약이 됩니다.

예를 들어 여러 팀이 같은 클러스터를 쓰는 조직에서는 정책을 작성하고 관리하는 팀과 리소스를 제출하는 팀이 다를 수 있습니다. 이럴 때는 정책 정의와 특정 제외 조건을 분리하는 편이 낫습니다. 또 위험을 알고 감수할 수 있다면, 원래는 유효한 규칙에 위반되는 경우를 일회성으로 허용해야 할 때도 많습니다. 두 경우 모두 **PolicyException** 리소스를 쓰는 사례입니다.

`PolicyException`은 네임스페이스 범위의 커스텀 리소스로, 특정 정책과 규칙 조합을 리소스가 통과하도록 허용합니다. 현재 PolicyException은 `policies.kyverno.io` API 그룹에 정의되어 있으며 `ValidatingPolicy`, `ImageValidatingPolicy` 같은 모든 CEL 기반 [정책 유형](/docs/policy-types/overview)과 함께 동작합니다.

<a id="policyexceptions-for-cel-policies"></a>

## CEL 정책용 PolicyException

`policies.kyverno.io` 그룹의 PolicyException(Kyverno 1.14에서 도입)은 **CEL 표현식**을 지원합니다. 이 표현식으로 `ValidatingPolicy`, `ImageValidatingPolicy` 같은 정책 유형의 적용을 **어드미션**과 **백그라운드** 모드 모두에서 선택적으로 건너뛸 수 있습니다.

- `matchConditions` 아래의 **CEL 표현식**은 대상 리소스를 이름, 네임스페이스, 레이블 등으로 동적으로 매칭합니다.
- `policyRefs` 필드는 적용 제외할 **정책 이름**과 **정책 kind**를 지정합니다.
- 매치 조건이 `true`로 평가되면 참조된 규칙을 **건너뛰고**, 이 사실이 **PolicyReport**에 기록됩니다.
- `validations` 아래에 선택적으로 둘 수 있는 **CEL 검증**은 예외를 허용하기 전에 매칭된 리소스가 추가로 충족해야 하는 [보상 통제](#보상-통제)를 정의합니다.

### 어드미션 모드에서 ValidatingPolicy와 PolicyException 사용

다음 `ValidatingPolicy`는 모든 `Deployment` 리소스에 `env=prod` 레이블을 요구합니다. 이 조건을 충족하지 못하면 정책이 요청을 거부합니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: require-prod-label
spec:
  validationActions:
    - Deny
  matchConstraints:
    resourceRules:
      - apiGroups: ['apps']
        apiVersions: ['v1']
        resources: ['deployments']
        operations: ['CREATE', 'UPDATE']
  validations:
    - expression: >-
        has(object.metadata.labels) && object.metadata.labels.env == 'prod'
      messageExpression: "'Deployment must have label env=prod.'"
```

특정 `Deployment`를 위 정책의 적용에서 제외하려면 `PolicyException`을 정의합니다. 이 예시는 CEL 표현식으로 이름이 `skipped-deployment`인 `Deployment`를 매칭해 검증을 우회하게 합니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: PolicyException
metadata:
  name: exclude-skipped-deployment
  namespace: default
spec:
  policyRefs:
    - name: require-prod-label
      kind: ValidatingPolicy
  matchConditions:
    - name: skip-by-name
      expression: "object.metadata.name == 'skipped-deployment'"
```

실제 어드미션 요청 중에 예외가 적용되면 Kyverno는 그 판단을 `PolicyReport`에 기록합니다. 다음은 일치하는 `PolicyException` 때문에 정책 규칙을 건너뛴 예시입니다.

```yaml
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
metadata:
  namespace: default
  labels:
    app.kubernetes.io/managed-by: kyverno
  ownerReferences:
    - apiVersion: apps/v1
      kind: Deployment
      name: skipped-deployment
results:
  - policy: vpol-report-background-sample
    rule: exception
    result: skip
    message: 'rule is skipped due to policy exception: default/exclude-skipped-deployment'
    properties:
      exceptions: exclude-skipped-deployment
      process: admission review
    source: KyvernoValidatingPolicy
    scored: true
scope:
  apiVersion: apps/v1
  kind: Deployment
  name: skipped-deployment
  namespace: default
summary:
  pass: 0
  fail: 0
  warn: 0
  error: 0
  skip: 1
```

#### PolicyException의 PolicyReport 결과 해석

- **result: skip** — 규칙이 적용되지 않았음을 나타냅니다.
- **process: admission review** — 실제 어드미션 요청 중에 평가가 이루어졌음을 확인해 줍니다.
- **exceptions: exclude-skipped-deployment** — 적용된 `PolicyException`을 가리킵니다.

`PolicyException`은 어드미션 모드와 마찬가지로 백그라운드 모드에서도 동작하며, 다른 정책 유형인 `ImageValidatingPolicy`도 지원합니다.

### 백그라운드 모드에서 ImageValidatingPolicy와 PolicyException 사용

이 예시에서 `skipped-pod`라는 Pod는 정책의 매칭 조건을 충족합니다. default 네임스페이스에 있고 `prod: true` 레이블이 있으며, ghcr.io의 서명되지 않은 이미지를 참조합니다. 따라서 이 이미지는 증명(attestation)과 서명이 없거나 유효하지 않아 백그라운드 정책 평가에서 실패해야 합니다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: skipped-pod
  namespace: default
  labels:
    prod: 'true'
spec:
  containers:
    - name: nginx
      image: 'ghcr.io/kyverno/test-verify-image:unsigned'
```

아래 `ImageValidatingPolicy`는 어드미션 때는 실행되지 않고 백그라운드 스캔 때만 실행되도록 구성되어 있습니다. 대상은 `prod: true` 레이블이 있는 Pod 리소스입니다. 이런 리소스를 만나면 정책은 세 단계로 검증합니다. 제공된 notary 인증서로 이미지 서명을 검증하고, `CycloneDX` 유형의 SBOM 증명이 있는지 확인하고, 페이로드 형식이 기대한 구조와 일치하는지 확인합니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ImageValidatingPolicy
metadata:
  name: ivpol-sample
spec:
  webhookConfiguration:
    timeoutSeconds: 20
  failurePolicy: Ignore
  evaluation:
    admission:
      enabled: false
    background:
      enabled: true
  validationActions:
    - Audit
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE']
        resources: ['pods']
  matchConditions:
    - name: 'check-prod-label'
      expression: >-
        has(object.metadata.labels) && has(object.metadata.labels.prod) && object.metadata.labels.prod == 'true'
  matchImageReferences:
    - glob: ghcr.io/*
  attestors:
    - name: notary
      notary:
        certs:
          value: |-
            -----BEGIN CERTIFICATE-----
            MIIDTTCCAjWgAwIBAgIJAPI+zAzn4s0xMA0GCSqGSIb3DQEBCwUAMEwxCzAJB
            ...
            -----END CERTIFICATE-----
  attestations:
    - name: sbom
      referrer:
        type: sbom/cyclone-dx
  validations:
    - expression: >-
        images.containers.map(image, verifyImageSignatures(image, [attestors.notary])).all(e, e > 0)
      message: failed to verify image with notary cert
    - expression: >-
        images.containers.map(image, verifyAttestationSignatures(image, attestations.sbom, [attestors.notary])).all(e, e > 0)
      message: failed to verify attestation with notary cert
    - expression: >-
        images.containers.map(image, extractPayload(image, attestations.sbom).bomFormat == 'CycloneDX').all(e, e)
      message: sbom is not a cyclone dx sbom
```

이 `PolicyException`은 해당 Pod를 정책 적용에서 제외하도록 정의되어 있습니다. 예외는 CEL 표현식 `object.metadata.name == 'skipped-pod'`로 특정 리소스를 식별하고, `ivpol-sample`이라는 `ImageValidatingPolicy`에 연결됩니다. 리포트 컨트롤러가 이 Pod를 처리할 때 예외가 적용된다는 것을 감지하므로, 이 리소스에는 이미지 검증 규칙이 하나도 실행되지 않습니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: PolicyException
metadata:
  name: check-name
spec:
  policyRefs:
    - name: ivpol-sample
      kind: ImageValidatingPolicy
  matchConditions:
    - name: 'check-name'
      expression: "object.metadata.name == 'skipped-pod'"
```

Kyverno 리포트 컨트롤러는 [백그라운드 스캔](/docs/guides/reports)으로 이 Pod를 평가합니다. 리소스가 `PolicyException`과 일치하는 것을 감지하면 Kyverno가 그 판단을 `PolicyReport`에 기록합니다.

```yaml
apiVersion: wgpolicyk8s.io/v1alpha2
kind: PolicyReport
metadata:
  namespace: default
  labels:
    app.kubernetes.io/managed-by: kyverno
  ownerReferences:
    - apiVersion: v1
      kind: Pod
      name: skipped-pod
results:
  - policy: ivpol-sample
    rule: exception
    result: skip
    message: 'rule is skipped due to policy exception: '
    properties:
      exceptions: check-name
      process: background scan
    source: KyvernoImageValidatingPolicy
    scored: true
scope:
  apiVersion: v1
  kind: Pod
  name: skipped-pod
  namespace: default
summary:
  pass: 0
  fail: 0
  warn: 0
  error: 0
  skip: 1
```

#### PolicyException의 PolicyReport 결과 해석

- **result: skip** — 규칙이 적용되지 않았음을 나타냅니다.
- **process: background scan** — 백그라운드 정책 점검 중에 평가가 이루어졌음을 확인해 줍니다.
- **exceptions: check-name** — 적용된 `PolicyException`을 가리킵니다.

이렇게 하면 핵심 정책 로직을 수정하지 않고도 선언적으로 세밀하게 예외를 둘 수 있습니다. 보안 태세는 견고하게 유지하면서 예외적인 경우에 유연하게 대응할 수 있습니다.

### GeneratingPolicy와 PolicyException 사용

`PolicyException`으로 `GeneratingPolicy`를 선택적으로 건너뛸 수도 있습니다. 기본 정책을 바꾸지 않고 특정 네임스페이스나 특정 레이블이 있는 리소스처럼 일부 상황에서 리소스 생성을 막고 싶을 때 유용합니다.

다음 `GeneratingPolicy`는 새로 만든 모든 Namespace에 `zk-kafka-address`라는 ConfigMap을 자동으로 생성하도록 설계되었습니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: GeneratingPolicy
metadata:
  name: generate-configmap
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['namespaces']
  variables:
    - name: nsName
      expression: 'object.metadata.name'
    - name: configmap
      expression: >-
        [
          {
            "kind": dyn("ConfigMap"),
            "apiVersion": dyn("v1"),
            "metadata": dyn({
              "name": "zk-kafka-address",
              "namespace": string(variables.nsName),
            }),
            "data": dyn({
              "KAFKA_ADDRESS": "192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092",
              "ZK_ADDRESS": "192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181"
            })
          }
        ]
  generate:
    - expression: generator.Apply(variables.nsName, variables.configmap)
```

특정 네임스페이스(예: "testing" 네임스페이스)에 이 `ConfigMap`이 생성되지 않게 하려면 `PolicyException`을 정의합니다. 이 예외는 CEL 표현식으로 이름이 `testing`인 Namespace를 매칭하고, 해당 Namespace에 대해 `generate-configmap` 정책을 건너뜁니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: PolicyException
metadata:
  name: exclude-namespace-by-name
spec:
  policyRefs:
    - name: generate-configmap
      kind: GeneratingPolicy
  matchConditions:
    - name: 'check-namespace-name'
      expression: "object.metadata.name == 'testing'"
```

`testing`, `production`, `staging` 세 네임스페이스를 만들면 각각에 대해 `GeneratingPolicy`가 트리거됩니다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: testing
---
apiVersion: v1
kind: Namespace
metadata:
  name: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
```

그러나 `PolicyException`이 `testing` 네임스페이스와 일치하므로 `GeneratingPolicy`는 건너뜁니다. 그 결과 `zk-kafka-address` ConfigMap은 `production`과 `staging` 네임스페이스에만 생성됩니다. 생성된 `ConfigMap`은 아래와 같습니다. `testing` 네임스페이스에는 `ConfigMap`이 만들어지지 않았다는 점에 유의하세요.

```yaml
apiVersion: v1
data:
  KAFKA_ADDRESS: 192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092
  ZK_ADDRESS: 192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181
kind: ConfigMap
metadata:
  name: zk-kafka-address
  namespace: staging
---
apiVersion: v1
data:
  KAFKA_ADDRESS: 192.168.10.13:9092,192.168.10.14:9092,192.168.10.15:9092
  ZK_ADDRESS: 192.168.10.10:2181,192.168.10.11:2181,192.168.10.12:2181
kind: ConfigMap
metadata:
  name: zk-kafka-address
  namespace: production
```

네임스페이스가 생성되면 Kyverno 어드미션 컨트롤러는 `UpdateRequest`라는 중간 객체를 만들어 작업을 큐에 넣습니다. 이후 백그라운드 컨트롤러가 이 `UpdateRequest`를 처리해 최종 리소스를 생성합니다. 컨트롤러는 `production`과 `staging` 네임스페이스에는 `ConfigMap`을 정상적으로 만듭니다. 그러나 일치하는 `PolicyException`이 있으므로 `testing` 네임스페이스는 생성 단계를 건너뜁니다. 이어서 리포트 컨트롤러가 이벤트마다 `ClusterPolicyReport`를 만듭니다. `production`과 `staging`에서는 생성에 성공해 `pass` 결과를, `testing`에서는 적용된 예외를 정확히 가리키는 `skip` 결과를 보여 줍니다.

```yaml
apiVersion: wgpolicyk8s.io/v1alpha2
kind: ClusterPolicyReport
metadata:
  labels:
    app.kubernetes.io/managed-by: kyverno
  ownerReferences:
    - apiVersion: v1
      kind: Namespace
      name: production
results:
  - message: policy evaluated successfully
    policy: generate-configmap
    properties:
      generated-resources: /v1, Kind=ConfigMap Name=zk-kafka-address Namespace=production
      process: admission review
    result: pass
    rule: generate-configmap
    scored: true
    source: KyvernoGeneratingPolicy
scope:
  apiVersion: v1
  kind: Namespace
  name: production
summary:
  error: 0
  fail: 0
  pass: 1
  skip: 0
  warn: 0
---
apiVersion: wgpolicyk8s.io/v1alpha2
kind: ClusterPolicyReport
metadata:
  labels:
    app.kubernetes.io/managed-by: kyverno
  ownerReferences:
    - apiVersion: v1
      kind: Namespace
      name: testing
results:
  - policy: generate-configmap
    properties:
      exceptions: exclude-namespace-by-name
      process: admission review
    result: skip
    rule: generate-configmap
    scored: true
    source: KyvernoGeneratingPolicy
scope:
  apiVersion: v1
  kind: Namespace
  name: testing
summary:
  error: 0
  fail: 0
  pass: 0
  skip: 1
  warn: 0
```

### 세밀한 정책 예외

Kyverno는 CEL을 인식하는 좁은 범위의 예외를 지원하므로, 정책 전체를 약화하지 않고 특정 예외만 허용할 수 있습니다. 예외는 구조화된 허용 목록을 CEL에 전달할 수 있고(예: `exceptions.allowedImages`, `exceptions.allowedValues`), `reportResult`로 PolicyReport에 결과가 표시되는 방식도 제어할 수 있습니다.

#### 이미지 기반 예외

이 예외는 `ci` 네임스페이스의 Pod가 지정한 패턴에 맞는 이미지를 사용하도록 허용하면서, 그 밖의 모든 대상에는 "latest 태그 금지" 가드레일을 계속 적용합니다. 매치 조건은 우회 대상을 특정 팀으로 좁혀 감사 가능성을 높입니다.

```yaml
apiVersion: policies.kyverno.io/v1beta1
kind: PolicyException
metadata:
  name: allow-ci-latest-images
  namespace: ci
spec:
  policyRefs:
    - name: restrict-image-tag
      kind: ValidatingPolicy
  images:
    - 'ghcr.io/kyverno/*:latest'
  matchConditions:
    - expression: "has(object.metadata.labels.team) && object.metadata.labels.team == 'platform'"
```

다음 `ValidatingPolicy`는 `exceptions.allowedImages`를 참조해 허용 목록에 있는 이미지의 검증을 건너뜁니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: restrict-image-tag
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: [v1]
        operations: [CREATE, UPDATE]
        resources: [pods]
  validations:
    - message: 'Containers must not allow privilege escalation unless they are in the allowed images list.'
      expression: >-
        object.spec.containers.all(container,
          string(container.image) in exceptions.allowedImages ||
          (
            has(container.securityContext) &&
            has(container.securityContext.allowPrivilegeEscalation) &&
            container.securityContext.allowPrivilegeEscalation == false
          )
        )
```

#### 값 기반 예외

이 예외는 `allowedValues`로 값 목록을 제공합니다. 제한된 대상에 한해 CEL 검증이 이 값들을 허용할 수 있으므로, 정책 전체를 약화하지 않고도 팀이 작업을 진행할 수 있습니다.

```yaml
apiVersion: policies.kyverno.io/v1beta1
kind: PolicyException
metadata:
  name: allow-debug-annotation
  namespace: dev
spec:
  policyRefs:
    - name: check-security-context
      kind: ValidatingPolicy
  allowedValues:
    - 'debug-mode-temporary'
  matchConditions:
    - expression: "object.metadata.name.startsWith('experiments-')"
```

다음은 위의 허용 값을 활용하는 정책입니다. 어노테이션/capability 값이 `exceptions.allowedValues`에 없으면 리소스를 거부합니다.

```yaml
apiVersion: policies.kyverno.io/v1beta1
kind: ValidatingPolicy
metadata:
  name: check-security-context
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: [apps]
        apiVersions: [v1]
        operations: [CREATE, UPDATE]
        resources: [deployments]
  variables:
    - name: allowedCapabilities
      expression: "['AUDIT_WRITE','CHOWN','DAC_OVERRIDE','FOWNER','FSETID','KILL','MKNOD','NET_BIND_SERVICE','SETFCAP','SETGID','SETPCAP','SETUID','SYS_CHROOT']"
  validations:
    - expression: >-
        object.spec.containers.all(container,
          container.?securityContext.?capabilities.?add.orValue([]).all(capability,
            capability in exceptions.allowedValues ||
            capability in variables.allowedCapabilities))
      message: >-
        Any capabilities added beyond the allowed list (AUDIT_WRITE, CHOWN, DAC_OVERRIDE, FOWNER,
        FSETID, KILL, MKNOD, NET_BIND_SERVICE, SETFCAP, SETGID, SETPCAP, SETUID, SYS_CHROOT)
        are disallowed.
```

#### 보고 상태 설정

`PolicyException`의 `reportResult`로 일치한 예외가 PolicyReport에 표시되는 방식을 제어합니다. `reportResult: pass`로 설정하면 기본값인 "skip" 대신 "pass"로 표시됩니다.

```yaml
apiVersion: policies.kyverno.io/v1beta1
kind: PolicyException
metadata:
  name: exclude-skipped-deployment-2
  labels:
    polex.kyverno.io/priority: '0.2'
spec:
  policyRefs:
    - name: 'with-multiple-exceptions'
      kind: ValidatingPolicy
  matchConditions:
    - name: 'check-name'
      expression: "object.metadata.name == 'skipped-deployment'"
  reportResult: pass
```

<a id="interpreting-policyreport-results"></a>

#### PolicyReport 결과 해석

- `production` 네임스페이스의 리포트는 `result: pass`를 보여 주며, `properties.generated-resources` 필드로 `ConfigMap`이 정상적으로 생성되었음을 확인할 수 있습니다.

- 반대로 `testing` 네임스페이스의 리포트는 `result: skip`을 보여 줍니다. `properties.exceptions` 필드가 `exclude-namespace-by-name`을 가리키므로 `PolicyException`이 정상 적용되어 리소스가 생성되지 않았음을 알 수 있습니다.

<a id="compensating-controls"></a>

### 보상 통제

기본적으로 일치한 `PolicyException`은 무조건 적용됩니다. 참조한 정책에서 리소스를 완전히 면제하거나, 위의 [이미지 기반](#이미지-기반-예외) 예외와 [값 기반](#값-기반-예외) 예외처럼 `allowedImages`와 `allowedValues`를 정책 평가에 제공합니다. 추적되는 보안 티켓이나 더 엄격한 네트워크 설정처럼 다른 안전장치가 갖춰진 경우에만 예외를 허용해야 한다면, 그 안전장치를 `spec.validations` 아래에 나열합니다. 이 **보상 통제(compensating controls)**는 `ValidatingPolicy` 검증과 같은 스키마(`expression`, `message`, `messageExpression`)를 쓰는 CEL 검증입니다. 예외가 허용되려면 매칭된 리소스가 이 검증을 모두 충족해야 합니다.

:::note[참고]
보상 통제는 `ValidatingPolicy` 또는 `NamespacedValidatingPolicy`를 참조하는 예외에 대해서만 평가됩니다. 다른 정책 kind에서는 이 필드가 무시되며, 예외를 생성하거나 업데이트할 때 Kyverno가 경고를 반환합니다.
:::

다음 `ValidatingPolicy`는 Pod의 모든 컨테이너가 루트가 아닌 사용자로 실행되도록 요구합니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: disallow-root-user
spec:
  validationActions:
    - Deny
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  validations:
    - expression: >-
        (object.spec.containers
          + object.spec.?initContainers.orValue([])
          + object.spec.?ephemeralContainers.orValue([])).all(container,
          container.?securityContext.?runAsNonRoot.orValue(false) == true)
      message: >-
        Running as root is not allowed. Every container must set
        securityContext.runAsNonRoot to true.
```

아래 `PolicyException`은 이름이 `legacy-app`으로 시작하는 Pod가 루트로 실행되도록 허용합니다. 이 예외는 Pod에 보안 티켓 어노테이션이 있고 엄격한 네트워크 격리를 선언한 경우에만 허용됩니다.

```yaml
apiVersion: policies.kyverno.io/v1
kind: PolicyException
metadata:
  name: allow-root-legacy-app
  namespace: legacy-apps
spec:
  policyRefs:
    - name: disallow-root-user
      kind: ValidatingPolicy
  # 1단계: 이 예외를 사용할 수 있는 리소스를 선택합니다
  matchConditions:
    - name: check-app-name
      expression: "object.metadata.name.startsWith('legacy-app')"
  # 2단계: 예외가 허용되려면 충족해야 하는 보상 통제
  validations:
    - expression: "object.metadata.?annotations[?'security.company.com/ticket-id'].orValue('') != ''"
      message: >-
        Compensating Control Failure: Exception requires a security ticket
        annotation ('security.company.com/ticket-id').
    - expression: "object.metadata.?annotations[?'security.company.com/network-isolation'].orValue('') == 'strict'"
      message: >-
        Compensating Control Failure: Workload must run with 'network-isolation: strict'
        annotation to bypass non-root checks.
```

다음 Pod는 예외와 일치하고 두 통제를 모두 충족하므로 예외가 허용됩니다. 루트로 실행되지만 Pod는 어드미션을 통과합니다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: legacy-app-granted
  namespace: legacy-apps
  annotations:
    security.company.com/ticket-id: SEC-1234
    security.company.com/network-isolation: strict
spec:
  containers:
    - name: app
      image: busybox:1.35
```

#### 보상 통제 평가 방식

1. Kyverno는 먼저 예외의 `matchConditions`를 평가합니다. 리소스가 일치하지 않으면 예외와 그 통제는 무시됩니다.
2. 리소스가 일치하면 `validations`의 항목을 순서대로 평가합니다. 모든 항목이 `true`로 평가되어야만 예외가 허용됩니다.
3. 항목 하나라도 `false`로 평가되면 예외는 허용되지 **않으며**, 정책은 예외가 없는 것처럼 평가됩니다. 이때 정책이 실패하면 정책의 메시지 대신 실패한 통제의 메시지가 보고되므로, 제출자는 예외에 무엇이 필요한지 알 수 있습니다. 요청이 어떻게 처리되는지는 정책의 `validationActions`에 따라 다릅니다. `Deny`이면 해당 메시지와 함께 리소스를 거부하고, `Warn`이면 리소스를 허용하면서 메시지를 어드미션 경고로 반환하며, `Audit`이면 리소스를 허용하고 메시지를 PolicyReport에 기록합니다.

보상 통제는 예외를 허용할지 결정할 뿐 리소스 자체를 검증하지는 않습니다. 이미 정책을 준수하는 리소스는 예외가 필요 없으므로, 통제를 충족하지 못해도 어드미션을 통과합니다.

위의 정책과 예외는 `validationActions: [Deny]`를 사용하며, 이때 Kyverno는 Pod를 다음과 같이 처리합니다.

| Pod                                                            | 예외 일치 | 통제 충족 | 결과                                                                                            |
| -------------------------------------------------------------- | --------- | --------- | ----------------------------------------------------------------------------------------------- |
| `legacy-app-granted`: 루트로 실행, 두 어노테이션 모두 있음     | 예        | 예        | 예외가 허용되므로 통과                                                                          |
| `legacy-app-no-ticket`: 루트로 실행, 티켓 어노테이션 없음      | 예        | 아니요    | `Compensating Control Failure: Exception requires a security ticket annotation ...`와 함께 거부 |
| `legacy-app-compliant`: 루트가 아닌 사용자로 실행, 어노테이션 없음 | 예    | 아니요    | Pod가 정책을 준수하므로 통과                                                                    |
| `web-app`: 루트로 실행                                         | 아니요    | 평가 안 함 | `Running as root is not allowed ...`와 함께 거부                                               |

리소스에 둘 이상의 예외가 일치하면 Kyverno는 각 예외를 따로 판단합니다. 통제를 충족하지 못한 예외는 아무것도 허용하지 않지만, 통제를 통과한 다른 일치 예외(또는 통제가 없는 예외)는 여전히 우회를 허용합니다. 일치한 예외가 모두 거부되고 정책이 실패하면, Kyverno는 네임스페이스 순, 이름 순으로 정렬했을 때 처음 거부된 예외의 메시지를 보고합니다.

보상 통제는 [이미지 기반](#이미지-기반-예외) 예외와 [값 기반](#값-기반-예외) 예외에도 적용됩니다. 거부된 예외는 `exceptions.allowedImages`나 `exceptions.allowedValues`에 아무것도 추가하지 않습니다.

#### 보상 통제 작성

- 표현식에서는 `object`, `oldObject`, `request`, `namespaceObject`와 [Kyverno CEL 라이브러리](/docs/policy-types/cel-libraries/)를 쓸 수 있습니다. 예외는 이를 참조하는 정책과 별도로 작성되므로 정책의 `variables`와 `exceptions`는 사용할 수 없습니다.
- Kyverno는 `PolicyException`을 생성하거나 업데이트할 때 표현식을 컴파일하며, 하나라도 유효하지 않으면 예외를 거부합니다.
- `messageExpression`이 `message`보다 우선합니다. 둘 다 없으면 실패 메시지는 `compensating control at index <index> failed for policy exception <namespace>/<name>`입니다.
- `reason`은 검증 스키마에서 허용되지만 보상 통제에는 아무 효과가 없습니다. 예외에 통제가 정의된 정책은 `ValidatingAdmissionPolicy`로 오프로드되지 않기 때문입니다.
- 런타임 오류로 통제를 평가할 수 없으면 예외는 허용되지 않습니다. 이때 정책이 실패하면 결과는 `error`로 보고됩니다.
- [자동 생성된 파드 컨트롤러 규칙](/docs/policy-types/validating-policy#autogen)에서는 실패 메시지에 평가한 파드 템플릿의 경로가 포함됩니다.

#### 보상 통제의 PolicyReport 결과 해석

- 리소스를 완전히 면제하는 예외가 허용되면, 통제가 없는 예외와 마찬가지로 결과는 `skip`입니다(`reportResult: pass`가 설정되었다면 `pass`). 이미지 기반 또는 값 기반 예외는 리소스를 면제하지 않으므로 정책이 그대로 실행되고 정책 자체의 결과가 보고됩니다.
- 예외가 거부되고 정책이 실패하면 결과는 `fail`이고, `message`는 실패한 통제의 메시지이며, `properties.exceptions`는 거부된 예외의 이름을 나타냅니다.

#### ValidatingAdmissionPolicy 생성

생성된 `ValidatingAdmissionPolicy`는 보상 통제를 평가할 수 없습니다. `ValidatingPolicy`를 참조하는 예외가 `validations`를 정의하면 Kyverno는 그 정책의 `ValidatingAdmissionPolicy`를 생성하지 않고, 이전에 생성했던 것은 삭제합니다. 이유는 정책 상태에 기록되며, 정책은 계속 Kyverno 어드미션 웹훅이 강제합니다.
