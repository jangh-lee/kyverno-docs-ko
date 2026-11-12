---
title: 보안
excerpt: 보안 프로세스와 지침
sidebar:
  order: 90
---

Kyverno는 어드미션 컨트롤러로 동작하며 Kubernetes 컨트롤 플레인의 핵심 구성 요소입니다. Kyverno를 올바르게 보호하고 모니터링해야 합니다. 이 절에서는 Kyverno를 보호하는 방법과 Kyverno 프로젝트의 보안 프로세스를 안내합니다.

## 취약점 공개 절차

보안 취약점은 사용자가 공격에 노출되는 총 시간을 최소화하도록 신속하고 비공개로 처리하는 것이 가장 좋습니다.

취약점을 발견했거나 의심되면 [GitHub를 통해 비공개로 보고](https://github.com/kyverno/kyverno/security/advisories/new)해 주세요. 잠재적 취약점을 보고하는 창구는 GitHub 비공개 취약점 보고 하나뿐입니다. Kyverno 보안 대응팀이 보고를 추적하고, 수정을 조율하고, 공개 계획을 한곳에서 세울 수 있도록 이후 논의는 모두 비공개 GitHub 보안 권고(GHSA) 스레드에서 진행해 주세요.

보고서에는 다음 정보를 포함해 주세요.

- 문제 설명
- 문제를 재현한 정확하고 상세한 절차(스크린샷 포함)
- 영향을 받는 버전
- 알려진 완화 방법

보안 대응팀이 조사하고 수정과 공개를 조율하는 동안에는 취약점 세부 정보를 비공개로 유지해 주세요. 잠재적 취약점을 공개 GitHub 이슈, 풀 리퀘스트, Slack 채널에 보고하지 마세요.

보안 메일링 리스트는 더 이상 취약점 보고에 쓰지 않습니다. 이전에 이메일로 보고했지만 해결되지 않은 문제가 있다면, GitHub에 비공개 취약점 보고를 새로 제출하고 관련 세부 정보와 이전 대화 내용을 포함해 그곳에서 논의를 이어 가십시오.

Kyverno 보안 대응팀은 영업일 기준 3~5일 안에 공개 접수 확인을 보냅니다. 취약점과 완화 방법이 확인되면, 팀은 심각도와 복잡도에 따라 필요한 변경 사항을 릴리스할 계획을 세웁니다. 보안 정책과 프로세스의 자세한 내용은 Kyverno [git 저장소](https://github.com/kyverno/kyverno/blob/main/SECURITY.md)에서 볼 수 있습니다.

## 보안 권고

Kyverno는 프로젝트에서 발견된 모든 취약점에 대해 보안 권고를 게시합니다. 잠재적 보안 문제와 제공되는 패치를 파악하려면 [게시된 보안 권고](https://github.com/kyverno/kyverno/security/advisories)를 정기적으로 확인하세요.

## 보안 감사

Kyverno 프로젝트는 프로젝트의 보안 상태를 종합적으로 평가하는 서드파티 보안 감사와 검토에 참여합니다. 감사 내역은 다음과 같습니다.

### Kyverno 서드파티 보안 감사 2023

[Kyverno 서드파티 보안 감사](https://kyverno.io/blog/2023-security-audit/assets/kyverno-2023-security-audit-report.pdf)는 [Ada Logics](https://adalogics.com/)가 프로젝트 메인테이너와 협력해 수행했으며 [Cloud Native Computing Foundation](https://www.cncf.io/)이 비용을 지원했습니다. 감사에서 CVE 6건을 포함한 보안 이슈 10건을 확인하고 해결했으며, 수정 사항은 Kyverno v1.10.6과 v1.11.1에 반영되었습니다. 공식 릴리스를 사용하는 사용자는 Notary 검증기의 CVE에 영향을 받지 않았습니다. 감사에서 정책 우회 사례는 발견되지 않았고, 서드파티 종속성에서 보안 버그 두 건이 확인되었습니다. Kyverno는 [SLSA](https://slsa.dev/) 준수 수준이 높아 최고 점수를 받았고, 변조 방지 빌드 아티팩트를 확보한 것으로 확인되었습니다. 자세한 내용은 이 [블로그 글](https://kyverno.io/blog/2023/11/28/2023-security-audit/)에 있으며, 감사 보고서 링크는 글 하단에 있습니다.

### Kyverno 퍼징 보안 감사 2023

[Kyverno 퍼징 보안 감사](https://kyverno.io/blog/fuzzing-audit/assets/kyverno-2023-fuzzing-security-audit.pdf)는 CNCF의 보안 이니셔티브의 일환으로 수행되었습니다. 퍼즈 테스트(퍼징)는 시스템에 무작위 입력을 주입해 결함과 취약점을 찾아내는 자동화된 프로세스입니다. 2023년 7월과 8월에 걸쳐 진행된 감사에서 퍼저 15개가 버그 3건을 찾았습니다. 감사 이후에도 Kyverno는 [OSS-Fuzz](https://github.com/google/oss-fuzz)로 버그와 취약점을 계속 테스트합니다.
감사 결과에 따라 수정과 지속적인 테스트가 이루어져 코드베이스의 안전성과 견고함을 확보하고 있습니다. 퍼즈 테스트는 [이 블로그 글](https://kyverno.io/blog/2023/09/06/fuzzing-audit/)에서 더 읽을 수 있습니다.

### CNCF TAG Security 평가

CNCF 졸업 절차의 일환으로 Kyverno는 CNCF 보안 기술 자문 그룹(TAG Security)의 보안 평가를 받았습니다.

- [자체 평가](https://github.com/cncf/tag-security/blob/main/community/assessments/projects/kyverno/self-assessment.md) — Kyverno 메인테이너가 작성했으며, 프로젝트의 보안 상태, 위협 모델, CNCF 보안 모범 사례 준수 여부를 다룹니다.
- 공동 평가 — Kyverno 팀과 CNCF TAG Security 검토자가 함께 진행하는 평가로, 현재 진행 중입니다. 완료되면 [TAG Security 평가 디렉터리](https://github.com/cncf/tag-security/tree/main/community/assessments/projects/kyverno)에 게시됩니다.

## 문의

Kyverno 팀과 소통하거나 질문 및 논의를 하려면 [Slack](https://slack.k8s.io/#kyverno) 또는 [GitHub](https://github.com/kyverno/kyverno)를 이용하세요.

## 이슈

보안과 관련된 이슈에는 모두 `security` 레이블이 붙어 있으며 [여기](https://github.com/kyverno/kyverno/labels/security)에서 볼 수 있습니다.

## 릴리스 아티팩트

Kyverno 컨테이너 이미지는 [여기](https://github.com/orgs/kyverno/packages)에서 받을 수 있습니다.

릴리스마다 다음 아티팩트가 업로드됩니다(CLI 바이너리에는 서명 파일과 PEM 파일이 포함됩니다).

- checksums.txt
- install.yaml
- kyverno-cli-<version_number>.tar.gz
- kyverno-cli_v<version_number>\_darwin_arm64.tar.gz
- kyverno-cli_v<version_number>\_darwin_x86_64.tar.gz
- kyverno-cli_v<version_number>\_linux_arm64.tar.gz
- kyverno-cli_v<version_number>\_linux_s390x.tar.gz
- kyverno-cli_v<version_number>\_linux_x86_64.tar.gz
- kyverno-cli_v<version_number>\_windows_arm64.zip
- kyverno-cli_v<version_number>\_windows_x86_64.zip
- kyverno.io\_<crd_names>.yaml
- policies.kyverno.io\_<crd_names>.yaml
- reports.kyverno.io\_<crd_names>.yaml
- wgpolicyk8s.io\_<crd_names>.yaml
- Source code (zip)
- Source code (tar.gz)

## Kyverno 컨테이너 이미지, 설치 매니페스트, Helm 차트 검증

Kyverno 컨테이너 이미지와 매니페스트는 Cosign의 [키 없는 서명(keyless signing) 기능](https://docs.sigstore.dev/cosign/verifying/verify/)으로 서명됩니다. 서명은 참조하는 컨테이너 이미지와 별도의 저장소인 `ghcr.io/kyverno/signatures`에 저장됩니다. Cosign v1.x로 컨테이너 이미지와 매니페스트를 검증하려면 다음 단계를 따르십시오.

1. [Cosign](https://github.com/sigstore/cosign#installation)을 설치합니다.

2. Kyverno 서명 저장소를 설정합니다.

```sh
export COSIGN_REPOSITORY=ghcr.io/kyverno/signatures
```

3. 이미지를 검증합니다(JSON 출력을 보기 좋게 만드는 데 `jq`를 사용합니다).

<Tabs>
<TabItem label="Cosign v1.x">

```sh
# 이미지 검증
COSIGN_EXPERIMENTAL=1 cosign verify ghcr.io/kyverno/kyverno:<release_tag> | jq

# Kubernetes 설치 매니페스트 검증
COSIGN_EXPERIMENTAL=1 cosign verify ghcr.io/kyverno/manifests/kyverno:<release_tag> | jq

# kyverno Helm 차트 검증
COSIGN_EXPERIMENTAL=1 cosign verify ghcr.io/kyverno/charts/kyverno:<release_tag> | jq
```

</TabItem>
<TabItem label="Cosign v2.x">

```sh
# 이미지 검증
cosign verify ghcr.io/kyverno/kyverno:<release_tag> \
  --certificate-identity-regexp="https://github.com/kyverno/kyverno/.github/workflows/release.yaml@refs/tags/*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" | jq

# Kubernetes 설치 매니페스트 검증
cosign verify ghcr.io/kyverno/manifests/kyverno:<release_tag> \
  --certificate-identity-regexp="https://github.com/kyverno/kyverno/.github/workflows/release.yaml@refs/tags/*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" | jq

# kyverno Helm 차트 검증
cosign verify ghcr.io/kyverno/charts/kyverno:<release_tag> \
  --certificate-identity-regexp="https://github.com/kyverno/kyverno/.github/workflows/helm-release.yaml@refs/tags/*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" | jq
```

</TabItem>
</Tabs>

컨테이너 이미지가 올바르게 서명되었다면 출력은 다음과 비슷해야 합니다.

```sh
Verification for ghcr.io/kyverno/kyverno:v1.11.2 --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates
[
  {
    "critical": {
      "identity": {
        "docker-reference": "ghcr.io/kyverno/kyverno"
      },
      "image": {
        "docker-manifest-digest": "sha256:c2d33cc05ca2c7bab7ca13f4ef24276f4f1a83687e13a971945475b0e931bde8"
      },
      "type": "cosign container image signature"
    },
    "optional": {
      "1.3.6.1.4.1.57264.1.1": "https://token.actions.githubusercontent.com",
      "1.3.6.1.4.1.57264.1.2": "push",
      "1.3.6.1.4.1.57264.1.3": "5f9ed6f0f81e36a5f94a8bcece67ff94f7777a1a",
      "1.3.6.1.4.1.57264.1.4": "releaser",
      "1.3.6.1.4.1.57264.1.5": "kyverno/kyverno",
      "1.3.6.1.4.1.57264.1.6": "refs/tags/v1.11.2",
      "Bundle": {
        "SignedEntryTimestamp": "MEQCIH+Nnu89Mzm9XEb/f8n868uaQAGd631+kkx9mjcdYU+gAiAVPMEfIBGT5A+QBRfGR+X/Majgt+Jh5tsVNvlyvUu99A==",
        "Payload": {
          "body": "eyJhcGlWZXJzaW9uIjoiMC4w<snip>",
          "integratedTime": 1703770792,
          "logIndex": 59820453,
          "logID": "c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d"
        }
      },
      "Issuer": "https://token.actions.githubusercontent.com",
      "Subject": "https://github.com/kyverno/kyverno/.github/workflows/release.yaml@refs/tags/v1.11.2",
      "githubWorkflowName": "releaser",
      "githubWorkflowRef": "refs/tags/v1.11.2",
      "githubWorkflowRepository": "kyverno/kyverno",
      "githubWorkflowSha": "5f9ed6f0f81e36a5f94a8bcece67ff94f7777a1a",
      "githubWorkflowTrigger": "push",
      "ref": "5f9ed6f0f81e36a5f94a8bcece67ff94f7777a1a",
      "repo": "kyverno/kyverno",
      "workflow": "releaser"
    }
  }
]
```

출력에서 확인해야 할 중요한 필드는 `optional.Issuer`와 `optional.Subject`입니다. Issuer와 Subject가 위에 표시된 값과 다르면 정품 이미지가 아닙니다.

모든 Kyverno 이미지를 검증할 수 있습니다.

## 출처(Provenance) 검증

Kyverno는 [SLSA 표준](https://slsa.dev/provenance/v1.0)을 사용해 빌드의 출처를 생성하고 증명하며, SLSA [Level 3](https://slsa.dev/spec/v1.0/levels) 사양을 충족합니다. 증명된 출처는 `cosign` 도구로 검증할 수 있습니다.

Cosign v1.x에서는 다음 명령을 사용하세요.

```sh
COSIGN_EXPERIMENTAL=1 cosign verify-attestation \
  --type slsaprovenance ghcr.io/kyverno/kyverno:<release_tag> | jq .payload -r | base64 --decode | jq
```

Cosign v2.x에서는 다음 명령을 사용하세요.

```sh
cosign verify-attestation --type slsaprovenance \
  --certificate-identity-regexp="https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@refs/tags/*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/kyverno/kyverno:<release_tag> | jq .payload -r | base64 --decode | jq
```

출력은 아래와 비슷합니다.

```sh
Verification for ghcr.io/kyverno/kyverno:v1.11.2 --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates
Certificate subject: https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@refs/tags/v1.9.0
Certificate issuer URL: https://token.actions.githubusercontent.com
GitHub Workflow Trigger: push
GitHub Workflow SHA: 5f9ed6f0f81e36a5f94a8bcece67ff94f7777a1a
GitHub Workflow Name: releaser
GitHub Workflow Repository: kyverno/kyverno
GitHub Workflow Ref: refs/tags/v1.11.2
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v0.2",
  "subject": [
    {
      "name": "ghcr.io/kyverno/kyverno",
      "digest": {
        "sha256": "c2d33cc05ca2c7bab7ca13f4ef24276f4f1a83687e13a971945475b0e931bde8"
      }
    }
  ],
  "predicate": {
    "builder": {
      "id": "https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@refs/tags/v1.9.0"
    },
    "buildType": "https://github.com/slsa-framework/slsa-github-generator/container@v1",
    "invocation": {
      "configSource": {
        "uri": "git+https://github.com/kyverno/kyverno@refs/tags/v1.11.2",
        "digest": {
          "sha1": "5f9ed6f0f81e36a5f94a8bcece67ff94f7777a1a"
        },
        "entryPoint": ".github/workflows/release.yaml"
      },
      "parameters": {},
      "environment": {
```

## Kyverno SBOM 가져오기

Kyverno는 사전 릴리스를 포함한 모든 릴리스에 대해 [CycloneDX](https://cyclonedx.org/) JSON 형식의 SBOM(Software Bill of Materials)을 게시합니다. SBOM은 서명과 마찬가지로 별도의 저장소인 `ghcr.io/kyverno/sbom`에 저장됩니다. 특정 버전의 SBOM을 내려받아 검증하려면 Cosign을 설치하고 다음을 실행하세요.

```sh
COSIGN_REPOSITORY=ghcr.io/kyverno/sbom cosign download sbom ghcr.io/kyverno/kyverno:<release_tag>
```

SBOM을 파일로 저장하려면 다음 명령을 실행하세요.

```sh
COSIGN_REPOSITORY=ghcr.io/kyverno/sbom cosign download sbom ghcr.io/kyverno/kyverno:<release_tag> > kyverno.sbom.json
```

## 보안 스코어카드

Kyverno는 [OSSF의 Scorecards](https://github.com/ossf/scorecard)를 사용해 저장소 전반의 보안 기준을 유지합니다. Kyverno의 현재 OSSF/scorecard 점수는 이 [추적 이슈](https://github.com/kyverno/kyverno/issues/2617)에서 확인할 수 있습니다. Kyverno 팀은 높은 점수를 달성하고 유지하는 데 힘쓰고 있으며, 기여를 환영합니다.

## 취약점 스캔 리포트

Kyverno Helm 차트는 [Artifact Hub 페이지](https://artifacthub.io/packages/helm/kyverno/kyverno)에서 받을 수 있으며, Artifact Hub가 모든 릴리스에 대해 자동 생성한 [보안 리포트](https://artifacthub.io/packages/helm/kyverno/kyverno?modal=security-report)도 함께 제공됩니다.

## 보안 모범 사례

다음 절에서는 Kyverno와 관련된 모범 사례를 설명합니다.

### 파드 보안

Kyverno 파드는 보안 모범 사례를 따르도록 구성되어 있으며 [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)의 `restricted` 프로파일을 준수합니다.

- `runAsNonRoot`가 `true`로 설정됩니다.
- `privileged`가 `false`로 설정됩니다.
- `allowPrivilegeEscalation`이 `false`로 설정됩니다.
- `readOnlyRootFilesystem`이 `true`로 설정됩니다.
- 모든 capability를 제거합니다.
- limit과 quota가 구성되어 있습니다.
- liveness 프로브와 readiness 프로브가 구성되어 있습니다.

### RBAC

Kyverno RBAC 구성은 [설치](/docs/installation/customization#role-based-access-controls) 절에 설명되어 있습니다.

다음 명령으로 모든 Kyverno 롤을 확인합니다.

```sh
kubectl get clusterroles,roles -A | grep kyverno
```

### 네트워킹

Kyverno 네트워크 트래픽은 암호화되며, NetworkPolicy나 유사한 구성으로 제한해야 합니다.

기본 설치에서는 NetworkPolicy가 구성되지 않습니다([이 이슈](https://github.com/kyverno/kyverno/issues/2917) 참고). [Kyverno Helm 차트](https://artifacthub.io/packages/helm/kyverno/kyverno)에는 NetworkPolicy를 활성화하는 `networkPolicy.enabled` 옵션이 있습니다.

#### NetworkPolicy를 구성하지 않을 때의 위험

NetworkPolicy가 없으면 모든 파드에서 웹훅에 접근할 수 있고 아웃바운드 트래픽도 제한되지 않습니다. 아래 [위협 모델](#위협-모델)의 여러 완화 방법은 NetworkPolicy가 있다고 가정하므로, 없으면 다음 위험이 남습니다.

- 웹훅 직접 접근(위협 ID 1, 2, 8, 9): Kyverno는 API 서버를 인증하지 않으므로, 9443 포트에 닿는 파드는 누구든 웹훅에 트래픽을 쏟아붓거나 임의의 `AdmissionReview` 요청을 보낼 수 있습니다.
- 데이터 유출(위협 ID 18): 정책이 CEL [HTTP 라이브러리](/docs/policy-types/cel-libraries#http-library)(`http.Get()` / `http.Post()`)로 어드미션 요청 데이터를 클라우드 메타데이터와 링크 로컬 주소를 포함해 접근 가능한 모든 엔드포인트로 보낼 수 있습니다. [GlobalContextEntry](/docs/policy-types/global-context-caching)도 캐시된 데이터를 갱신하려고 외부 엔드포인트에 접속할 수 있습니다.
- 컨트롤러 탈취(위협 ID 4): 컨트롤러는 Kyverno 정책과 자신의 `MutatingWebhookConfiguration` / `ValidatingWebhookConfiguration`을 수정할 수 있으므로, 탈취된 파드가 클러스터가 강제하는 내용을 몰래 바꿀 수 있습니다. 이그레스 정책이 없으면 API 서버와 다른 내부 서비스에도 접근할 수 있습니다.

이를 완화하려면 아래 나열된 흐름만 허용하도록 NetworkPolicy를 구성하세요.

Kyverno는 다음 네트워크 통신이 허용되어야 합니다.

- API 서버에서 9443 포트로 들어오는 인그레스 트래픽
- 헬스 체크를 위해 호스트에서 9443 포트로 들어오는 인그레스 트래픽
- Prometheus 등 메트릭 수집기가 메트릭을 수집하는 경우 8000 포트로 들어오는 인그레스 트래픽
- 컨트롤러의 정상 동작과 [리소스 조회](/docs/policy-types/cel-libraries#resource-library)를 위해 API 서버로 나가는 이그레스 트래픽
- [이미지 검증](/docs/policy-types/image-validating-policy)이나 [이미지 메타데이터 조회](/docs/policy-types/cel-libraries#image-library)를 위해 OCI 레지스트리로 나가는 이그레스(HTTPS) 트래픽
- [HTTP 라이브러리](/docs/policy-types/cel-libraries#http-library)나 외부 [글로벌 컨텍스트 소스](/docs/policy-types/global-context-caching)를 사용하는 경우 외부 서비스로 나가는 이그레스(HTTP 또는 HTTPS) 트래픽

다음 절의 샘플 매니페스트가 이 흐름을 구현합니다.

#### 참조용 샘플 매니페스트

이 매니페스트는 **기준이 되는 참조용**이며 프로덕션에 바로 쓸 수 있는 기본값이 아닙니다. NetworkPolicy의 동작은 클러스터 유형, CNI, 제공자에 따라 다릅니다. 적용하기 전에 셀렉터, CIDR, 허용할 이그레스 대상을 환경에 맞게 조정하세요.

:::note[CNI 적용 여부]
NetworkPolicy는 클러스터의 CNI 플러그인이 지원할 때만 적용됩니다. 이 매니페스트를 보안 통제 수단으로 삼기 전에 지원 여부를 확인하세요.
:::

샘플은 Kyverno가 `kyverno` 네임스페이스에 설치되었다고 가정합니다. 컨트롤러별 포트는 다음과 같습니다.

| 컨트롤러                | 웹훅 | 메트릭 |
| ----------------------- | ---- | ------ |
| `admission-controller`  | 9443 | 8000   |
| `cleanup-controller`    | 9443 | 8000   |
| `background-controller` | —    | 8000   |
| `reports-controller`    | —    | 8000   |

이그레스 요구 사항은 네 컨트롤러가 모두 같습니다.

- list/watch와 CEL [리소스 조회](/docs/policy-types/cel-libraries#resource-library)를 위한 **Kubernetes API 서버**
- **DNS**
- [이미지 검증](/docs/policy-types/image-validating-policy)과 [이미지 메타데이터 조회](/docs/policy-types/cel-libraries#image-library)를 위한 **OCI 레지스트리**
- [글로벌 컨텍스트 소스](/docs/policy-types/global-context-caching)와 [CEL HTTP 라이브러리](/docs/policy-types/cel-libraries#http-library)를 위한 **외부 HTTPS 엔드포인트**. 둘 중 하나라도 일반 HTTP를 쓴다면 아래 이그레스 정책에 80 포트 규칙을 추가하세요.

샘플은 기본 설치의 레이블을 사용하며, 이때 `app.kubernetes.io/instance`와 `app.kubernetes.io/part-of`는 모두 `kyverno`입니다. 다른 릴리스 이름을 썼다면 이 값이 다릅니다. 적용하기 전에 파드의 실제 레이블을 확인해 매니페스트에 그대로 옮기십시오.

```sh
kubectl get pods -n kyverno --show-labels
```

##### 인그레스: 어드미션 및 정리 컨트롤러

9443 포트는 API 서버의 웹훅 트래픽과 kubelet의 헬스 프로브를 받습니다. 둘 다 파드나 네임스페이스 셀렉터와 안정적으로 맞지 않으므로, 아래 규칙은 9443 포트에서 모든 소스를 허용합니다. 정책의 `podSelector`가 이미 컨트롤러로 범위를 한정합니다.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: kyverno-admission-controller
  namespace: kyverno
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/part-of: kyverno
      app.kubernetes.io/instance: kyverno
      app.kubernetes.io/component: admission-controller
  policyTypes:
    - Ingress
  ingress:
    - ports:
        - protocol: TCP
          port: 9443
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: monitoring
      ports:
        - protocol: TCP
          port: 8000
```

정리 컨트롤러에도 같은 매니페스트를 적용합니다. `metadata.name`을 `kyverno-cleanup-controller`로 바꾸고, `spec.podSelector.matchLabels`의 `app.kubernetes.io/component`를 `cleanup-controller`로 바꾸세요.

##### 인그레스: 백그라운드 및 리포트 컨트롤러

이 컨트롤러는 웹훅을 실행하지 않으므로 메트릭 포트만 인그레스가 필요합니다.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: kyverno-background-controller
  namespace: kyverno
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/part-of: kyverno
      app.kubernetes.io/instance: kyverno
      app.kubernetes.io/component: background-controller
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: monitoring
      ports:
        - protocol: TCP
          port: 8000
```

리포트 컨트롤러에도 같은 매니페스트를 적용합니다. `metadata.name`을 `kyverno-reports-controller`로 바꾸고, `spec.podSelector.matchLabels`의 `app.kubernetes.io/component`를 `reports-controller`로 바꾸세요.

##### 이그레스: 모든 Kyverno 컨트롤러

이그레스 정책 하나로 네 컨트롤러를 모두 처리합니다. 이 정책은 DNS, Kubernetes API 서버, 공용 엔드포인트로 나가는 HTTPS를 허용합니다. 클라우드 메타데이터 대역(`169.254.0.0/16`)과 RFC1918 사설 대역(보통 파드 및 서비스 CIDR이 포함됩니다)은 차단합니다.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: kyverno-egress
  namespace: kyverno
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/part-of: kyverno
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    - to:
        - ipBlock:
            cidr: 203.0.113.10/32
      ports:
        - protocol: TCP
          port: 443
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 169.254.0.0/16
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

:::caution[적용 전에 교체]

- 이 샘플은 차트가 생성하는 NetworkPolicy와 오브젝트 이름이 같습니다. 차트에서 `networkPolicy.enabled: true`를 설정했다면 위의 인그레스 샘플을 함께 적용하지 마세요. 함께 적용하면 `kubectl apply`가 차트와 충돌하고, 다음 `helm upgrade`에서 변경 내용이 덮어써집니다.
- `203.0.113.10/32`는 [RFC 5737](https://datatracker.ietf.org/doc/html/rfc5737) TEST-NET-3 대역의 문서용 자리표시자입니다. 이 규칙은 CEL [리소스 조회](/docs/policy-types/cel-libraries#resource-library)뿐 아니라 컨트롤러의 정상 동작에 필요합니다. 이 값을 CNI가 Kyverno 파드에서 Kubernetes API 서버로 가는 트래픽에 대해 평가하는 CIDR로 교체하세요. 클러스터와, Service DNAT 기준으로 NetworkPolicy가 적용되는 위치에 따라 `kubernetes.default` 서비스의 ClusterIP일 수도 있고, DNAT 이후의 컨트롤 플레인 엔드포인트일 수도 있으며, 둘 다일 수도 있습니다. 다음 명령으로 가능한 대상을 확인하세요.

  ```sh
  # Kubernetes Service ClusterIP
  kubectl get service kubernetes -n default \
    -o jsonpath='{.spec.clusterIP}{"\n"}'

  # Service 뒤의 API 서버 엔드포인트
  kubectl get endpoints kubernetes -n default -o wide
  ```

  적용한 뒤에는 Kyverno 컨트롤러 네 개가 모두 API 연결을 유지하는지 확인하세요(파드가 `Ready` 상태를 유지하고, 로그에 `dial tcp` 타임아웃이 없어야 합니다).

- `monitoring`은 Prometheus가 있는 네임스페이스의 자리표시자입니다. 메트릭을 수집하는 네임스페이스로 교체하세요.
- DNS 규칙은 `kube-system`에 `k8s-app: kube-dns` 파드가 있다고 가정합니다. kubeadm, GKE, EKS, AKS에서는 이 가정이 맞습니다. OpenShift에서는 podSelector를 `dns.operator.openshift.io/daemonset-dns: default`로, namespaceSelector를 `kubernetes.io/metadata.name: openshift-dns`로 바꾸세요.
- `0.0.0.0/0` 블록은 기본적으로 RFC1918을 제외합니다. RFC1918은 보통 파드 및 서비스 CIDR을 포함합니다. 미러 레지스트리나 [HTTP 라이브러리](/docs/policy-types/cel-libraries#http-library)로 호출하는 서비스처럼 클러스터 내부 대상이 있다면, 그 위에 명시적인 허용 규칙을 추가하세요.

:::

##### 확인

NetworkPolicy가 적용되었는지, API 서버가 어드미션 웹훅에 여전히 접근할 수 있는지 확인합니다.

```sh
kubectl get networkpolicy -n kyverno
kubectl run netpol-test \
  --image=nginx \
  --restart=Never \
  --namespace=default \
  --dry-run=server
```

서버 측 드라이 런은 파드를 스케줄링하지 않고 어드미션 경로를 거칩니다. 어드미션 웹훅에 접근할 수 있는지만 확인하며, Kyverno가 Kubernetes API, DNS, 레지스트리, 외부 서비스로 나가는 아웃바운드 접근은 확인하지 않습니다.

이그레스 정책을 적용한 뒤에는 Kyverno 컨트롤러 디플로이먼트가 모두 사용 가능한 상태인지 확인하세요.

```sh
kubectl rollout status deployment -l app.kubernetes.io/part-of=kyverno -n kyverno
kubectl get pods -n kyverno
```

컨트롤러 로그에서 Kubernetes API 연결 실패, list/watch 오류, DNS 실패, 요청 타임아웃이 있는지 살펴보십시오.

```sh
kubectl logs -n kyverno \
  -l app.kubernetes.io/part-of=kyverno \
  --all-containers \
  --since=10m \
  --prefix
```

이미지 검증, 이미지 레지스트리 컨텍스트 변수, 외부 서비스 호출을 구성했다면 해당 기능이 필요로 하는 아웃바운드 대상에 계속 접근할 수 있는지 따로 테스트하세요.

##### Helm 차트 사용

Helm 차트는 컨트롤러별 `networkPolicy.enabled`로 인그레스 정책 네 개를 생성할 수 있습니다([차트 `values.yaml`](https://github.com/kyverno/kyverno/blob/main/charts/kyverno/values.yaml) 참고). 이그레스 규칙은 생성하지 않으므로 위의 `kyverno-egress`를 차트와 함께 적용하고, 충돌을 피하기 위해 인그레스 샘플은 건너뛰십시오.

##### 심층 방어

위의 참조 샘플에 제한적인 이그레스 정책을 함께 적용하세요.

- 정책의 HTTP 호출에 쓰는 승인된 외부 대상만 허용합니다.
- 설계상 필요하지 않다면 메타데이터 엔드포인트와 사설/링크 로컬 대역을 명시적으로 차단합니다.

Kyverno는 CEL 정책의 HTTP 사용을 제한하는 HTTP 강화 설정(`allowHTTPInNamespacedPolicies`, `httpBlocklist`, `httpAllowlist`)도 제공합니다. [구성 상세](/docs/installation/customization#http-calls)를 참고하세요.

### 웹훅

다음 명령으로 모든 Kyverno 웹훅을 확인합니다.

```sh
kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations | grep kyverno
```

Kyverno는 다음 변경(mutating) 웹훅 구성을 생성합니다.

- `kyverno-policy-mutating-webhook-cfg`: 정책 변경을 처리해 정책 집합을 인덱싱하고 캐시합니다.
- `kyverno-resource-mutating-webhook-cfg`: 리소스 어드미션 요청을 처리해 일치하는 Kyverno 변경 정책 규칙을 적용합니다.
- `kyverno-verify-mutating-webhook-cfg`: Kyverno 웹훅 구성을 주기적으로 테스트합니다.

Kyverno는 다음 검증(validating) 웹훅 구성을 생성합니다.

- `kyverno-policy-validating-webhook-cfg`: 스키마 검증으로는 할 수 없는 검사로 Kyverno 정책을 검증합니다.
- `kyverno-resource-validating-webhook-cfg`: 리소스 어드미션 요청을 처리해 일치하는 Kyverno 검증 정책 규칙을 적용합니다.
- `kyverno-cleanup-validating-webhook-cfg`: 정리 정책을 처리합니다.
- `kyverno-exception-validating-webhook-cfg`: 정책 예외를 처리합니다.

#### 웹훅 실패 모드

Kyverno 정책은 기본적으로 **fail-closed**로 구성됩니다. 이 설정은 [정책별로](/docs/installation/customization#webhooks) 조정할 수 있습니다. Kyverno는 구성된 정책 집합을 보고 웹훅을 자동으로 구성합니다.

#### 웹훅 인증과 암호화

기본적으로 Kyverno는 API 서버 인증과 네트워크 트래픽 암호화에 쓰는 TLS 인증서를 자동으로 생성하고 관리합니다. 사용자 지정 CA를 쓰려면 [설치 절](/docs/installation/customization#certificate-management)의 설명을 참고하세요.

### 권장 정책

Kyverno 커뮤니티는 [샘플 정책](/policies/) 모음을 관리합니다.

최소한 [Pod Security Standards](/docs/guides/pod-security)와 [모범 사례](/policies/?policytypes=Best%2520Practices) 정책 집합은 사용하기를 권장합니다.

### 정책 보호

Kyverno 정책은 네임스페이스 범위와 클러스터 범위의 리소스를 변경하고 생성할 수 있습니다. 따라서 정책을 중요한 리소스로 취급하고 RBAC로 정책 접근을 보호해야 합니다. 이 정책 집합에 있는 일부 정책에는 대체 버전이 있을 수 있습니다. 모든 정책은 설치하기 전에 검토해야 합니다.

## 위협 모델

[Kubernetes SIG Security](https://github.com/kubernetes/community/tree/master/sig-security) 팀은 [어드미션 컨트롤 위협 모델](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md)을 정의했습니다. Kyverno 관리자는 이 위협 모델을 읽고 이해한 뒤, 이를 출발점으로 삼아 자체 위협 모델을 만들기를 강력히 권장합니다.

아래 절에서는 각 위협과 완화 방법을 나열하고 Kyverno에 해당하는 세부 내용을 설명합니다.

### 위협 ID 1 - 공격자가 웹훅에 트래픽을 쏟아부어 동작을 방해함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-1---attacker-floods-webhook-with-traffic-preventing-its-operations)

**완화 방법:**

- [완화 ID 2 - 웹훅이 fail-closed로 동작](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-2---webhook-fails-closed)

  Kyverno 정책은 기본적으로 **fail-closed**로 구성됩니다. 이 설정은 [정책별로](/docs/installation/customization#webhooks) 조정할 수 있습니다. Kyverno는 구성된 정책 집합을 보고 웹훅을 자동으로 구성합니다.

### 위협 ID 2 - 공격자가 복잡한 처리가 필요한 워크로드를 보내 타임아웃을 유발함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-2---attacker-passes-workloads-which-require-complex-processing-causing-timeouts)

**완화 방법:**

- [완화 ID 2 - 웹훅이 fail-closed로 동작](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-2---webhook-fails-closed)

  Kyverno 정책은 기본적으로 **fail-closed**로 구성됩니다. 이 설정은 [정책별로](/docs/installation/customization#webhooks) 조정할 수 있습니다. Kyverno는 구성된 정책 집합을 보고 웹훅을 자동으로 구성합니다.

- [완화 ID 3 - 웹훅이 호출자를 인증함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-3---webhook-authenticates-callers)

  기본적으로 Kyverno는 웹훅 등록에 쓸 CA와 X.509 인증서를 생성합니다. [구성 가이드](/docs/installation/customization#custom-certificates)에 설명된 대로 사용자 지정 CA와 인증서를 쓸 수 있습니다. 현재 Kyverno는 API 서버를 인증하지 않습니다. 네트워크 정책으로 Kyverno 웹훅 포트로 향하는 트래픽을 제한할 수 있습니다.

### 위협 ID 3 - 공격자가 웹훅의 잘못된 구성을 악용해 우회함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-3---attacker-exploits-misconfiguration-of-webhook-to-bypass)

**완화 방법:**

- [완화 ID 8 - 웹훅 구성을 정기적으로 검토해 문제를 찾아냄](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-8---regular-reviews-of-webhook-configuration-catch-issues)

  Kyverno는 구성된 정책 집합을 바탕으로 웹훅 구성을 자동으로 생성합니다. 따라서 웹훅은 항상 최신 상태이며 최소한으로 구성됩니다.

### 위협 ID 4 - 공격자에게 Kubernetes 웹훅 오브젝트를 삭제하거나 수정할 권한이 있음

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-4---attacker-has-rights-to-delete-or-modify-the-k8s-webhook-object)

**완화 방법:**

- [완화 ID 1 - RBAC 권한을 엄격하게 통제함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-1---rbac-rights-are-strictly-controlled)

  Kyverno RBAC 구성은 [설치 절](/docs/installation/customization#role-based-access-controls)에 설명되어 있습니다. Kyverno는 `kyverno:admission-controller` 롤로 웹훅을 구성합니다. Kyverno에 필요한 권한만 부여하고 RBAC 롤과 롤 바인딩의 변경을 감사하는 것이 중요합니다.

### 위협 ID 5 - 공격자가 웹훅의 유효한 자격 증명을 획득함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-5---attacker-gets-access-to-valid-credentials-for-the-webhook)

**완화 방법:**

- [완화 ID 2 - 웹훅이 fail-closed로 동작](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-2---webhook-fails-closed)

  Kyverno 정책은 기본적으로 **fail-closed**로 구성됩니다. 이 설정은 [정책별로](/docs/installation/customization#webhooks) 조정할 수 있습니다. Kyverno는 구성된 정책 집합을 보고 웹훅을 자동으로 구성합니다.

### 위협 ID 6 - 공격자가 클러스터 관리자 자격 증명을 획득함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-6---attacker-gains-access-to-a-cluster-admin-credential)

**완화 방법**

**N/A**

### 위협 ID 7 - 공격자가 컨테이너 네트워크의 트래픽을 스니핑함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-7---attacker-sniffs-traffic-on-the-container-network)

**완화 방법:**

- [완화 ID 4 - 웹훅이 모든 트래픽에 TLS 암호화를 사용함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-4---webhook-uses-tls-encryption-for-all-traffic)

  Kyverno는 모든 웹훅 트래픽에 HTTPS를 사용합니다.

### 위협 ID 8 - 공격자가 웹훅에 중간자(MITM) 공격을 수행함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-8---attacker-carries-out-a-mitm-attack-on-the-webhook)

**완화 방법:**

- [완화 ID 5 - 웹훅 상호 TLS 인증을 사용함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-5---webhook-mutual-tls-authentication-is-used)

  기본적으로 Kyverno는 웹훅 등록에 쓸 CA와 X.509 인증서를 생성합니다. [구성 가이드](/docs/installation/customization#custom-certificates)에 설명된 대로 사용자 지정 CA와 인증서를 쓸 수 있습니다. 현재 Kyverno는 API 서버를 인증하지 않습니다. 네트워크 정책으로 Kyverno 웹훅 포트로 향하는 트래픽을 제한할 수 있습니다.

### 위협 ID 9 - 공격자가 스푸핑으로 웹훅의 트래픽을 가로챔

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-9---attacker-steals-traffic-from-the-webhook-via-spoofing)

**완화 방법:**

- [완화 ID 5 - 웹훅 상호 TLS 인증을 사용함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-5---webhook-mutual-tls-authentication-is-used)

  기본적으로 Kyverno는 웹훅 등록에 쓸 CA와 X.509 인증서를 생성합니다. [구성 가이드](/docs/installation/customization#custom-certificates)에 설명된 대로 사용자 지정 CA와 인증서를 쓸 수 있습니다. 현재 Kyverno는 API 서버를 인증하지 않습니다. 네트워크 정책으로 Kyverno 웹훅 포트로 향하는 트래픽을 제한할 수 있습니다.

### 위협 ID 10 - 변경 규칙을 악용해 권한 있는 컨테이너를 생성함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-10---abusing-a-mutation-rule-to-create-a-privileged-container)

**완화 방법:**

- [완화 ID 6 - 모든 규칙을 검토하고 테스트함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#Mitigation-id-6---all-rules-are-reviewed-and-tested)

  Kyverno 규칙은 YAML로 작성하고 OpenAPIv3 스키마로 관리하는 Kubernetes 리소스입니다. 덕분에 정책 정의를 이해하기 쉽고 코드 리뷰 같은 Policy-as-Code 모범 사례를 Kyverno 정책에 적용할 수 있습니다. [Kyverno CLI](/docs/subprojects/kyverno-cli)는 지속적 배포 파이프라인에서 단위 테스트를 실행하는 `test` 명령을 제공합니다.

### 위협 ID 11 - 공격자가 어드미션 컨트롤에서 제외된 네임스페이스에 워크로드를 배포함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-11---attacker-deploys-workloads-to-namespaces-that-are-exempt-from-admission-control)

**완화 방법:**

- [완화 ID 1 - RBAC 권한을 엄격하게 통제함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-1---rbac-rights-are-strictly-controlled)

  Kyverno RBAC 구성은 [구성 절](/docs/installation/customization#role-based-access-controls)에 설명되어 있습니다. Kyverno는 `kyverno:admission-controller` 롤로 웹훅을 구성합니다. Kyverno에 필요한 권한만 부여하고 RBAC 롤과 롤 바인딩의 변경을 감사하는 것이 중요합니다.

  Kyverno는 Kyverno 네임스페이스 자체를 포함한 일부 핵심 시스템 네임스페이스를 기본적으로 제외합니다. 이 제외 대상은 [ConfigMap](/docs/installation/customization#configmap-keys)으로 관리하고 구성할 수 있습니다.

### 위협 ID 12 - 누락된 매치(예: initContainers 누락) 때문에 차단 규칙을 우회할 수 있음

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-12---block-rule-can-be-bypassed-due-to-missing-match-eg-missing-initcontainers)

**완화 방법:**

- [완화 ID 6 - 모든 규칙을 검토하고 테스트함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#Mitigation-id-6---all-rules-are-reviewed-and-tested)

  Kyverno 규칙은 YAML로 작성하고 OpenAPIv3 스키마로 관리하는 Kubernetes 리소스입니다. 덕분에 정책 정의를 이해하기 쉽고 코드 리뷰 같은 Policy-as-Code 모범 사례를 Kyverno 정책에 적용할 수 있습니다. [Kyverno CLI](/docs/subprojects/kyverno-cli)는 지속적 배포 파이프라인에서 단위 테스트를 실행하는 `test` 명령을 제공합니다.

### 위협 ID 13 - 공격자가 차단 목록의 부실한 문자열 매칭을 악용해 규칙을 우회함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-13---attacker-exploits-bad-string-matching-on-a-blocklist-to-bypass-rules)

**완화 방법:**

- [완화 ID 6 - 모든 규칙을 검토하고 테스트함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#Mitigation-id-6---all-rules-are-reviewed-and-tested)

  Kyverno 규칙은 YAML로 작성하고 OpenAPIv3 스키마로 관리하는 Kubernetes 리소스입니다. 덕분에 정책 정의를 이해하기 쉽고 코드 리뷰 같은 Policy-as-Code 모범 사례를 Kyverno 정책에 적용할 수 있습니다. [Kyverno CLI](/docs/subprojects/kyverno-cli)는 지속적 배포 파이프라인에서 단위 테스트를 실행하는 `test` 명령을 제공합니다.

### 위협 ID 14 - 공격자가 규칙이 없는 Kubernetes API의 신규/구 기능을 사용함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-14---attacker-uses-newold-features-of-the-kubernetes-api-which-have-no-rules)

**완화 방법:**

- [완화 ID 6 - 모든 규칙을 검토하고 테스트함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#Mitigation-id-6---all-rules-are-reviewed-and-tested)

  Kyverno 규칙은 YAML로 작성하고 OpenAPIv3 스키마로 관리하는 Kubernetes 리소스입니다. 덕분에 정책 정의를 이해하기 쉽고 코드 리뷰 같은 Policy-as-Code 모범 사례를 Kyverno 정책에 적용할 수 있습니다. [Kyverno CLI](/docs/subprojects/kyverno-cli)는 지속적 배포 파이프라인에서 단위 테스트를 실행하는 `test` 명령을 제공합니다.

### 위협 ID 15 - 공격자가 웹훅 컨트롤러가 실행 중인 노드에 권한 있는 컨테이너를 배포함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-15---attacker-deploys-privileged-container-to-node-running-webhook-controller)

**완화 방법:**

- [완화 ID 7 - 어드미션 컨트롤러가 제한적인 정책으로 권한 있는 워크로드를 막음](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-7---admission-controller-uses-restrictive-policies-to-prevent-privileged-workloads)

  Kyverno [정책 라이브러리](/policies/)에는 컨테이너 권한을 제한하고 호스트 리소스 접근을 제한하는 정책이 있습니다. Pod Security Standards와 모범 사례 정책을 적극 권장합니다.

### 위협 ID 16 - 공격자가 권한 있는 노드 hostPath를 마운트해 웹훅 컨트롤러 구성을 수정함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-16---attacker-mounts-a-privileged-node-hostpath-allowing-modification-of-webhook-controller-configuration)

**완화 방법:**

- [완화 ID 7 - 어드미션 컨트롤러가 제한적인 정책으로 권한 있는 워크로드를 막음](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-7---admission-controller-uses-restrictive-policies-to-prevent-privileged-workloads)

  Kyverno [정책 라이브러리](/policies/)에는 컨테이너 권한을 제한하고 호스트 리소스 접근을 제한하는 정책이 있습니다. Pod Security Standards와 모범 사례 정책을 적극 권장합니다.

### 위협 ID 17 - 공격자가 어드미션 웹훅이 실행 중인 클러스터 노드에 권한 있는 SSH 접근 권한을 가짐

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-17---attacker-has-privileged-ssh-access-to-cluster-node-running-admission-webhook)

**완화 방법**

**N/A**

### 위협 ID 18 - 공격자가 정책을 이용해 어드미션 요청의 기밀 데이터를 외부 시스템으로 전송함

[위협 모델 링크](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#threat-id-18---attacker-uses-policies-to-send-confidential-data-from-admission-requests-to-external-systems)

**완화 방법:**

- [완화 ID 9 - 외부 시스템 접근을 엄격하게 통제함](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/admission-control/kubernetes-admission-control-threat-model.md#mitigation-id-9---strictly-control-external-system-access)

  Kyverno의 네트워크 통신을 보호하는 방법은 [네트워킹](#네트워킹)을 참고하세요.

