---
title: "Javascript 이벤트루프"
date: 2026-05-17
draft: false
tags: ["Javascript"]
categories: ["Javascript"]
---

자바스크립트 이벤트 루프(Event Loop)는 단일 스레드 언어인 JS가 비동기 작업을 처리할 수 있게 해주는 핵심 메커니즘입니다. 동기 코드는 먼저 실행되고, 이후 마이크로태스크(Promise 등) → 태스크 큐(setTimeout 등) 순서로 실행됩니다.

🔑 이벤트 루프 기본 구조
- 콜 스택(Call Stack): 현재 실행 중인 함수들이 쌓이는 공간.
- 힙(Heap): 객체가 저장되는 메모리 영역.
- 웹 API: 브라우저가 제공하는 비동기 기능 (예: setTimeout, fetch).
- 태스크 큐(Task Queue): setTimeout, 이벤트 리스너 콜백이 대기.
- 마이크로태스크 큐(Microtask Queue): Promise.then, MutationObserver 등이 대기.

⚙️ 실행 순서
- 동기 코드 → 즉시 실행.
- 마이크로태스크 큐 → Promise 콜백 등 먼저 실행.
- 태스크 큐 → setTimeout, setInterval, 이벤트 핸들러 실행.

📌 예제
console.log('start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
});

console.log('end');


출력 결과
start
end
promise
setTimeout


👉 이유:
- start, end는 동기 코드라 바로 실행.
- Promise.then은 마이크로태스크 큐에 들어가서 다음 tick에서 실행.
- setTimeout은 태스크 큐에 들어가서 마이크로태스크 이후 실행.

🚀 실무 활용
- setTimeout / setInterval: 일정 시간 후 실행.
- Promise / async-await: 비동기 API 처리.
- 이벤트 리스너: 클릭, 입력 등 사용자 이벤트 처리.
- 주의점: 긴 동기 작업은 이벤트 루프를 막아 UI가 멈출 수 있음 → 작업을 잘게 나누거나 Web Worker 활용.

✅ 정리 포인트
- 자바스크립트는 싱글 스레드지만 이벤트 루프 덕분에 비동기 처리가 가능.
- 실행 순서: 동기 → 마이크로태스크 → 태스크 큐.
- Promise가 setTimeout보다 먼저 실행되는 이유는 마이크로태스크 우선 처리 규칙 때문.
