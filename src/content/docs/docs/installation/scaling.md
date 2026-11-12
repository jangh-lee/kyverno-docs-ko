---
title: Kyverno 확장
excerpt: Kyverno 설치를 확장할 때 고려할 사항입니다.
sidebar:
  order: 45
---

## Kyverno 확장

Kyverno는 수직과 수평, 여러 차원의 확장을 지원합니다. 언제 확장하고 어떻게 확장하며 확장이 동작에 어떤 영향을 미치는지 이해하는 것이 중요합니다. 아래 절에서 이 주제를 자세히 설명합니다.

Kyverno는 기능이 많은 어드미션 컨트롤러이고 Kubernetes 클러스터의 환경 유형, 규모, 구성이 저마다 다르므로, Kyverno가 수행하는 처리량도 크게 달라질 수 있습니다. 노드 수나 Pod 수만으로 Kyverno 설치의 크기를 정하면 필요한 리소스를 정확하게 예측하기 어려운 경우가 많습니다.

예를 들어 Pod가 60,000개인 대규모 프로덕션 클러스터라도 `Pod`에 일치하는 Kyverno 정책이 없다면 Kyverno에 필요한 리소스와는 관계가 없습니다. Kyverno는 클러스터에 설치된 정책에 따라 웹훅을 동적으로 관리하므로, `Pod`에 일치하는 정책이 없으면 API 서버가 Pod 정보를 Kyverno에 보내지 않고 처리 부하도 줄어듭니다.

반면 와일드카드(`"*"`)에 일치하는 정책이 하나라도 있으면 Kyverno는 클러스터에 있는 _모든_ 리소스의 _모든_ 작업(CREATE, UPDATE, DELETE, CONNECT)을 처리해야 합니다. 정책 로직 자체가 단순하더라도, 이렇게 작성한 단순한 정책 하나만 대규모 클러스터에 설치해도 Kyverno에 필요한 리소스에 상당한 영향을 줄 수 있고 실제로 줍니다.

### 수직 확장

수직 확장은 기존 Pod에 할당한 리소스, 즉 리소스 요청과 제한을 늘리는 것을 말합니다.

실제 사용량을 파악해 리소스 요청과 제한을 가장 알맞게 설정하도록 사용자의 환경에서 직접 테스트하길 권장합니다. 모범 사례로 CPU 제한은 설정하지 않기를 권장합니다.

### 수평 확장

수평 확장은 특정 컨트롤러의 레플리카 수를 늘리는 것을 말합니다. Kyverno는 모든 컨트롤러에서 레플리카를 여러 개 두는 것을 지원하지만, 레플리카가 여러 개일 때의 효과는 컨트롤러마다 다르게 처리됩니다. 자세한 내용은 [고가용성 절](/docs/guides/high-availability#kyverno의-고가용성-동작-방식)을 참고하세요.

<a id="scale-testing"></a>

### 확장 테스트

#### 어드미션 컨트롤러

Kyverno 어드미션 컨트롤러 벤치마크는 [k6](https://k6.io/open-source/)와 [xk6-kubernetes](https://github.com/grafana/xk6-kubernetes) 확장으로 측정합니다. k6의 shared-iterations 실행기는 고정된 수의 Pod CREATE 요청을 동시 가상 사용자(VU) 풀에 분배합니다. 모든 지연 시간 값은 k6 클라이언트에서 측정한 종단 간 반복 소요 시간(API 서버와 웹훅 왕복 포함)입니다. 파드 스케줄링 오버헤드가 어드미션 지연 시간 수치를 부풀리지 않도록 [KWOK](https://kwok.sigs.k8s.io/) 가상 노드를 사용합니다.

##### CEL 기반 정책 (v1.18.1, `policies.kyverno.io/v1`)

Akamai Dedicated `g6-dedicated-32`(32 vCPU / 64 GB RAM), KinD 워커 3개 클러스터, KWOK 가상 노드, Kyverno v1.18.1(Helm 차트 3.8.1) 환경에서 테스트했습니다. 부하는 별도의 `g6-dedicated-16` 인스턴스에서 생성했습니다. 지연 시간은 avg / p95 / p99로 보고합니다. 이번 실행에서는 메모리와 CPU 메트릭을 수집하지 않았습니다. 런타임 모니터링에는 `kyverno_admission_review_duration_seconds` Prometheus 메트릭을 사용하세요.

`vpol-pss` 시나리오는 Pod Security Standards restricted 프로파일을 반영한 `ValidatingPolicy` 리소스 16개를 설치합니다. `combined` 시나리오는 `ValidatingPolicy` 하나와 `MutatingPolicy` 하나를 동시에 활성화해, 어드미션 요청마다 두 웹훅 경로를 모두 거치게 합니다.

| 레플리카 | 정책 수 | 정책 유형        | 시나리오     | 대상 | VU / 반복 횟수 | avg   | p95   | p99       | 실패율 |
| -------- | ------- | ---------------- | ------------ | ---- | -------------- | ----- | ----- | --------- | ------ |
| 1        | 16         | ValidatingPolicy | vpol-pss     | Pods | 50 / 5,000       | 57ms  | 103ms | 182ms     | 0%    |
| 1        | 16         | ValidatingPolicy | vpol-pss     | Pods | 200 / 10,000     | 156ms | 316ms | 487ms     | 0%    |
| 1        | 16         | ValidatingPolicy | vpol-pss     | Pods | 500 / 10,000     | 366ms | 866ms | 1,247ms ⚠ | 0%    |
| 3        | 16         | ValidatingPolicy | vpol-pss     | Pods | 50 / 5,000       | 57ms  | 95ms  | 106ms     | 0%    |
| 3        | 16         | ValidatingPolicy | vpol-pss     | Pods | 200 / 10,000     | 145ms | 237ms | 284ms     | 0%    |
| 3        | 16         | ValidatingPolicy | vpol-pss     | Pods | 500 / 10,000     | 321ms | 536ms | 649ms     | 0%    |
| 1        | 1          | MutatingPolicy   | mpol-complex | Pods | 200 / 10,000     | 152ms | 221ms | 240ms     | 0%    |
| 1        | 1          | MutatingPolicy   | mpol-complex | Pods | 500 / 10,000     | 252ms | 378ms | 427ms     | 0%    |
| 3        | 1          | MutatingPolicy   | mpol-complex | Pods | 200 / 10,000     | 152ms | 220ms | 244ms     | 0%    |
| 3        | 1          | MutatingPolicy   | mpol-complex | Pods | 500 / 10,000     | 256ms | 386ms | 460ms     | 0%    |
| 1        | 2          | combined         | vpol + mpol  | Pods | 200 / 10,000     | 155ms | 295ms | 454ms     | 0%    |
| 1        | 2          | combined         | vpol + mpol  | Pods | 500 / 10,000     | 384ms | 777ms | 1,113ms ⚠ | 0%    |
| 3        | 2          | combined         | vpol + mpol  | Pods | 200 / 10,000     | 149ms | 241ms | 289ms     | 0%    |
| 3        | 2          | combined         | vpol + mpol  | Pods | 500 / 10,000     | 310ms | 491ms | 567ms     | 0%    |

⚠ 단일 레플리카에서 극단적인 부하(동시 생성 500건)일 때 p99가 1초를 넘었습니다. `KyvernoAdmissionHighLatency` PrometheusRule 알림은 p99가 1초를 넘는 상태가 5분간 지속되면 발생합니다. 레플리카가 3개이면 500 VU에서도 모든 시나리오의 p99가 650ms 미만입니다. simple/moderate 복잡도 변형과 VU 수준별 세부 결과를 포함한 전체 결과는 [docs/perf-testing/v1.18.1/results/summary.md](https://github.com/kyverno/kyverno/blob/main/docs/perf-testing/v1.18.1/results/summary.md)에 있습니다.

#### 리포트 컨트롤러

다음 표는 워크로드가 늘어날 때의 리소스 소비량(메모리와 CPU)과 etcd 내 객체 크기를 보여 줍니다. 테스트에서는 Kubernetes Pod Security Standards를 감사하는 Kyverno 정책 16개를 설치했습니다. 이어서 워크로드를 만들어 KWOK 가상 노드에 스케줄링하고 etcd에 저장된 정책 리포트의 전체 크기를 측정했습니다. [KWOK](https://kwok.sigs.k8s.io/)는 수천 개의 노드로 구성된 클러스터를 몇 초 만에 구성하는 툴킷입니다. 이 테스트에 관한 자세한 내용은 [리포트 컨트롤러](https://github.com/kyverno/kyverno/tree/main/docs/perf-testing) 테스트 문서를 참고하세요.

| 정책 리포트 수 | etcd 전체 크기 | CPU (최대) | 메모리 (최대) |
| -------------- | -------------- | ---------- | ------------- |
| 1284           | 373 MB         | 3709m      | 99Mi          |
| 2524           | 381 MB         | 3729m      | 102Mi         |
| 3572           | 390 MB         | 3721m      | 110Mi         |
| 4879           | 398 MB         | 3981m      | 118Mi         |
| 6099           | 418 MB         | 4014m      | 124Mi         |
| 7319           | 431 MB         | 4034m      | 136Mi         |
| 10254          | 483 MB         | 4273m      | 152Mi         |

<a id="admissionreview-reference"></a>

#### AdmissionReview 참조

Kyverno 규칙에 일치하는 API 요청, 작업, 활동이 있으면 Kyverno 같은 어드미션 컨트롤러로 AdmissionReview 요청이 전송됩니다. 이 요청의 수와 빈도는 클러스터에서 일어나는 활동의 양과 유형에 따라 크게 달라질 수 있습니다. 아래 표는 일반적인 작업에서 최소 몇 건의 AdmissionReview 요청이 발생하는지 가늠하도록 제공합니다. 이 수치는 _최소_ 건수일 뿐이며, 실제 건수는 거의 확실히 이보다 많고 파이널라이저나 클러스터의 다른 컨트롤러 같은 요인에 따라 달라집니다.

| 작업   |  리소스    |                 구성                   |         AR 수        |
| :----: | :--------: | :------------------------------------: | :------------------: |
|  CREATE   |    Pod     |                                        |          1           |
|  DELETE   |    Pod     |                                        |          3           |
|  CREATE   | Deployment |               replicas=1               |          3           |
|  UPDATE   | Deployment |              Change image              |          8           |
|  DELETE   | Deployment |               replicas=1               |          7           |
|  CREATE   | Deployment |               replicas=2               |          4           |
|  UPDATE   | Deployment |              Change image              |          13          |
|  DELETE   | Deployment |               replicas=2               |          10          |
|  CREATE   |    Job     |  restartPolicy=Never, backoffLimit=4   |          3           |
|  DELETE   |    Job     |                                        |          4           |
|  CREATE   |  CronJob   |       schedule="_/1 _ \* \* \*"        | 4 (3 per invocation) |
|  DELETE   |  CronJob   | schedule="_/1 _ \* \* \*", 2 completed |          9           |
|  CREATE   | ConfigMap  |                                        |          1           |
|   EDIT    | ConfigMap  |                                        |          1           |
|  DELETE   | ConfigMap  |                                        |          1           |

이 수치는 K3d v5.4.9, Kubernetes v1.26.2, Kyverno 1.10.0-alpha.2, 레플리카 3개의 어드미션 컨트롤러 환경에서 측정했습니다. KinD에서 테스트하면 Pod 관련 작업의 DELETE AdmissionReview가 하나 적을 수 있습니다.

### Kubernetes api-server와 etcd의 리소스 점유

Kyverno 정책 리소스가 많은 클러스터에서는 kube-apiserver와 etcd를 비롯한 일부 Kubernetes 핵심 구성 요소의 리소스 점유가 영향을 받을 수 있습니다.

예를 들어 Kyverno 정책 리소스를 수천 개 만든다면, kube-apiserver Pod의 메모리 할당을 늘릴 여유가 있는지 다시 확인하세요. 그렇지 않으면 클러스터 전체가 다운될 수 있습니다.
