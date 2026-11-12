---
title: "kyverno create cluster-role"
weight: 35
---
## kyverno create cluster-role

지정한 리소스 종류에 대한 집계 롤(aggregated role)을 생성합니다.

### 개요

이 명령은 지정한 리소스 종류에 대한 Kubernetes ClusterRole을 생성합니다.
출력은 기본적으로 stdout에 출력되며, 지정한 파일에 저장할 수도 있습니다.
'api-groups', 'verbs', 'resources' 플래그는 필수입니다.

```
kyverno create cluster-role [name]  [flags]
```

### 옵션

```
  -g, --api-groups string         리소스의 API 그룹 (필수)
      --controllers stringArray   ClusterRole을 적용할 컨트롤러 목록 (기본값 = background-controller) (기본값 [background-controller])
  -h, --help                      cluster-role 도움말
  -o, --output string             출력 파일 경로 (지정하지 않으면 콘솔에 출력)
      --resources stringArray     쉼표로 구분한 리소스 목록 (필수)
      --verbs stringArray         쉼표로 구분한 verb 목록. 모든 verb는 'all'
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

* [kyverno create](/docs/kyverno-cli/reference/kyverno_create)	 - 다양한 Kyverno 리소스 생성을 돕습니다.

