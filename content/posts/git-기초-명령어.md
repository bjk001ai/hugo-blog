---
title: "Git 기초 명령어"
date: 2026-05-17
draft: false
tags: ["GIT"]
categories: ["GIT 사용법"]
---

Git 기본 명령어
1. 저장소 초기화
git init

- 현재 디렉토리를 Git 저장소로 초기화.
2. 저장소 복제
git clone <저장소_URL>

- 원격 저장소를 로컬로 복제.
3. 상태 확인
git status

- 변경된 파일, 스테이징 여부 확인.
4. 변경사항 스테이징
git add <파일명>
git add .

- 특정 파일 또는 전체 변경사항을 스테이징 영역에 추가.
5. 커밋
git commit -m "메시지"

- 스테이징된 변경사항을 저장소에 기록.
6. 로그 확인
git log

- 커밋 히스토리 확인.
7. 브랜치 관리
git branch
git branch <브랜치명>
git checkout <브랜치명>
git switch <브랜치명>

- 브랜치 목록 확인, 생성, 이동.
8. 병합
git merge <브랜치명>

- 다른 브랜치의 변경사항을 현재 브랜치에 병합.
9. 원격 저장소 연결
git remote add origin <저장소_URL>

- 로컬 저장소와 원격 저장소 연결.
10. 푸시 & 풀
git push origin <브랜치명>
git pull origin <브랜치명>

- 원격 저장소에 업로드(push), 원격 저장소에서 가져오기(pull).

📌 자주 쓰는 조합
- 새 프로젝트 시작:
git init
git add .
git commit -m "first commit"
git remote add origin <URL>
git push -u origin main
- 기존 프로젝트 참여:
git clone <URL>
git checkout -b feature/new-feature
git add .
git commit -m "add new feature"
git push origin feature/new-feature