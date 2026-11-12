---
excerpt: Kyverno 정책으로 구현한 파드 보안 표준(Pod Security Standards)이다.
title: 파드 보안 표준
type: policies
url: /policies/pod-security/
---

쿠버네티스 파드 보안 표준(Pod Security Standards)은 파드를 안전하게 배포하고 최소 권한 원칙을 따르도록 하는 지침과 모범 사례이다. 이 표준은 **Privileged**, **Baseline**, **Restricted**의 세 수준으로 나뉘며, 관리자는 워크로드에 맞는 보안 수준을 선택할 수 있다. 이 표준의 자세한 내용은 [쿠버네티스 공식 문서](https://kubernetes.io/docs/concepts/security/pod-security-standards/)에서 볼 수 있다.

Kyverno는 쿠버네티스 파드 보안 표준에 정의된 모든 컨트롤의 정책을 지원한다.

## 설치

모든 파드 보안 표준 정책을 적용하려면(권장) [Kyverno를 설치](/docs/installation/installation)하고 [kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/binaries/)를 설치한 다음 아래 명령을 실행한다.

```sh
kustomize build https://github.com/kyverno/policies/pod-security | kubectl apply -f -
```

:::note[참고]
이 정책에 사용자 지정을 적용하려면 [여기](https://kubectl.docs.kubernetes.io/installation/kustomize/binaries/)에서 받을 수 있는 업스트림 `kustomize`를 써야 한다. `kubectl`에 내장된 `kustomize` 버전으로는 동작하지 않는 경우가 많다.
:::

[Helm](https://helm.sh/)으로 Kyverno 파드 보안 표준(PSS) 정책을 설치하려면 `kyverno/kyverno-policies` 차트를 사용한다.

먼저 Kyverno Helm 저장소를 추가한다.

```sh
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
```

그런 다음 PSS 정책 차트를 설치한다.

```sh
helm install kyverno-pss kyverno/kyverno-policies \
  --namespace kyverno-policies --create-namespace
```

이 명령은 차트 기본값인 **Baseline** 프로파일의 정책을 설치한다. **Restricted** 프로파일을 설치하려면 `--set podSecurityStandard=restricted`를 추가한다.  
_환경에 맞게 네임스페이스를 바꿔도 된다._

더 많은 옵션과 고급 구성은 [Kyverno Policies Helm 차트 문서](https://github.com/kyverno/kyverno/tree/main/charts/kyverno-policies)를 참고한다.

## PSA 버전 고정

쿠버네티스 [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/)(PSA) 검사는 쿠버네티스 버전마다 다를 수 있다. `pod-security.kubernetes.io/<MODE>-version` 레이블로 네임스페이스를 특정 버전에 고정할 수 있다. Helm 차트의 `podSecurityVersion` 설정은 릴리스 전체에 적용되는 단일 값이므로 `pod-security.kubernetes.io/enforce-version` 레이블의 버전과 같게 설정한다. 다른 네임스페이스나 모드가 서로 다른 버전을 고정했다면 Kyverno는 그 모두에 맞출 수 없다.

이 설정은 `3.9.2` 이후의 `kyverno-policies` 차트 릴리스에서 사용할 수 있다. 또한 차트 기본값인 `policyType: ValidatingPolicy`가 필요하다.

`podSecurityVersion` 설정에는 다음 값을 쓸 수 있다.

- **`latest`(기본값):** 차트를 렌더링할 때의 클러스터 쿠버네티스 마이너 버전을 사용하면서, 이전 차트 릴리스의 허용 목록은 유지한다. 그 결과 PSA가 거부하는 파드를 허용할 수 있다. Kubernetes를 업그레이드한 뒤에는 `helm upgrade`를 실행해 렌더링된 정책을 업데이트한다.
- **`v1.30` 같은 고정 버전:** 지정한 PSA 버전의 검사를 적용한다. 요청한 버전이 차트가 지원하는 버전보다 새로우면 차트가 지원하는 가장 최신 버전을 사용한다.

버전에 따라 달라지는 정책은 [Kyverno Policies Helm 차트 문서](https://github.com/kyverno/kyverno/tree/main/charts/kyverno-policies)를 참고한다.

기존 릴리스의 버전을 고정하려면 다음을 실행한다.

```sh
helm upgrade kyverno-pss kyverno/kyverno-policies \
  --namespace kyverno-policies \
  --reset-then-reuse-values \
  --set policyType=ValidatingPolicy \
  --set podSecurityVersion=v1.30
```

values 파일에서는 <span class="hl-link" tabindex="0" data-code="podsecurity-version.yaml" data-lines="1">버전을 따옴표로 감싼다</span>.

```yaml title="podsecurity-version.yaml"
podSecurityVersion: 'v1.30'
```

버전을 인식하는 각 정책이 어떤 버전을 쓰는지 확인하려면 정책의 `kyverno.io/pod-security-version` 어노테이션을 살펴본다. PSA 버전 사이에 검사가 바뀌지 않는 정책에는 이 어노테이션이 없으므로 `PSA_VERSION` 값이 비어 있다.

```sh
kubectl get validatingpolicies.policies.kyverno.io \
  -o custom-columns='NAME:.metadata.name,PSA_VERSION:.metadata.annotations.kyverno\.io/pod-security-version'
```

## 사용자 네임스페이스

`spec.hostUsers: false`를 설정한 파드는 자체 [사용자 네임스페이스](https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/)에서 실행되며, 컨테이너 안의 root가 호스트의 권한 없는 사용자로 매핑된다. 파드 보안 표준 정책 버전이 v1.35 이상이면 PSA는 이런 파드에 한해 [일부 파드 보안 표준 검사를 완화](https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/#integration-with-pod-security-admission-checks)한다. 여기서 말하는 정책 버전은 쿠버네티스 서버 버전이 아니라 네임스페이스의 `pod-security.kubernetes.io/<MODE>-version` 레이블로 선택한 버전이다.

`podSecurityUserNamespaces`를 `true`로 설정하면 `kyverno-policies` 차트가 이에 대응하는 Kyverno 정책 검사를 완화한다. 이 설정은 기본으로 꺼져 있다. [`podSecurityVersion`](#psa-버전-고정)을 지원하는 차트 버전에서는 완화 적용 여부가 그 설정에도 좌우된다.

- **`latest`(기본값):** 쿠버네티스 버전과 관계없이 완화가 적용된다.
- **`v1.35` 이상의 고정 버전:** 해당 정책 버전의 PSA 동작과 같게 완화가 적용된다.
- **`v1.35`보다 이전의 고정 버전:** 해당 정책 버전의 PSA 동작과 같게 완화가 적용되지 않는다.

`podSecurityVersion`을 `v1.35` 이상으로 고정하고 `podSecurityUserNamespaces`를 `false`로 두면, PSA가 허용하는 `hostUsers: false` 파드를 Kyverno 정책이 위반으로 표시한다. `validationFailureAction`이 `Enforce`이면 Kyverno는 이 파드를 거부한다.

### 요구 사항

- **쿠버네티스 지원:** 리눅스 노드가 사용자 네임스페이스를 지원해야 한다. 사용자 네임스페이스는 쿠버네티스 v1.36부터 안정(stable) 기능이다. 커널, 파일 시스템, 컨테이너 런타임 요구 사항은 쿠버네티스 문서의 [User Namespaces](https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/#before-you-begin)를 참고한다.

- **Helm 차트 버전:** `kyverno-policies` 차트 3.9.2(Kyverno v1.19.2) 이상을 사용한다. Kustomize로 설치한 정책에는 이 차트 설정이 포함되지 않는다.

- **PSA 정책 버전:** PSA는 정책 버전이 `v1.35` 이상일 때만 이 검사를 완화한다. PSA도 함께 강제하면서 완화를 원한다면 PSA와 `podSecurityVersion` 모두 `v1.35` 이상을 쓴다. 그렇지 않으면 둘을 같은 버전으로 설정한다.

- **정책 유형:** `policyType`을 차트 기본값인 `ValidatingPolicy`로 설정한다. 이 값은 정책을 CEL 기반 `ValidatingPolicy` 리소스로 설치한다. `policyType`이 `ClusterPolicy`이면 사용 중단(deprecated)된 `ClusterPolicy` 리소스를 대신 설치하며, 이때 `podSecurityUserNamespaces` 설정은 효과가 없다. 자세한 내용은 [CEL 정책으로 마이그레이션](/docs/guides/migration-to-cel)을 참고한다.

### 사용자 네임스페이스 지원 활성화

새로 설치할 때 이 설정을 켜려면 다음을 실행한다.

```sh
helm install kyverno-pss kyverno/kyverno-policies \
  --namespace kyverno-policies --create-namespace \
  --set podSecurityUserNamespaces=true
```

기존 릴리스에서 켜려면 다음을 실행한다.

```sh
helm upgrade kyverno-pss kyverno/kyverno-policies \
  --namespace kyverno-policies \
  --reset-then-reuse-values \
  --set policyType=ValidatingPolicy \
  --set podSecurityUserNamespaces=true
```

`--reset-then-reuse-values` 플래그는 Helm v3.14 이상이 필요하다. 이 플래그는 기존 릴리스의 값을 유지하면서 새 차트 버전에서 도입된 기본값을 적용한다. 이 플래그 없이 `helm upgrade --set`을 실행하면 명시적으로 전달하지 않은 값이 차트 기본값으로 초기화된다. 예를 들어 릴리스가 `podSecurityStandard=restricted`와 `validationFailureAction=Enforce`를 쓰고 있다면, 플래그 없이 업그레이드할 때 차트 기본값인 **Baseline**과 **Audit**으로 초기화된다.

릴리스에 설정된 사용자 지정 값을 확인하려면 다음을 실행한다.

```sh
helm get values kyverno-pss --namespace kyverno-policies
```

### 완화되는 정책

`podSecurityUserNamespaces`가 `true`이고 `podSecurityVersion`이 `latest`이거나 `v1.35` 이상의 고정 버전이면, 다음 정책이 `spec.hostUsers: false`를 설정한 파드의 특정 검사를 완화한다.

| 정책                           | 프로파일   | 완화되는 검사                                |
| ------------------------------ | ---------- | -------------------------------------------- |
| `disallow-proc-mount`          | Baseline   | 컨테이너의 `securityContext.procMount`       |
| `require-run-as-nonroot`       | Restricted | 파드 또는 컨테이너 수준의 `runAsNonRoot`     |
| `require-run-as-non-root-user` | Restricted | 파드 또는 컨테이너 수준의 `runAsUser`        |

`spec.hostUsers`를 생략했거나 `true`로 설정한 파드는 계속 이 검사의 대상이다. 적용 가능한 다른 정책 검사도 모두 그대로 적용된다.

:::note[참고]
**Restricted** 프로파일은 사용자 네임스페이스를 쓰는 파드에도 기본 `/proc` 마운트 유형을 요구한다. 완화가 적용될 때 차트는 이 요구 사항을 `disallow-proc-mount-strict` 정책으로 강제하며, 이 정책은 완화되지 않는다.

차트는 `podSecurityStandard`가 `restricted`일 때, `includeRestrictedPolicies`로 활성화했을 때, 또는 `custom` 프로파일의 `podSecurityPolicies`에 명시적으로 나열했을 때 이 정책을 설치한다. `disallow-proc-mount-strict`가 설치되어 있으면 `disallow-proc-mount` 정책도 완화되지 않는다.
:::

### 동작 확인

Kyverno와 `kyverno-policies` Helm 차트가 설치된 테스트 클러스터에서 이 테스트를 실행한다.

API 서버가 `hostUsers` 필드를 받아들여야 하며, 이를 위해 `UserNamespacesSupport` 기능 게이트가 필요하다. 이 게이트는 쿠버네티스 v1.33부터 기본으로 켜져 있고 v1.36부터는 끌 수 없다.

이 테스트는 서버 측 dry-run 요청을 사용하므로 파드를 만들거나 스케줄하지 않는다. 이 어드미션 테스트에서는 워커 노드가 사용자 네임스페이스를 지원하지 않아도 된다.

사용자 네임스페이스 지원을 켜고 Restricted 프로파일을 강제하려면 기존 `kyverno-pss` 릴리스를 업그레이드한다.

```sh
helm upgrade kyverno-pss kyverno/kyverno-policies \
  --namespace kyverno-policies \
  --reset-then-reuse-values \
  --set policyType=ValidatingPolicy \
  --set podSecurityStandard=restricted \
  --set validationFailureAction=Enforce \
  --set podSecurityUserNamespaces=true
```

다음 매니페스트를 `userns-pod.yaml`로 저장한다. 이 파드는 <span class="hl-link" tabindex="0" data-code="userns-pod.yaml" data-lines="6,8">사용자 네임스페이스 안에서 root(`runAsUser: 0`)로 실행되며</span>, 적용 가능한 <span class="hl-link" tabindex="0" data-code="userns-pod.yaml" data-lines="9-10,16-19">나머지 Restricted 프로파일 요구 사항은 충족한다</span>.

```yaml title="userns-pod.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: userns-root
spec:
  hostUsers: false
  securityContext:
    runAsUser: 0
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: busybox
      image: busybox:1.36
      command: ['sleep', '3600']
      securityContext:
        allowPrivilegeEscalation: false
        capabilities:
          drop:
            - ALL
```

파드를 만들거나 스케줄하지 않고 서버 측 검증만 요청한다.

```sh
kubectl apply -f userns-pod.yaml --namespace default --dry-run=server
```

**예상 결과:** Kyverno가 파드를 허용하고, `kubectl`이 다음을 출력한다.

```sh
pod/userns-root created (server dry run)
```

매니페스트에서 `hostUsers: false`를 제거하고 같은 명령을 다시 실행한다.

**예상 결과:** 파드가 `require-run-as-nonroot` 정책과 `require-run-as-non-root-user` 정책을 위반하므로 Kyverno가 거부한다.

결과가 다르다면 다음을 확인한다. `podSecurityVersion`이 `v1.35`보다 이전 버전으로 고정되어 있는지, `validationFailureActionByPolicy`로 두 정책 중 하나가 `Audit`를 쓰는지, 테스트 네임스페이스가 `vpolExclude` 또는 `vpolExcludeByPolicy`로 제외되어 있는지이다. Kyverno는 기본적으로 `kube-system` 네임스페이스와 Kyverno 자신의 네임스페이스도 이 정책에서 제외한다.

## PSP 마이그레이션

Kyverno에는 PodSecurityPolicy(PSP)와 같은 기능을 재현하는 정책이 여럿 있으며, PSP에서 Kyverno로 마이그레이션하는 것을 돕는 정책이다. 이 정책은 PSP Migration 정책 카테고리를 참고한다.

PodSecurityPolicy와 Pod Security Admission을 비교하고 PSP에서 Kyverno로 마이그레이션하는 방법을 다룬 블로그 글은 [여기](/blog/general/psp-migration/index.md)를 참고한다.
