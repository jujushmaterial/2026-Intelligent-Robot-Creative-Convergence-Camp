# 자료 업로드 및 파일 관리 가이드

이 문서는 캠프 자료의 파일명, 저장 위치와 공개 기준을 기록한다. 필수 자료 업로드와 README 연결은 완료되었으며, 이후 발표 사진·PPT 크롭·시뮬레이션 캡처를 추가할 때도 같은 규칙을 사용한다.

---

## 1. 공통 파일명 규칙

- 영문 소문자와 하이픈(`-`) 사용
- 띄어쓰기, 괄호, 한글과 불필요한 특수문자 사용하지 않기
- 같은 자료의 수정본은 파일명 뒤에 `-v2`, `-v3` 추가
- 최종본이 확정되면 공개 폴더에는 최종본만 유지
- 실제 사진은 JPG, 투명 배경 그래픽은 PNG, 글자 중심 벡터 이미지는 SVG 사용

```text
좋음: janghowon-traditional-market.jpg
좋음: final-presentation-cheoltongi.pdf
좋음: evaluation-criteria.svg
피하기: 장호원 시장 사진(최종).jpg
피하기: 발표자료 진짜최종최종.pdf
```

---

## 2. 현재 완료된 핵심 구조

```text
2026-Intelligent-Robot-Creative-Convergence-Camp/
├─ documents/
│  ├─ interview-plan-original.pdf
│  └─ final-presentation-cheoltongi.pdf
├─ simulation/
│  └─ cheoltongi-fast30/
│     ├─ index.html
│     ├─ app.js
│     ├─ style.css
│     ├─ README.txt
│     └─ run_server.bat
├─ downloads/
│  └─ cheoltongi-fast30.zip
├─ assets/
│  └─ images/
│     ├─ camp/dongwon-leaders-academy.jpg
│     ├─ field-research/janghowon-rice-field.jpg
│     ├─ field-research/janghowon-traditional-market.jpg
│     ├─ project/cheoltongi-concept-overview.jpg
│     └─ evaluation/evaluation-criteria.svg
└─ notes/
```

---

## 3. PDF 자료

### 3.1 사전 인터뷰 계획서

| 구분 | 내용 |
|---|---|
| 원본 파일명 | `인터뷰 계획(이대로되진않음).pdf` |
| 공개 파일명 | `interview-plan-original.pdf` |
| 저장 위치 | [`documents/interview-plan-original.pdf`](documents/interview-plan-original.pdf) |
| 자료 성격 | 현장조사 전 준비한 초기 가설과 질문 계획 |

이 자료를 실제 인터뷰 결과로 소개하지 않는다.

### 3.2 최종 발표자료

| 구분 | 내용 |
|---|---|
| 원본 파일명 | `05_3조_철통이.pdf` |
| 공개 파일명 | `final-presentation-cheoltongi.pdf` |
| 저장 위치 | [`documents/final-presentation-cheoltongi.pdf`](documents/final-presentation-cheoltongi.pdf) |
| 자료 구분 | 1~12페이지 본 발표, 13페이지 이후 Q&A 대비자료 |

웹페이지 제작 시에도 본 발표와 Research Appendix를 구분한다.

---

## 4. 시뮬레이션

### 4.1 압축 해제본

다음 다섯 파일은 모두 [`simulation/cheoltongi-fast30/`](simulation/cheoltongi-fast30/)에 있다.

```text
index.html
app.js
style.css
README.txt
run_server.bat
```

- `index.html`, `app.js`, `style.css`는 같은 폴더에 유지
- `README.md`는 저장소용 안내 문서이므로 삭제하지 않음
- GitHub 파일 화면은 소스 확인용이며 실제 실행은 로컬 환경에서 진행
- Three.js CDN을 사용하므로 실행 시 인터넷 연결 필요

### 4.2 원본 ZIP

| 구분 | 내용 |
|---|---|
| 원본 파일명 | `1차 시연자료_시뮬.zip` |
| 공개 파일명 | `cheoltongi-fast30.zip` |
| 저장 위치 | [`downloads/cheoltongi-fast30.zip`](downloads/cheoltongi-fast30.zip) |

ZIP은 다운로드·실행용 원본 패키지이고, `simulation/`은 코드와 파일 구성 확인용이다.

---

## 5. 실제 사진

### 캠프 장소

[`assets/images/camp/dongwon-leaders-academy.jpg`](assets/images/camp/dongwon-leaders-academy.jpg)

```text
동원리더스아카데미 — 캠프 진행 장소
Dongwon Leaders Academy, Icheon
```

### 장호원 논·농촌 환경

[`assets/images/field-research/janghowon-rice-field.jpg`](assets/images/field-research/janghowon-rice-field.jpg)

```text
현장조사 중 직접 확인한 장호원의 농촌 환경
```

### 장호원 전통시장

[`assets/images/field-research/janghowon-traditional-market.jpg`](assets/images/field-research/janghowon-traditional-market.jpg)

```text
초기 조사 장소에서 충분한 인터뷰 대상을 만나지 못한 뒤 이동한 실제 조사 장소
```

사람의 얼굴이 선명한 사진을 추가할 경우 공개 동의를 확인하거나 얼굴을 가린다.

---

## 6. 철통이 콘셉트 이미지

[`assets/images/project/cheoltongi-concept-overview.jpg`](assets/images/project/cheoltongi-concept-overview.jpg)

파일 확장자는 **`.jpg`**다.

```text
Cheoltongi Concept Design
Concept rendering created to visualize the proposed robot system.
```

실제 제작된 로봇 사진, 완제품 또는 검증된 안전장치로 설명하지 않는다.

### 향후 추가할 PPT 크롭

```text
assets/images/project/problem-background.jpg
assets/images/project/persona-and-pov.jpg
assets/images/project/solution-overview.jpg
assets/images/project/prototype-concept.jpg
assets/images/project/expected-impact.jpg
assets/images/project/sustainability.jpg
assets/images/project/existing-technology-research.jpg
```

### 향후 추가할 시뮬레이션 캡처

```text
assets/images/project/simulation-field-scan.jpg
assets/images/project/simulation-digital-twin.jpg
assets/images/project/simulation-risk-projection.jpg
assets/images/project/simulation-rescue-scene.jpg
```

---

## 7. 평가기준 시각자료

원본 평가기준 사진을 그대로 게시하지 않고, 사전 인터뷰 계획서 첫 페이지의 메모를 바탕으로 가독성 높은 벡터 이미지로 재구성했다.

[`assets/images/evaluation/evaluation-criteria.svg`](assets/images/evaluation/evaluation-criteria.svg)

정리된 평가 관점:

1. 로봇 기술 활용
2. 이천 지역과의 관련성 및 지속가능성
3. 사용자 분석의 정확성과 실제 필요 반영
4. 아이디어의 매력성과 유용성

원본의 `유영한 아이디어`는 문맥상 오타로 판단해 `유용한 아이디어`로 바로잡았다. 별도의 점수나 평가 비중은 임의로 추가하지 않았다.

---

## 8. 향후 발표·수상 이미지

공개 가능한 자료가 확보되면 다음 이름을 사용한다.

```text
assets/images/presentation/final-presentation.jpg
assets/images/presentation/team-presentation.jpg
assets/images/presentation/award-photo.jpg
assets/images/evaluation/silver-award-result.jpg
assets/images/evaluation/silver-award-certificate.jpg
```

수상 결과 표기:

```text
Silver Award · 3rd Place
은상 · 전체 3위
```

---

## 9. 현재 완료 체크리스트

- [x] 인터뷰 계획서가 `documents/interview-plan-original.pdf`에 있다.
- [x] 발표자료가 `documents/final-presentation-cheoltongi.pdf`에 있다.
- [x] 시뮬레이션 다섯 파일이 같은 폴더에 있다.
- [x] 원본 ZIP이 `downloads/cheoltongi-fast30.zip`에 있다.
- [x] 캠프 장소 사진이 정확한 이름으로 업로드되었다.
- [x] 논 사진과 시장 사진이 `field-research/`에 있다.
- [x] 철통이 개략도가 `.jpg` 확장자로 `project/`에 있다.
- [x] 평가기준 재구성 이미지가 `evaluation/`에 있다.
- [x] README와 관련 기록 문서에서 실제 자료 링크를 연결했다.
- [x] 웹 구현과 메인 포트폴리오 연결은 진행하지 않았다.
