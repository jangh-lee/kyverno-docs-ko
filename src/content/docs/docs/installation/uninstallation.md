---
title: Kyverno 제거
excerpt: Kyverno를 제거한다.
sidebar:
  order: 65
---

## Kyverno 제거

Kyverno를 제거하려면 YAML 매니페스트 원본이나 Helm을 사용한다. 정책 리포트와 함께 Kyverno 디플로이먼트(Deployment) 및 모든 지원 리소스가 제거된다.

### YAML로 Kyverno 제거

Kyverno를 완전히 제거하려면 설치한 버전에 해당하는 태그 릴리스 매니페스트를 사용한다. `KYVERNO_VERSION`을 정확한 릴리스 태그(`v` 접두사 포함)로 설정한다. v1.20.0 설치 예시에서는 `v1.20.0`을 쓴다. 제거한 뒤에는 [아래](#웹훅-정리)에 나온 대로 모든 웹훅이 제거되었는지 확인한다.

```sh
KYVERNO_VERSION=v1.20.0
kubectl delete -f "https://github.com/kyverno/kyverno/releases/download/${KYVERNO_VERSION}/install.yaml"
```

### Helm으로 Kyverno 제거

Kyverno를 설치할 때 사용한 릴리스의 네임스페이스와 이름을 확인한다. 기본 설정을 사용했다면 제거 명령은 다음과 같다.

```sh
helm uninstall kyverno -n kyverno
```

### 웹훅 정리

Helm 기반 설치에서 Kyverno는 종료될 때 기본적으로 모든 웹훅을 정리하려고 시도한다. 그러나 Kyverno의 RBAC 리소스가 먼저 제거되는 등의 경우에는 웹훅을 제대로 정리할 권한을 잃는다. Kyverno는 리소스가 올바른 순서로 삭제되도록 파이널라이저(finalizer)를 이용한 삭제를 지원한다. 이 기능을 사용하려면 admission-controller와 cleanup-controller 디플로이먼트에 `--autoDeleteWebhooks`를 사용한다. 이 기능은 이후 릴리스에서 기본으로 활성화될 예정이다.

웹훅을 수동으로 제거해야 한다면 아래 명령을 사용한다. 표시된 이름은 `v1.20.0` 설치 예시의 이름이다. 다른 릴리스라면 클러스터의 웹훅 구성을 나열해 그 릴리스가 만든 이름을 사용한다.

```sh
kubectl delete mutatingwebhookconfigurations kyverno-policy-mutating-webhook-cfg kyverno-resource-mutating-webhook-cfg kyverno-verify-mutating-webhook-cfg

kubectl delete validatingwebhookconfigurations kyverno-cel-exception-validating-webhook-cfg kyverno-cleanup-validating-webhook-cfg kyverno-exception-validating-webhook-cfg kyverno-global-context-validating-webhook-cfg kyverno-policy-validating-webhook-cfg kyverno-resource-validating-webhook-cfg kyverno-ttl-validating-webhook-cfg
```
