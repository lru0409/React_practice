# 16장. 리덕스 라이브러리 이해하기

> **리덕스는 가장 많이 사용하는 리액트 상태 관리 라이브러리이다.**
>
> - 컴포넌트의 상태 업데이트 관련 로직을 다른 파일로 분리시켜서 더욱 효율적으로 관리할 수 있다.
> - 컴포넌트끼리 똑같은 상태를 공유해야 할 때도 여러 컴포넌트를 거치지 않고 상태 값을 전달 및 업데이트할 수 있다.
> - 단순히 전역 상태 관리만 한다면 Context API를 사용하는 것만으로 충분하지만, 리덕스를 사용하면 상태를 더욱 체계적으로 관리할 수 있으므로 프로젝트 규모가 클 경우 리덕스를 사용하자.

<br/>

## 개념 미리 정리하기

> **액션(action)**
>
> - 상태에 어떠한 변화가 필요하면 액션이 발생한다.
> - 액션은 하나의 객체로 표현되며, 다음과 같은 형식으로 이루어져 있다.
>   ```jsx
>   {
>     type: "TOGGLE_VALUE"; // 액션의 이름, 반드시 type 필드를 가지고 있어야 함.
>   }
>   ```
> - type 필드 외의 값은 상태 업데이트 시 참고할 값으로, 작성자 마음대로 넣을 수 있다.

> **액션 생성 함수(action creator)**
>
> - 액션 객체를 만들어주는 함수이다.
> - 변화를 일으켜야 할 때마다 액션 객체를 매번 작성하기 번거롭기 때문에, 이를 함수로 만들어 관리한다.
>
> ```jsx
> function addTodo(data) {
>   return {
>     type: "ADD_TODO",
>     data,
>   };
> }
> ```

> **리듀서(reducer)**
>
> - 변화를 일으키는 함수이다.
> - 액션을 만들어 발생시키면 리듀서가 현재 상태와 전달받은 액션 객체를 파라미터로 받아 오고, 두 값을 참고하여 새로운 상태를 만들어 반환해준다.
>
> ```jsx
> const initialState = { counter: 1 };
> function reducer(state = initialState, action) {
>   switch (action.type) {
>     case INCREMENT:
>       return { counter: action.couter + 1 };
>     default:
>       return state;
>   }
> }
> ```

> **스토어(store)**
>
> - 프로젝트에 리덕스를 적용하기 위해 스토어를 만든다.
> - 한 개의 프로젝트는 단 하나의 스토어만 가질 수 있다.
> - 현재 애플리케이션 상태와 리듀서를 포함하며, 그 외에도 몇 가지 중요한 내장 함수를 지닌다.

> **디스패치(dispath)**
>
> - 스토어 내장 함수 중 하나로, 액션을 발생시킨다.
> - dispath(action)과 같은 형태로 액션 객체를 파라미터로 넣어 호출한다.
> - 이 함수가 호출되면 스토어는 리듀서 함수를 실행시켜서 새로운 상태를 만들어준다.

> **구독(subscribe)**
>
> - 스토어의 내장 함수이다.
> - subscribe 함수 안에 리스너 함수를 파라미터로 전달해 호출하면, 액션이 디스패치되어 상태가 업데이트될 때마다 이 리스너 함수가 호출된다.
>
> ```jsx
> const listener = () => {
>   console.log("상태가 업데이트됨");
> };
> const unsubscribe = store.subscribe(listener);
> unsubscribe(); // 구독 비활성화
> ```

<br/>

## 리액트 없이 쓰는 리덕스

리덕스는 리액트에서 사용하려고 만들어졌지만 다른 UI 라이브러리/프레임워크와 함께 사용할 수도 있다.
바닐라 자바스크립트 환경에서 리덕스를 사용해보자.

> **프로젝트 만들기**

- (쉽고 빠르게 웹 애플리케이션을 구성할 수 있게 해주는) Parcel 이라는 도구를 사용하자.
  - `npm install -g parcel-bundler` (전역 설치, 패키지가 공용 디렉토리에 설치됨)
- 프로젝트 디렉토리를 생성하고 package.json 파일을 생성하자.
  ```bash
  mkdir vanilla-redux
  cd vanilla-redux
  npm init -y
  ```
- index.html, index.js 파일을 만들어 코드를 작성한 후 `parcel index.html`을 실행하면 개발용 서버가 실행된다.
- `npm install redux` : 리덕스 모듈을 설치한다.

> **액션 타입, 생성 함수, 리듀서 함수 정의**

```jsx
const TOGGLE_SWITCH = "TOGGLE_SWITCH";
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

const toggleSwitch = () => ({ type: TOGGLE_SWITCH });
const increase = (difference) => ({ type: INCREASE, difference });
const decrease = () => ({ type: DECREASE });

const initialState = { toggle: false, counter: 0 };

// state가 undefined일 때는 initialState를 기본값으로 사용
function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SWITCH:
      return { ...state, toggle: !state.toggle };
    case INCREASE:
      return { ...state, counter: state.counter + action.difference };
    case DECREASE:
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
}
```

- 리듀서 함수가 맨 처음 호출될 때는 state 값이 undefined이다.
- 리듀서에서는 상태의 불변성을 유지하며 데이터에 변화를 주어야 한다. 따라서 리덕스의 상태는 최대한 깊지 않은 구조로 진행하는 것이 좋으며, 객체의 구조가 복잡해지는 경우 immer 라이브러리를 사용하자.

> **스토어 만들고 액션 발생시켜 렌더링하기**

- 책에서는 스토어를 만들기 위해 `createStore` 함수를 사용하지만, 지금은 더 이상 권장되는 방식이 아니라고 한다. 대신 `configureStore`를 사용해보자.
  ```jsx
  import { createStore, configureStore } from "redux";
  const store = createStore(reducer); // createStore를 사용하는 경우
  const store = configureStore({ reducer: reducer }); // configureStore을 사용하는 경우
  ```

```jsx
const store = configureStore({ reducer }); // 스토어 생성

const render = () => {
  const state = store.getState(); // 변경된 상태를 가져옴
  if (state.toggle) {
    divToggle.classList.add("active");
  } else {
    divToggle.classList.remove("active");
  }
  counter.innerText = state.counter;
};

render(); // 초기 렌더링
store.subscribe(render); // 상태 변경 시 렌더링되도록 구독

// 특정 행동 시 액션 발생
divToggle.onclick = () => {
  store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
  store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
  store.dispatch(decrease());
};
```

- 스토어 생성 후 액션 구독(configureStore, subscribe) → 특정 상황에서 액션 발생(dispatch) → 상태 업데이트(reducer) → 업데이트된 상태를 가지고 렌더링(render)
- 이 프로젝트에서는 subscribe 함수를 직접 사용하지만, 추후 리액트 프로젝트에서는 이 작업을 react-redux 라이브러리가 대신해준다.

<br/>

## 리덕스의 세 가지 규칙

1. 단일 스토어
   - 하나의 애플리케이션 안에는 하나의 스토어가 있어야 한다.
     - 여러 개의 스토어를 만들 수는 있지만, 상태 관리가 복잡해질 수 있어 권장되지 않는다.
   - 따라서 프로젝트 내의 모든 액션 타입은 고유해야 한다.
2. 읽기 전용 상태
   - 상태를 업데이트할 때 기존 객체는 건드리지 않고 새로운 객체를 생성해 주어야 한다.
   - 불변성을 유지해야 하는 이유는 리덕스에서 내부적으로 데이터 변경을 감지하기 위해 얕은 비교 검사를 하기 때문이다. (그래야만 리덕스에서 상태가 변경된 것을 캐치 가능)
3. 리듀서는 순수한 함수
   - 변화를 일으키는 리듀서는 순수한 함수여야 한다.
   - 리듀서 함수는 파라미터(이전 상태와 액션 객체) 외의 값에는 의존하면 안 된다.
   - 이전 상태는 절대 건드리지 않고, 변화를 준 새로운 상태 객체를 만들어 반환한다.
   - 똑같은 파라미터로 호출된 리듀서 함수는 언제나 똑같은 결과 값을 반환해야 한다.
