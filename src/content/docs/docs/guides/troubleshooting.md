---
title: 문제 해결
excerpt: Kyverno 문제 해결과 복구 절차를 설명한다.
sidebar:
  order: 130
---

Kyverno는 정책을 단순하게 만드는 것을 목표로 하지만, 그래도 문제가 생길 때가 있다. 아래 섹션은 문제가 생겼을 때 원인을 찾고 복구하는 데 도움이 된다.

<a id="api-server-is-blocked"></a>

## API 서버가 차단됨

**증상**: Kyverno 파드가 실행되지 않고, 웹훅 타임아웃 때문에 API 서버가 응답하지 않는다. 클러스터가 "고장 난" 것처럼 보인다.

**원인**: 클러스터 장애나 노드 그룹 전체의 잘못된 스케일링·종료로 Kyverno 파드가 모두 내려갔는데, 파드를 대상으로 하는 정책이 [fail-closed](/docs/installation/customization#webhooks)로 구성된 경우에 발생할 수 있다. 보통 Kyverno 네임스페이스가 제외되지 않았거나(기본 동작이 아니다), `kube-system`처럼 클러스터 핵심 구성 요소가 있는 시스템 네임스페이스가 제외되지 않았을 때만 이런 일이 생긴다.

**해결**: Kyverno의 validating 웹훅 구성과 mutating 웹훅 구성을 삭제한다. Kyverno가 복구되면 네임스페이스 제외 설정을 확인한다. 아래 단계를 따른다. 어드미션 컨트롤러 컴포넌트를 레플리카 3개로 실행하는 것도 고려한다.

1. API 서버가 요청을 Kyverno로 전달하도록 지시하는 validating 웹훅 구성과 mutating 웹훅 구성을 삭제한다.

```sh
kubectl delete validatingwebhookconfiguration kyverno-resource-validating-webhook-cfg
kubectl delete  mutatingwebhookconfiguration kyverno-resource-mutating-webhook-cfg
```

이 두 웹훅 구성은 리소스용이다. 다른 Kyverno 웹훅은 내부 동작용이어서 보통 삭제할 필요가 없다. Kyverno가 복구되면 현재 설치된 정책을 기준으로 웹훅이 다시 만들어진다.

2. Kyverno 재시작

이 단계는 보통 필요 없다. 필요한 경우 Kyverno 파드를 삭제하거나, 디플로이먼트(Deployment)를 0으로 줄였다가 다시 늘린다. 예를 들어 기본 네임스페이스에 레플리카 3개로 설치했다면 다음과 같이 한다.

```sh
kubectl scale deploy kyverno-admission-controller -n kyverno --replicas 0
kubectl scale deploy kyverno-admission-controller -n kyverno --replicas 3
```

3. 네임스페이스 제외 고려

[네임스페이스 셀렉터](/docs/installation/customization#namespace-selectors)로 시스템 네임스페이스로 가는 요청을 걸러낸다. 이 설정은 선택한 네임스페이스에서 모든 정책 검사를 건너뛰므로 보안 모범 사례에 어긋날 수 있다. 네임스페이스를 제외할 때는 Kyverno가 그 안의 오브젝트에 정책을 적용할 수 없으므로, 쿠버네티스 RBAC 같은 다른 통제 수단을 직접 설정해야 한다. 자세한 내용은 [보안 대 운영성](/docs/installation/installation#security-vs-operability) 섹션을 참고한다. Kyverno 네임스페이스는 기본으로 제외되어 있다. 일부 PaaS 플랫폼에서 Kyverno를 실행한다면 `kube-system` 같은 네임스페이스를 추가로 제외해야 할 수도 있다.

## 정책이 적용되지 않음

**증상**: 정책을 만들었는데, 정책을 트리거해야 하는 리소스를 만들어도 아무 일도 일어나지 않는 것 같다.

**해결**: Kyverno가 Kubernetes로부터 정보를 받고 정상 상태인지 확인하려면 몇 가지를 점검해야 한다.

1. Kyverno 파드가 실행 중인지 확인한다. Kyverno를 기본 네임스페이스 `kyverno`에 설치했다면 `kubectl -n kyverno get po` 명령으로 상태를 확인한다. 상태는 항상 `Running`이어야 한다.
2. 클러스터에 설치된 모든 정책의 `READY` 열이 `true`인지 확인한다.

   ```sh
   kubectl get validatingpolicies,mutatingpolicies,generatingpolicies,deletingpolicies,imagevalidatingpolicies
   kubectl get namespacedvalidatingpolicies,namespacedmutatingpolicies,namespacedgeneratingpolicies,namespaceddeletingpolicies,namespacedimagevalidatingpolicies -A
   ```

3. Kyverno는 Kubernetes에 두 종류의 웹훅으로 등록된다. 등록된 웹훅 상태를 확인해 Kyverno가 목록에 있는지 본다.

   ```sh
   $ kubectl get validatingwebhookconfigurations,mutatingwebhookconfigurations
    NAME                                                                                                        WEBHOOKS       AGE
    validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-cleanup-validating-webhook-cfg             1          5d21h
    validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-policy-validating-webhook-cfg              1          5d21h
    validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-exception-validating-webhook-cfg           1          5d21h
    validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-resource-validating-webhook-cfg            1          5d21h
    validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-global-context-validating-webhook-cfg      1          5d21h
    validatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-ttl-validating-webhook-cfg                 1          5d21h

    NAME                                                                                              WEBHOOKS   AGE
    mutatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-policy-mutating-webhook-cfg     1          5d21h
    mutatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-verify-mutating-webhook-cfg     1          5d21h
    mutatingwebhookconfiguration.admissionregistration.k8s.io/kyverno-resource-mutating-webhook-cfg   1          5d21h
   ```

   웹훅의 AGE는 현재 실행 중인 Kyverno 파드의 AGE와 비슷해야 한다. 웹훅이 몇 초밖에 안 됐다면 Kyverno가 Kubernetes에 등록하는 데 문제가 있을 수 있다.

4. 간단한 `busybox` 파드를 띄워 Kyverno에 접속해 보면서, 클러스터 안에서 Kyverno 서비스로의 이름 해석과 연결이 되는지 확인한다. 아래와 같이 `wget` 명령을 입력한다. 응답이 "remote file exists"가 아니라면 클러스터에 네트워크 연결 또는 DNS 문제가 있는 것이다. 클러스터를 [kubespray](https://github.com/kubernetes-sigs/kubespray)로 프로비저닝했다면 [이 코멘트](https://github.com/jetstack/cert-manager/issues/2640#issuecomment-601872165)가 도움이 되는지 확인해 본다.

   ```sh
   $ kubectl run busybox --rm -ti --image=busybox -- /bin/sh
   If you don't see a command prompt, try pressing enter.
   / # wget --no-check-certificate --spider --timeout=1 https://kyverno-svc.kyverno.svc:443/health/liveness
   Connecting to kyverno-svc.kyverno.svc:443 (100.67.141.176:443)
   remote file exists
   / # exit
   Session ended, resume using 'kubectl attach busybox -c busybox -i -t' command when the pod is running
   pod "busybox" deleted
   ```

5. `validate` 정책에서는 해당 리소스를 차단하는 것이 목적이라면 `failureAction`이 `Enforce`로 설정되어 있는지 확인한다. 샘플 라이브러리의 정책 대부분은 신규 사용자에게 의도치 않은 영향이 없도록 일부러 `Audit` 모드로 설정되어 있다. 앞 단계가 모두 정상이라면 Kyverno는 잘 동작하고 있고, 정책이 리소스를 즉시 차단하지 않도록 설정되어 있을 뿐일 수 있다.

6. 생성하려는 리소스가 기본적으로 Kyverno 처리에서 제외되는 종류가 아닌지, 제외된 네임스페이스에서 만든 것이 아닌지 확인한다. Kyverno는 이런 항목을 걸러내는 데 Kyverno 네임스페이스의 `kyverno`라는 컨피그맵(ConfigMap)을 기본으로 사용한다. 키 이름은 `resourceFilters`이며, 자세한 내용은 [여기](/docs/installation/customization#resource-filters)를 참고한다.

7. 같은 컨피그맵에서 리소스를 제출한 사용자/주체나 그룹이 제외 대상이 아닌지 확인한다. `excludeGroups`, `excludeUsernames` 등이 있다면 함께 점검한다.

## Kyverno가 리소스를 많이 쓰거나 OOMKill이 발생함

**증상**: Kyverno가 메모리나 CPU를 너무 많이 쓴다. 원인은 어떻게 파악할 수 있을까?

**해결**: "너무 많다"고 보는 사용량이 실제로 과한지 판단하려면 Kyverno가 어떻게 동작하고 처리하는지 이해해야 한다. Kyverno는 (기본값이며 변경할 수 있다) 로드된 정책과 그 정책이 매칭하는 리소스에 따라 웹훅을 동적으로 구성한다. 클러스터의 파드나 노드 수에 요구 리소스가 정비례하는 단순한 공식은 없다. Kyverno가 사용하는 리소스의 전체 모습을 파악하려면 다음 질문에 답해야 한다.

1. 클러스터에 어떤 정책이 있고, 어떤 종류의 리소스에 매칭하는가? 와일드카드(`"*"`)에 매칭하는 정책은 Kyverno에 엄청난 부하를 주므로 가능하면 피해야 한다. 이런 정책은 쿠버네티스 API 서버가 클러스터의 _모든 리소스에 대한 모든 동작_ 을 Kyverno로 보내게 만들기 때문이다. Kyverno에 이 리소스 대부분에 매칭하는 정책이 없더라도 요청 하나하나에 _반드시_ 응답해야 한다. 와일드카드에 매칭하는 정책이 하나만 있어도 Kyverno에 필요한 리소스가 두 배, 세 배 이상으로 늘어날 수 있다.
2. 어느 컨트롤러에 부하가 걸리는가? Kyverno 컨트롤러마다 책임이 다르다. 자세한 내용은 [컨트롤러 가이드](/docs/guides/high-availability#controllers-in-kyverno)를 참고한다. 컨트롤러는 각각 독립적으로 스케일할 수 있지만, 어느 방향으로든 바로 스케일하기 전에 부하를 먼저 살핀다.
3. 기본 요청(request)과 한도(limit)가 그대로인가? Kyverno(어느 컨트롤러든)가 받는 부하가 기본 요청과 한도로 감당할 수 있는 범위를 넘었을 수 있다. 이 기본값은 실제 사용 사례와 피드백을 적절히 반영해 정했지만 **모든 환경에 맞지는 않는다**. Kyverno 입장에서 매우 크고 활발한 클러스터라면 이 값을 늘려야 할 수 있다.
4. 모니터링 메트릭은 무엇을 보여주는가? Kyverno는 클러스터 인프라의 핵심 요소이므로 다른 요소와 마찬가지로 효과적으로 모니터링해야 한다. Kyverno가 얼마나 활발한지 보여주는 메트릭이 여럿 있으며, 가장 중요한 것은 [어드미션 요청 수](/docs/guides/monitoring)이다. 그 밖에 메모리 사용량과 CPU 사용률이 있다. 용량 산정은 평균이 아닌 최대 사용량을 기준으로 해야 한다.
5. 생성 또는 기존 리소스 변경 규칙을 쓸 때 대기 중인 업데이트 요청의 수를 확인했는가? 어드미션 요청 수 메트릭 외에 `kubectl -n kyverno get updaterequests`로도 요청 수를 가늠할 수 있다. `Pending` 상태인 요청이 많다면 권한 문제일 수 있고, 동기화를 켠 clone 방식 생성 규칙이라면 소스 리소스가 과도하게 업데이트되고 있다는 신호일 수 있다. 백그라운드 컨트롤러에 필요한 리소스와 작업에 대한 권한을 부여했는지, Kyverno가 clone 소스에 레이블을 붙일 수 있는지 확인한다.

메모리와 CPU 프로파일링을 켜는 방법은 [Kyverno 위키](https://github.com/kyverno/kyverno/wiki/Profiling-Kyverno-on-Kubernetes)에서도 볼 수 있다.

## AKS 웹훅 구성 및 성능 문제

**증상**: AKS를 쓰는데 Kyverno가 메모리나 CPU를 너무 많이 쓰거나 감사 로그를 많이 만들어 낸다.

**해결**: AKS에서는 AKS [Admissions Enforcer](https://learn.microsoft.com/en-us/azure/aks/faq#can-admission-controller-webhooks-impact-kube-system-and-internal-aks-namespaces) 플러그인이 Kyverno 웹훅을 변경해 끝없는 업데이트 루프가 생길 수 있다. 이를 막으려면 모든 Kyverno 웹훅에 `"admissions.enforcer/disabled": true` 어노테이션을 설정한다. Helm으로 설치할 때는 `config.webhookAnnotations`로 어노테이션을 추가할 수 있다. Kyverno 1.12부터는 이 설정이 기본으로 켜져 있다.

## Kyverno 응답이 느림

**증상**: 리소스를 변경하거나 검증할 때 Kyverno가 느리게 동작해서 쿠버네티스 클러스터에서 리소스를 만드는 데 시간이 더 걸린다.

**해결**: Kyverno 로그에서 스로틀링 메시지를 확인한다. 메시지가 많다면 Kyverno가 너무 짧은 간격에 API를 지나치게 많이 호출해서 쿠버네티스 API 서버가 스로틀링하고 있다는 뜻이다. `--clientRateLimitQPS`와 `--clientRateLimitBurst` [플래그](/docs/installation/customization#container-flags) 값을 늘리거나 설정한다. 이 플래그의 기본값은 현장 검증을 거친 합리적인 값이지만, 경우에 따라 늘려야 할 수 있다.

## 정책이 일부만 적용됨

**증상**: 일부 정책은 동작하는데 다른 정책은 동작하지 않는다. 무슨 일이 일어나는지 어떻게 볼 수 있을까?

**해결**: 먼저 Kyverno 파드 로그에서 정책이나 규칙이 동작하지 않는 이유가 나와 있는지 확인한다.

1. Kyverno 파드 로그를 확인한다. Kyverno를 기본 네임스페이스 `kyverno`에 설치했다면 `kubectl -n kyverno logs <kyverno_pod_name>` 명령으로 로그를 본다. 로그를 실시간으로 보려면 "follow" 옵션인 `-f` 스위치를 추가한다.

2. 기본 로그 수준에서 유용한 정보가 나오지 않으면 Kyverno 디플로이먼트를 수정해 로그 상세 레벨(verbosity)을 높인다. 기본 네임스페이스에 설치했다면 `kubectl -n kyverno edit deploy kyverno-<controller_type>-controller` 명령으로 디플로이먼트를 수정한다. `kyverno` 컨테이너의 `args` 섹션에서 `-v` 스위치를 추가하거나 값을 더 높인다. `-v=6`이 가장 높은 로그 수준이다. 문제 해결이 끝나면 이 변경을 반드시 되돌린다.

## Kyverno가 종료됨

**증상**: 오브젝트와 Kyverno 정책이 많은 대규모 클러스터에서 Kyverno가 가끔 크래시한다.

**해결**: 매우 큰 규모에서는 오브젝트를 추적할 수 있도록 Kyverno 파드의 메모리 한도(limit)를 늘려야 할 수 있다.

1. 먼저 [위의 문제 해결 섹션](#kyverno가-리소스를-많이-쓰거나-oomkill이-발생함)을 참고한다. 변경이 필요하면 해당 Kyverno 디플로이먼트를 수정해 컨테이너의 메모리 한도를 늘린다. `resources.limits.memory` 필드를 더 큰 값으로 바꾼다. [쿠버네티스 metrics-server](https://github.com/kubernetes-sigs/metrics-server#installation) 같은 도구로 메모리 사용량을 계속 모니터링한다.

## GKE에서 Kyverno가 실패함

**증상**: GKE를 쓰는데 Kyverno를 설치한 뒤 클러스터가 고장 나거나 타임아웃 등의 문제가 생긴다.

**해결**: 프라이빗 GKE 클러스터는 컨트롤 플레인에서 워커로 가는 일부 통신을 허용하지 않는데, Kyverno가 API 서버로부터 웹훅을 받으려면 이 통신이 필요하다. 이 문제를 해결하려면 컨트롤 플레인이 워커의 Kyverno TCP 포트(현재 기본값은 9443)와 통신할 수 있도록 방화벽 규칙을 만든다. 자세한 내용은 [GKE 문서](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters#add_firewall_rules)를 참고한다.

## EKS에서 Kyverno가 실패함

**증상**: EKS를 쓰는데 Kyverno 정책이 차단해야 할 리소스가 차단되지 않는다. 클러스터는 VPC CNI를 쓰지 않는다.

**해결**: EKS에서 사용자 지정 CNI 플러그인(예: 캘리코(Calico))을 쓰면, 사용자 지정 CNI를 쓸 수 없는 컨트롤 플레인 노드와 쓸 수 있는 워커 노드의 구성이 달라서 API 서버가 Kyverno 웹훅에 도달하지 못한다. 이를 해결하려면 Helm으로 Kyverno를 설치할 때 `hostNetwork` 옵션을 `true`로 설정한다. [이 참고 사항](https://cert-manager.io/docs/installation/compatibility/#aws-eks)도 확인한다. AWS가 호환되는 다른 CNI 플러그인을 정리한 목록은 [여기](https://docs.aws.amazon.com/eks/latest/userguide/alternate-cni-plugins.html)에 있다.

**증상**: 파드나 다른 리소스를 만들 때 `Error from server (InternalError): Internal error occurred: failed calling webhook "validate.kyverno.svc-fail": Post "https://kyverno-svc.kyverno.svc:443/validate?timeout=10s": context deadline exceeded` 같은 오류가 난다.

**해결**: EKS에서 VPC CNI를 쓸 때 CNI 플러그인이 오래된 버전이면 문제가 생길 수 있다. VPC CNI 플러그인을 EKS 클러스터의 쿠버네티스 버전에서 지원하고 호환되는 버전으로 업그레이드한다.

EKS 클러스터가 자체 보안 그룹을 쓴다면 컨트롤 플레인에서 워커 노드로 가는 네트워크 트래픽 일부가 차단될 수 있다([문서](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) 참고). EKS 워커 노드에 연결된 보안 그룹에 EKS 클러스터 보안 그룹으로부터 오는 9443 포트 통신을 허용하는 인바운드 규칙을 만든다.

## 클라이언트 측 스로틀링

**증상**: Kyverno 파드가 `Waited for <n>s due to client-side throttling` 로그를 남기고, 변경된 리소스의 생성이 지연될 수 있다.

**해결**: `clientRateLimitBurst`와 `clientRateLimitQPS`([여기](/docs/installation/customization#container-flags) 참고) 값을 늘려 본다. 그래도 해결되지 않으면 값을 조금씩 늘려 가며 실험할 수 있다. 다만 값이 높을수록 쿠버네티스 API에 부담이 커진다(클라이언트 측 스로틀링은 이유가 있어서 도입되었다). 클러스터 전체의 지연으로 이어질 수 있으니 신중하게 진행한다.

## 정책 정의가 동작하지 않음

**증상**: 정책을 작성한 방식대로라면 동작해야 할 것 같은데 동작하지 않는다.

**해결**: 다른 정책은 정상 동작한다고 가정할 때, 정책이 의도대로 동작하지 않는 원인은 여러 가지이다. 가장 흔한 원인은 API 서버가 정책에서 예상한 것과 다른 내용을 보내는 경우이다. 쿠버네티스 API 서버가 Kyverno로 보내는 AdmissionReview 요청의 전체 내용을 보려면 `dumpPayload` [컨테이너 플래그](/docs/installation/customization#container-flags)를 `true`로 설정하고 로그를 확인한다. 성능에 영향이 있으므로 확인이 끝나면 제거하거나 `false`로 되돌려야 한다.

두 번째로 흔한 원인은 변수이다. Kyverno가 변수에 대입하는 값을 보려면 컨테이너 플래그 `-v=4`로 로그 수준을 `4`로 높인다. 문자열 `variable`을 `grep`하거나 [stern](https://github.com/stern/stern) 같은 도구를 쓰면 변수에 대입되는 값만 볼 수 있다.

## 어드미션 리포트가 쌓임

**증상**: 어드미션 리포트가 클러스터에 계속 쌓여 etcd 공간을 점점 더 차지하고 요청이 느려진다.

**진단**: 이 문제의 영향을 받는지 확인하려면 [문제 해결 문서](https://github.com/kyverno/kyverno/blob/main/docs/dev/troubleshooting/reports.md)를 따른다.

**해결**: 리포트 컨트롤러가 제대로 동작하지 않으면 어드미션 리포트가 쌓일 수 있으므로, 먼저 리포트 컨트롤러가 실행 중이고 계속 재시작하지 않는지 확인한다. 컨트롤러가 정상 동작한다면, 어드미션 리포트를 충분히 빠르게 집계하지 못하는 것이 또 다른 원인일 수 있다. 보통 컨트롤러가 스로틀링될 때 이렇게 된다. 컨트롤러에 `--clientRateLimitQPS=500`과 `--clientRateLimitBurst=500`을 설정해 QPS와 버스트 값을 늘리면 해결된다.
Kyverno 1.10부터는 어드미션 리포트가 일정 임계값을 넘게 쌓이면 두 개의 크론잡(CronJob)이 자동으로 삭제한다.

## 정책을 만들 때 Kyverno가 권한이 없다고 함

**증상**: 기존 리소스를 업데이트하는 [MutatingPolicy](/docs/policy-types/mutating-policy)나 [GeneratingPolicy](/docs/policy-types/generating-policy)를 만들 때, 백그라운드 컨트롤러에 대상 리소스에 접근할 권한이 없어 실패한다.

**진단**: `kubectl`로 Kyverno 백그라운드 컨트롤러에 필요한 권한이 있는지 확인한다. `kubectl auth can-i create helmrepositories --as system:serviceaccount:kyverno:kyverno-background-controller` 명령의 응답이 "no"라면 Kyverno도 같은 응답을 받는다.

**해결**: 백그라운드 컨트롤러는 기존 리소스에 대한 모든 변경과 생성을 처리한다. 이 컨트롤러에는 최소한의 권한만 기본으로 부여되어 있고, 추가 권한은 사용자가 직접 추가해야 한다. Kyverno는 백그라운드 컨트롤러가 처리하는 정책을 생성·업데이트할 때 권한을 검사하고, 필요한 권한이 없으면 작업을 막는다. 좋은 사용자 경험을 유지하기 위해서이다. 필요한 권한을 쉽게 추가하는 방법은 [권한 사용자 지정](/docs/installation/customization#customizing-permissions) 페이지를 참고한다. 그렇게 했는데도 진행할 수 없다면, 원인은 대개 잘못된 컨트롤러를 대상으로 했거나, 레이블이 하나 이상 틀려서 집계(aggregation)가 일어나지 않았거나, 롤(Role)이나 클러스터롤(ClusterRole)에 정의한 권한이 잘못된 경우(예: 리소스 이름을 복수형이 아닌 단수형으로 지정)이다. 문제를 고치고 `kubectl auth` 명령을 다시 실행한다. "yes"가 반환될 때까지는 권한이 올바르지 않은 것이다.
