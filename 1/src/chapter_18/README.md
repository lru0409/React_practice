# 리액트 버전18

## Automatic Batching

- 각각의 state가 업데이트될 때마다 재렌더링이 발생한다. useState 훅을 사용해 선언한 각 state들의 set 함수를 거의 동시에 호출하더라도, 호출된 횟수만큼 재렌더링이 발생하게 된다.
- 여러 상태의 업데이트가 동시에 발생하면, 이 작업들을 묶어서 한 번에 처리한다.

  <img width="735" alt="스크린샷 2024-09-04 오후 4 39 55" src="https://gist.github.com/user-attachments/assets/1f654a3c-91f3-489f-b13b-42de5be71560">

<br/>

## Transitions

- 긴급한 업데이트와 긴급하지 않은 업데이트를 구분해서 처리하기 위한 개념이다.
  - 긴급한 업데이트 : 사용자와 직접적인 인터렉션이 일어나는 경우
    - 예) 버튼 클릭, 글자 입력
  - 긴급하지 않은 업데이트 : 사용자와 직적업인 인터렉션이 일어나지 않는 경우
    - 예) 서버로부터 결과를 받아와 보여주는 경우
- 긴급한 업데이트를 먼저 처리함으로써 더 나은 사용자 경험을 제공하기 위한 것이다.
  <img width="1019" alt="스크린샷 2024-09-04 오후 4 43 41" src="https://gist.github.com/user-attachments/assets/28786ac0-b6b6-42a5-88da-c4fa476810ea">
- 긴급한 업데이트는 기존과 동일하게 상태 업데이트를 진행하고, 긴급하지 않은 업데이트는 StartTransition 함수를 사용해서 트랜지션 업데이트로 처리한다.
- 트랜지션 업데이트는 처리 중에 더 긴급한 업데이트가 발생하면 중단될 수 있다.

<br/>

## Suspense

- 웹사이트 규모가 커지면서 컴포넌트 사이즈가 커진다. 브라우저에서 큰 컴포넌트를 한 번에 로딩하려고 하면 시간이 오래 걸리는 문제가 생긴다.
- 이 문제를 해결하기 위해 컴포넌트의 코드를 여러 조각으로 분리하는 Code Splitting이라는 기법을 적용할 수 있다. 분리된 조각에 동적 로딩(lazy 로딩, 다이나믹 로딩) 기법을 적용하여 웹사이트의 반응 속도를 높이는 방법이다.
- Suspense 컴포넌트가 하는 역할은 하위 컴포넌트가 준비되기 전까지 렌더링을 중단하는 것이다.
  <img width="1034" alt="스크린샷 2024-09-04 오후 4 50 36" src="https://gist.github.com/user-attachments/assets/0480360b-9727-4a2b-aa56-b2aba8697c24">
- OtherComponent가 준비되기 전까지 fallback 속성에 들어가 있는 LoadingSpinner라는 컴포넌트를 화면에 보여주고, OtherComponent가 준비되면 그때 렌더링하게 된다.
- 리액트 버전 18에서는 Suspense를 서버 렌더링과 제한적으로 데이터 패칭에서도 사용할 수 있도록 업데이트되었다고 한다?

<br/>

## 클라이언트와 서버 렌더링 API 업데이트

> **클라이언트 렌더링**

- 기존에는 클라이언트에서 렌더링을 위해 다음과 같은 형태로 ReactDOM.render 함수를 사용했다.
  <img width="754" alt="스크린샷 2024-09-04 오후 4 53 12" src="https://gist.github.com/user-attachments/assets/66cec14c-e650-4e0a-b030-2bccea976307">
- 리액트 버전18에서는 react-dom/client 패키지가 새롭게 추가되었고, createRoot 함수를 사용해 렌더링하게 된다.
  <img width="1198" alt="스크린샷 2024-09-04 오후 4 54 11" src="https://gist.github.com/user-attachments/assets/aaba5e0e-461e-4bc7-af59-479434296115">
- 서버 사이드 렌더링을 위해서 기존에는 renderToString 함수를 사용했다. 리액트 버전18에서는 react-dom/server 패키지에서 제공하는 두 가지 함수와 Suspense를 함께 사용할 수 있도록 업데이트되었다.
  - renderToPipeableStream : NodeJS 환경에서 스트리밍을 위한 함수
  - renderToReadableStream : Edge runtime 환경을 위한 함수

<br/>

## 새로운 Strict 모드 동작 방식

- Strict Mode는 잠재적인 버그를 찾을 수 있게 도와주는 모드이다.
- 리액트 버전 18에서 Strict 모드를 사용하면, 컴포넌트를 언마운트시켰다가 다시 마운트시키게 된다.
- 그래서 컴포넌트 생명주기 함수들이 예상과 다르게 여러 번 호출될 수 있다.
- 컴포넌트가 여러 번 마운트되어도 문제 생기지 않도록 개발하는 것이 중요하다.

<br/>

## 새롭게 추가된 훅들

- **useId()**
  - 서버와 클라이언트에서 고유한 id 값을 생성하기 위한 훅
  - 리스트를 렌더링할 때 map 함수 내에서 반환하는 element의 key로 사용하는 용도 X
- **useTransitions()**
  - 긴급하지 않은 업데이트를 위한 훅
  - useTransitions 훅이나 startTransition 훅을 사용해 긴급하지 않은 업데이트들을 모아 처리할 수 있다.
- **useDeferredValue()**
  - 긴급하지 않은 업데이트를 재렌더링하는 것을 연기할 수 있게 해주는 훅
  - 예를 들어 짧은 시간 안에 한 가지 상태의 업데이트가 여러 번 발생하게 되면, 최종 상태 값만을 업데이트해준다. (디바운싱)
- **useSyncExternalStore()**
  - 외부 저장소를 구독할 수 있게 해주는 훅
  - 외부 저장소를 State와 연동해서 사용할 수 있다.
- **useInsertionEffect()**
  - CSS in JS 라이브러리를 위한 훅
  - 렌더링 과정에서 스타일 삽입의 성능 문제를 해결할 수 있게 해준다.
