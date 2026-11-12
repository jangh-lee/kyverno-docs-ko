---
title: "kyverno apply"
weight: 35
---
## kyverno apply

리소스에 정책을 적용한다.

### 개요

리소스에 정책을 적용한다.


```
kyverno apply [flags]
```

### 예시

```
  # 평가 결과를 표로 출력
  kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --output-format table

  # 변경/생성된 리소스를 디렉터리에 저장
  kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --output-dir /path/to/results/

  # 변경/생성된 리소스를 파일에 저장
  kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --output-file /path/to/results.yaml

  # 리소스에 적용
  kyverno apply /path/to/policy.yaml /path/to/folderOfPolicies --resource=/path/to/resource1 --resource=/path/to/resource2

  # 리소스 폴더에 적용
  kyverno apply /path/to/policy.yaml /path/to/folderOfPolicies --resource=/path/to/resources/

  # 클러스터에 적용
  kyverno apply /path/to/policy.yaml /path/to/folderOfPolicies --cluster

  # gitSourceURL의 정책을 클러스터에 적용
  kyverno apply https://github.com/kyverno/policies/openshift/ --git-branch main --cluster

  # 변수를 지정해 단일 정책을 단일 리소스에 적용
  kyverno apply /path/to/policy.yaml --resource /path/to/resource.yaml --set <variable1>=<value1>,<variable2>=<value2>

  # 변수를 지정해 여러 정책을 여러 리소스에 적용
  kyverno apply /path/to/policy1.yaml /path/to/policy2.yaml --resource /path/to/resource1.yaml --resource /path/to/resource2.yaml -f /path/to/value.yaml
```

### 옵션

```
      --audit-warn                         현재는 아무 효과가 없다. ValidatingPolicy 감사 지원은 https://github.com/kyverno/kyverno/issues/16485 에서 추적한다
      --batch-size int                     API 호출 한 번에 가져올 리소스 수 (기본값 100)
  -c, --cluster                            현재 컨텍스트의 클러스터에 정책을 적용할지 확인한다
      --cluster-wide-resources             true로 설정하면 클러스터 범위 리소스에 정책을 적용한다
      --concurrent int                     리소스 로딩에 사용할 동시 워커 수 (기본값 1)
      --context string                     사용할 kubeconfig 컨텍스트 이름
      --context-file string                CEL 정책용 컨텍스트 데이터가 들어 있는 파일
      --continue-on-error                  리소스 로딩 오류가 있어도 처리를 계속한다 (기본값 true)
      --continue-on-fail                   true로 설정하면 현재 리소스에 정책을 적용하지 못해도 종료하지 않고 다음 리소스에 계속 적용한다
      --crd-paths strings                  apply 명령에 사용할 CRD 파일 경로 목록
      --detailed-results                   true로 설정하면 상세 결과를 표시한다
      --envoy-payload strings              Envoy check 요청 페이로드 파일(JSON) 경로
  -e, --exception strings                  리소스에 대해 정책을 평가할 때 고려할 정책 예외
      --exceptions strings                 리소스에 대해 정책을 평가할 때 고려할 정책 예외
      --exceptions-with-resources          리소스 경로의 정책 예외를 평가한다
      --exceptions-within-policies         정책 경로의 정책 예외를 평가한다
      --exceptions-within-resources        리소스 경로의 정책 예외를 평가한다
      --explain                            각 ValidatingPolicy, MutatingPolicy, GeneratingPolicy, ImageValidatingPolicy, DeletingPolicy가 결과에 이른 과정을 출력한다. 적용 여부, 매치 조건, 변수, 검사한 이미지와 검증 항목, 실행한 변경, 실행한 생성 항목, 삭제 조건이 포함된다. 트레이스에는 표현식이 읽은 리소스 필드와 변수 값이 그대로 출력되므로, 시크릿의 데이터를 읽는 정책은 그 데이터를 출력한다. 출력은 민감 정보로 취급한다
      --generate-exceptions                위반마다 정책 예외를 생성한다
      --generated-exception-ttl duration   생성된 예외의 기본 TTL (기본값 720h0m0s)
  -b, --git-branch string                  테스트 git 리포지터리 브랜치
  -h, --help                               apply 도움말
      --http-payload strings               HTTP check 요청 페이로드 파일(JSON) 경로
      --json strings                       JSON 페이로드 파일 경로
      --kubeconfig string                  인증 정보와 마스터 위치 정보가 들어 있는 kubeconfig 파일 경로
  -n, --namespace string                   cluster 플래그와 함께 전달하는 선택적 Policy 파라미터
      --output-dir string                  변경/생성된 리소스를 저장할 디렉터리
      --output-file string                 변경/생성된 리소스를 저장할 파일
      --output-format string               출력 형식: 정책 리포트/예외는 json 또는 yaml, 평가 결과는 table (기본값 "yaml")
      --parameter-resource strings         ValidatingAdmissionPolicy/MutatingAdmissionPolicy 파라미터로 쓰는 리소스 파일 경로
      --password string                    git 리포지터리 연결용 비밀번호
  -p, --policy-report                      지정하면 정책 리포트를 생성한다 (기본값 policyviolation)
      --registry                           true로 설정하면 로컬 docker 자격 증명으로 이미지 레지스트리에 접근해 외부 데이터를 채운다
      --remove-color                       출력에서 색상을 모두 제거한다
  -r, --resource strings                   리소스 파일 경로
      --resources strings                  리소스 파일 경로
  -s, --set strings                        필요한 변수
      --show-performance                   리소스 로딩 성능 메트릭을 표시한다
  -i, --stdin                              kubectl로 바로 파이프할 선택적 mutate 정책 파라미터
  -t, --table                              결과를 표 형식으로 표시한다
      --target-resource strings            mutate existing 정책의 대상 리소스가 들어 있는 개별 파일 경로
      --target-resources strings           mutate existing 정책의 대상 리소스 파일이 들어 있는 디렉터리 경로
  -u, --userinfo string                    롤, 클러스터 롤, 서브젝트를 포함한 어드미션 정보
      --username string                    git 리포지터리 연결용 사용자 이름
  -f, --values-file string                 정책 변수 값이 들어 있는 파일
      --warn-exit-code int                 경고 시 종료 코드를 설정한다. 실패나 오류가 있으면 1로 종료한다
      --warn-no-pass                       정책을 만족한 객체가 없을 때 경고 종료 코드를 발생시킬지 지정한다. --warn-exit-code 플래그와 함께 사용할 수 있다
      --warnings-as-errors                 사용 중단(deprecation) 경고를 오류로 처리한다
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

