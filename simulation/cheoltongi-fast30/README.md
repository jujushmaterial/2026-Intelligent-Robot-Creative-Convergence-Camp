# Cheoltongi FAST-30 Concept Simulation

이 폴더에는 압축을 해제한 실행 파일과 안내 문서를 보관한다.

## Files

- [`index.html`](index.html) — 시뮬레이션 진입 파일
- [`app.js`](app.js) — 장면과 인터랙션 로직
- [`style.css`](style.css) — 화면 스타일
- [`README.txt`](README.txt) — 원본 실행 및 기능 안내
- [`run_server.bat`](run_server.bat) — Windows 로컬 서버 실행 파일
- [`../../downloads/cheoltongi-fast30.zip`](../../downloads/cheoltongi-fast30.zip) — 원본 패키지 다운로드

## Purpose

Three.js 기반의 인터랙티브 콘셉트 시뮬레이션으로 다음 흐름을 시각화한다.

```text
현장 스캔
→ 구조 레이어와 데이터 누적
→ 위험도 분석 표현
→ 현장 프로젝션 경고
→ 작업자 추락 감지
→ 구조 장치 전개
```

## Run Locally

1. [`cheoltongi-fast30.zip`](../../downloads/cheoltongi-fast30.zip)을 내려받아 압축을 해제한다.
2. `run_server.bat`을 실행하거나 해당 폴더에서 `python -m http.server 8000`을 실행한다.
3. 브라우저에서 `http://localhost:8000`에 접속한다.

Three.js를 CDN으로 불러오므로 실행 시 인터넷 연결이 필요하다.

## Notice

이 시뮬레이션은 실제 구조해석, 센서 정확도 또는 안전장치 성능을 검증하는 프로그램이 아니다. 발표에서 아이디어와 사용자 시나리오를 설명하기 위한 **visual prototype**이다.
