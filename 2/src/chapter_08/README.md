# 8장. Hooks

## useState

- 함수 컴포넌트에서 상태를 관리할 수 있게 해준다.

```jsx
import { useState } from "react";

const Counter = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{value}</b>입니다.
      </p>
      <button onClick={() => setValue(value + 1)}>+1</button>
      <button onClick={() => setValue(value - 1)}>-1</button>
    </div>
  );
};
```

<br/>

## useEffect

- 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있다.
- componentDidMount, componentDidUpdate를 합친 형태라고 보아도 무방하다.
- 컴포넌트가 화면에 처음 렌더링 될 때만 실행하고, 업데이트될 때는 실행하지 않으려면, 함수의 두 번째 파라미터로 비어있는 배열을 전달한다.
  ```jsx
  useEffect(() => {
    console.log("마운트될 때만 실행됩니다.");
  }, []);
  ```
- 특정 값이 변경될 때만 호출하고 싶으면, 두 번째 파라미터로 전달되는 배열 안에 해당 값을 넣어준다.
  ```jsx
  useEffect(() => {
    console.log(name);
  }, [name]);
  ```
- 두 번째 파라미터로 전달하는 배열 안에는 state를 넣어주어도 되고 props를 넣어주어도 된다.
- 컴포넌트가 언마운트되기 전이나 업데이트되기 직전에 어떤 작업을 수행하고 싶다면, useEffect에서 뒷 정리 함수를 반환한다.
  ```jsx
  useEffect(() => {
    // name 값이 변경되어 리렌더링된 이후에 실행
    return () => {
      // name 값이 변경되어 리렌더링 직전에 실행
    };
  }, [name]);
  ```
  - 오직 언마운트될 때만 뒷정리 함수를 호출하고 싶다면 useEffect 함수의 두 번째 파라미터에 비어있는 배열을 넣으면 된다.

<br/>

## useReducer

- useState보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해주고 싶을 때 사용한다.
- 리듀서는 현재 상태, 업데이트를 위해 필요한 정보를 담은 액션 값을 전달받아 새로운 상태를 반환하는 함수이다. 리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜 주어야 한다.
  ```jsx
  function reducer(state, action) {
  	return { ... };
  }
  ```
- 액션 값은 주로 다음과 같은 형태로 이루어져 있다.
  ```jsx
  {
  	type: "INCREMENT",
  }
  ```
  - 리덕스에서 사용하는 액션 객체에서는 type 필드(어떤 액션인지 알려줌)가 꼭 있어야 하지만, useReducer에서 사용하는 액션 객체는 꼭 그렇진 않다. 심지어 문자열이나 숫자여도 상관 없다.
- useReducer의 첫 번째 파라미터로는 리듀서 함수, 두 번째 파라미터로는 해당 리듀서의 기본 값을 넣어준다.

  ```jsx
  function reducer(state, action) {
    switch (action.type) {
      case "INCREAMENT":
        return { value: state.value + 1 };
      case "DECREAMENT":
        return { value: state.value - 1 };
      default:
        return state;
    }
  }

  const Counter = () => {
    const [state, dispatch] = useReducer(reducer, { value: 0 });

    return (
      <div>
        <p>
          현재 카운터의 값은 <b>{state.value}</b>입니다.
        </p>
        <button onClick={() => dispatch({ type: "INCREAMENT" })}>+1</button>
        <button onClick={() => dispatch({ type: "DECREAMENT" })}>-1</button>
      </div>
    );
  };
  ```

  - useReducer는 state와 dispatch를 반환한다. state는 현재 가리키고 있는 상태, dispatch는 액션을 발생시키는 함수이다. dispatch 호출 시 파라미터로 액션 값을 넣어 두면 리듀서 함수가 호출된다.

- useReducer의 가장 큰 장점은 컴포넌트 업데이트 로직을 컴포넌트 바깥으로 빼낼 수 있는 것이다.

<br/>

## UseMemo

- 함수 컴포넌트 내부에서 발생하는 연산을 최적화할 수 있다.
- 렌더링 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았다면 이전에 연산했던 결과를 다시 사용할 수 있다.
- 두 번째 파라미터로 전달한 값이 바뀔 때만, 첫 번째 파라미터로 전달한 함수를 수행하여 결과를 반환한다.

```jsx
const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");

  const onChange = (e) => setNumber(e.target.value);
  const onInsert = (e) => setList(list.concat(parseInt(number)));

  const arg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b> {arg}
      </div>
    </div>
  );
};
```

<br/>

## useCallback

- useMemo와 상당히 비슷하다.
- 만들어 놨던 함수를 재사용할 수 있다.
- 함수 컴포넌트 안에 함수를 선언하면, 컴포넌트가 리렌더링될 때마다 새로 만들어진 함수를 사용하게 된다.
- 첫 번째 파라미터로는 생성하고 싶은 함수, 두 번째 파라미터로는 변경 시 함수를 새로 생성하고 싶은 값의 배열을 전달한다.
- useCallback에 전달하는 함수에서 상태 값에 의존해야 할 때는, 반드시 그 값을 두 번째 파라미터 안에 포함시켜야 한다.

```jsx
const onChange = useCallback((e) => setNumber(e.target.value), []);
const onInsert = useCallback(
  (e) => setList(list.concat(parseInt(number))),
  [number, list]
);
```

<br/>

## useRef

- 함수 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해준다.

  ```jsx
  const Average = () => {
    const input = useRef(null);
    const onInsert = useCallback(
      (e) => {
        setList(list.concat(parseInt(number)));
        input.current.focus();
      },
      [number, list]
    );

    return (
      <div>
        <input ref={input} />
      </div>
    );
  };
  ```

- 로컬 변수(렌더링과 상관없이 바뀔 수 있는 값)를 사용해야 할 때도 활용할 수 있다.
  ```jsx
  const RefSample = () => {
  	const id = useRef(1);
  	const setId = (n) => { id.current = n; }
  	const printId = () => { console.log(id.current); }
  	return (...);
  }
  ```
  - ref 안의 값이 바뀌어도 컴포넌트가 렌더링되지 않는다.
  - 렌더링과 관련되지 않은 값을 관리할 때만 이러한 방식을 사용하자.

<br/>

## 커스텀 Hooks 만들기

- 여러 컴포넌트에서 훅을 공유할 경우, 나만의 Hook으로 작성하여 로직을 재사용할 수 있다.

```jsx
function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

export default function useInputs(initialForm) {
  const [state, dispatch] = useReducer(reducer, initialForm);
  const onChange = (e) => dispatch(e.target);
  return [state, onChange];
}
```

```jsx
const Info = () => {
  const [state, onChange] = useInputs({
    name: "",
    nickname: "",
  });
  const { name, nickname } = state;

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};
```

<br/>

> **앞으로 프로젝트를 개발할 때는 함수 컴포넌트의 사용을 첫 번째 옵션으로 두고, 꼭 필요한 경우에만 클래스 컴포넌트를 구현하자.**
