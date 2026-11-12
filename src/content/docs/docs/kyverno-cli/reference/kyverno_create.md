---
title: "kyverno create"
weight: 35
---
## kyverno create

다양한 Kyverno 리소스 생성을 돕는다.

### 개요

다양한 Kyverno 리소스 생성을 돕는다.

  참고: 레거시 kyverno.io/v2 PolicyException의 틀을 만들어 주던 "kyverno create exception"은
  1.20에서 레거시 정책 실행과 함께 제거됐으며, 이를 대체하는 명령은 없다.
  CEL PolicyException의 형태는 policies.kyverno.io PolicyException 문서
  (https://kyverno.io/docs/guides/exceptions/)를 참고한다.


```
kyverno create [flags]
```

### 예시

```
  # metrics config 파일 생성
  kyverno create metrics-config -i ns-included-1 -i ns-included-2 -e ns-excluded

  # 테스트 파일 생성
  kyverno create test -p policy.yaml -r resource.yaml -f values.yaml --pass policy-name,rule-name,resource-name,resource-namespace,resource-kind

  # user info 파일 생성
  kyverno create user-info -u molybdenum@somecorp.com -g basic-user -c admin

  # values 파일 생성
  kyverno create values -g request.mode=dev -n prod,env=prod --rule policy,rule,env=demo --resource policy,resource,env=demo
```

### 옵션

```
  -h, --help   create 도움말
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
* [kyverno create cluster-role](/docs/kyverno-cli/reference/kyverno_create_cluster-role)	 - 지정한 리소스 종류에 대한 집계 롤(aggregated role)을 생성한다.
* [kyverno create metrics-config](/docs/kyverno-cli/reference/kyverno_create_metrics-config)	 - Kyverno metrics-config 파일을 생성한다.
* [kyverno create test](/docs/kyverno-cli/reference/kyverno_create_test)	 - Kyverno 테스트 파일을 생성한다.
* [kyverno create user-info](/docs/kyverno-cli/reference/kyverno_create_user-info)	 - Kyverno user-info 파일을 생성한다.
* [kyverno create values](/docs/kyverno-cli/reference/kyverno_create_values)	 - Kyverno values 파일을 생성한다.

