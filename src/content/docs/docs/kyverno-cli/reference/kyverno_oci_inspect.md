---
title: "kyverno oci inspect"
weight: 35
---
## kyverno oci inspect

푸시된 번들의 리졸브된 다이제스트, 리소스 인덱스, 세트, 소스 및 리비전 메타데이터, 매니페스트 어노테이션, Kyverno 호환성을 보여 줍니다.

### 개요

푸시된 번들의 리졸브된 다이제스트, 리소스 인덱스, 세트, 소스 및 리비전 메타데이터, 매니페스트 어노테이션, Kyverno 호환성을 보여 줍니다.
  이 명령은 매니페스트와 config blob만 읽으며, 콘텐츠 레이어는 다운로드하거나 검증하지 않습니다. 아카이브 전체를 다시 검증하려면 "kyverno oci validate -i"를 사용하세요.
  --output json 또는 yaml을 지정하면 같은 정보를 스크립트에서 쓰기 좋은 안정적인 형식으로 출력합니다. config 섹션은 config blob의 내용을 그대로 재현하지만, JSON 출력에서는 들여쓰기가 다시 적용됩니다.


```
kyverno oci inspect [flags]
```

### 예시

```
  # 푸시된 번들 조회
  kyverno oci inspect -i ghcr.io/acme/baseline:v1.0.0

  # 다이제스트로 고정된 번들을 JSON으로 조회
  kyverno oci inspect -i ghcr.io/acme/baseline@sha256:... -o json

  # 특정 대상 Kyverno 버전에 대한 호환성 확인
  kyverno oci inspect -i ghcr.io/acme/baseline:v1.0.0 --kyverno-version 1.20.0
```

### 옵션

```
  -h, --help                     inspect 도움말
  -i, --image string             조회할 푸시된 번들의 이미지 참조(태그 또는 다이제스트)
      --kyverno-version string   이 CLI의 버전 대신 호환성 기준으로 삼을 Kyverno 버전
  -o, --output string            출력 형식(json, yaml). 생략하면 사람이 읽기 쉬운 텍스트로 출력
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

