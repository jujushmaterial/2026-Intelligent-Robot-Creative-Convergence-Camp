# 자료 업로드 가이드

이 문서는 캠프 자료를 정해진 폴더와 파일명으로 직접 업로드하기 위한 가이드다.  
파일명을 먼저 통일한 뒤 업로드하면 README와 향후 포트폴리오 웹페이지에서 같은 경로를 그대로 사용할 수 있다.

---

## 1. 업로드 전 공통 규칙

### 파일명 규칙

- 영문 소문자와 하이픈(`-`) 사용
- 띄어쓰기, 괄호, 한글, 특수문자 사용하지 않기
- 같은 자료의 수정본은 파일명 뒤에 `-v2`, `-v3` 추가
- 최종본이 확정되면 중간 버전 대신 최종본만 공개 폴더에 유지
- 사진 원본은 가능하면 JPG, 투명 배경이 필요한 그래픽은 PNG 사용

### 예시

```text
좋음: janghowon-traditional-market.jpg
좋음: final-presentation-cheoltongi.pdf
피하기: 장호원 시장 사진(최종).jpg
피하기: 발표자료 진짜최종최종.pdf
```

---

## 2. 최종 폴더 구조

```text
2026-Intelligent-Robot-Creative-Convergence-Camp/
├─ documents/
├─ simulation/
│  └─ cheoltongi-fast30/
├─ downloads/
├─ assets/
│  └─ images/
│     ├─ camp/
│     ├─ field-research/
│     ├─ project/
│     ├─ presentation/
│     └─ evaluation/
└─ notes/
```

각 폴더에는 안내용 `README.md`가 먼저 생성되어 있다. 해당 폴더로 들어간 뒤 파일을 업로드하면 된다.

---

## 3. PDF 업로드

### 3.1 인터뷰 계획서

현재 파일:

```text
인터뷰 계획(이대로되진않음).pdf
```

변경할 파일명:

```text
interview-plan-original.pdf
```

업로드 위치:

```text
documents/interview-plan-original.pdf
```

설명:

- 현장조사 전에 준비한 사전 인터뷰 계획
- 실제 인터뷰 결과가 아님
- 주차 정산기와 보행 문제를 중심으로 가설을 세운 자료
- README에서는 `Initial Interview Plan`으로 소개

### 3.2 최종 발표자료

현재 파일:

```text
05_3조_철통이.pdf
```

변경할 파일명:

```text
final-presentation-cheoltongi.pdf
```

업로드 위치:

```text
documents/final-presentation-cheoltongi.pdf
```

설명:

- 1~12페이지: 본 발표자료
- 13페이지 이후: Q&A 대비 사전 조사자료
- 웹페이지에서는 본 발표와 Research Appendix를 구분해 소개

---

## 4. 시뮬레이션 업로드

### 4.1 압축 해제본

현재 ZIP을 먼저 컴퓨터에서 압축 해제한다.

예상 파일:

```text
index.html
app.js
style.css
README.txt
run_server.bat
```

각 파일명은 변경하지 않고 다음 폴더에 업로드한다.

```text
simulation/cheoltongi-fast30/
```

최종 경로:

```text
simulation/cheoltongi-fast30/index.html
simulation/cheoltongi-fast30/app.js
simulation/cheoltongi-fast30/style.css
simulation/cheoltongi-fast30/README.txt
simulation/cheoltongi-fast30/run_server.bat
```

주의사항:

- ZIP 파일 자체를 이 폴더에 넣지 않는다.
- 압축을 해제한 파일만 넣는다.
- `README.md`는 현재 폴더 안내 파일이므로 삭제하지 않는다.
- `index.html`과 `app.js`, `style.css`가 같은 폴더에 있어야 한다.

### 4.2 원본 ZIP

현재 파일:

```text
1차 시연자료_시뮬.zip
```

변경할 파일명:

```text
cheoltongi-fast30.zip
```

업로드 위치:

```text
downloads/cheoltongi-fast30.zip
```

ZIP은 원본 패키지 다운로드용이고, `simulation/` 폴더는 코드 확인과 실행용이다.

---

## 5. 실제 사진 업로드

### 5.1 캠프 장소

대상 이미지:

- 동원리더스아카데미 야외 전경 사진

파일명:

```text
dongwon-leaders-academy.jpg
```

업로드 위치:

```text
assets/images/camp/dongwon-leaders-academy.jpg
```

권장 설명:

```text
동원리더스아카데미 — 캠프 진행 장소
Dongwon Leaders Academy, Icheon
```

### 5.2 장호원 논·농촌 환경

파일명:

```text
janghowon-rice-field.jpg
```

업로드 위치:

```text
assets/images/field-research/janghowon-rice-field.jpg
```

권장 설명:

```text
현장조사 중 직접 확인한 장호원의 농촌 환경
```

### 5.3 장호원 전통시장

파일명:

```text
janghowon-traditional-market.jpg
```

업로드 위치:

```text
assets/images/field-research/janghowon-traditional-market.jpg
```

권장 설명:

```text
초기 조사 장소에서 인터뷰 대상을 만나지 못한 뒤 이동한 실제 인터뷰 장소
```

### 5.4 추가 현장 사진

교회, 시장 내부, 팀 이동, 인터뷰 준비 등 추가 사진이 있다면 다음 규칙을 사용한다.

```text
assets/images/field-research/initial-interview-location.jpg
assets/images/field-research/team-field-research.jpg
assets/images/field-research/interview-preparation.jpg
```

사람의 얼굴이 선명한 사진은 공개 동의를 확인하거나 얼굴을 가린 뒤 업로드한다.

---

## 6. 철통이 관련 이미지 업로드

### 6.1 기술 및 개략도

현재 올린 철통이 기술·개략도 이미지 파일명:

```text
cheoltongi-concept-overview.jpg
```

업로드 위치:

```text
assets/images/project/cheoltongi-concept-overview.jpg
```

이 이미지는 실제 제작된 로봇 사진이 아니므로 다음처럼 설명한다.

```text
Cheoltongi Concept Design
Concept rendering created to visualize the proposed robot system.
```

### 6.2 PPT 크롭 이미지

발표 PDF에서 필요한 페이지만 이미지로 저장하거나 크롭한다.

권장 파일명:

```text
assets/images/project/problem-background.jpg
assets/images/project/persona-and-pov.jpg
assets/images/project/solution-overview.jpg
assets/images/project/prototype-concept.jpg
assets/images/project/expected-impact.jpg
assets/images/project/sustainability.jpg
assets/images/project/existing-technology-research.jpg
```

PPT 한 페이지 전체를 그대로 쓰기보다 핵심 내용이 잘 보이도록 여백을 크롭한다. 원본 발표자료는 `documents/`에 보관하므로 크롭 이미지에는 설명에 필요한 내용만 남긴다.

### 6.3 시뮬레이션 캡처

시뮬레이션 실행 화면을 캡처해 다음 이름으로 업로드한다.

```text
assets/images/project/simulation-field-scan.jpg
assets/images/project/simulation-digital-twin.jpg
assets/images/project/simulation-risk-projection.jpg
assets/images/project/simulation-rescue-scene.jpg
```

권장 캡처 수는 3~4장이다. 같은 장면을 여러 각도로 반복해서 올리지 않는다.

---

## 7. 발표·평가 이미지 업로드

### 7.1 평가기준 사진

현재 올린 평가기준 사진 파일명:

```text
evaluation-criteria.jpg
```

업로드 위치:

```text
assets/images/evaluation/evaluation-criteria.jpg
```

### 7.2 발표 사진

발표 중 본인이나 팀이 보이는 사진이 있다면:

```text
assets/images/presentation/final-presentation.jpg
assets/images/presentation/team-presentation.jpg
assets/images/presentation/award-photo.jpg
```

은상 또는 전체 3위를 확인할 수 있는 상장·결과 화면이 있다면 `award-photo.jpg` 또는 `silver-award-certificate.jpg`로 업로드한다.

---

## 8. GitHub 웹에서 업로드하는 방법

### 일반 파일 업로드

1. 저장소 페이지에 접속한다.
2. 업로드할 폴더를 클릭한다.
3. 오른쪽 위 `Add file`을 클릭한다.
4. `Upload files`를 선택한다.
5. 파일을 끌어다 놓거나 `choose your files`를 누른다.
6. 화면 아래 `Commit changes`에서 메시지를 작성한다.
7. `Commit directly to the main branch`를 선택한다.
8. `Commit changes`를 누른다.

권장 커밋 메시지:

```text
Upload interview planning document
Upload final camp presentation
Add Janghowon field research photos
Add Cheoltongi concept simulation
Add evaluation and award materials
```

### 여러 파일을 한 번에 올릴 때

- 같은 성격의 자료끼리만 묶어서 업로드한다.
- PDF, 사진, 시뮬레이션을 한 번에 모두 올리지 않는다.
- 업로드 후 각 파일이 정확한 폴더에 있는지 확인한다.

### 시뮬레이션 폴더 업로드

1. `simulation/cheoltongi-fast30/` 폴더로 이동한다.
2. `Add file` → `Upload files`를 누른다.
3. 압축을 해제한 다섯 파일을 동시에 선택한다.
4. 업로드 목록에 `index.html`, `app.js`, `style.css`, `README.txt`, `run_server.bat`가 모두 있는지 확인한다.
5. 커밋 메시지를 `Upload Cheoltongi concept simulation`으로 작성한다.

---

## 9. 업로드 후 확인할 체크리스트

- [ ] 인터뷰 계획서가 `documents/interview-plan-original.pdf`에 있다.
- [ ] 발표자료가 `documents/final-presentation-cheoltongi.pdf`에 있다.
- [ ] 시뮬레이션 다섯 파일이 같은 폴더에 있다.
- [ ] 원본 ZIP이 `downloads/cheoltongi-fast30.zip`에 있다.
- [ ] 캠프 장소 사진이 정확한 이름으로 업로드되었다.
- [ ] 논 사진과 시장 사진이 `field-research/`에 있다.
- [ ] 철통이 개략도가 `project/`에 있다.
- [ ] 평가기준 사진이 `evaluation/`에 있다.
- [ ] 사람 얼굴이 포함된 사진의 공개 가능 여부를 확인했다.
- [ ] 파일명이 README에 적힌 경로와 완전히 일치한다.

업로드가 끝난 뒤 README의 `업로드 예정` 표시와 이미지 링크를 실제 파일로 연결한다.
