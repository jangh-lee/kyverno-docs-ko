---
title: "kyverno docs"
weight: 35
---
## kyverno docs

레퍼런스 문서를 생성한다.

### 개요

레퍼런스 문서를 생성한다.

  docs 명령은 Kyverno CLI 레퍼런스 문서를 생성한다.

  단순한 마크다운 파일이나 웹사이트용 마크다운을 생성할 수 있다.


```
kyverno docs [flags]
```

### 예시

```
  # 단순 마크다운 문서 생성
  KYVERNO_EXPERIMENTAL=true kyverno docs -o . --autogenTag=false

  # 웹사이트용 문서 생성
  KYVERNO_EXPERIMENTAL=true kyverno docs -o . --website
```

### 옵션

```
      --autogenTag      생성된 문서에 타임스탬프를 포함할지 결정한다 (기본값 true)
  -h, --help            docs 도움말
      --markdownLinks   생성된 문서에 마크다운 파일 링크를 포함할지 결정한다
      --noDate          생성된 문서에 날짜를 포함할지 결정한다
  -o, --output string   출력 경로 (기본값 ".")
      --website         웹사이트용 버전
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

