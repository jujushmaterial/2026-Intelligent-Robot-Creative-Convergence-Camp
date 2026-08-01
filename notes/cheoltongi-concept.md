# Cheoltongi Concept

## 1. Role in This Portfolio

철통이는 이 저장소의 중심 목적이 아니라, 디자인씽킹 과정을 통해 도출한 **최종 아이디어 결과물**이다.

이 프로젝트가 보여주려는 것은 산업용 로봇을 실제 제작했다는 사실이 아니라 다음 과정이다.

```text
현장조사
→ 문제 발견
→ 문제 재정의
→ 아이디어 발산
→ 기술 요소 조사
→ 콘셉트 구체화
→ 시각적 프로토타입 제작
```

---

## 2. Concept Definition

> 철통이는 변화하는 건설현장을 이동하며 주변 환경을 스캔하고, 위험 구역을 시각적으로 알려 작업자의 안전을 돕는 지능형 로봇 시스템 콘셉트다.

발표에서는 사고 예방과 대응을 함께 고려하기 위해 다음 기능을 제안했다.

- 현장 골조 단계 지속 스캐닝
- Digital Twin 구축과 데이터 누적
- 설계 하중과 실제 현장 상태의 편차 분석 아이디어
- 위험 구역 프로젝션
- 작업자 행동과 발 위치 감시
- 긴급 보조 발판 전개
- 고치형 투망 구조 모듈

---

## 3. Mobility Concept

철통이는 평지와 계단·단차가 함께 존재하는 건설현장을 고려해 다리와 바퀴를 결합한 하이브리드 이동 구조로 시각화했다.

### Wheel Mode

- 평지에서 빠르고 효율적으로 이동
- 순찰과 반복 스캔에 활용

### Leg Mode

- 계단과 장애물 통과
- 고르지 않은 지면 대응
- 필요한 위치에서 안정적으로 자세 유지

이 구조는 기계설계와 구동 성능이 검증된 결과가 아니라 발표용 제품 콘셉트다.

---

## 4. Sensing and Data

발표자료와 개념 이미지에서는 다음 센서를 고려했다.

- LiDAR
- Camera
- LED Light
- IMU

로봇이 현장을 스캔한 뒤 데이터를 서버와 관리자 화면으로 전달하는 흐름을 제안했다.

```text
Robot Sensors
→ Construction Site Scan
→ Data Transfer
→ Server / Digital Twin
→ Risk Analysis
→ Field Warning
```

---

## 5. Core Functions

### 5.1 Continuous Site Scanning

공사가 끝난 건물을 한 번 검사하는 것이 아니라, 공사가 진행되는 동안 골조와 작업환경을 반복적으로 확인하는 기능이다.

### 5.2 Digital Twin and Data Accumulation

스캔 데이터를 누적하여 현재 현장 상태를 관리자 화면에서 확인하는 아이디어다. 발표에서는 실제 현장 상태와 설계 상태를 비교하고 위험을 분석하는 방향으로 확장했다.

### 5.3 Risk Projection

로봇이 위험 구역 주변에 경고 빛이나 프로젝션을 표시한다. 작업자가 특정 언어를 읽지 않더라도 위험을 직관적으로 인지하도록 하기 위한 기능이다.

### 5.4 Worker Monitoring

위험 구역 주변의 작업자 위치와 움직임을 관찰해 추락 가능성을 판단하는 아이디어다.

### 5.5 Emergency Support Platform

작업자가 발을 헛디딜 가능성이 있을 때 보조 발판을 전개해 균형 회복을 돕는 콘셉트다. 실제 하중과 반응시간은 검증되지 않았다.

### 5.6 Cocoon Net Rescue

추락이 발생하면 외벽에 설치된 앵커와 투망을 이용해 작업자를 포획·현수하는 구조 아이디어다. 실제 안전장비 성능을 검증한 결과가 아니다.

---

## 6. Interactive Concept Simulation

철통이의 작동 흐름을 발표에서 쉽게 설명하기 위해 Three.js 기반 인터랙티브 시뮬레이션을 제작했다.

최종 시연 흐름:

```text
골조 형성
→ 로봇 스캔
→ 구조 레이어와 현장 데이터 누적
→ 하중·위험도 분석 표현
→ 위험 구역 프로젝션
→ 작업자 추락 감지
→ 구조 장치 전개
```

시뮬레이션은 물리적 성능이나 구조 안전성을 계산하는 해석 도구가 아니다. 아이디어와 사용자 시나리오를 설명하기 위한 **visual prototype**이다.

- 소스: [`../simulation/cheoltongi-fast30/`](../simulation/cheoltongi-fast30/)
- 원본 ZIP: [`../downloads/cheoltongi-fast30.zip`](../downloads/cheoltongi-fast30.zip)

---

## 7. Concept Image

<p align="center">
  <img src="../assets/images/project/cheoltongi-concept-overview.jpg" alt="철통이 기술 및 개략도" width="900">
</p>

이미지 표기:

```text
Cheoltongi Concept Design
Concept rendering created during the camp to visualize the proposed robot system.
```

이 이미지는 실제 제작된 하드웨어 사진이 아니라 제품 콘셉트 렌더링이다.

---

## 8. Expected Value Proposed in the Presentation

### For Workers

- 추락사고 위험 감소
- 위험에 대한 심리적 부담 감소
- 언어 장벽 없이 위험 정보 인지
- 사고 발생 시 신속한 대응

### For Companies

- 안전관리 비용 감소 가능성
- 재시공 비용 절감 가능성
- ESG 및 기업 이미지 개선
- 현장 데이터 축적

위 내용은 발표에서 제안한 기대효과이며, 실제 현장 실증이나 비용 분석 결과가 아니다.

---

## 9. Limitations

- 실제 로봇 하드웨어를 제작하지 않았다.
- 실제 건설현장에서 기능을 시험하지 않았다.
- 구조해석과 하중 분석 정확도를 검증하지 않았다.
- 보조 발판과 투망의 인체 보호 성능을 검증하지 않았다.
- 센서 정확도와 통신 지연을 시험하지 않았다.
- 발표자료의 일부 기술 성능과 비용은 Q&A 대비용 조사값이다.

따라서 철통이는 다음 표현으로 소개한다.

- Design Thinking Project
- Intelligent Robot Concept
- Concept Design
- Interactive Concept Simulation

다음 표현은 사용하지 않는다.

- Commercial Product
- Verified Safety System
- Completed Industrial Robot
- Field-Proven Solution
