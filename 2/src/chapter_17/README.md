# 17장. 리덕스를 사용하여 리액트 애플리케이션 상태 관리하기

> **리액트 애플리케이션에서 리덕스를 사용할 때는 store 인스턴스를 직접 사용하기보다는 주로 react-redux 라이브러리에서 제공하는 유틸 함수와 컴포넌트를 사용하여 리덕스 관련 작업을 처리한다.**

<br/>

## 작업 환경 설정

- `npm install redux react-redux` : 리덕스와 react-redux 라이브러리 설치

<br/>

## UI 준비하기

리액트에서 리덕스를 사용할 때 가장 많이 사용하는 패턴은 프레젠테이셔널 컴포넌트와 컨테이너 컴포넌트를 분리하는 것이다.

![image](https://gist.github.com/user-attachments/assets/d0fff617-29bb-4d04-a5f7-77fa2c7ccc51)

- **프레젠테이셔널 컴포넌트** : 상태 관리가 이루어지지 않고, 그저 props를 받아와서 화면에 UI를 보여주기만 하는 컴포넌트
- **컨테이너 컴포넌트** : 리덕스와 연동되어 있는 컴포넌트로, 리덕스로부터 상태를 받아오기도 하고 리덕스 스토어에 액션을 디스패치하기도 함
- 이 패턴을 사용하면 코드의 재사용성이 높아지고 관심사의 분리가 이루어진다.
- UI 관련 컴포넌트는 src/componenets, 리덕스 연동 컴포넌트는 src/containers 경로에 저장하자.

<br/>

## 리덕스 관련 코드 작성하기

- 리덕스 관련 코드에 대한 디렉토리 구조에는 주로 두 가지 방법이 사용된다.
  - **actions(액션 생성 함수), constants(액션 타입), reducers(리듀서 코드)** → 세 개의 디렉토리를 만들고 그 안에 기능 별로 파일을 하나씩 만드는 방식이 일반적이다. 하지만 새로운 액션을 만들 때마다 세 종류의 파일을 모두 수정해야 하기 때문에 불편하기도 하다.
  - 액션 타입, 액션 생성 함수, 리듀서 함수를 기능 별로 파일 하나에 몰아서 작성하는 **Ducks 패턴**도 있다.
- 액션 타입은 대문자로 정의하고, ‘모듈 이름/액션 이름’과 같은 형태로 작성한다. 나중에 프로젝트가 커졌을 때 액션 이름이 충돌하지 않도록, 모듈 이름을 넣는 것이다.
  ```jsx
  const INCREASE = "counter/INCREASE";
  const DECREASE = "counter/DECREASE";
  ```
- ‘액션 타입 정의 → 액션 생성 함수 정의 → 초기 상태 선언 → 리듀서 함수 구현’ 순서로 진행한다.
- 스토어를 만들 때는 리듀서를 하나만 사용해야 한다. 따라서 기능 별로 분류하여 구현한 리듀서를 하나로 합쳐주어야 하는데, 이 작업은 리덕스에서 제공하는 `combineReducers` 함수를 사용할 수 있다.
  ```jsx
  import { combineReducers } from "redux";
  const rootReducer = combineReducers({ counter, todos });
  ```

<br/>

## 리액트 애플리케이션에 리덕스 적용하기

- src/index.js에서 스토어를 생성하고, react-redux에서 제공하는 Provider 컴포넌트로 App 컴포넌트로 감싸준다. Provider 컴포넌트에 store를 props로 전달한다.
  ```jsx
  const store = configureStore({ reducer: rootReducer });

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  ```
- Redux DevTools는 리덕스 개발자 도구로, 크롬 확장 프로그램으로 설치하여 사용할 수 있다.
  - createStore를 사용하는 경우, Redux DevTools를 적용하기 위해 별도의 과정이 필요하지만, configureStore는 이미 Redux DevTools와 통합되어 있기에 적용 과정이 따로 필요 없는 것 같다.
  - 다만 configureStore는 @reduxjs/toolkit 패키지를 설치해야 사용할 수 있다. @reduxjs/toolkit를 설치하면서 호환성 충돌 오류가 있었는데, 일단 충돌을 무시하는 방식으로 진행했다.
    - `npm install @reduxjs/toolkit --legacy-peer-deps`
  - 크롬 개발자 도구의 Redux 탭에서 State 버튼을 눌러 리덕스 스토어 내부의 상태를 확인할 수 있다.

<br/>

## 컨테이너 컴포넌트 만들기

- 컴포넌트를 리덕스와 연동하려면 react-redux에서 제공하는 `connect` 함수를 사용해야 한다.
  ```jsx
  connect(mapStateToProps, mapDispatchToProps)(연동할 컴포넌트)
  ```
  - `mapStateToProps` : 리덕스 스토어 안의 상태를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수
    - 현재 스토어가 지니고 있는 state를 파라미터로 받아온다.
  - `mapDispatchToProps` : 액션을 발생시키는 함수를 컴포넌트의 props로 넘겨주기 위해 설정하는 함수
    - 스토어의 내장 함수 dispatch를 파라미터로 받아온다.
  - 두 함수에서 반환하는 객체 내부의 값들은 컴포넌트의 props로 전달된다.
  - connect 함수를 호출하면, 컨테이너 컴포넌트를 만들어주는 또 다른 함수가 반환된다. 그리고 이 함수에 컴포넌트를 파라미터로 전달하면 드디어 리덕스와 연동된 컴포넌트가 만들어진다.

```jsx
import { connect } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease } from "../modules/counter";

const CounterContainer = ({ number, increase, decrease }) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

const mapStateToProps = (state) => ({
  // counter 컴포넌트에 props로 전달할 state 반환
  number: state.counter.number, // counter는 combineReducers 시 설정된 리듀서의 이름임
});

const mapDispatchToProps = (dispatch) => ({
  // counter 컴포넌트에 props로 전달할 액션 발생 함수 반환
  increase: () => dispatch(increase()),
  decrease: () => dispatch(decrease()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
```

- CounterContainer 컴포넌트를 생성할 때 props를 전달할 필요가 없다. 리덕스와 연동된 컴포넌트로써 스토어가 가진 정보와 상호작용하기 때문이다.
- 각 액션 생성 함수를 호출하고 dispatch로 감싸는 작업이 번거롭게 느껴진다면, 리덕스의 `bindActionCreators` 함수를 사용할 수 있다.
  ```jsx
  const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ increase, decrease }, dispatch); // ({ 액션 생성 함수들 }, dispatch) 형식
  ```
  더 쉬운 방법은 함수 형태가 아닌 액션 생성 함수로 이루어진 객체를 파라미터로 전달하는 것이다.
  ```jsx
  const mapDispatchToProps = { increase, decrease };
  ```

<br/>

## 리덕스 더 편하게 사용하기

액션 생성 함수, 리듀서를 작성할 때 react-actions 라이브러리와 immer 라이브러리를 활용하면 리덕스를 더 편하게 사용할 수 있다.

> **redux-actions**

- 액션 생성 함수와 리듀서를 더 짧은 코드로 작성할 수 있다.
- `npm install redux-actions` : redux-actions 라이브러리 설치

```jsx
import { createAction, handleActions } from "redux-actions";

const INCREASE = "counter/INCREASE";
const DECREASE = "counter/DECREASE";

export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

const initialState = { number: 0 };
const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 }),
    [DECREASE]: (state, action) => ({ number: state.number - 1 }),
  },
  initialState
);
```

- `createAction` 함수를 사용하면 매번 액션 객체를 직접 만들어 줄 필요 없이 간단하게 액션 생성 함수를 선언할 수 있다.
  - 액션에 필요한 추가 데이터가 있는 경우 payload 라는 이름을 사용한다.
    ```jsx
    const MY_ACTION = "sample/MY_ACTION";
    const myAction = createAction(MY_ACTION, (text) => text);
    const action = myAction("hello, world!");
    // { type: MY_ACTION, payload: 'hello, world!' }
    ```
    - 파라미터를 그대로 반환하는 함수라면, createAction에 두 번째 인자를 넣어줄 필요는 없다.
- `handleActions` 함수를 사용하면 리듀서에서 switch/case 문 대신 더 간결하게 작성할 수 있다.
  - 첫 번째 파라미터에는 각 액션에 대한 업데이트 함수, 두 번째 파라미터로는 초기 상태를 넣어준다.
  - 액션에 type 외의 데이터가 있는 경우 payload로 접근해야 한다. 모든 추가 데이터 값을 action.payload로 사용하면 헷갈릴 수 있기 때문에 객체 비구조화 할당 문법으로 payload 이름을 새로 설정해주면 좋다.

> **immer**

- 리듀서에서 복잡한 구조를 가진 객체의 상태 업데이트 시 immer 라이브러리를 사용할 수 있다.

```jsx
const todos = handleActions(
  {
    [CHANGE_INPUT]: (state, { payload: input }) =>
      produce(state, (draft) => {
        draft.input = input;
      }),
    [INSERT]: (state, { payload: todo }) =>
      produce(state, (draft) => {
        draft.todos.push(todo);
      }),
    [TOGGLE]: (state, { payload: id }) =>
      produce(state, (draft) => {
        const todo = draft.todos.find((todo) => todo.id === id);
        todo.done = !todo.done;
      }),
  },
  initialState
);
```

<br/>

## Hooks를 사용하여 컨테이너 컴포넌트 만들기

리덕스 스토어와 연동된 컨테이너 컴포넌트를 만들 때 connect 함수 대신 react-redux에서 제공하는 Hooks을 사용할 수도 있다.

> **useSelector로 상태 조회하기**

- connect 함수를 사용하지 않고도 리덕스의 상태를 조회할 수 있다.
- `useSelector`에 `mapStateToProps`와 동일한 형태의 상태 선택 함수를 파라미터로 전달한다.

```jsx
const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  return <Counter number={number} />;
};

export default CounterContainer;
```

> **useDispatch를 사용하여 액션 디스패치하기**

- 컴포넌트 내부에서 스토어의 dispatch를 사용할 수 있게 해준다.

```jsx
const CounterContainer = () => {
  const number = useSelector((state) => state.counter.number);
  const dispatch = useDispatch();
  return (
    <Counter
      number={number}
      onIncrease={useCallback(() => dispatch(increase()), [dispatch])}
      onDecrease={useCallback(() => dispatch(decrease()), [dispatch])}
    />
  );
};
```

- 컴포넌트가 리렌더링될 때마다 onIncrease, onDecrease 함수가 새롭게 만들어지지 않게 하기 위해, useCallback 훅을 사용한다. → `useDispatch`은 `useCallback`과 함께 사용하는 습관을 들이자.

> **useStore를 사용하여 리덕스 스토어 사용하기**

- 컴포넌트 내부에서 리덕스 스토어 객체를 직접 사용할 수 있다.
- 꼭 스토어에 직접 접근해야 하는 상황에만 사용하자.

```jsx
const store = useStore();
store.dispatch({ type: "SAMPLE_ACTION" });
store.getState();
```

> **useActions 유틸 Hook을 만들어서 사용하기**

- useActions는 react-redux에서 제외된 훅이지만, [공식 문서](https://react-redux.js.org/next/api/hooks#recipe-useactions)에서 제공하고 있다.
- 이 훅을 사용하면, 여러 개의 액션을 사용해야 하는 경우 코드를 깔끔하게 정리해 작성할 수 있다.
  ```jsx
  const dispatch = useDispatch();
  const onChangeInput = useCallback(
    (input) => dispatch(changeInput(input)),
    [dispatch]
  );
  const onInsert = useCallback((text) => dispatch(insert(text)), [dispatch]);
  const onToggle = useCallback((id) => dispatch(toggle(id)), [dispatch]);
  const onRemove = useCallback((id) => dispatch(remove(id)), [dispatch]);
  ```
- 액션 생성 함수를 액션을 디스패치하는 함수로 변환해준다.
- 첫 번째 파라미터로 액션 생성 함수로 이루어진 배열, 두 번째 파라미터로 변경 시에 액션을 디스패치할 원소 배열을 전달한다.

```jsx
const [onChangeInput, onInsert, onToggle, onRemove] = useActions(
  [changeInput, insert, toggle, remove],
  []
);
```

> **connect 함수와의 차이점**

- connect 함수를 사용하여 컨테이너 컴포넌트를 만들었을 경우, 해당 컨테이너 컴포넌트의 부모 컴포넌트가 리렌더링될 때 해당 컨테이너 컴포넌트의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지된다.
- 반면 useSelector를 사용해 리덕스 상태를 조회했을 때는 최적화 작업이 이루어지지 않으므로, React.memo를 컨테이너 컴포넌트에 사용해 주어야 한다.

```jsx
export default React.memo(TodosContainer);
```
