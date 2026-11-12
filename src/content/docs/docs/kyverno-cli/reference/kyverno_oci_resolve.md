---
title: "kyverno oci resolve"
weight: 35
---
## kyverno oci resolve

번들 태그를 변경 불가능한 다이제스트로 리졸브하고, "kyverno test", "kyverno apply", "kyverno oci pull" 또는 Flux OCIRepository에 전달할 수 있는 다이제스트 고정 참조를 출력합니다.

### 개요

번들 태그를 변경 불가능한 다이제스트로 리졸브하고, "kyverno test", "kyverno apply", "kyverno oci pull" 또는 Flux OCIRepository에 전달할 수 있는 다이제스트 고정 참조를 출력합니다.
  이 명령은 매니페스트와 config를 가져와 Kyverno 번들인지 확인한 뒤 stdout에 정확히 한 줄을 출력합니다. 콘텐츠 레이어는 다운로드하지 않습니다. 다이제스트만 필요하면 --digest-only를 사용하세요.


```
kyverno oci resolve [flags]
```

### 예시

```
  # 태그를 다이제스트 고정 참조로 리졸브
  kyverno oci resolve -i ghcr.io/acme/baseline:v1.0.0

  # 리졸브된 다이제스트 고정 번들로 kyverno test 실행
  kyverno test oci://$(kyverno oci resolve -i ghcr.io/acme/baseline:v1.0.0)

  # 다이제스트만 출력
  kyverno oci resolve -i ghcr.io/acme/baseline:v1.0.0 --digest-only
```

### 옵션

```
      --digest-only    전체 다이제스트 고정 참조 대신 다이제스트(sha256:...)만 출력
  -h, --help           resolve 도움말
  -i, --image string   리졸브할 푸시된 번들의 이미지 참조(태그 또는 다이제스트)
```

### 상위 명령에서 상속된 옵션

```
      --add_dir_header                      If true, adds the file directory to the header of the log messages
      --alsologtostderr                     log to standard error as well as files (no effect when -logtostderr=true)
      --alsologtostderrthreshold severity   logs at or above this threshold go to stderr when -alsologtostderr=true (no effect when -logtostderr=true)
      --kubeconfig string                   kubeconfig 경로. 클러스터 외부에서 실행할 때만 필요합니다.
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

* [kyverno oci](/docs/kyverno-cli/reference/kyverno_oci)	 - OCI 레지스트리에서 Kyverno CEL 정책 번들을 푸시, 풀, 검증, 조회, 리졸브합니다. 각 하위 명령의 플래그와 예시는 "kyverno oci <subcommand> --help"를 참고하세요.

