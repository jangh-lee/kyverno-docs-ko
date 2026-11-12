---
title: Kyverno 퀵 스타트
linkTitle: 퀵 스타트 가이드
sidebar:
  order: 20
excerpt: Kyverno 정책과 규칙 유형 소개
---

이 섹션은 Kyverno를 빠르게 실행하는 방법과 대표 기능 몇 가지를 보여주는 퀵 가이드를 제공합니다. 검증, 변경, 생성을 각각 다루므로 사용 사례에 가장 맞는 가이드를 하나만 고르거나 모두 따라 해도 됩니다.

이 가이드는 개념 증명(PoC)이나 실습 시연 전용이며 프로덕션 가이드로는 권장하지 않습니다. 프로덕션에 Kyverno를 설치하는 방법은 [설치 페이지](/docs/installation/installation)를 참고하세요.

이 가이드를 따르려면 **Kyverno v1.17.0 이상**이 필요합니다. `ValidatingPolicy`, `MutatingPolicy`, `GeneratingPolicy` 리소스를 `policies.kyverno.io/v1`로 제공하는 첫 검증 릴리스입니다. Kyverno v1.16.0은 이 정책 리소스를 `v1`이 아닌 `v1alpha1`로만 제공합니다.

먼저 Helm으로 최신 Kyverno 릴리스를 설치합니다.

```sh
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm install kyverno kyverno/kyverno -n kyverno --create-namespace
```

다음으로 관심 있는 퀵 스타트 가이드를 고릅니다. 처음부터 차례로 따라 해도 됩니다.

검증과 변경 예제에는 레지스트리 자격 증명이나 시크릿이 필요하지 않습니다. 생성 예제는 별도로 구성한, 실습 전용 시크릿 시연입니다.

<a id="validate-resources"></a>

## 리소스 검증

검증 가이드에서는 모든 Pod에 `team` 레이블이 있어야 한다는 간단한 Kyverno 정책 예제를 봅니다. 검증은 정책의 가장 흔한 사용 사례로, "예" 또는 "아니오"를 판단합니다. 정책을 준수하는 리소스는 통과하고("예, 허용됩니다") 준수하지 않는 리소스는 통과하지 못할 수 있습니다("아니오, 허용되지 않습니다").

아래 정책을 클러스터에 추가합니다. `quick-start-validation` 네임스페이스의 모든 Pod에 `team` 레이블을 요구하는 검증 규칙 하나가 들어 있습니다. Kyverno는 검증, 변경, 생성, 정리, 이미지 검증을 위한 여러 정책 유형을 지원합니다. `validationActions` 필드는 `Deny`로 설정되어 있어 준수하지 않는 Pod를 차단합니다.

이 예제용 네임스페이스를 만듭니다. 이 예제의 모든 Pod는 이 네임스페이스에 만듭니다.

```sh
kubectl create namespace quick-start-validation
```

```sh
kubectl create -f- << EOF
apiVersion: policies.kyverno.io/v1
kind: ValidatingPolicy
metadata:
  name: require-labels
spec:
  validationActions:
    - Deny
  autogen:
    podControllers:
      controllers:
        - deployments
  matchConstraints:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: quick-start-validation
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  validations:
    - message: "label 'team' is required"
      expression: "has(object.metadata.labels) && has(object.metadata.labels.team) && object.metadata.labels.team != ''"
EOF
```

필수 레이블이 없는 Deployment를 만들어 봅니다.

```sh
kubectl -n quick-start-validation create deployment nginx --image=nginx
```

어드미션 요청이 `label 'team' is required` 메시지와 함께 거부됩니다.

정책이 Pod를 매칭하지만, Kyverno는 [자동 생성(autogen)](/docs/policy-types/validating-policy#autogen)으로 Deployment 같은 Pod 컨트롤러에도 이 정책을 적용할 수 있습니다.

이번에는 필수 레이블을 붙여 Pod를 만듭니다.

```sh
kubectl -n quick-start-validation run nginx --image registry.k8s.io/pause:3.10 --labels team=backend
```

이 Pod 구성은 정책을 준수하므로 허용됩니다.

검증을 체험했으니 위에서 만든 정책과 네임스페이스를 삭제해 정리합니다.

```sh
kubectl delete validatingpolicy require-labels
kubectl delete namespace quick-start-validation
```

네임스페이스를 삭제하면 이 과정에서 만든 Deployment(허용되었다면)와 Pod도 함께 삭제됩니다.

축하합니다. Kubernetes 클러스터에 검증 정책을 적용했습니다. 검증 정책의 자세한 내용은 [ValidatingPolicy 섹션](/docs/policy-types/validating-policy)을 참고하세요.

## 리소스 변경

변경(mutation)은 리소스가 클러스터에 어드미션되기 전에 리소스를 어떤 식으로든 바꾸는("mutate") 기능입니다. 변경 규칙은 Pod나 ConfigMap 같은 리소스를 선택하고 원하는 상태를 정의한다는 점에서 검증 규칙과 비슷합니다.

아래 Kyverno 변경 정책을 클러스터에 추가합니다. 이 정책은 `team` 레이블이 아직 없는 새 Pod에만 `team` 레이블을 값 `bravo`로 추가합니다. Kyverno는 CEL 표현식으로 조건 로직을 처리하므로 정책을 쉽게 쓰고 읽을 수 있습니다.

이 예제용 네임스페이스를 만듭니다.

```sh
kubectl create namespace quick-start-mutation
```

```sh
kubectl create -f- << EOF
apiVersion: policies.kyverno.io/v1
kind: MutatingPolicy
metadata:
  name: add-labels
spec:
  matchConstraints:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: quick-start-mutation
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['CREATE', 'UPDATE']
        resources: ['pods']
  matchConditions:
    - name: team-label-missing
      expression: '!has(object.metadata.labels) || !has(object.metadata.labels.team)'
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >
          Object{
            metadata: Object.metadata{
              labels: Object.metadata.labels{
                team: "bravo"
              }
            }
          }
EOF
```

이제 원하는 레이블이 정의되지 않은 새 Pod를 만듭니다.

```sh
kubectl -n quick-start-mutation run redis --image registry.k8s.io/pause:3.10
```

Pod가 만들어지면 Pod를 조회해 `team` 레이블이 추가되었는지 확인합니다.

```sh
kubectl -n quick-start-mutation get pod redis --show-labels
```

Kyverno가 `team=bravo` 레이블을 추가한 것을 볼 수 있습니다.

이번에는 `team` 레이블이 이미 정의된 Pod를 하나 더 만듭니다.

```sh
kubectl -n quick-start-mutation run newredis --image registry.k8s.io/pause:3.10 -l team=alpha
```

이 Pod를 조회해 레이블을 다시 확인합니다.

```sh
kubectl -n quick-start-mutation get pod newredis --show-labels
```

이번에는 Pod에 이미 `team` 레이블이 있으므로 Kyverno가 정책에 정의된 값으로 `team` 레이블을 추가하지 않은 것을 볼 수 있습니다.

변경 정책을 체험하고 로직을 쉽게 쓸 수 있다는 것도 확인했으니, 위에서 만든 정책을 삭제해 정리합니다.

```sh
kubectl delete mutatingpolicy add-labels
kubectl delete namespace quick-start-mutation
```

네임스페이스를 삭제하면 이 과정에서 만든 Pod 두 개도 함께 삭제됩니다.

축하합니다. Kubernetes 클러스터에 변경 정책을 적용했습니다. 변경 정책의 자세한 내용은 [MutatingPolicy 섹션](/docs/policy-types/mutating-policy)을 참고하세요.

## 리소스 생성

Kyverno는 정책에 저장된 정의를 바탕으로 Kubernetes 리소스를 생성(create)할 수 있습니다. 이 예제는 이미지 풀 시크릿을 실습용 네임스페이스 하나에 한 번 복사합니다.

:::caution[실습 전용 시크릿과 권한]
아래의 가짜 값만 사용하세요. 실제 레지스트리 자격 증명을 터미널 명령, 셸 히스토리, 공유 클러스터, 이 가이드에 붙여 넣지 마세요. 실제 레지스트리 자격 증명은 민감한 정보이므로 이 시연과는 별개로 전용 시크릿 관리 워크플로를 사용하세요.

Kyverno의 background-controller는 보통 시크릿에 접근할 수 없습니다. 아래 두 RoleBinding은 `quick-start-source`의 지정한 소스 시크릿에 대한 `get` 권한과, 대상 네임스페이스 `quick-start-generated` 하나의 시크릿에 대한 `get`/`create` 권한만 부여합니다. 그래도 이는 민감한 실습 전용 접근 권한이므로 이 예제의 권한을 프로덕션에서 사용하지 마세요.
:::

소스 네임스페이스와 더미 이미지 풀 시크릿을 만듭니다. `.invalid` 도메인과 자리 표시자 비밀번호는 실제 레지스트리 자격 증명이 아니며 레지스트리에 인증할 수 없습니다.

```sh
kubectl create namespace quick-start-source
kubectl -n quick-start-source create secret docker-registry regcred \
  --docker-server=registry.example.invalid \
  --docker-username=demo-user \
  --docker-password=replace-with-non-sensitive-placeholder \
  --docker-email=demo@example.invalid
```

background-controller가 `regcred`라는 소스 시크릿만 읽을 수 있도록 Role과 RoleBinding을 만듭니다.

```sh
kubectl apply -f- << EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kyverno-quick-start-source-secret
  namespace: quick-start-source
rules:
- apiGroups:
  - ''
  resources:
  - secrets
  resourceNames:
  - regcred
  verbs:
  - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kyverno-quick-start-source-secret
  namespace: quick-start-source
subjects:
- kind: ServiceAccount
  name: kyverno-background-controller
  namespace: kyverno
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kyverno-quick-start-source-secret
---
apiVersion: v1
kind: Namespace
metadata:
  name: quick-start-generated
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kyverno-quick-start-generated-secret
  namespace: quick-start-generated
rules:
- apiGroups:
  - ''
  resources:
  - secrets
  resourceNames:
  - regcred
  verbs:
  - get
- apiGroups:
  - ''
  resources:
  - secrets
  verbs:
  - create
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kyverno-quick-start-generated-secret
  namespace: quick-start-generated
subjects:
- kind: ServiceAccount
  name: kyverno-background-controller
  namespace: kyverno
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: kyverno-quick-start-generated-secret
EOF
```

소스 Role은 `regcred` 읽기만 허용합니다. 대상 네임스페이스에서 컨트롤러는 `regcred`만 읽고 시크릿을 생성할 수 있습니다. Kubernetes RBAC은 리소스 이름으로 `create`를 제한할 수 없으므로, 이 네임스페이스는 예제 전용으로 두세요. 두 Role과 RoleBinding이 모두 만들어진 뒤에 아래 정책을 생성합니다. 이 정책은 준비 레이블을 `true`로 처음 추가하는 업데이트에만 일치하므로, 이후의 네임스페이스 업데이트에서는 생성이 다시 실행되지 않습니다.

```sh
kubectl create -f- << EOF
apiVersion: policies.kyverno.io/v1
kind: GeneratingPolicy
metadata:
  name: sync-secrets
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: ['']
        apiVersions: ['v1']
        operations: ['UPDATE']
        resources: ['namespaces']
  matchConditions:
    - name: destination-namespace-ready
      expression: "object.metadata.name == 'quick-start-generated' && object.metadata.labels.exists(k, k == 'quick-start.kyverno.io/ready' && object.metadata.labels[k] == 'true') && (!has(oldObject.metadata.labels) || !oldObject.metadata.labels.exists(k, k == 'quick-start.kyverno.io/ready'))"
  variables:
    - name: targetNs
      expression: 'object.metadata.name'
    - name: sourceSecret
      expression: 'resource.Get("v1", "secrets", "quick-start-source", "regcred")'
  generate:
    - expression: 'generator.Apply(variables.targetNs, [variables.sourceSecret])'
EOF
```

정책이 준비될 때까지 기다린 다음, 대상 네임스페이스의 레이블을 업데이트해 생성을 활성화합니다.

```sh
kubectl wait --for='jsonpath={.status.conditionStatus.ready}=true' generatingpolicy/sync-secrets --timeout=120s
kubectl label namespace quick-start-generated quick-start.kyverno.io/ready=true
```

생성된 시크릿을 조회합니다.

```sh
kubectl wait --for=create secret/regcred -n quick-start-generated --timeout=120s
kubectl -n quick-start-generated get secret
```

Kyverno가 `quick-start-source`의 소스 시크릿으로 `regcred`를 생성한 것을 볼 수 있습니다.

생성 정책의 기본을 이해했으니, 이 예제에서 만든 리소스를 모두 정리합니다.

```sh
kubectl delete generatingpolicy sync-secrets
kubectl -n quick-start-generated delete secret regcred --ignore-not-found
kubectl -n quick-start-generated delete rolebinding kyverno-quick-start-generated-secret
kubectl -n quick-start-generated delete role kyverno-quick-start-generated-secret
kubectl -n quick-start-source delete rolebinding kyverno-quick-start-source-secret
kubectl -n quick-start-source delete role kyverno-quick-start-source-secret
kubectl -n quick-start-source delete secret regcred
kubectl delete namespace quick-start-generated quick-start-source
```

축하합니다. Kubernetes 클러스터에 생성 정책을 적용했습니다. 생성 정책의 자세한 내용은 [GeneratingPolicy 섹션](/docs/policy-types/generating-policy)을 참고하세요.

모든 가이드를 마치면 전용 실습 클러스터에서 Kyverno 릴리스와 네임스페이스를 제거합니다.

```sh
helm uninstall kyverno -n kyverno
kubectl delete namespace kyverno
```

Helm은 제거 후에도 일부 Kyverno CRD를 남겨 둡니다. 공유 클러스터에서는 남은 CRD를 그대로 두세요. 격리된 실습 환경에서 CRD를 지우려면, 다른 정책이나 리소스가 들어 있을 수 있는 CRD를 삭제하지 말고 폐기해도 되는 클러스터 자체를 삭제하세요.
