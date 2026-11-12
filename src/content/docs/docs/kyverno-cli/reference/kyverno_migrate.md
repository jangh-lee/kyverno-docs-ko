---
title: "kyverno migrate"
weight: 35
---
## kyverno migrate

하나 이상의 리소스를 저장 버전(stored version)으로 마이그레이션한다.

### 개요

하나 이상의 리소스를 저장 버전(stored version)으로 마이그레이션한다.


```
kyverno migrate [flags]
```

### 예시

```
  # CEL 정책 마이그레이션
  kyverno migrate --resource validatingpolicies.policies.kyverno.io
```

### 옵션

```
      --context string      사용할 kubeconfig 컨텍스트 이름
  -h, --help                migrate 도움말
      --kubeconfig string   인증 정보와 마스터 위치 정보가 들어 있는 kubeconfig 파일 경로
      --resource strings    마이그레이션할 리소스
```

### 상위 명령에서 상속된 옵션

```
      --add_dir_header                      If true, adds the file directory to the header of the log messages
      --alsologtostderr                     log to standard error as well as files (no effect when -logtostderr=true)
      --alsologtostderrthreshold severity   logs at or above this threshold go to stderr when -alsologtostderr=true (no effect when -logtostderr=true)
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

