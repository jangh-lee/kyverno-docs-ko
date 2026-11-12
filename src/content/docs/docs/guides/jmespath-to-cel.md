---
title: JMESPath에서 CEL로
excerpt: Kyverno의 CEL 기반 정책 엔진으로 JMESPath 필터 로직을 표현합니다.
sidebar:
  order: 131
---

이 페이지는 [JMESPath 가이드](https://release-1-18-0.kyverno.io/docs/policy-types/cluster-policy/jmespath)의 JMESPath 사용자 정의 필터를 Kyverno의 CEL 기반 정책 엔진(`ValidatingPolicy`, `MutatingPolicy`)의 대응 표현과 하나씩 짝지어 보여 줍니다. `ClusterPolicy` 규칙을 새로운 CEL 기반 정책 유형으로 마이그레이션할 때 참고 자료로 사용하세요.

Kyverno에서 쓸 수 있는 CEL 라이브러리의 배경은 [CEL 라이브러리](/docs/policy-types/cel-libraries)를 참고하세요.

:::note[지원하지 않거나 부분적으로만 지원하는 필터]
다음 JMESPath 필터는 아직 CEL 엔진에서 완전히 지원하지 않습니다.

- **`multiply()` / `divide()`** — Kubernetes 수량(quantity)을 인식하는 곱셈과 나눗셈은 아직 CEL에서 사용할 수 없습니다. 업스트림 Kubernetes 기여로 지원을 개발하고 있습니다.
- **`sum()`** — 수량 배열의 합계를 구하는 직접적인 CEL 대응 표현이 없습니다. Kubernetes CEL 수량 타입은 두 값을 더하는 `add()`를 지원하지만, 배열을 줄여 하나로 합치는(array-reduce) 대응 기능은 없습니다.
- **`compare()`** — 문자열을 사전식으로 비교하는 이 필터는 CEL 엔진으로 이어지지 않았습니다.
- **`regex_replace_all()` / `regex_replace_all_literal()`** — CEL 문자열 확장은 정규식 매칭(`matches()`, `find()`, `findAll()`)을 지원하지만 정규식 기반 치환은 지원하지 않습니다. 업스트림 Kubernetes 기여로 지원을 개발하고 있습니다.
  :::

## 빠른 참조

| JMESPath 필터                 | CEL 대응 표현                                                      |
| ----------------------------- | ------------------------------------------------------------------ |
| `add()`                       | `quantity(q).add(quantity(q2))` / `quantity(q).add(int)`           |
| `base64_decode()`             | `base64.decode(str)`                                               |
| `base64_encode()`             | `base64.encode(str)`                                               |
| `divide()`                    | 아직 지원하지 않음 (업스트림 기여 진행 중)              |
| `equal_fold()`                | `a.lowerAscii() == b.lowerAscii()`                                 |
| `image_normalize()`           | `image(str).registry()`, `.tag()`, `.repository()`                 |
| `items()`                     | `myMap.map(k, {"key": k, "value": myMap[k]})`                      |
| `label_match()`               | `map1 == map2`                                                     |
| `lookup()`                    | `map["key"]` / `array[index]`                                      |
| `md5()`                       | `md5(str)` (Hash 라이브러리)                                          |
| `modulo()`                    | `a % b`                                                            |
| `multiply()`                  | 아직 지원하지 않음 (업스트림 기여 진행 중)              |
| `object_from_lists()`         | `listObjToMap(...)` (Transform 라이브러리)                            |
| `parse_json()`                | `json.unmarshal(str)` (JSON 라이브러리)                               |
| `parse_yaml()`                | `yaml.parse(str)` (YAML 라이브러리)                                   |
| `path_canonicalize()`         | `'/' + str.split('/').filter(s, s != '').join('/')`                |
| `pattern_match()`             | 대신 `regex_match` / `str.matches(regex)` 사용                   |
| `random()`                    | `random(pattern)` (Random 라이브러리)                                 |
| `regex_match()`               | `str.matches(pattern)`                                             |
| `regex_replace_all()`         | 아직 지원하지 않음 (업스트림 기여 진행 중)              |
| `regex_replace_all_literal()` | 아직 지원하지 않음 (업스트림 기여 진행 중)              |
| `replace()`                   | `str.replace(old, new, n)`                                         |
| `replace_all()`               | `str.replace(old, new, -1)`                                        |
| `round()`                     | `math.round(num, places)` (Math 라이브러리)                           |
| `semver_compare()`            | `semver(str).isGreaterThan(semver(str2))`, `.isLessThan()`         |
| `sha1()`                      | `sha1(str)` (Hash 라이브러리)                                         |
| `sha256()`                    | `sha256(str)` (Hash 라이브러리)                                       |
| `split()`                     | `str.split(delimiter)`                                             |
| `subtract()`                  | `quantity(q).sub(quantity(q2))` / `quantity(q).sub(int)`           |
| `sum()`                       | 지원하지 않음 (array-reduce 대응 기능 없음)                         |
| `time_add()`                  | `timestamp(str) + duration(dur)`                                   |
| `time_after()`                | `timestamp(t1) > timestamp(t2)`                                    |
| `time_before()`               | `timestamp(t1) < timestamp(t2)`                                    |
| `time_between()`              | `timestamp(t) > timestamp(start) && timestamp(t) < timestamp(end)` |
| `time_diff()`                 | `timestamp(end) - timestamp(start)`                                |
| `time_now()`                  | `time.now()`                                                       |
| `time_now_utc()`              | `time.now()`                                                       |
| `time_parse()`                | `timestamp(str)` (RFC 3339와 Unix 에포크만 지원)                    |
| `time_since()`                | `time.now() - timestamp(start)`                                    |
| `time_to_cron()`              | `time.toCron(timestamp(str))`                                      |
| `time_truncate()`             | `time.truncate(timestamp(str), duration(dur))`                     |
| `time_utc()`                  | `string(timestamp(str))`                                           |
| `to_boolean()`                | `str.lowerAscii() == "true"`                                       |
| `to_lower()`                  | `str.lowerAscii()`                                                 |
| `to_upper()`                  | `str.upperAscii()`                                                 |
| `trim()`                      | `str.trim()` / `str.replace(chars, "")`                            |
| `trim_prefix()`               | `str.replace(prefix, "", 1)`                                       |
| `truncate()`                  | `str.substring(0, n)`                                              |
| `x509_decode()`               | `x509.decode(str)` (X509 라이브러리)                                  |

## 상세 대응 표현

### Add

JMESPath `add()` 필터는 단위를 인식합니다. 일반 숫자, Kubernetes 리소스 수량(예: `10Mi`, `500m`), 기간(duration)을 더할 수 있습니다. CEL에서는 더하는 값의 타입에 따라 방법이 달라집니다.

- **일반 숫자** — 기본 `+` 연산자를 씁니다.
- **Kubernetes 수량** — `quantity()` 생성자와 `.add()` 메서드를 함께 씁니다. `.add()`는 다른 `quantity`나 일반 정수(메모리 수량에서는 바이트로 해석)를 받습니다.
- **기간** — CEL 기본 기간 연산을 씁니다: `duration("1h") + duration("30s")`.

Kubernetes CEL 수량 타입은 `.sign()`(`1`, `-1`, `0` 반환)과 비교 메서드 `isLessThan()`, `isGreaterThan()`, `compareTo()`도 제공하므로, 수량 결과를 조건과 결합할 때 쓸 수 있습니다.

| JMESPath             | CEL                                     |
| -------------------- | --------------------------------------- |
| `add(`10`, `5`)`     | `10 + 5`                                |
| `add('10Mi', '5Mi')` | `quantity("10Mi").add(quantity("5Mi"))` |
| `add('1h', '30s')`   | `duration("1h") + duration("30s")`      |

**예시:** 이 정책은 컨테이너의 메모리 요청량에 주입된 사이드카용으로 예약한 고정 오버헤드 256Mi를 더한 값이 2Gi를 넘지 않도록 보장합니다.

JMESPath (`ClusterPolicy`):

```yaml
validate:
  failureAction: Enforce
  message: 'Container memory request plus 256Mi sidecar overhead must not exceed 2Gi.'
  foreach:
    - list: 'request.object.spec.containers'
      deny:
        conditions:
          any:
            - key: "{{ add('{{ element.resources.requests.memory || `0` }}', '256Mi') }}"
              operator: GreaterThan
              value: 2Gi
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      object.spec.containers.all(c,
        quantity(c.resources.?requests.memory.orValue("0")).add(quantity("256Mi")).isLessThan(quantity("2Gi"))
      )
    message: Container memory request plus 256Mi sidecar overhead must not exceed 2Gi.
```

---

### Subtract

JMESPath `subtract()` 필터는 `add()`와 대칭이며 마찬가지로 단위를 인식합니다. CEL에서도 타입별 구분이 똑같이 적용됩니다.

| JMESPath                  | CEL                                     |
| ------------------------- | --------------------------------------- |
| `subtract(`10`, `2`)`     | `10 - 2`                                |
| `subtract('10Mi', '5Ki')` | `quantity("10Mi").sub(quantity("5Ki"))` |
| `subtract('2h', '30s')`   | `duration("2h") - duration("30s")`      |

---

### Lookup

JMESPath `lookup()` 함수는 키로 맵의 값을, 인덱스로 배열의 값을 가져오며, 주로 키 자체를 런타임에 계산하는 _동적_ 조회에 유용합니다. CEL은 맵과 배열에 직접 접근하는 방식으로 이를 기본 지원합니다.

| JMESPath               | CEL            |
| ---------------------- | -------------- |
| `lookup(map, 'mykey')` | `map["mykey"]` |
| `lookup(array, 1)`     | `array[1]`     |

**예시:**

```cel
// 맵 조회
object.metadata.labels["env"]

// 배열 인덱스
object.spec.containers[0].image
```

---

### Label Match

CEL은 `==`로 맵을 직접 비교할 수 있으므로 `label_match()`를 대체할 전용 표현이 필요 없습니다. 내용이 같은 두 레이블 맵은 삽입 순서와 관계없이 같다고 비교되므로, 이 함수가 의도한 동작과 일치합니다.

```cel
object.metadata.labels == object.spec.selector.matchLabels
```

---

### Equal Fold

JMESPath `equal_fold()` 함수는 두 문자열을 대소문자 구분 없이 비교합니다. CEL에서는 비교하기 전에 두 문자열을 같은 대소문자로 맞춥니다.

| JMESPath           | CEL                                |
| ------------------ | ---------------------------------- |
| `equal_fold(a, b)` | `a.lowerAscii() == b.lowerAscii()` |

**예시:** 이 정책은 ConfigMap의 `dept` 레이블과 `data.dept` 값이 대소문자와 관계없이 같은지 검증합니다.

JMESPath (`ClusterPolicy`):

```yaml
validate:
  failureAction: Enforce
  message: The dept label must equal the data.dept value aside from case.
  deny:
    conditions:
      any:
        - key: "{{ equal_fold('{{request.object.metadata.labels.dept}}', '{{request.object.data.dept}}') }}"
          operator: NotEquals
          value: true
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      object.metadata.labels["dept"].lowerAscii() == object.data["dept"].lowerAscii()
    message: The dept label must equal the data.dept value aside from case.
```

---

### Image Normalize

JMESPath `image_normalize()` 함수는 짧은 이미지 참조를 정규 형태로 확장하면서, 없는 기본 레지스트리(`docker.io`)와 태그(`latest`)를 채웁니다. CEL에서는 [Image 라이브러리](/docs/policy-types/cel-libraries#image-library)가 이미지 참조를 파싱해서 각 구성 요소를 메서드로 제공하므로, 전체 참조를 검사하거나 재구성하기 쉽습니다.

| JMESPath               | CEL                                                                  |
| ---------------------- | -------------------------------------------------------------------- |
| `image_normalize(img)` | `image(img)` → `.registry()`, `.repository()`, `.tag()`, `.digest()` |

**예시:** 이 정책은 모든 컨테이너 이미지가 승인된 내부 레지스트리에서 오도록 요구합니다.

JMESPath (`ClusterPolicy`):

```yaml
foreach:
  - list: 'request.object.spec.containers'
    deny:
      conditions:
        any:
          - key: "{{ image_normalize('{{element.image}}') | split(@, '/') | [0] }}"
            operator: NotEquals
            value: harbor.corp.org
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      object.spec.containers.all(c, image(c.image).registry() == "harbor.corp.org")
    message: All images must come from harbor.corp.org.
```

---

### Truncate

JMESPath `truncate()` 함수는 문자열을 처음 N개 문자로 제한합니다. CEL에서는 Kubernetes 문자열 확장의 `substring(startIndex, endIndex)`를 씁니다.

| JMESPath           | CEL                   |
| ------------------ | --------------------- |
| `truncate(str, n)` | `str.substring(0, n)` |

**예시:** 이 정책은 `buildhash` 레이블을 처음 12개 문자로 잘라냅니다.

JMESPath (`ClusterPolicy`):

```yaml
mutate:
  patchStrategicMerge:
    metadata:
      labels:
        buildhash: "{{ truncate('{{@}}', `12`) }}"
```

CEL (`MutatingPolicy`):

```yaml
variables:
  - name: buildHash
    expression: object.metadata.labels["buildhash"].substring(0, 12)
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            labels: {
              "buildhash": variables.buildHash
            }
          }
        }
```

---

### Trim

JMESPath `trim()` 함수는 문자열 양 끝에서 임의의 문자 집합을 제거합니다. CEL에서는 다음과 같이 합니다.

- **공백**을 제거하려면 Kubernetes 문자열 확장의 `str.trim()`을 씁니다.
- **특정 문자나 알려진 부분 문자열**을 제거하려면 `str.replace(chars, "")` 호출을 조합합니다.

| JMESPath                              | CEL                            |
| ------------------------------------- | ------------------------------ |
| 공백 제거                             | `str.trim()`                   |
| 특정 문자/부분 문자열 제거            | `str.replace("@corp.com", "")` |

**예시:** 이 정책은 이메일 어노테이션에서 도메인 접미사를 제거합니다.

JMESPath (`ClusterPolicy`):

```yaml
mutate:
  patchStrategicMerge:
    metadata:
      annotations:
        extnameemail: "{{ trim('{{@}}','@corp.com') }}"
```

CEL (`MutatingPolicy`):

```yaml
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            annotations: {
              "extnameemail": object.metadata.annotations["extnameemail"].replace("@corp.com", "")
            }
          }
        }
```

---

### Trim Prefix

JMESPath `trim_prefix()` 함수는 문자열 앞에서 특정 문자열을 제거합니다. CEL에서는 `replace()`에 횟수 `1`을 지정해서 접두사의 첫 번째 출현만 제거합니다.

| JMESPath                   | CEL                          |
| -------------------------- | ---------------------------- |
| `trim_prefix(str, prefix)` | `str.replace(prefix, "", 1)` |

**예시:** 이 정책은 이미지 URL에서 `docker://` URI 스킴을 제거합니다.

JMESPath (`ClusterPolicy`):

```yaml
imageExtractors:
  DataVolume:
    - path: /spec/source/registry/url
      jmesPath: "trim_prefix(@, 'docker://')"
```

CEL:

```cel
c.image.replace("docker://", "", 1)
```

---

### Replace / Replace All

JMESPath `replace()` 함수는 부분 문자열을 최대 N번 치환하고, `replace_all()`은 모든 출현을 치환합니다. CEL에서는 Kubernetes 문자열 확장의 `replace()` 함수 하나로 두 경우를 모두 처리합니다. 치환 횟수를 제한하려면 양의 정수를, 모두 치환하려면 `-1`을 전달합니다.

| JMESPath                     | CEL                         |
| ---------------------------- | --------------------------- |
| `replace_all(str, old, new)` | `str.replace(old, new, -1)` |
| `replace(str, old, new, n)`  | `str.replace(old, new, n)`  |

**예시:** 이 정책은 `team` 어노테이션의 공백을 하이픈으로 치환해서 정규화합니다.

JMESPath (`ClusterPolicy`):

```yaml
mutate:
  patchStrategicMerge:
    metadata:
      annotations:
        team: "{{ replace_all('{{request.object.metadata.annotations.team}}', ' ', '-') }}"
```

CEL (`MutatingPolicy`):

```yaml
variables:
  - name: newTeam
    expression: >-
      object.metadata.annotations["team"].replace(" ", "-", -1)
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            annotations: {
              "team": variables.newTeam
            }
          }
        }
```

---

### Path Canonicalize

JMESPath `path_canonicalize()` 함수는 파일 시스템 경로에서 중복된 슬래시를 제거합니다(예: `/var//lib///kubelet` → `/var/lib/kubelet`). CEL에서는 `/`로 분할하고, 빈 세그먼트를 버리고, 다시 합쳐서 같은 결과를 만듭니다.

| JMESPath                  | CEL                                                  |
| ------------------------- | ---------------------------------------------------- |
| `path_canonicalize(path)` | `'/' + path.split('/').filter(s, s != '').join('/')` |

**예시:** 이 정책은 경로에 슬래시가 추가로 들어 있어도 Containerd 소켓을 마운트하지 못하게 합니다.

JMESPath (`ClusterPolicy`):

```yaml
foreach:
  - list: 'request.object.spec.volumes[]'
    deny:
      conditions:
        any:
          - key: '{{ path_canonicalize(element.hostPath.path) }}'
            operator: Equals
            value: '/var/run/containerd/containerd.sock'
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: mountsContainerdSocket
    expression: >-
      object.spec.?volumes.orValue([]).exists(v,
        has(v.hostPath) &&
        ('/' + v.hostPath.path.split('/').filter(s, s != '').join('/')) == '/var/run/containerd/containerd.sock'
      )
validations:
  - expression: variables.mountsContainerdSocket == false
    message: Mounting the Containerd socket is not allowed.
```

---

### Base64 Decode / Encode

JMESPath `base64_decode()`와 `base64_encode()` 필터는 base64 문자열을 디코딩하고 인코딩합니다. CEL에서는 표준 확장으로 제공됩니다.

| JMESPath             | CEL                  |
| -------------------- | -------------------- |
| `base64_decode(str)` | `base64.decode(str)` |
| `base64_encode(str)` | `base64.encode(str)` |

**예시:** 이 정책은 시크릿의 `license` 필드를 디코딩하고, 사용이 금지된 키를 차단합니다.

JMESPath (`ClusterPolicy`):

```yaml
context:
  - name: status
    apiCall:
      jmesPath: 'data.license'
      urlPath: '/api/v1/namespaces/{{request.namespace}}/secrets/{{element.name}}'
deny:
  conditions:
    any:
      - key: '{{ status | base64_decode(@) }}'
        operator: Equals
        value: W0247-4RXD3-6TW0F-0FD63-64EFD-38180
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: secret
    expression: >-
      resource.Get("v1", "secrets", object.metadata.namespace, "license-secret")
  - name: licenseKey
    expression: base64.decode(variables.secret.data["license"])
validations:
  - expression: variables.licenseKey != "W0247-4RXD3-6TW0F-0FD63-64EFD-38180"
    message: This license key may not be consumed by a Secret.
```

---

### To Lower / To Upper

JMESPath `to_lower()`와 `to_upper()` 함수는 문자열의 대소문자를 정규화합니다. CEL에서는 Kubernetes 문자열 확장의 `lowerAscii()`와 `upperAscii()`를 씁니다.

| JMESPath        | CEL                |
| --------------- | ------------------ |
| `to_lower(str)` | `str.lowerAscii()` |
| `to_upper(str)` | `str.upperAscii()` |

**예시:** 이 정책은 존(zone) 레이블을 소문자로 정규화합니다.

JMESPath (`ClusterPolicy`):

```yaml
mutate:
  patchStrategicMerge:
    metadata:
      labels:
        zonekey: "{{ to_lower('{{@}}') }}"
```

CEL (`MutatingPolicy`):

```yaml
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            labels: {
              "zonekey": object.metadata.labels["zonekey"].lowerAscii()
            }
          }
        }
```

---

### To Boolean

JMESPath `to_boolean()` 함수는 문자열 `"true"` 또는 `"false"`를 대소문자와 관계없이 불리언 값으로 변환합니다. CEL에서는 문자열을 소문자로 바꾼 뒤 직접 비교합니다.

| JMESPath          | CEL                          |
| ----------------- | ---------------------------- |
| `to_boolean(str)` | `str.lowerAscii() == "true"` |

**예시:** 이 정책은 레이블 값으로 `hostIPC`를 설정합니다.

JMESPath (`ClusterPolicy`):

```yaml
mutate:
  patchStrategicMerge:
    spec:
      hostIPC: '{{ to_boolean(request.object.metadata.labels.canuseIPC) }}'
```

CEL (`MutatingPolicy`):

```yaml
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          spec: Object.spec{
            hostIPC: object.metadata.labels["canuseIPC"].lowerAscii() == "true"
          }
        }
```

---

### Split

JMESPath `split()` 함수는 구분자를 기준으로 문자열을 배열로 나눕니다. CEL에서는 Kubernetes 문자열 확장으로 같은 함수를 쓸 수 있습니다.

| JMESPath                      | CEL                          |
| ----------------------------- | ---------------------------- |
| `split('cat,dog,horse', ',')` | `'cat,dog,horse'.split(',')` |

**예시:** 이 정책은 Deployment의 `env` 레이블이 알려진 티어(`production` 또는 `staging`)로 시작하는지 검증합니다. 레이블 값은 `production-us-east-1`처럼 하이픈으로 구분한 복합 문자열입니다.

JMESPath (`ClusterPolicy`):

```yaml
# 트리거: Deployment
deny:
  conditions:
    any:
      - key: "{{ split(request.object.metadata.labels.env, '-') | [0] }}"
        operator: NotIn
        value:
          - production
          - staging
```

CEL (`ValidatingPolicy`):

```yaml
# 트리거: Deployment
validations:
  - expression: >-
      object.metadata.labels["env"].split("-")[0] in ["production", "staging"]
    message: The env label must start with 'production' or 'staging'.
```

---

### Modulo

JMESPath `modulo()` 필터는 나눗셈의 나머지를 반환합니다. CEL에서는 `%` 연산자를 직접 씁니다(정수만 가능).

| JMESPath       | CEL     |
| -------------- | ------- |
| `modulo(a, b)` | `a % b` |

---

### Round

JMESPath `round()` 필터는 숫자를 지정한 소수 자릿수로 반올림합니다. CEL에서는 [Math 라이브러리](/docs/policy-types/cel-libraries#math-library)를 씁니다.

| JMESPath             | CEL                       |
| -------------------- | ------------------------- |
| `round(num, places)` | `math.round(num, places)` |

**예시:** 이 정책은 CPU 요청량이 최대 소수점 둘째 자리까지 반올림된 값인지 검증합니다.

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      variables.cpuRequests.all(cpu,
        cpu == 0.0 || math.round(cpu, 2) == cpu
      )
    message: CPU requests must be rounded to at most 2 decimal places.
```

---

### Regex Match

JMESPath `regex_match()` 필터는 문자열이 정규식 패턴과 일치하는지 검사합니다. CEL에서는 기본 `matches()` 메서드를 씁니다.

| JMESPath                    | CEL                    |
| --------------------------- | ---------------------- |
| `regex_match(pattern, str)` | `str.matches(pattern)` |

**예시:** 이 정책은 Deployment의 `app.kubernetes.io/version` 레이블이 시맨틱 버전 규칙을 따르는지 검증합니다.

JMESPath (`ClusterPolicy`):

```yaml
# 트리거: Deployment
deny:
  conditions:
    any:
      - key: "{{ regex_match('^\\d+\\.\\d+\\.\\d+$', '{{request.object.metadata.labels[\"app.kubernetes.io/version\"]}}') }}"
        operator: Equals
        value: false
```

CEL (`ValidatingPolicy`):

```yaml
# 트리거: Deployment
validations:
  - expression: >-
      object.metadata.labels["app.kubernetes.io/version"].matches('^\\d+\\.\\d+\\.\\d+$')
    message: The app.kubernetes.io/version label must follow semantic versioning (e.g. 1.2.3).
```

---

### Regex Replace All / Regex Replace All Literal

JMESPath `regex_replace_all()`과 `regex_replace_all_literal()` 필터는 정규식 기반 문자열 치환을 수행하며, 앞의 필터는 치환 문자열에서 캡처 그룹 참조를 지원합니다. CEL 문자열 확장에는 패턴 탐지용 `matches()`, `find()`, `findAll()`이 있지만 정규식 치환은 아직 지원하지 않습니다. 업스트림 Kubernetes 기여로 지원을 개발하고 있습니다.

---

### Items

JMESPath `items()` 필터는 맵을 객체 배열로 변환하면서 키 필드와 값 필드에 원하는 이름을 붙입니다. CEL에서는 `.map()` 매크로로 맵의 키를 순회하며 원하는 형태를 만듭니다.

| JMESPath                     | CEL                                       |
| ---------------------------- | ----------------------------------------- |
| `items(map, 'key', 'value')` | `map.map(k, {"key": k, "value": map[k]})` |
| Keys only                    | `map.map(k, k)`                           |

**예시:** 이 정책은 Pod의 레이블 키를 나열한 어노테이션을 추가합니다.

JMESPath (`ClusterPolicy`):

```yaml
context:
  - name: labelKeys
    variable:
      jmesPath: items(request.object.metadata.labels,'key','value')[].key
mutate:
  patchStrategicMerge:
    metadata:
      annotations:
        label-keys: "{{labelKeys | join(',', @)}}"
```

CEL (`MutatingPolicy`):

```yaml
variables:
  - name: labelKeys
    expression: object.metadata.labels.map(k, k)
  - name: labelKeysStr
    expression: variables.labelKeys.join(",")
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            annotations: {
              "label-keys": variables.labelKeysStr
            }
          }
        }
```

---

### Object From Lists

JMESPath `object_from_lists()` 필터는 나란한 두 배열을 받아 한 배열을 키로, 다른 배열을 값으로 하는 맵을 만듭니다. CEL에서는 [Transform 라이브러리](/docs/policy-types/cel-libraries#transform-library)의 `listObjToMap()`이 같은 일을 하며, 객체 리스트에서 키로 쓸 필드와 값으로 쓸 필드를 지정합니다.

| JMESPath                                       | CEL                                       |
| ---------------------------------------------- | ----------------------------------------- |
| `object_from_lists(envs[].name, envs[].value)` | `listObjToMap(env, env, "name", "value")` |

**예시:** 이 정책은 컨테이너 환경 변수 이름을 값에 매핑하고 특정 키를 확인합니다.

JMESPath (`ClusterPolicy`):

```yaml
context:
  - name: envs_to_labels
    variable:
      jmesPath: object_from_lists(envs[].name, envs[].value)
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: envMap
    expression: >-
      listObjToMap(
        object.spec.containers[0].env,
        object.spec.containers[0].env,
        "name",
        "value"
      )
validations:
  - expression: variables.envMap["KEY"] == "123-456-789"
    message: KEY must be 123-456-789.
```

---

### Parse JSON

JMESPath `parse_json()` 필터는 JSON 문자열을 구조화된 객체로 파싱합니다. CEL에서는 [JSON 라이브러리](/docs/policy-types/cel-libraries#json-library)의 `json.unmarshal()`을 씁니다.

| JMESPath          | CEL                   |
| ----------------- | --------------------- |
| `parse_json(str)` | `json.unmarshal(str)` |

**예시:** 이 정책은 어노테이션에 JSON으로 인코딩된 승인 메타데이터를 파싱합니다. 대상 리소스의 어노테이션은 다음과 같습니다.

```yaml
metadata:
  annotations:
    security.approval: '{"approved": true, "approver": "alice", "ticket": "SEC-1234"}'
```

JMESPath (`ClusterPolicy`):

```yaml
deny:
  conditions:
    - key: '{{ request.object.metadata.annotations.config | parse_json(@).approved }}'
      operator: NotEquals
      value: true
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: approval
    expression: json.unmarshal(object.metadata.annotations["security.approval"])
validations:
  - expression: variables.approval.approved == true
    message: Deployment is not approved by security policy.
```

---

### Parse YAML

JMESPath `parse_yaml()` 필터는 YAML 문자열을 구조화된 객체로 파싱합니다. CEL에서는 [YAML 라이브러리](/docs/policy-types/cel-libraries#yaml-library)의 `yaml.parse()`를 씁니다.

| JMESPath          | CEL               |
| ----------------- | ----------------- |
| `parse_yaml(str)` | `yaml.parse(str)` |

**예시:** 이 정책은 YAML 어노테이션을 파싱해서 중첩된 불리언 필드를 확인합니다. 대상 리소스의 어노테이션은 다음과 같습니다.

```yaml
metadata:
  annotations:
    pets: |
      species:
        name: dog
        isGoodBoi: true
```

JMESPath (`ClusterPolicy`):

```yaml
deny:
  conditions:
    - key: '{{request.object.metadata.annotations.pets | parse_yaml(@).species.isGoodBoi }}'
      operator: NotEquals
      value: true
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: pets
    expression: yaml.parse(object.metadata.annotations["pets"])
validations:
  - expression: variables.pets.species.isGoodBoi == true
    message: Only good bois allowed.
```

---

### MD5 / SHA1 / SHA256

JMESPath 해시 필터는 CEL [Hash 라이브러리](/docs/policy-types/cel-libraries#hash-library)에 직접 대응하는 함수가 있습니다.

| JMESPath      | CEL           |
| ------------- | ------------- |
| `md5(str)`    | `md5(str)`    |
| `sha1(str)`   | `sha1(str)`   |
| `sha256(str)` | `sha256(str)` |

**예시:** 이 정책은 이미지 이름의 MD5 해시를 기대값과 비교해서 검증합니다.

JMESPath (`ClusterPolicy`):

```yaml
mutate:
  patchStrategicMerge:
    metadata:
      name: '{{ md5(request.object.metadata.name) }}'
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: expectedHash
    expression: '"403554a5dfea78d1ca4a8ff5830ac2ae"'
  - name: md5sum
    expression: md5(object.spec.template.spec.containers[0].image)
validations:
  - expression: variables.md5sum == variables.expectedHash
    messageExpression: '"Expected MD5 hash " + variables.expectedHash + ", got: " + variables.md5sum'
```

---

### Random

JMESPath `random()` 필터는 정규식 패턴에 맞는 임의의 문자열을 생성합니다. CEL [Random 라이브러리](/docs/policy-types/cel-libraries#random-library)가 같은 구문의 같은 함수를 제공합니다.

| JMESPath                | CEL                     |
| ----------------------- | ----------------------- |
| `random('[a-z0-9]{6}')` | `random("[a-z0-9]{6}")` |

**예시:** 이 정책은 새 시크릿에 임의의 추적 레이블을 추가합니다.

JMESPath (`ClusterPolicy`):

```yaml
context:
  - name: randomtest
    variable:
      jmesPath: random('[a-z0-9]{6}')
mutate:
  patchStrategicMerge:
    metadata:
      labels:
        randomoutput: random-{{randomtest}}
```

CEL (`MutatingPolicy`):

```yaml
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            labels: {
              "randomoutput": "random-" + random("[a-z0-9]{6}")
            }
          }
        }
```

---

### Semver Compare

JMESPath `semver_compare()` 필터는 두 시맨틱 버전 문자열을 비교하며 연산자 접두사와 범위 표현식을 받습니다. CEL에서는 Kubernetes 기본 `semver()` 타입을 쓰며, 이 타입은 정확한 비교를 위한 `isGreaterThan()`, `isLessThan()`, `major()`, `minor()`, `patch()` 메서드를 제공합니다.

| JMESPath                   | CEL                                                                       |
| -------------------------- | ------------------------------------------------------------------------- |
| `semver_compare(v, '>v2')` | `semver(v).isGreaterThan(semver(v2))`                                     |
| `semver_compare(v, '<v2')` | `semver(v).isLessThan(semver(v2))`                                        |
| `semver_compare(v, '=v2')` | `semver(v) == semver(v2)`                                                 |
| AND 범위 `>v1 <v2`        | `semver(v).isGreaterThan(semver(v1)) && semver(v).isLessThan(semver(v2))` |
| 구성 요소 검사 `>=4.1.x`  | `semver(v).major() == 4 && semver(v).minor() >= 1`                        |

**예시:** 이 정책은 구성 요소의 버전이 4.5.0보다 큰지 확인합니다.

JMESPath (`ClusterPolicy`):

```yaml
conditions:
  - all:
      - key: "{{ semver_compare( {{ components[?name == 'httpclient'].version | [0] }}, '>4.5.0') }}"
        operator: Equals
        value: true
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      variables.components.exists(c,
        c.name == "httpclient" &&
        semver(c.version).isGreaterThan(semver("4.5.0"))
      )
    message: httpclient version must be greater than 4.5.0.
```

---

### x509 Decode

JMESPath `x509_decode()` 필터는 PEM으로 인코딩된 X.509 인증서를 구조화된 객체로 디코딩합니다. CEL에서는 [X509 라이브러리](/docs/policy-types/cel-libraries#x509-library)의 `x509.decode()`가 같은 기능과 필드 구조를 제공합니다.

| JMESPath           | CEL                |
| ------------------ | ------------------ |
| `x509_decode(pem)` | `x509.decode(pem)` |

**예시:** 이 정책은 웹훅의 CA 인증서가 앞으로 일주일 안에 만료되지 않는지 확인합니다.

JMESPath (`ClusterPolicy`):

```yaml
deny:
  conditions:
    any:
      - key: "{{ base64_decode('{{ request.object.webhooks[0].clientConfig.caBundle }}').x509_decode(@).time_since('',NotBefore,NotAfter) }}"
        operator: LessThan
        value: 168h0m0s
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      timestamp(x509.decode(string(base64.decode(object.webhooks[0].clientConfig.caBundle))).NotAfter) - time.now() > duration("168h")
    message: Certificate in the webhook will expire in less than a week.
```

---

## 시간 연산

모든 JMESPath 시간 필터에는 CEL 대응 표현이 있습니다. CEL 엔진은 기본 `timestamp()`와 `duration()` 타입을 제공하고, Kyverno [Time 함수](/docs/policy-types/cel-libraries#time-functions) 라이브러리는 `time.now()`, `time.truncate()`, `time.toCron()`을 추가합니다.

### time_now / time_now_utc

`time_now()`와 `time_now_utc()`는 둘 다 현재 시간을 반환합니다. CEL에서는 `time.now()`가 항상 UTC 타임스탬프를 반환하므로 둘을 모두 대체합니다.

| JMESPath         | CEL          |
| ---------------- | ------------ |
| `time_now()`     | `time.now()` |
| `time_now_utc()` | `time.now()` |

---

### time_add

| JMESPath                 | CEL                                  |
| ------------------------ | ------------------------------------ |
| `time_add(rfc3339, dur)` | `timestamp(rfc3339) + duration(dur)` |

**예시:** 이 정책은 생성 시점으로부터 4시간 뒤로 예약된 ClusterCleanupPolicy를 생성합니다.

JMESPath (`ClusterPolicy`):

```yaml
schedule: "{{ time_add('{{ time_now_utc() }}','4h') | time_to_cron(@) }}"
```

CEL (표현식):

```cel
time.toCron(time.now() + duration("4h"))
```

---

### time_after / time_before / time_between

| JMESPath                      | CEL                                                                |
| ----------------------------- | ------------------------------------------------------------------ |
| `time_after(t1, t2)`          | `timestamp(t1) > timestamp(t2)`                                    |
| `time_before(t1, t2)`         | `timestamp(t1) < timestamp(t2)`                                    |
| `time_between(t, start, end)` | `timestamp(t) > timestamp(start) && timestamp(t) < timestamp(end)` |

**예시:** 이 정책은 클러스터 폐기 기한 이후의 ConfigMap 생성을 거부합니다.

JMESPath (`ClusterPolicy`):

```yaml
key: "{{ time_after('{{time_now_utc() }}','2023-01-12T00:00:00Z') }}"
operator: Equals
value: true
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: time.now() < timestamp("2023-01-12T00:00:00Z")
    message: This cluster is being decommissioned and no further resources may be created after January 12th.
```

**예시:** 날짜 범위 안에서만 활성화되는 시간 제한 정책입니다.

JMESPath (`ClusterPolicy`):

```yaml
preconditions:
  all:
    - key: "{{ time_between('{{ time_now_utc() }}','2023-01-01T00:00:00Z','2023-01-31T23:59:59Z') }}"
      operator: Equals
      value: true
```

CEL (`ValidatingPolicy`):

```yaml
variables:
  - name: withinWindow
    expression: >-
      time.now() > timestamp("2023-01-01T00:00:00Z") &&
      time.now() < timestamp("2023-01-31T23:59:59Z")
```

---

### time_diff

| JMESPath                | CEL                                 |
| ----------------------- | ----------------------------------- |
| `time_diff(start, end)` | `timestamp(end) - timestamp(start)` |

CEL의 결과는 `duration`이므로 `duration("24h")` 같은 값과 비교할 수 있습니다.

---

### time_since

JMESPath `time_since()` 필터는 고정된 시작 시간부터 경과한 시간을 계산하며, 선택적으로 현재 시간을 종료 시간으로 쓸 수 있습니다. CEL에서는 `time.now()`에서 `timestamp()`를 빼서 `duration`을 만듭니다.

| JMESPath                        | CEL                                 |
| ------------------------------- | ----------------------------------- |
| `time_since('', startTime, '')` | `time.now() - timestamp(startTime)` |

**예시:** 이 정책은 6개월보다 오래전에 빌드된 컨테이너를 차단합니다.

JMESPath (`ClusterPolicy`):

```yaml
- key: "{{ time_since('', '{{ imageData.configData.created }}', '') }}"
  operator: GreaterThan
  value: 4380h
```

CEL (`ValidatingPolicy`):

```yaml
validations:
  - expression: >-
      object.spec.containers.all(c,
        time.now() - timestamp(variables.imageData.configData.created) <= duration("4380h")
      )
    message: Images built more than 6 months ago are prohibited.
```

---

### time_to_cron

| JMESPath                | CEL                               |
| ----------------------- | --------------------------------- |
| `time_to_cron(rfc3339)` | `time.toCron(timestamp(rfc3339))` |

---

### time_truncate

| JMESPath                      | CEL                                                |
| ----------------------------- | -------------------------------------------------- |
| `time_truncate(rfc3339, dur)` | `time.truncate(timestamp(rfc3339), duration(dur))` |

**예시:** 이 정책은 타임스탬프 어노테이션을 가장 가까운 2시간 단위로 내림합니다.

JMESPath (`ClusterPolicy`):

```yaml
thistime: "{{ time_truncate('{{ @ }}','2h') }}"
```

CEL (`MutatingPolicy`):

```yaml
variables:
  - name: thistime
    expression: |
      time.truncate(timestamp(object.metadata.annotations["thistime"]), duration("2h"))
mutations:
  - patchType: ApplyConfiguration
    applyConfiguration:
      expression: |
        Object{
          metadata: Object.metadata{
            annotations: {
              "thistime": string(variables.thistime)
            }
          }
        }
```

---

### time_utc

JMESPath `time_utc()` 함수는 시간대 오프셋이 있는 RFC 3339 문자열을 UTC 문자열로 변환합니다. CEL에서는 `timestamp()`가 시간대 오프셋이 있는 입력을 포함한 모든 RFC 3339 입력을 내부적으로 UTC로 정규화합니다. 결과에 `string()`을 호출하면 정규 UTC 문자열이 됩니다.

| JMESPath                      | CEL                                    |
| ----------------------------- | -------------------------------------- |
| `time_utc(rfc3339WithOffset)` | `string(timestamp(rfc3339WithOffset))` |

**예시:**

JMESPath 표현식: `time_utc('2021-01-02T18:04:05-05:00')` → `"2021-01-02T23:04:05Z"`

CEL 표현식: `string(timestamp("2021-01-02T18:04:05-05:00"))` → `"2021-01-02T23:04:05Z"`

---

### time_parse

JMESPath `time_parse()` 함수는 시간 문자열을 RFC 3339로 변환합니다. CEL에서는 RFC 3339 문자열이나 Unix 에포크 정수와 함께 `timestamp()`를 직접 씁니다.

| JMESPath                                         | CEL                     |
| ------------------------------------------------ | ----------------------- |
| `time_parse(rfc3339Layout, str)`                 | `timestamp(str)`        |
| `time_parse('1702691171', '1702691171')` (에포크) | `timestamp(1702691171)` |
