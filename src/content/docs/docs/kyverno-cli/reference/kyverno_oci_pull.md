---
title: "kyverno oci pull"
weight: 35
---
## kyverno oci pull

OCI 레지스트리에서 OCI 이미지에 포함된 정책을 풀(pull)하여 로컬 디렉터리에 저장한다.

### 개요

OCI 레지스트리에서 OCI 이미지에 포함된 정책을 풀(pull)하여 로컬 디렉터리에 저장한다.


```
kyverno oci pull [dir] [flags]
```

### 예시

```
  # OCI 이미지에서 정책을 풀하여 지정한 디렉터리에 저장
  kyverno oci pull . -i <imgref>
```

### 옵션

```
  -h, --help           pull 도움말
  -i, --image string   푸시하거나 풀할 이미지 참조
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

