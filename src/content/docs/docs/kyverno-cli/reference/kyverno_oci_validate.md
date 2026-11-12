---
title: "kyverno oci validate"
weight: 35
---
## kyverno oci validate

아무것도 푸시하지 않고 번들 디렉터리나 파일, 또는 푸시된 OCI 이미지를 검증한다. 기본적으로 로컬 검증은 "kyverno oci push"가 업로드 단계에 도달할 때에만 성공한다. --kyverno-version과 --strict는 모두 이 기준을 바꾼다(아래 참고).

### 개요

아무것도 푸시하지 않고 번들 디렉터리나 파일, 또는 푸시된 OCI 이미지를 검증한다. 기본적으로 로컬 검증은 "kyverno oci push"가 업로드 단계에 도달할 때에만 성공한다. --kyverno-version과 --strict는 모두 이 기준을 바꾼다(아래 참고).
  로컬 모드(디렉터리 또는 파일 인수)는 push가 업로드 단계 전까지 수행하는 모든 검사를 실행하며, 네트워크 호출은 하지 않는다.
  참조 모드(--image)는 푸시된 이미지를 가져와 같은 엄격한 검사를 다시 실행한다. 번들 밖의 정책을 참조하는 예외처럼 "kyverno oci pull"은 받아들이는 콘텐츠에서도 실패할 수 있으므로, 이런 번들은 pull로 추출한다.
  --kyverno-version은 번들의 kyvernoVersion 제약을 지정한 버전과 비교해 맞지 않으면 실패한다. 일반 push나 validate는 실행 중인 CLI 자체의 버전과 비교하므로 경고만 낸다.
  --strict는 push와 일반 validate에서는 경고만 내는 조건에서도 실패하도록 한다. 만료된 예외나, 정책 종류에서 무시되는 보완 통제(compensating control)가 그 예이다.


```
kyverno oci validate [dir or file] [flags]
```

### 예시

```
  # 푸시하기 전에 로컬 번들 디렉터리 검증
  kyverno oci validate ./bundle

  # 로컬 번들을 검증하되, 만료된 예외 같은 경고에서도 실패 처리
  kyverno oci validate ./bundle --strict

  # 푸시된 번들을 특정 대상 Kyverno 버전 기준으로 검증
  kyverno oci validate -i <imgref> --kyverno-version 1.20.0
```

### 옵션

```
  -h, --help                     validate 도움말
  -i, --image string             검증할 푸시된 번들의 이미지 참조
      --kyverno-version string   번들에 선언된 kyvernoVersion 제약을 확인할 기준 Kyverno 버전. 제약을 만족하지 않으면 실패
      --strict                   경고(만료된 예외 등)를 실패로 처리
```

### 상위 명령에서 상속된 옵션

```
      --add_dir_header                      If true, adds the file directory to the header of the log messages
      --alsologtostderr                     log to standard error as well as files (no effect when -logtostderr=true)
      --alsologtostderrthreshold severity   logs at or above this threshold go to stderr when -alsologtostderr=true (no effect when -logtostderr=true)
      --kubeconfig string                   kubeconfig 경로. 클러스터 외부에서 실행할 때만 필요하다.
      --legacy_stderr_threshold_behavior    If true, stderrthreshold is ignored when logtostderr=true (legacy behavior). If false, stderrthreshold is honored even when logtostderr=true (default true)
      --log_backtrace_at traceLocation      when logging hits line file:N, emit a stack trace (default :0)
      --log_dir string                      If non-empty, write log files in this directory (no effect when -logtostderr=true)
      --log_file string                     If non-empty, use this log file (no effect when -logtostderr=true)
      --log_file_max_size uint              Defines the maximum size a log file can grow to (no effect when -logtostderr=true). Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
      --logtostderr                         log to standard error instead of files (default true)
      --one_output                          If true, only write logs to their native severity level (vs also writing to each lower severity level; no effect when -logtostderr=true)
      --skip_headers                        If true, avoid header prefixes in the log messages
      --skip_log_headers                    If true, avoid headers when opening log files (no effect when -logtostderr=true)
      --stderrthreshold severity            logs at or above this threshold go to stderr when writing to files and stderr (no effect when -logtostderr=true or -alsologtostderr=true unless -legacy_stderr_threshold_behavior=false) (default 2)
  -v, --v Level                             number for the log level verbosity
      --vmodule moduleSpec                  comma-separated list of pattern=N settings for file-filtered logging
```

### 함께 보기

* [kyverno oci](/docs/kyverno-cli/reference/kyverno_oci)	 - OCI 레지스트리에서 Kyverno CEL 정책 번들을 푸시, 풀, 검증, 조회, 리졸브한다. 각 하위 명령의 플래그와 예시는 "kyverno oci <subcommand> --help"를 참고한다.

