---
title: "kyverno completion"
weight: 35
---
## kyverno completion

지정한 셸용 kyverno 자동 완성 스크립트를 생성한다.

### 개요

지정한 셸용 kyverno 자동 완성 스크립트를 생성한다.

  셸 자동 완성을 사용하면 kyverno 명령, 하위 명령, 플래그, 인수를 탭 키로 완성할 수 있다.
  명령어를 제안해 주므로 입력량이 줄고 CLI를 더 편하게 쓸 수 있다.

  생성된 스크립트에는 셸별 함수가 들어 있다. 이 함수가 셸의 자동 완성 시스템과 연동되어
  Tab 키를 누르면 명령을 지능적으로 완성해 준다.

  자동 완성을 사용하려면 생성된 스크립트를 셸 프로필에서 source 하거나
  셸의 자동 완성 디렉터리에 저장한다. 셸별 방법은 아래 예시를 참고한다.


```
kyverno completion [bash|zsh|fish|powershell]
```

### 예시

```
  # bash 자동 완성 생성 및 설치(Linux)
  kyverno completion bash > /etc/bash_completion.d/kyverno

  # 현재 세션용 bash 자동 완성 생성 및 source
  source <(kyverno completion bash)

  # zsh 자동 완성 생성 및 설치
  kyverno completion zsh > "${fpath[1]}/_kyverno"

  # 현재 세션용 zsh 자동 완성 생성 및 source
  source <(kyverno completion zsh)

  # fish 자동 완성 생성 및 설치
  kyverno completion fish > ~/.config/fish/completions/kyverno.fish

  # PowerShell 자동 완성 생성
  kyverno completion powershell | Out-String | Invoke-Expression

  # PowerShell 자동 완성을 영구적으로 활성화하려면 프로필에 추가:
  kyverno completion powershell >> $PROFILE
```

### 옵션

```
  -h, --help   completion 도움말
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

