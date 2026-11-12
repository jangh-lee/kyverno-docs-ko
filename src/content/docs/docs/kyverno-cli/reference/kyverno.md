---
title: "kyverno"
weight: 35
---
## kyverno

쿠버네티스 네이티브 정책 관리 도구입니다.

### 개요

쿠버네티스 네이티브 정책 관리 도구입니다.

  Kyverno CLI는 Kyverno 리소스를 다루는 커맨드라인 인터페이스를 제공합니다.
  리소스를 클러스터에 추가하기 전에 정책 동작을 검증하고 테스트하는 데 쓸 수 있습니다.

  Kyverno CLI에는 다양한 Kyverno 리소스를 생성하고 다루는 데 도움이 되는 추가 명령도 포함돼 있습니다.

  참고: 실험적 명령을 활성화하려면 환경 변수 "KYVERNO_EXPERIMENTAL"을 true 또는 1로 설정해야 합니다.


```
kyverno [flags]
```

### 옵션

```
      --add_dir_header                      If true, adds the file directory to the header of the log messages
      --alsologtostderr                     log to standard error as well as files (no effect when -logtostderr=true)
      --alsologtostderrthreshold severity   logs at or above this threshold go to stderr when -alsologtostderr=true (no effect when -logtostderr=true)
  -h, --help                                kyverno 도움말
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

* [kyverno apply](/docs/kyverno-cli/reference/kyverno_apply)	 - 리소스에 정책을 적용합니다.
* [kyverno completion](/docs/kyverno-cli/reference/kyverno_completion)	 - 지정한 셸용 kyverno 자동 완성 스크립트를 생성합니다.
* [kyverno create](/docs/kyverno-cli/reference/kyverno_create)	 - 다양한 Kyverno 리소스 생성을 돕습니다.
* [kyverno docs](/docs/kyverno-cli/reference/kyverno_docs)	 - 레퍼런스 문서를 생성합니다.
* [kyverno migrate](/docs/kyverno-cli/reference/kyverno_migrate)	 - 하나 이상의 리소스를 저장 버전(stored version)으로 마이그레이션합니다.
* [kyverno oci](/docs/kyverno-cli/reference/kyverno_oci)	 - OCI 레지스트리에서 Kyverno CEL 정책 번들을 푸시, 풀, 검증, 조회, 리졸브합니다. 각 하위 명령의 플래그와 예시는 "kyverno oci <subcommand> --help"를 참고하세요.
* [kyverno test](/docs/kyverno-cli/reference/kyverno_test)	 - 로컬 파일시스템 또는 원격 git 저장소에서 테스트를 실행합니다.
* [kyverno version](/docs/kyverno-cli/reference/kyverno_version)	 - Kyverno CLI의 버전을 출력합니다.

