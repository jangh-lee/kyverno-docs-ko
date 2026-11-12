---
title: 메트릭
excerpt: Kyverno가 노출하는 모든 메트릭의 전체 레퍼런스
sidebar:
  order: 1
---

이 문서는 Kyverno가 노출하는 모든 메트릭의 레퍼런스입니다. 필요한 정보를 빨리 찾을 수 있도록 메트릭을 범주별로 구분했습니다.

이 메트릭으로 모니터링을 설정하고 구성하는 방법은 [모니터링 가이드](/docs/guides/monitoring)를 참고하세요.

---

## 정책 및 규칙 메트릭

### 검증 정책 실행 지연 시간

#### 메트릭 이름

- `kyverno_validating_policy_execution_duration_seconds_count`
- `kyverno_validating_policy_execution_duration_seconds_sum`
- `kyverno_validating_policy_execution_duration_seconds_bucket`

#### 메트릭 값

히스토그램 - 검증 정책 실행의 지연 시간을 초 단위로 나타내는 실수 값입니다.

히스토그램의 동작 방식은 [Prometheus 문서](https://prometheus.io/docs/practices/histograms/)를 참고하세요.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_background_mode | "true", "false" | 정책에 설정된 백그라운드 모드 |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| policy_validation_mode | "Audit", "Deny" | 정책에 구성된 `validationActions` |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "admission_request", "background_scan" | 정책이 어드미션 요청에 대응해 실행되는지, 주기적인 백그라운드 스캔으로 실행되는지 나타냅니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 최근 24시간 동안 Kyverno 정책 실행의 평균 지연 시간을 추적해 정책이 얼마나 효율적으로 실행되는지 파악하려는 경우
- 클러스터 관리자가 특정 클러스터 정책에서 지연 시간이 가장 긴 정책을 추적하려는 경우

#### 유용한 쿼리

- 검증 정책 실행의 평균 지연 시간 추적:<br>
  `avg(kyverno_validating_policy_execution_duration_seconds{})`

- deny 정책의 평균 실행 지연 시간 추적:<br>
  `avg(kyverno_validating_policy_execution_duration_seconds{policy_validation_mode="Deny"})`

---

<a id="validating-policy-results"></a>

### 검증 정책 결과

#### 메트릭 이름

- `kyverno_validating_policy_results_total`

#### 메트릭 값

카운터 - 검증 정책 실행과 관련된 결과 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_validation_mode | "Audit", "Deny" | 정책에 구성된 `validationActions` |
| policy_background_mode | "true", "false" | 정책에 설정된 백그라운드 모드 |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "admission_request", "background_scan" | 정책이 어드미션 요청에 대응해 실행되는지, 주기적인 백그라운드 스캔으로 실행되는지 나타냅니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 검증 정책에서 통과(pass) 또는 실패(fail) 결과가 나온 리소스 요청 수를 추적하려는 경우
- 클러스터 관리자가 같은 정책에 대해 어드미션 시점의 강제 결과와 백그라운드 스캔 결과를 비교하려는 경우

#### 유용한 쿼리

- 최근 24시간 동안 발생한 검증 정책 실패의 총 횟수를 정책별로 추적:<br>
  `sum(increase(kyverno_validating_policy_results_total{result="fail"}[24h])) by (policy_name)`

- 어드미션 요청으로 발생한 검증 정책 결과의 분당 비율 추적:<br>
  `rate(kyverno_validating_policy_results_total{execution_cause="admission_request"}[1m])*60`

---

### 변경 정책 실행 지연 시간

#### 메트릭 이름

- `kyverno_mutating_policy_execution_duration_seconds_count`
- `kyverno_mutating_policy_execution_duration_seconds_sum`
- `kyverno_mutating_policy_execution_duration_seconds_bucket`

#### 메트릭 값

히스토그램 - 변경 정책 실행의 지연 시간을 초 단위로 나타내는 실수 값입니다.

히스토그램의 동작 방식은 [Prometheus 문서](https://prometheus.io/docs/practices/histograms/)를 참고하세요.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_background_mode | "true", "false" | 정책에 설정된 백그라운드 모드 |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "admission_request", "background_scan" | 정책이 어드미션 요청에 대응해 실행되는지, 주기적인 백그라운드 스캔으로 실행되는지 나타냅니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 최근 24시간 동안 Kyverno 정책 실행의 평균 지연 시간을 추적해 정책이 얼마나 효율적으로 실행되는지 파악하려는 경우
- 클러스터 관리자가 특정 클러스터 정책에서 지연 시간이 가장 긴 정책을 추적하려는 경우

#### 유용한 쿼리

- 변경 정책 실행의 평균 지연 시간 추적:<br>
  `avg(kyverno_mutating_policy_execution_duration_seconds{})`

---

### 변경 정책 결과

#### 메트릭 이름

- `kyverno_mutating_policy_results_total`

#### 메트릭 값

카운터 - 변경 정책 실행과 관련된 결과 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_background_mode | "true", "false" | 정책에 설정된 백그라운드 모드 |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "admission_request", "background_scan" | 정책이 어드미션 요청에 대응해 실행되는지, 주기적인 백그라운드 스캔으로 실행되는지 나타냅니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 변경 정책에서 통과(pass) 또는 실패(fail) 결과가 나온 리소스 요청 수를 추적하려는 경우
- 클러스터 관리자가 특정 변경 정책이 실제로 변경한 리소스와 건너뛴 리소스가 각각 몇 개인지 알고 싶은 경우

#### 유용한 쿼리

- 최근 24시간 동안 발생한 변경 정책 실패의 총 횟수를 정책별로 추적:<br>
  `sum(increase(kyverno_mutating_policy_results_total{result="fail"}[24h])) by (policy_name)`

- 어드미션 요청으로 발생한 변경 정책 결과의 분당 비율 추적:<br>
  `rate(kyverno_mutating_policy_results_total{execution_cause="admission_request"}[1m])*60`

---

### 생성 정책 실행 지연 시간

#### 메트릭 이름

- `kyverno_generating_policy_execution_duration_seconds_count`
- `kyverno_generating_policy_execution_duration_seconds_sum`
- `kyverno_generating_policy_execution_duration_seconds_bucket`

#### 메트릭 값

히스토그램 - 생성 정책 실행의 지연 시간을 초 단위로 나타내는 실수 값입니다.

히스토그램의 동작 방식은 [Prometheus 문서](https://prometheus.io/docs/practices/histograms/)를 참고하세요.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "background_scan" | 생성 정책은 UpdateRequest 리컨실리에이션으로만 비동기 처리되고 실시간 어드미션 응답 안에서는 처리되지 않으므로, 이 레이블은 현재 항상 `"background_scan"`으로 고정됩니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 최근 24시간 동안 Kyverno 정책 실행의 평균 지연 시간을 추적해 정책이 얼마나 효율적으로 실행되는지 파악하려는 경우
- 클러스터 관리자가 특정 클러스터 정책에서 지연 시간이 가장 긴 정책을 추적하려는 경우

#### 유용한 쿼리

- 생성 정책 실행의 평균 지연 시간 추적:<br>
  `avg(kyverno_generating_policy_execution_duration_seconds{})`

---

### 생성 정책 결과

#### 메트릭 이름

- `kyverno_generating_policy_results_total`

#### 메트릭 값

카운터 - 생성 정책 실행과 관련된 결과 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 트리거 리소스의 종류 |
| resource_namespace |  | 트리거 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 트리거한 리소스 요청이 생성, 수정, 삭제 중 무엇이었는지 나타냅니다. |
| execution_cause | "background_scan" | 생성 정책은 UpdateRequest 리컨실리에이션으로만 비동기 처리되고 실시간 어드미션 응답 안에서는 처리되지 않으므로, 이 레이블은 현재 항상 `"background_scan"`으로 고정됩니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 생성 정책에서 통과(pass) 또는 실패(fail) 결과가 나온 생성 건수를 추적하려는 경우
- 클러스터 관리자가 특정 생성 정책이 만든 다운스트림 리소스와 만들지 못한 다운스트림 리소스가 각각 몇 개인지 알고 싶은 경우

#### 유용한 쿼리

- 최근 24시간 동안 발생한 생성 정책 실패의 총 횟수를 정책별로 추적:<br>
  `sum(increase(kyverno_generating_policy_results_total{result="fail"}[24h])) by (policy_name)`

- 생성 정책 결과의 분당 비율 추적:<br>
  `rate(kyverno_generating_policy_results_total[1m])*60`

---

### 이미지 검증 정책 실행 지연 시간

#### 메트릭 이름

- `kyverno_image_validating_policy_execution_duration_seconds_count`
- `kyverno_image_validating_policy_execution_duration_seconds_sum`
- `kyverno_image_validating_policy_execution_duration_seconds_bucket`

#### 메트릭 값

히스토그램 - 이미지 검증 정책 실행의 지연 시간을 초 단위로 나타내는 실수 값입니다.

히스토그램의 동작 방식은 [Prometheus 문서](https://prometheus.io/docs/practices/histograms/)를 참고하세요.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_background_mode | "true", "false" | 정책에 설정된 백그라운드 모드 |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| policy_validation_mode | "Audit", "Deny" | 정책에 구성된 `validationActions` |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "admission_request", "background_scan" | 정책이 어드미션 요청에 대응해 실행되는지, 주기적인 백그라운드 스캔으로 실행되는지 나타냅니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 최근 24시간 동안 Kyverno 정책 실행의 평균 지연 시간을 추적해 정책이 얼마나 효율적으로 실행되는지 파악하려는 경우
- 클러스터 관리자가 특정 클러스터 정책에서 지연 시간이 가장 긴 정책을 추적하려는 경우

#### 유용한 쿼리

- 이미지 검증 정책 실행의 평균 지연 시간 추적:<br>
  `avg(kyverno_image_validating_policy_execution_duration_seconds{})`

- deny 정책의 평균 실행 지연 시간 추적:<br>
  `avg(kyverno_image_validating_policy_execution_duration_seconds{policy_validation_mode="Deny"})`

---

### 이미지 검증 정책 결과

#### 메트릭 이름

- `kyverno_image_validating_policy_results_total`

#### 메트릭 값

카운터 - 이미지 검증 정책 실행과 관련된 결과 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_background_mode | "true", "false" | 정책에 설정된 백그라운드 모드 |
| policy_name |  | 정책 이름 |
| policy_namespace |  | 이 정책이 속한 네임스페이스. 클러스터 범위 정책이면 이 필드는 비어 있습니다. |
| policy_validation_mode | "Audit", "Deny" | 정책에 구성된 `validationActions` |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |
| execution_cause | "admission_request", "background_scan" | 정책이 어드미션 요청에 대응해 실행되는지, 주기적인 백그라운드 스캔으로 실행되는지 나타냅니다. |
| result | "pass", "fail", "warning", "error", "skip" | 정책 실행 결과 |

#### 사용 사례

- 클러스터 관리자가 이미지 검증 정책에서 통과(pass) 또는 실패(fail) 결과가 나온 이미지 검증 건수를 추적하려는 경우
- 클러스터 관리자가 같은 정책에 대해 어드미션 시점의 이미지 검증 결과와 백그라운드 스캔 결과를 비교하려는 경우

#### 유용한 쿼리

- 최근 24시간 동안 발생한 이미지 검증 정책 실패의 총 횟수를 정책별로 추적:<br>
  `sum(increase(kyverno_image_validating_policy_results_total{result="fail"}[24h])) by (policy_name)`

- 어드미션 요청으로 발생한 이미지 검증 정책 결과의 분당 비율 추적:<br>
  `rate(kyverno_image_validating_policy_results_total{execution_cause="admission_request"}[1m])*60`

## 어드미션 메트릭

<a id="admission-requests-count"></a>

### 어드미션 요청 수

#### 메트릭 이름

- `kyverno_admission_requests_total`

#### 메트릭 값

카운터 - 샘플과 관련된 어드미션 요청 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| request_allowed | "true", "false" | 어드미션 리뷰가 수락되었는지 거부되었는지 나타냅니다. |
| request_webhook | "ValidatingWebhookConfiguration", "MutatingWebhookConfiguration" | 어드미션 리뷰를 처리하는 웹훅의 유형 |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |

#### 사용 사례

- 클러스터 관리자가 최근 24시간 동안 발생한 어드미션 요청 수를 확인해 Kyverno가 얼마나 활발하게 동작했는지 알고 싶은 경우
- 클러스터 관리자가 Kyverno로 들어오는 전체 어드미션 요청 중 리소스 생성 요청이 차지하는 비율을 알고 싶은 경우

#### 유용한 쿼리

- 최근 24시간 동안 발생한 전체 어드미션 요청 수:<br>
  `sum(increase(kyverno_admission_requests_total{}[24h]))`

- 전체 어드미션 요청 중 리소스 생성에 해당하는 요청의 비율:<br>
  `sum(kyverno_admission_requests_total{resource_request_operation="create"})/sum(kyverno_admission_requests_total{})`

---

### 어드미션 리뷰 지연 시간

#### 메트릭 이름

- `kyverno_admission_review_duration_seconds_count`
- `kyverno_admission_review_duration_seconds_sum`
- `kyverno_admission_review_duration_seconds_bucket`

#### 메트릭 값

히스토그램 - 어드미션 리뷰의 지연 시간을 초 단위로 나타내는 실수 값입니다.

히스토그램의 동작 방식은 [Prometheus 문서](https://prometheus.io/docs/practices/histograms/)를 참고하세요.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| request_allowed | "true", "false" | 어드미션 리뷰가 수락되었는지 거부되었는지 나타냅니다. |
| request_webhook | "ValidatingWebhookConfiguration", "MutatingWebhookConfiguration" | 어드미션 리뷰를 처리하는 웹훅의 유형 |
| resource_kind | "Pod", "Deployment", "StatefulSet", "ReplicaSet", etc. | 이 리소스의 종류 |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |
| resource_request_operation | "create", "update", "delete" | 요청된 리소스가 생성, 수정, 삭제 중 무엇인지 나타냅니다. |

#### 사용 사례

- 클러스터 관리자가 default 네임스페이스에서 "Deployment" 생성과 관련해 들어온 요청의 어드미션 리뷰가 얼마나 빠르게 또는 느리게 처리되었는지 알고 싶은 경우
- 클러스터 관리자가 들어오는 "Pod" 생성 요청과 관련된 어드미션 리뷰의 p95 지연 시간이 특정 임계값을 넘는 즉시 알림을 받으려는 경우

#### 유용한 쿼리

- 들어온 리소스 요청으로 발생한 어드미션 리뷰의 평균 지연 시간(리소스별):<br>
  `avg(kyverno_admission_review_duration_seconds{}) by (resource_type)`

- 최근 24시간 동안 들어온 파드 요청으로 발생한 어드미션 리뷰의 최대 지연 시간:<br>
  `max(kyverno_admission_review_duration_seconds{resource_type="Pod"}[24h])`

- 최근 60분 동안 지연 시간이 가장 길었던 어드미션 요청 조회:<br>
  `max(kyverno_admission_review_duration_seconds{}[60m])`

## HTTP 메트릭

### HTTP 요청 수

#### 메트릭 이름

- `kyverno_http_requests_total`

#### 메트릭 값

카운터 - 샘플과 관련된 HTTP 요청 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| http_method | `GET`, `POST`, etc. | HTTP 메서드 |
| http_url |  | 요청 URL |

#### 사용 사례

- 클러스터 관리자가 최근 24시간 동안 발생한 HTTP 요청 수를 확인해 Kyverno가 얼마나 활발하게 동작했는지 알고 싶은 경우
- 클러스터 관리자가 Kyverno로 들어오는 전체 HTTP 요청 중 특정 HTTP 메서드나 URL에 해당하는 요청의 비율을 알고 싶은 경우

#### 유용한 쿼리

- 최근 24시간 동안 발생한 전체 어드미션 요청 수:<br>
  `sum(increase(kyverno_http_requests_total{}[24h]))`

- 전체 어드미션 요청 중 리소스 생성에 해당하는 요청의 비율:<br>
  `sum(kyverno_http_requests_total{http_method="POST"})/sum(kyverno_http_requests_total{})`

---

### HTTP 요청 지연 시간

#### 메트릭 이름

- `kyverno_http_requests_duration_seconds_count`
- `kyverno_http_requests_duration_seconds_sum`
- `kyverno_http_requests_duration_seconds_bucket`

#### 메트릭 값

히스토그램 - HTTP 요청 처리의 지연 시간을 초 단위로 나타내는 실수 값입니다.

히스토그램의 동작 방식은 [Prometheus 문서](https://prometheus.io/docs/practices/histograms/)를 참고하세요.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| http_method | `GET`, `POST`, etc. | HTTP 메서드 |
| http_url |  | 요청 URL |

#### 사용 사례

- 클러스터 관리자가 특정 HTTP 메서드의 요청이 얼마나 빠르게 또는 느리게 처리되는지 알고 싶은 경우

#### 유용한 쿼리

- HTTP URL 및 메서드별 평균 HTTP 요청 지연 시간:<br>
  `avg by (http_url, http_method) (kyverno_http_requests_duration_seconds_sum / kyverno_http_requests_duration_seconds_count)`

---

## 컨트롤러 메트릭

### 컨트롤러 리컨실리에이션 수

#### 메트릭 이름

- `kyverno_controller_reconcile_total`

#### 메트릭 값

카운터 - 수행된 리컨실리에이션 횟수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| controller_name |  | 컨트롤러 이름 |

#### 사용 사례

- 비정상 동작 문제 해결

#### 유용한 쿼리

- 최근 1시간 동안 컨트롤러별 리컨실리에이션 횟수:<br>
  `changes (kyverno_controller_reconcile_total[1h])`

---

### 컨트롤러 재큐 수

#### 메트릭 이름

- `kyverno_controller_requeue_total`

#### 메트릭 값

카운터 - 다시 큐에 들어간 항목 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| controller_name |  | 컨트롤러 이름 |
| num_requeues |  | 같은 항목이 연속으로 다시 큐에 들어간 횟수 |

#### 사용 사례

- 리컨실리에이션에서 발생하는 비정상 충돌 문제 해결

#### 유용한 쿼리

- 최근 1시간 동안 컨트롤러별 재큐 횟수:<br>
  `changes (kyverno_controller_requeue_total[1h])`

---

### 컨트롤러 드롭 수

#### 메트릭 이름

- `kyverno_controller_drop_total`

#### 메트릭 값

카운터 - 드롭된 항목 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| controller_name |  | 컨트롤러 이름 |

#### 사용 사례

- 최근 1시간 동안 항목이 드롭되었는지 확인

#### 유용한 쿼리

- 컨트롤러별 초당 드롭 수:<br>
  `sum by (controller_name) (rate(kyverno_controller_drop_total{}[1h]))`

---

## 정리 메트릭

### 정리 TTL 컨트롤러 삭제 오브젝트 수

#### 메트릭 이름

- `kyverno_ttl_controller_deletedobjects`

#### 메트릭 값

카운터 - 정리 TTL 컨트롤러가 삭제한 오브젝트 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| resource_group | "apps", "rbac.authorization.k8s.io", "networking.k8s.io", etc. | 이 리소스의 그룹 |
| resource_version | "v1", "v1beta1", "v1alpha1", etc. | 이 리소스의 버전 |
| resource_resource | "pods", "deployments", "statefulSets", "replicaSets", etc. | 이 리소스의 resource |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |

#### 사용 사례

- 정리 TTL 컨트롤러가 시간에 따라 삭제한 리소스 수 모니터링

---

### 정리 TTL 컨트롤러 오류 수

#### 메트릭 이름

- `kyverno_ttl_controller_errors`

#### 메트릭 값

카운터 - 정리 TTL 컨트롤러가 오브젝트를 삭제하려다 만난 오류 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| resource_group | "apps", "rbac.authorization.k8s.io", "networking.k8s.io", etc. | 이 리소스의 그룹 |
| resource_version | "v1", "v1beta1", "v1alpha1", etc. | 이 리소스의 버전 |
| resource_resource | "pods", "deployments", "statefulSets", "replicaSets", etc. | 이 리소스의 resource |
| resource_namespace |  | 이 리소스가 속한 네임스페이스 |

#### 사용 사례

- 정리 TTL 컨트롤러가 삭제를 수행하다 실패한 횟수 모니터링

---

### 삭제 컨트롤러 삭제 오브젝트 수

#### 메트릭 이름

- `kyverno_deleting_controller_deletedobjects_total`

#### 메트릭 값

카운터 - 삭제 정책이 삭제한 오브젝트 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_type |  | `DeletingPolicy` 또는 `NamespacedDeletingPolicy` |
| policy_namespace |  | 정책의 네임스페이스(클러스터 범위 `DeletingPolicy`이면 비어 있음) |
| policy_name |  | 정책 이름 |
| resource | "pods", "deployments", "statefulsets", "replicasets", etc. | 삭제된 오브젝트의 resource |

#### 사용 사례

- 시간에 따라 삭제된 리소스 수 모니터링

#### 유용한 쿼리

- 최근 1시간 동안 리소스별 삭제 오브젝트 수:<br>
  `sum by (resource) (increase(kyverno_deleting_controller_deletedobjects_total[1h]))`

- 최근 24시간 동안 정책별 삭제 오브젝트 수:<br>
  `sum by (policy_namespace, policy_name) (increase(kyverno_deleting_controller_deletedobjects_total[24h]))`

- 최근 15분 동안 네임스페이스 및 리소스별(네임스페이스 범위 오브젝트) 삭제 오브젝트 수:<br>
  `sum by (resource_namespace, resource) (increase(kyverno_deleting_controller_deletedobjects_total[15m]))`

---

### 삭제 컨트롤러 오류 수

#### 메트릭 이름

- `kyverno_deleting_controller_errors_total`

#### 메트릭 값

카운터 - 삭제 정책이 오브젝트를 삭제하려다 만난 오류 수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| policy_type |  | `DeletingPolicy` 또는 `NamespacedDeletingPolicy` |
| policy_namespace |  | 정책의 네임스페이스(클러스터 범위 `DeletingPolicy`이면 비어 있음) |
| policy_name |  | 정책 이름 |
| resource | "pods", "deployments", "statefulsets", "replicasets", etc. | 삭제된 오브젝트의 resource |

#### 사용 사례

- 삭제 정책별 오류 수 모니터링
- 특정 리소스나 네임스페이스에서 삭제 작업이 실패하기 시작하면 알림

#### 유용한 쿼리

- 삭제 정책별 초당 오류 수:<br>
  `sum by (policy_name, policy_namespace) (rate(kyverno_deleting_controller_errors_total{}[5m]))`

---

## 기타 메트릭

### 클라이언트 쿼리

#### 메트릭 이름

- `kyverno_client_queries_total`

#### 메트릭 값

카운터 - 메트릭 샘플과 관련된 정책 수준 변경의 총 횟수를 나타내는, 증가만 하는 정수입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| client_type | dynamic, kubeclient, kyverno, policyreport | 클라이언트 유형 |
| operation | create, get, list, update, update_status, delete, delete_collection, watch, patch | 수행된 작업 |
| resource_kind |  | 리소스 종류 |
| resource_namespace |  | 리소스 네임스페이스 |

#### 사용 사례

- 클러스터 관리자가 Kyverno가 Kubernetes API 서버에 초당 몇 건의 쿼리를 보내는지 추적하려는 경우

#### 유용한 쿼리

- `kyverno_client_queries_total`
- `rate(kyverno_client_queries_total{client_type="dynamic"}[5m])`
- `increase(kyverno_client_queries_total{client_type="dynamic"}[5m])`

---

### Kyverno 정보

#### 메트릭 이름

- `kyverno_info`

#### 메트릭 값

게이지 - 관련 정보를 담은 레이블이 붙은 상수 1입니다.

#### 메트릭 레이블

| 레이블 | 허용 값 | 설명 |
| --- | --- | --- |
| version |  | 사용 중인 Kyverno의 현재 버전 |

#### 사용 사례

- 클러스터 관리자가 버전 등 Kyverno 관련 정보를 확인하려는 경우

#### 유용한 쿼리

- `kyverno_info`
