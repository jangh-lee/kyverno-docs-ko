---
title: 정책 적용
excerpt: 클러스터와 배포 파이프라인 전반에 정책을 적용합니다.
sidebar:
  order: 40
---

:::tip[팁]
[Kyverno 정책](/policies/) 저장소에는 클러스터에 바로 적용할 수 있는 정책이 여럿 있습니다.
:::

## 클러스터에서

Kyverno는 설치되면 Kubernetes 클러스터에서 [동적 어드미션 컨트롤러](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/)로 실행됩니다. Kubernetes API 서버로부터 검증 및 변경 어드미션 웹훅 HTTP 콜백을 받고, 일치하는 정책을 적용해 어드미션 정책을 강제하거나 요청을 거부하는 결과를 반환합니다.

정책의 예외는 규칙 자체에 정의하거나 별도의 [PolicyException 리소스](/docs/guides/exceptions)로 정의할 수 있습니다.

[DeletingPolicy](/docs/policy-types/deleting-policy)는 CEL 일치 조건과 일정에 따라 기존 리소스를 삭제할 수 있습니다. 개별 리소스를 [TTL 정리](/docs/guides/ttl-cleanup)로 만료시킬 수도 있습니다.

## 파이프라인에서

소프트웨어 배포 파이프라인에서 [Kyverno CLI](/docs/subprojects/kyverno-cli)로 YAML 리소스 매니페스트 파일에 정책을 적용할 수 있습니다. 이 명령줄 도구로 Kyverno를 GitOps 방식의 워크플로에 통합하면, 리소스 매니페스트를 버전 관리에 커밋하고 클러스터에 적용하기 전에 정책 준수 여부를 확인할 수 있습니다.

CLI의 자세한 내용은 [Kyverno apply 명령 절](/docs/kyverno-cli/reference/kyverno_apply)을 참고하세요. 파이프라인에서 CLI로 정책을 적용하고 테스트하는 예시는 [지속적 통합 절](/docs/guides/testing-policies#지속적-통합)을 참고하세요.

## API로

[ValidatingPolicy](/docs/policy-types/validating-policy)와 [ImageValidatingPolicy](/docs/policy-types/image-validating-policy) 유형은 모든 JSON 페이로드에 적용할 수 있습니다. 이 정책은 Golang SDK나 웹 서비스로 적용합니다.
