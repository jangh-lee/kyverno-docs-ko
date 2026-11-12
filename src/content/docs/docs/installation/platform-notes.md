---
title: 플랫폼 참고 사항
excerpt: 특정 쿠버네티스 플랫폼에서 고려할 사항
sidebar:
  order: 25
---

## 플랫폼별 참고 사항

Kyverno를 설치하고 관리하는 데 쓰는 애플리케이션이나 클러스터가 구축된 쿠버네티스 플랫폼에 따라 알아 두어야 할 고려 사항이 있다. 이 참고 사항은 Helm 차트를 설치 방식으로 쓴다고 가정한다.

<a id="notes-for-argocd-users"></a>

### ArgoCD 사용자를 위한 참고 사항

ArgoCD v2.10부터 `ServerSideDiff`를 지원한다. Kubernetes의 Server Side Apply 기능을 활용해 OutOfSync 문제를 해결하는 기능이다. 이 방식은 비교를 서버 측에서 처리한다. 그래서 Kubernetes가 기본으로 설정하는 `skipBackgroundRequests` 같은 필드와 Kyverno 같은 변경 어드미션 컨트롤러가 설정하는 필드를 존중하므로, 로컬 매니페스트와의 차이 때문에 생기는 불필요한 `OutOfSync` 오류를 막는다.

#### 구성 모범 사례

1. **서버 측 구성**
   - 다음 두 방법 중 하나로 `ServerSideDiff`를 활성화한다.
     - 애플리케이션별: `argocd.argoproj.io/compare-options` 어노테이션을 추가한다.
     - 전역: `argocd-cmd-params-cm` 컨피그맵(ConfigMap)에서 구성한다.

   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     annotations:
       argocd.argoproj.io/compare-options: ServerSideDiff=true,IncludeMutationWebhook=true
       #...
   ```

2. **RBAC 및 CRD 관리**
   - 메타데이터를 올바르게 처리하도록 `syncOptions`에서 [ServerSideApply를 활성화](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/#server-side-apply)한다.
   - ArgoCD가 [집계된 클러스터롤(ClusterRole)의 차이를 무시](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/#ignoring-rbac-changes-made-by-aggregateroles)하도록 구성한다.
   - ArgoCD가 Kyverno CRD를 관리할 수 있도록 적절한 RBAC 권한을 부여한다.

3. **동기화 옵션 구성**
   - `Replace=true`는 기존 리소스에 문제를 일으킬 수 있으므로 사용하지 않는다.
   - 리소스를 매끄럽게 업데이트하려면 `ServerSideApply=true`를 사용한다.
   - 새 네임스페이스에 배포한다면 `CreateNamespace=true`를 활성화한다.

4. **구성 보존**
   - Helm 차트에는 기본적으로 `config.preserve=true`가 설정되어 있다. Helm 기반 설치, 업그레이드, 제거 시나리오에서 유용한 설정이다.
   - 이 설정은 Helm post-delete 훅(hook)을 활성화한다. App of Apps 패턴으로 배포하면 ArgoCD가 애플리케이션을 out-of-sync로 표시할 수 있다.
   - 부모 애플리케이션을 삭제할 때 ArgoCD가 Kyverno 애플리케이션을 정리하지 못할 수도 있다.
   - **권장 사항:** ArgoCD로 Kyverno를 배포할 때는 `config.preserve=false`로 설정해 리소스가 제대로 정리되고 동기화 상태가 올바르게 표시되도록 한다.

#### 전체 Application 예시

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: kyverno
  namespace: argocd
  annotations:
    argocd.argoproj.io/compare-options: ServerSideDiff=true,IncludeMutationWebhook=true
spec:
  destination:
    namespace: kyverno
    server: https://kubernetes.default.svc
  project: default
  source:
    chart: kyverno
    repoURL: https://kyverno.github.io/kyverno
    targetRevision: <my.target.version>
    helm:
      values: |
        webhookLabels:
          app.kubernetes.io/managed-by: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true
```

#### 문제 해결 가이드

1. **CRD 확인 실패**
   - **증상**: CRD 검증 중 배포가 실패한다.
   - **일반적인 원인**:
     - RBAC 권한 부족
     - CRD가 올바르게 등록되지 않음
   - **해결 방법**:
     - ArgoCD 서비스어카운트(ServiceAccount)의 RBAC 권한을 확인한다.
     - 정책보다 CRD를 먼저 설치했는지 확인한다.
     - ArgoCD 로그에서 구체적인 권한 오류를 확인한다.

2. **동기화 실패**
   - **증상**: 리소스가 OutOfSync로 표시된다.
   - **일반적인 원인**:
     - ServerSideDiff 구성 누락
     - 집계된 클러스터롤의 차이
   - **해결 방법**:
     - 위에 나온 대로 ServerSideDiff를 활성화한다.
     - 집계된 클러스터롤은 리소스 제외 설정을 구성한다.
     - ArgoCD UI에서 리소스 상태를 확인한다.

3. **리소스 관리 문제**
   - **증상**: 리소스가 올바르게 생성되거나 업데이트되지 않는다.
   - **일반적인 원인**:
     - 잘못된 동기화 옵션
     - 리소스 소유권 충돌
   - **해결 방법**:
     - Replace 대신 ServerSideApply를 사용한다.
     - 리소스 추적 방식을 구성한다.
     - 리소스 소유권 레이블을 확인한다.

4. **성능과 확장**
   - **증상**: 동기화나 리소스 처리가 느리다.
   - **일반적인 원인**:
     - 리소스 수가 많음
     - 리소스를 많이 쓰는 작업
   - **해결 방법**:
     - 대규모 배포에서는 선택적 동기화를 사용한다.
     - 적절한 리소스 한도를 구성한다.
     - 가능한 곳에서는 백그라운드 처리를 활성화한다.

Argo CD를 Kyverno 변경 정책과 함께 사용할 때의 고려 사항은 [GitOps 고려 사항](/docs/policy-types/mutating-policy#argocd)을 참고한다.

#### 리소스 추적과 소유권

ArgoCD는 `app.kubernetes.io/instance` 레이블을 자동으로 설정하고, 이 레이블로 어떤 리소스가 앱을 구성하는지 판단한다. Kyverno Helm 차트도 같은 목적으로 이 레이블을 설정한다. 이 충돌은 다음과 같이 해결한다.

1. [문서](https://argo-cd.readthedocs.io/en/latest/user-guide/resource_tracking/#additional-tracking-methods-via-an-annotation)에 설명된 대로 ArgoCD가 다른 추적 방식을 쓰도록 구성한다.
2. Application 매니페스트에 적절한 어노테이션을 추가한다.

Argo CD 사용자는 [Kyverno 컨피그맵](/docs/installation/customization#configmap-keys)의 `webhookLabels` 키로 Kyverno가 웹훅에 레이블을 추가하게 할 수도 있다. Argo CD에서 Kyverno 애플리케이션을 볼 때 도움이 된다.

### OpenShift 사용자를 위한 참고 사항

Red Hat OpenShift에는 프로파일 기반으로 특정 보안 제어를 강제하는 [Security Context Constraints](https://docs.openshift.com/container-platform/4.11/authentication/managing-security-context-constraints.html)(SCC) 기능이 있다. OpenShift 클러스터에는 SCC가 여러 개 기본으로 들어 있으며, OpenShift 4.11은 기본적으로 `restricted-v2`를 우선한다. Kyverno Helm 차트는 파드의 `securityContext` 오브젝트에 자체 값을 정의한다. 이 값은 업스트림 [Pod Security Standards의 restricted 프로파일](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted)을 따르지만, 사용자가 정의한 Security Context Constraints와 호환되지 않을 수 있다. Kyverno Helm 차트를 OpenShift 환경에 그대로 배포하면 "unable to validate against any security context constraint"와 비슷한 오류가 발생할 수 있다. 이를 피하려면 필요한 securityContext 플래그/필드를 `null` 값으로 설정해 Kyverno Helm 차트를 배포한다. 그러면 OpenShift가 배포 시 정의된 SCC를 적용한다. OpenShift 4.11 이상에서는 `restricted-v2` 프로파일 덕분에 Helm 차트 설치 과정을 수정하지 않고도 차트를 성공적으로 배포할 수 있는 것으로 알려져 있다.

### EKS 사용자를 위한 참고 사항

VPC CNI 플러그인으로 구축한 EKS 클러스터에서 [보안과 운영 가능성 절](/docs/installation/installation#보안과-운영-가능성)에 정의된 운영 가능성 전략을 택하려면, Kyverno를 설치할 때 웹훅에서 `kube-system` 네임스페이스를 제외해야 한다. 이 네임스페이스에서 플러그인이 실행되기 때문이다. 클러스터의 모든 노드가 "삭제"되는 경우(예: 클러스터에 노드 그룹이 하나뿐이고 이를 0으로 축소한 경우)에는 Kyverno 레플리카가 실행되는 위치도 영향을 받는다. 이때 `kube-system`을 제외하지 않았고 `Fail` 모드의 정책이 파드에 하나 이상 일치하면, VPC CNI 플러그인의 데몬셋(DaemonSet) 파드가 올라오지 못해 노드 부트스트랩 과정을 끝내지 못할 수 있다. 이런 상황이 발생하면 기반 클러스터 네트워크가 정상 상태로 돌아가지 못하므로 Kyverno는 웹훅 요청을 처리할 수 없다. Kyverno 1.12부터는 웹훅에서 `kube-system`이 기본으로 제외된다.

<a id="notes-for-aks-users"></a>

### AKS 사용자를 위한 참고 사항

AKS는 Admission Enforcer로 AKS 클러스터의 웹훅을 제어하며, 시스템 네임스페이스에 영향을 줄 수 있는 웹훅을 제거한다. Kyverno는 웹훅으로 등록되므로 Admission Enforcer가 Kyverno의 웹훅을 제거할 수 있고, 그러면 둘이 웹훅 조정을 두고 충돌한다. 자세한 내용은 [Microsoft Azure FAQ](https://learn.microsoft.com/en-us/azure/aks/faq#can-admission-controller-webhooks-impact-kube-system-and-internal-aks-namespaces)를 참고한다. AKS 클러스터에 Kyverno를 배포할 때는 Helm 옵션 `config.webhookAnnotations`에 Admission Enforcer를 비활성화하는 어노테이션을 포함하도록 설정한다. Kyverno는 이 어노테이션을 붙여 웹훅을 구성하므로 AKS가 웹훅을 제거하지 못한다. 사용할 어노테이션은 `"admissions.enforcer/disabled": true`이다. 자세한 내용은 차트 [README](https://github.com/kyverno/kyverno/blob/release-1.12/charts/kyverno/README.md)를 참고한다. Kyverno 1.12부터는 이 어노테이션이 이미 설정되어 있다.

#### 클러스터 중지/시작 작업

Azure AKS는 클러스터 중지와 시작 작업 전에 어드미션 웹훅을 엄격하게 검사한다. 어드미션 웹훅 구성 중 `failurePolicy: Fail`이면서 `apiGroups`와 `resources` 양쪽에 와일드카드(`*`)를 쓴 것이 있으면, AKS는 재시작 중 클러스터 부트스트랩 교착 상태가 생길 가능성을 막으려고 중지/시작 작업을 차단한다.

Kyverno에는 `protect-generation-labels.kyverno.svc`라는 검증 웹훅이 있다. 컨트롤러가 아닌 계정이 Kyverno 생성 메타데이터(`generate.kyverno.io/policy-name`)를 수정하지 못하게 막는 웹훅이다. 이 웹훅은 기본적으로 `failurePolicy: Fail`이고 모든 대상을 가리키는 와일드카드를 쓰기 때문에, Kyverno Helm 차트 3.9.2 이상을 실행하는 AKS 클러스터를 중지하면 다음 오류와 함께 실패할 수 있다.

```text
Failed to stop the Kubernetes service '<cluster_name>'. Error: The managed cluster has the following webhooks, that might prevent stop/start cluster operations, Please remove them before the operation. 1. Webhook configuration 'kyverno-resource-validating-webhook-cfg': 'protect-generation-labels.kyverno.svc' Rule 1 has wildcard in both APIGroups and Resources.
```

##### 해결 방법과 구성

AKS 클러스터의 중지/시작 작업을 막지 않으려면 Helm 값에서 생성 레이블 보호 웹훅을 비활성화한다.

```yaml
features:
  protectGenerationLabels:
    enabled: false
```

또는 Kyverno 어드미션 컨트롤러에 `--protectGenerationLabels=false` 플래그(또는 환경 변수 `FLAG_PROTECT_GENERATION_LABELS=false`)를 전달한다. 비활성화하면 웹훅은 자동으로 생략되고 조정 중에 `kyverno-resource-validating-webhook-cfg`에서 제거된다.

:::caution[중요]
`protectGenerationLabels`를 비활성화하면 Kyverno의 생성 추적 레이블을 무단으로 변경하는 일을 어드미션 시점에 막아 주던 보호가 사라진다. AKS 클러스터 중지나 시작 작업을 허용하려고 이 설정을 일시적으로 껐다면, 유지 보수가 끝난 뒤 `features.protectGenerationLabels.enabled=true`로 다시 활성화해 보호를 복원한다.
:::

##### 웹훅 등록 확인

클러스터를 시작한 뒤(또는 유지 보수 뒤) `protect-generation-labels.kyverno.svc`가 `failurePolicy: Fail`로 다시 등록되었는지 확인하려면 다음 명령을 실행한다.

```bash
kubectl get validatingwebhookconfigurations kyverno-resource-validating-webhook-cfg \
  -o jsonpath='{range .webhooks[?(@.name=="protect-generation-labels.kyverno.svc")]}{.name}{": failurePolicy="}{.failurePolicy}{"\n"}{end}'
```

- **활성(보호됨):** `protect-generation-labels.kyverno.svc: failurePolicy=Fail`을 반환한다.
- **비활성화되었거나 제거됨:** 출력이 비어 있다.

`jq`를 사용할 수도 있다.

```bash
kubectl get validatingwebhookconfigurations kyverno-resource-validating-webhook-cfg -o json \
  | jq -e '.webhooks[] | select(.name=="protect-generation-labels.kyverno.svc" and .failurePolicy=="Fail")' >/dev/null \
  || echo "protect-generation-labels is missing or not Fail" >&2
```
