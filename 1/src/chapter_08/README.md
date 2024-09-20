# Hooks

## Hooks 개요

<img width="1106" alt="스크린샷 2024-08-29 오후 1 06 55" src="https://gist.github.com/user-attachments/assets/b7c8a89f-4ef5-4307-ad49-5763729b53b0">

- 클래스 컴포넌트와 달리 함수 컴포넌트는 state나 생명주기 메소드를 사용할 수 없었다.
- 따라서 함수 컴포넌트에 이러한 기능을 지원하기 위해 등장한 것이 Hooks이다.
- state와 생명주기 기능에 갈고리를 걸어 원하는 시점에 정해진 함수가 실행되도록 만들었다.
  - 이때 실행되는 함수를 hook이라고 부른다.
- hook의 이름은 모두 use로 시작한다.

<br/>

## useState() 훅

- state를 사용하기 위한 Hook이다.
- `useState()` 사용법
  ```jsx
  const [변수명, set함수명] = useState(초기값);
  ```
- `useState()` 사용 예시

  ```jsx
  function Counter(props) {
    const [count, setCount] = useState(0);

    return (
      <div>
        <p>총 {count}번 클릭했습니다.</p>
        <button onClick={() => setCount(count + 1)}>클릭</button>
      </div>
    );
  }
  ```

- 클래스 컴포넌트에서는 `setState` 함수 하나를 사용해서 모든 state 값을 업데이트할 수 있었다.
  하지만 `useState`를 사용하면, 변수 각각에 대해 set 함수가 따로 존재한다.
- 컴포넌트에서, 변경 될 시 재렌더링되길 원하는 값은 `useState`를 사용해야 한다.

<br/>

## useEffect() 훅

- 사이드 이펙트를 수행하기 위한 Hook이다.
- 여기서 사이드 이펙트는, 다른 컴포넌트에 영향을 미칠 수 있으며, 렌더링이 끝난 이후에 실행되어야 하는 작업을 말한다.
- 클래스 컴포넌트에서 제공하던 `componentDidMount`, `componentDidUpdate`, `componentDidUnmount`와 동일한 기능을 하나로 통합해서 제공한다.
- `useEffect()` 사용법
  ```jsx
  useEffect(이펙트 함수, 의존성 배열);
  ```
  - 의존성 배열 : 이펙트가 의존하고 있는 배열.
  - 의존성 배열 안의 변수 중 하나라도 값이 변경되면 이펙트 함수를 실행한다.
  - 의존성 배열을 생략하면, 컴포넌트가 업데이트될 때마다 이펙트 함수가 호출된다. (DOM이 변경된 이후마다)
  - 의존성 배열을 빈 배열로 전달하면, mount와 unmount 시 단 한 번씩만 이펙트 함수가 호출된다.
- `useEffect()` 사용 예시

  ```jsx
  function Counter(props) {
    const [count, setCount] = useState(0);

    // componentDidMount, componentDidUpdate와 비슷하게 동작한다.
    useEffect(() => {
      // 브라우저 API를 사용해서 document의 title을 업데이트한다.
      document.title = `You clicked ${count} times`;
    });

    return (
      <div>
        <p>총 {count}번 클릭했습니다.</p>
        <button onClick={() => setCount(count + 1)}>클릭</button>
      </div>
    );
  }
  ```

- `useEffect`가 리턴하는 함수는 컴포넌트가 unmount될 때 호출된다.
  ```jsx
  useEffect(() => {
  	// 컴포넌트가 마운트 된 이후 실행
  	// 의존성 배열에 있는 변수들 중 하나라도 값이 변경되었을 때 실행
  	// 의존성 배열에 빈 배열을 넣으면 마운트와 언마운트 시에 단 한 번씩만 실행
  	// 의존성 배열 생략 시 컴포넌트 업데이트 시마다 실행
  	return () => {
  		// 컴포넌트가 마운트 해제되기 전에 실행
  	};
  }, [의존성 변수, ... ]);
  ```

<br/>

## useMemo() 훅

- Memoized value를 리턴하는 Hook이다.
- Memoization : 비용이 높은, 연산이 많이 드는 함수의 호출 결과를 저장해 두었다가 같은 입력 값으로 함수를 호출하면, 새로 함수를 호출하지 않고 이전에 저장해둔 결과를 바로 반환하는 최적화 기법이다.
  - Memoization된 결과 값을 Memoized value 라고 부른다.
- `useMemo()` 사용법
  ```jsx
  const memoizedValue = useMemo(
  	() => {
  		// 연산량이 높은 작업을 수행하여 결과를 반환
  		return computeExpensiveValue(의존성 변수1, 의존성 변수2);
  	},
  	[의존성 변수1, 의존성 변수2]
  );
  ```
  - 파라미터로 `memoizedValue`를 생성하는 create 함수와 의존성 배열을 받는다.
  - 의존성 배열에 들어있는 변수가 변했을 경우에만 새로 create 함수를 호출하여 결과값을 반환한다. 그렇지 않은 경우에는 기존 함수의 결과값을 그대로 반환한다.
  - 의존성 배열을 생략할 경우, 매 렌더링마다 함수가 실행된다.
  - 의존성 배열으로 빈 배열을 전달하면, 컴포넌트 마운트 시에만 호출된다.
- 컴포넌트가 다시 렌더링될 때마다 연산량이 높은 작업을 반복하는 것을 피할 수 있다. → 빠른 렌더링 속도
- `useMemo`로 전달된 함수는 렌더링이 일어나는 동안 실행된다. → 렌더링이 일어나는 동안 실행해선 안 될 작업을 `useMemo`의 함수에 넣으면 안 된다.
  - 예를 들어 서버에서 데이터를 받아오거나 수동으로 DOM을 변경하는 작업 등은 렌더링이 일어나는 동안 실행되면 안 되므로, `useMemo`가 아닌 `useEffect`을 사용해야 한다?

<br/>

## useCallback() 훅

- `useMemo()` 훅과 비슷하지만 값이 아닌 함수를 반환한다.
- 컴포넌트가 렌더링될 때마다 매번 함수를 새로 정의하는 것이 아니라 의존성 배열의 값이 바뀐 경우에만 함수를 새로 정의해서 반환해준다.
- `useCallback`을 사용하지 않고 컴포넌트 내에 함수를 정의하면, 렌더링이 일어날 때마다 함수가 새로 정의된다. → 특정 변수의 값이 변한 경우에만 함수를 다시 정의하도록 해서 불필요한 반복 작업을 없앤다.
- `handleClick` 함수는 자식 컴포넌트의 `props`로 전달되고 있다. 이때 만약 `useCallback`을 사용하지 않으면, 부모 컴포넌트가 렌더링될 때마다 매번 자식 컴포넌트도 다시 렌더링된다.

  ```jsx
  function ParentComponent(props) {
    const handleClick = useCallback((event) => {
      // 클릭 이벤트 처리
    }, []);

    return (
      <div>
        <ChildComponent handleClick={handleClick} />
      </div>
    );
  }
  ```

<br/>

## useRef() 훅

- Reference를 사용하기 위한 Hook이다.
- React에서 레퍼런스란, 특정 컴포넌트에 접근할 수 있는 객체를 의미한다.
- `useRef`는 레퍼런스 객체를 반환한다.
- 레퍼런스 객체의 `current` 속성은 현재 참조하고 있는 엘리먼트를 저장한다.
- `useRef()` 사용법
  ```jsx
  const refContainer = useRef(초깃값);
  ```
  - 파라미터로 전달된 초기값으로 초기화된 레퍼런스 객체를 반환한다.
  - 반환된 레퍼런스 객체는 컴포넌트 라이프타임 전체에 걸쳐 유지된다.
- `useRef()` 사용 예시

  ```jsx
  function TextInputWithFocusButton(props) {
    const inputElem = useRef(null);

    const onButtonClick = () => {
      // `current`는 마운트된 input element를 가리킴
      inputElem.current.focus();
    };

    return (
      <>
        <input ref={inputElem} type="text" />
        <button onClick={onButtonClick}>Focus the input</button>
      </>
    );
  }
  ```

  - 버튼 클릭 시 input에 포커스를 하도록 하는 코드이다.

- 코드를 다음과 같이 작성하면, 노드가 변경될 때마다 `myRef`의 `current` 속성에 현재 해당되는 DOM 노드를 저장한다.
  ```jsx
  <div ref={myRef} />
  ```
- `useRef`는 내부의 데이터가 변경되었을 때 별도로 알리지 않는다. → current 속성을 변경한다고 해서 재렌더링이 일어나지 않는다.
- ref에 DOM 노드가 연결되거나 분리되었을 때 어떤 코드를 실행하고 싶다면 useCallback을 사용해야 한다.

  - React는 ref가 다른 노드에 연결될 때마다 콜백을 호출한다.

  ```jsx
  function MeasureExample(props) {
    const [height, setHeight] = useState(0);

    const measureRef = useCallback((node) => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
    }, []);

    return (
      <>
        <h1 ref={measureRef}>안녕, 리액트 </h1>
        <h2>위 헤더의 높이는 {Math.round(height)}px 입니다. </h2>
      </>
    );
  }
  ```

<br/>

## Hook의 규칙

1. Hook은 무조건 최상위 레벨에서만 호출해야 한다.
   - 반복문, 조건문, 중첩된 함수들 안에서 Hook을 호출하면 안 된다.
   - 컴포넌트가 렌더링될 떄마다 매번 같은 순서로 호출되어야 한다. 그래야 다수의 useState 훅과 useEffect 훅의 호출에서 컴포넌트의 state를 올바르게 관리할 수 있다.
2. 리액트 함수 컴포넌트에서만 Hook을 호출해야 한다.
   - 리액트 컴포넌트에 있는 state와 관련된 모든 로직은 소스 코드를 통해 명확하게 확인 가능해야 한다.

> eslint-plugin-react-hooks 는 Hook의 규칙을 따르도록 강제해주는 플러그인이다.
>
> [npm: eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

<br/>

## Custom Hook 만들기

- React에서 기본 제공하는 Hook들 이외에 추가적으로 필요한 기능이 있다면 직접 Hook을 만들어 사용할 수 있다.
- 커스텀 Hook을 만드는 이유는 여러 컴포넌트에서 반복적으로 사용하는 로직을 Hook으로 만들어 재사용하기 위함이다.
- 두 개의 함수에서 하나의 로직을 공유하고 싶을 때 새로운 함수를 하나 만든다. React 함수 컴포넌트와 Hook은 모두 함수이기 때문에 동일한 방법을 사용 가능하다.
- 커스텀 Hook은 이름이 use로 시작하고 내부에서 다른 Hook을 호출하는 자바스크립트 함수이다.
- 커스텀 Hook은 파라미터로 무엇을 받을지, 무엇을 리턴할지 등 정해진 규칙이 없다.
  - 하지만 이름을 use로 시작하도록 해서 단순한 함수가 아니라 리액트 훅이라는 것을 나타낸다.
  - 또한 Hook의 규칙이 적용된다.

```jsx
function useUserStatus(userId) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ServerAPI.subscribeUserStatus(userId, handleStatusChange);
    return () => {
      ServerAPI.unsubscribeUserStatus(userId, handleStatusChange);
    };
  });

  return isOnline;
}

function UserStatus(props) {
  const isOnline = useUserStatus(props.user.id);

  if (isOnline === null) return "대기중...";
  return isOnline ? "온라인" : "오프라인";
}

function UserListItem(props) {
  const isOnline = useUserStatus(props.user.id);

  return (
    <li style={{ color: isOnline ? "green" : "black" }}>{props.user.name}</li>
  );
}
```

<br/>

## Hooks 사용해보기

```jsx
import React, { useState } from "react";

function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue);

  const increaseCount = () => setCount((count) => count + 1);
  const decreaseCount = () => setCount((count) => Math.max(count - 1, 0));

  return [count, increaseCount, decreaseCount];
}

export default useCounter;
```

```jsx
import React, { useState, useEffect } from "react";
import useCounter from "./useCounter";

const MAX_CAPACITY = 10;

function Accommodate(props) {
  const [isFull, setIsFull] = useState(false);
  const [count, increaseCount, decreaseCount] = useCounter(0);

  useEffect(() => {
    console.log("====================");
    console.log("useEffect() is called.");
    console.log(`isFull: ${isFull}`);
  });

  useEffect(() => {
    setIsFull(count >= MAX_CAPACITY);
    console.log(`Current count value: ${count}`);
  }, [count]);

  return (
    <div style={{ padding: 16 }}>
      <p>{`총 ${count}명 수용했습니다.`}</p>

      <button onClick={increaseCount} disabled={isFull}>
        입장
      </button>
      <button onClick={decreaseCount}>퇴장</button>

      {isFull && <p style={{ color: "red" }}>정원이 가득 찼습니다.</p>}
    </div>
  );
}

export default Accommodate;
```

- `count`가 포함된 의존성 배열을 받는 `useEffect` 훅은 `count` 값이 변할 때마다 실행되고, 의존성 배열이 생략된 `useEffect` 훅은 화면이 렌더링될 때마다 실행된다.
