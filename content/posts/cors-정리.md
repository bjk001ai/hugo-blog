---
title: "Cors 정리"
date: 2026-05-17
draft: false
tags: ["WEB", "CORS"]
categories: ["WEB 지식"]
---

## CORS란?

CORS(Cross-Origin Resource Sharing)는 브라우저가 보안 정책(Same-Origin Policy)을 유지하면서도 다른 도메인·포트·프로토콜의 리소스를 안전하게 요청할 수 있도록 서버가 허용하는 방식입니다. 즉, 서버가 특정 출처(origin)를 명시적으로 허용해야만 클라이언트가 교차 출처 요청을 정상적으로 처리할 수 있습니다.

🔑 기본 개념
- Same-Origin Policy(SOP): 기본적으로 브라우저는 다른 출처(origin)의 리소스 접근을 차단.
- CORS: 서버가 응답 헤더에 허용할 출처를 명시(Access-Control-Allow-Origin)하여 교차 출처 요청을 허용.
- 출처(Origin): 프로토콜 + 도메인 + 포트 조합으로 정의됨.
- 예: https://example.com:443

⚙️ 동작 방식
- Simple Request
- GET, POST, HEAD 요청 중 특정 조건을 만족하면 바로 요청.
- 서버가 응답에 Access-Control-Allow-Origin 헤더를 포함해야 브라우저가 응답을 사용 가능.
- Preflight Request (사전 요청)
- PUT, DELETE 같은 메서드나 커스텀 헤더 사용 시 브라우저가 먼저 OPTIONS 요청을 보냄.
- 서버가 허용 메서드와 헤더를 응답하면 실제 요청 진행.
- Credential Request
- 쿠키, 인증 헤더 등 자격 증명을 포함한 요청.
- 서버가 Access-Control-Allow-Credentials: true를 명시해야 브라우저가 인증 정보를 포함해 응답을 허용.

📌 주요 HTTP 헤더
- Access-Control-Allow-Origin: 허용할 출처 지정 (* 또는 특정 도메인).
- Access-Control-Allow-Methods: 허용할 HTTP 메서드 지정.
- Access-Control-Allow-Headers: 허용할 요청 헤더 지정.
- Access-Control-Allow-Credentials: 인증 정보 포함 여부 지정.

🛠️ 예시
# 클라이언트 요청
GET /api/data HTTP/1.1
Host: api.example.com
Origin: https://client.example.com

# 서버 응답
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://client.example.com



🚨 자주 발생하는 문제
- 헤더 누락: 서버에서 Access-Control-Allow-Origin을 설정하지 않음.
- 잘못된 출처: 허용되지 않은 도메인에서 요청.
- 인증 문제: 쿠키/토큰을 포함했는데 서버가 Allow-Credentials를 설정하지 않음.

✅ 정리:
CORS는 서버가 허용을 명시해야만 브라우저가 교차 출처 요청을 처리할 수 있는 보안 메커니즘입니다. 프론트엔드와 백엔드가 다른 도메인에 있을 때 반드시 설정해야 하며, Access-Control-Allow-* 헤더를 올바르게 지정하는 것이 핵심입니다.