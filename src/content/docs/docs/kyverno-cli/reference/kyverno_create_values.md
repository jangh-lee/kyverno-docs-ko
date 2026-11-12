---
title: "kyverno create values"
weight: 35
---
## kyverno create values

Kyverno values 파일을 생성한다.

### 개요

Kyverno values 파일을 생성한다.


```
kyverno create values [flags]
```

### 예시

```
  # values 파일 생성
  kyverno create values -g request.mode=dev -n prod,env=prod --rule policy,rule,env=demo --resource policy,resource,env=demo
```

### 옵션

```
  -g, --global strings            전역 값
  -h, --help                      values 도움말
  -n, --ns-selector stringArray   네임스페이스 셀렉터
  -o, --output string             출력 경로 (지정하지 않으면 표준 콘솔 출력 사용)
      --resource stringArray      정책 리소스 값
      --rule stringArray          정책 규칙 값
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

* [kyverno create](/docs/kyverno-cli/reference/kyverno_create)	 - 다양한 Kyverno 리소스 생성을 돕는다.

