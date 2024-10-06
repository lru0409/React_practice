# 18장. 리덕스 미들웨어를 통한 비동기 작업 관리

> **리액트 프로젝트에서 리덕스를 사용한다면, API 요청 관련 비동기 작업 관리 시 ‘미들웨어’를 사용해 효율적이고 편하게 상태 관리를 할 수 있다.**

<br/>

## 미들웨어란?

- 리덕스 미들웨어는 액션을 디스패치했을 때 리듀서에서 이를 처리하기에 앞서 사전에 지정된 작업들을 실행한다. → 미들웨어는 액션과 리듀서 사이의 중간자
- 리듀서가 액션을 처리하기 전에 미들웨어가 전달 받은 액션을 콘솔에 기록하거나, 전달받은 액션 정보를 기반으로 액션을 취소하거나, 다른 종류의 액션을 추가로 디스패치하는 등의 작업을 할 수 있다.

<br/>

### 미들웨어 만들기

- 다른 개발자들이 만들어 놓은 미들웨어를 사용하면 되기에 직접 만들어 사용할 일은 그리 많지 않다. 하지만 미들웨어를 직접 만들어보면 어떻게 작동하는지 제대로 이해할 수 있을 것이다.
- 미들웨어의 기본 구조
  ```jsx
  const middleware = (store) => (next) => (action) => {};
  ```
  - 함수를 반환하는 함수를 반환하는 함수
  - 풀어쓰면 다음과 같다.
    ```jsx
    const loggerMiddleware = function loggerMiddleware(store) {
      return function (next) {
        return function (action) {};
      };
    };
    ```
  - `store`는 리덕스 스토어 인스턴스, `action`은 디스패치된 액션을 가리킨다.
  - `next(action)`을 호출하면 그다음 처리해야 할 미들웨어에게 액션을 넘겨주고, 만약 그다음 미들웨어가 없다면 리듀서에게 액션을 넘겨준다.
- 액션이 디스패치될 때마다 디스패치 전후의 상태를 콘솔에 보여주는 로깅 미들웨어를 작성해보자.
  ```jsx
  const loggerMiddleware = (store) => (next) => (action) => {
    console.group(action && action.type); // 액션 타입으로 log를 그룹화함
    console.log("이전 상태", store.getStore());
    console.log("액션", action);
    next(action); // 다음 미들웨어 혹은 리듀서에게 전달
    console.log("다음 상태", store.getStore());
    console.groupEnd();
  };
  ```
- 미들웨어는 스토어를 생성하는 과정에서 적용한다.
  ```jsx
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware.concat(loggerMiddleware), // 기존 미들웨어에 loggerMiddleware 추가
  });
  ```

### redux-logger 사용하기

- 오픈 소스 커뮤니티에 올라와 있는 redux-logger 미들웨어를 설치하고 사용해보자.
- `npm install redux-logger` : 라이브러리 설치

```jsx
import { createLogger } from "redux-logger";

const logger = createLogger();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

- 리덕스에서 미들웨어를 사용할 때는 이미 완성된 미들웨어를 라이브러리로 설치해서 사용하는 경우가 많다.

<br/>

## 비동기 작업을 처리하는 미들웨어 사용 : **redux-thunk**

- 리덕스를 사용하는 프로젝트에서 비동기 작업 처리에 가장 많이 사용된다.
- 객체가 아닌 함수 형태의 액션을 디스패치할 수 있게 해준다.
- Thunk는 특정 작업을 나중으로 미루기 위해 함수 형태로 감싼 것을 의미한다.
  ```jsx
  const addOne = (x) => x + 1;
  const addOneThunk = (x) => () => addOne(x);
  const fn = addOneThunk(1);
  fn(); // fn이 실행되는 시점에 연산
  ```
- thunk 함수를 만들어 디스패치하면, 리덕스 미들웨어가 그 함수를 전달받아 store의 dispatch와 getState를 파라미터로 넣어서 호출해준다. (현재 상태 참조와 새 액션 디스패치 가능)
- `npm install redux-thunk` : 라이브러리 설치

### redux-thunk 연습

- 스토어 생성 시에 redux-thunk 적용하기
  ```jsx
  import { thunk } from "redux-thunk";
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(loggerMiddleware, thunk), // 기존 미들웨어에 추가
  });
  ```
- Thunk 생성 함수 만들기 (액션 객체 대신 함수를 반환함)
  ```jsx
  export const increaseAsync = () => (dispatch) => {
    setTimeout(() => {
      dispatch(increase());
    }, 1000);
  };
  ```

### thunk를 활용하여 웹 요청 비동기 작업을 처리해보자.

- `npm install axios` : Promise 기반 웹 클라이언트 라이브러리 설치

```jsx
export const getPost = (id) => async (dispatch) => {
  dispatch({ type: GET_POST }); // 요청 시작
  try {
    const response = await api.getPost(id);
    dispatch({ type: GET_POST_SUCCESS, payload: response.data }); // 요청 성공
  } catch (e) {
    dispatch({ type: GET_POST_FAILURE, payload: e, error: true }); // 에러 발생
    throw e; // 이후 컴포넌트단에서 에러를 조회할 수 있도록
  }
};
```

- `getPost`가 반환하는 함수를, 이후에 미들웨어가 `dispatch`를 넣어 호출해준다.

<br/>
