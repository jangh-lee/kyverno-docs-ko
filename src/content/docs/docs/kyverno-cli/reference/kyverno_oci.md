---
title: "kyverno oci"
weight: 35
---
## kyverno oci

OCI 레지스트리에서 Kyverno CEL 정책 번들을 푸시, 풀, 검증, 조회, 리졸브한다. 각 하위 명령의 플래그와 예시는 "kyverno oci <subcommand> --help"를 참고한다.

### 개요

OCI 레지스트리에서 Kyverno CEL 정책 번들을 푸시, 풀, 검증, 조회, 리졸브한다. 각 하위 명령의 플래그와 예시는 "kyverno oci <subcommand> --help"를 참고한다.


```
kyverno oci [flags]
```

### 예시

```
  # 디렉터리의 정책 번들을 OCI 이미지로 푸시
  kyverno oci push policies -i ghcr.io/acme/baseline:v1.0.0

  # 푸시된 번들을 디렉터리로 풀
  kyverno oci pull policies -i ghcr.io/acme/baseline:v1.0.0

  # 풀하지 않고 푸시된 번들 검증
  kyverno oci validate -i ghcr.io/acme/baseline:v1.0.0

  # 푸시된 번들의 메타데이터와 Kyverno 호환성 조회
  kyverno oci inspect -i ghcr.io/acme/baseline:v1.0.0

  # 태그를 다이제스트 고정 참조로 리졸브
  kyverno oci resolve -i ghcr.io/acme/baseline:v1.0.0
```

### 옵션

```
  -h, --help   oci 도움말
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

* [kyverno](/docs/kyverno-cli/reference/kyverno)	 - 쿠버네티스 네이티브 정책 관리 도구이다.
* [kyverno oci inspect](/docs/kyverno-cli/reference/kyverno_oci_inspect)	 - 푸시된 번들의 리졸브된 다이제스트, 리소스 인덱스, 세트, 소스 및 리비전 메타데이터, 매니페스트 어노테이션, Kyverno 호환성을 보여 준다.
* [kyverno oci pull](/docs/kyverno-cli/reference/kyverno_oci_pull)	 - OCI 레지스트리에서 OCI 이미지에 포함된 정책을 풀(pull)하여 로컬 디렉터리에 저장한다.
* [kyverno oci push](/docs/kyverno-cli/reference/kyverno_oci_push)	 - OCI 이미지에 포함할 정책을 OCI 레지스트리에 푸시한다.
* [kyverno oci resolve](/docs/kyverno-cli/reference/kyverno_oci_resolve)	 - 번들 태그를 변경 불가능한 다이제스트로 리졸브하고, "kyverno test", "kyverno apply", "kyverno oci pull" 또는 Flux OCIRepository에 전달할 수 있는 다이제스트 고정 참조를 출력한다.
* [kyverno oci validate](/docs/kyverno-cli/reference/kyverno_oci_validate)	 - 아무것도 푸시하지 않고 번들 디렉터리나 파일, 또는 푸시된 OCI 이미지를 검증한다. 기본적으로 로컬 검증은 "kyverno oci push"가 업로드 단계에 도달할 때에만 성공한다. --kyverno-version과 --strict는 모두 이 기준을 바꾼다(아래 참고).

