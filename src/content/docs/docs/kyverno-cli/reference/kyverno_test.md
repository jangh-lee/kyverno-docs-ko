---
title: "kyverno test"
weight: 35
---
## kyverno test

로컬 파일시스템 또는 원격 git 리포지터리에서 테스트를 실행한다.

### 개요

로컬 파일시스템 또는 원격 git 리포지터리에서 테스트를 실행한다.

  test 명령은 테스트 매니페스트 파일에 미리 선언한 기대 결과를 Kyverno가 보고한 실제 결과와 비교해,
  정책에 대해 리소스를 테스트하는 기능을 제공한다.

  사용자는 kyverno-test.yaml 파일이 들어 있는 폴더의 경로를 지정하며,
  이 위치는 로컬 파일시스템이나 원격 git 리포지터리일 수 있다.


```
kyverno test [local folder or git repository]... [flags]
```

### 예시

```
  # Kyverno 테스트 케이스가 들어 있는 git 리포지터리 테스트
  kyverno test https://github.com/kyverno/policies/pod-security --git-branch main

  # 테스트 케이스가 들어 있는 로컬 폴더 테스트
  kyverno test .

  # 로컬 폴더의 여러 테스트 케이스 중 일부만 테스트
  kyverno test . --test-case-selector "policy=disallow-latest-tag, rule=require-image-tag, resource=test-require-image-tag-pass"
```

### 옵션

```
      --detailed-results            true로 설정하면 상세 결과를 표시한다
      --fail-only                   true로 설정하면 test 명령의 출력으로 실패한 테스트만 표시한다
  -f, --file-name string            테스트 파일 이름 (기본값 "kyverno-test.yaml")
  -b, --git-branch string           테스트 github 리포지터리 브랜치
  -h, --help                        test 도움말
  -o, --output-format string        출력 형식 지정 (json, yaml, markdown, junit)
      --registry                    true로 설정하면 로컬 docker 자격 증명으로 이미지 레지스트리에 접근해 외부 데이터를 채운다
      --remove-color                출력에서 색상을 모두 제거한다
      --require-tests               true로 설정하면 테스트를 찾지 못했을 때 오류를 반환한다
  -t, --test-case-selector string   실행할 테스트 케이스 필터 (기본값 "policy=*,rule=*,resource=*")
      --warnings-as-errors          사용 중단(deprecation) 경고를 오류로 처리한다
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

