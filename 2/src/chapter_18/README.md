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

## 비동기 작업을 처리하는 미들웨어 사용 : **redux-saga**

- redux-thunk 다음으로 많이 사용하는 비동기 작업 관련 미들웨어이다.
- redux-saga는 좀 더 까다로운 상황에서 유용하다.
  - 기존 요청을 취소 처리해야 할 때(불필요한 중복 요청 방지)
  - 특정 액션이 발생했을 때 다른 액션을 발생시키거나, API 요청 등 리덕스와 관계없는 코드를 실행할 때
  - 웹소켓을 사용할 때
  - API 요청 실패 시 재요청해야 할 때
- ES6의 제네레이터 함수 문법을 기반으로 비동기 작업을 관리해준다.

  - 함수를 특정 구간에 멈춰 놓을 수도 있고, 원할 때 다시 돌아가게 할 수도 있다.

  ```jsx
  function* generatorFunction() {
    console.log("안녕하세요");
    yield 1;
    console.log("제너레이터 함수");
    yield 2;
    console.log("function*");
    yield 3;
    return 4;
  }

  const generator = generatorFunction();
  generator.next(); // [출력] 안녕하세요 [반환] { value: 1, done: false }
  generator.next(); // [출력] 제너레이터 함수 [반환] { value: 2, done: false }
  generator.next(); // [출력] function* [반환] { value: 3, done: false }
  generator.next(); // [반환] { value: 4, done: true }
  generator.next(); // [반환] { value: undefined, done: true }
  ```

- 디스패치하는 액션을 모니터링해서 그에 따라 필요한 작업을 따로 수행할 수 있는 미들웨어이다.

### 비동기 카운터 만들기

- 액션 타입과 액션 생성 함수, 제너레이터 함수(사가)를 만든다.
  ```jsx
  function* increaseSaga() {
    yield delay(1000); // 1초 대기
    yield put(increase()); // 특정 액션 디스패치
  }

  function* decreaseSaga() {
    yield delay(1000); // 1초 대기
    yield put(decrease()); // 특정 액션 디스패치
  }

  export function* counterSaga() {
    // takeEvery는 들어오는 모든 액션을 처리함
    yield takeEvery(INCREASE_ASYNC, increaseSaga);
    // takeLast는 기존에 진행 중이던 작업은 취소하고 마지막으로 실행된 작업만 수행함
    yield takeLatest(DECREASE_ASYNC, decreaseSaga);
  }
  ```
- 루트 리듀서를 만들었던 것처럼 루트 사가를 만들고 스토어에 적용해야 한다.
- +1을 두 번 누르면 `INCREASE_ASYNC` 액션이 두 번 디스패치되고, -1을 두 번 누르면 `DECREASE_ASYNC` 액션이 한 번 디스패치될 것이다.

### API 요청 상태 관리하기

- 사가 내부에서 API를 호출해야 하는 상황에는 직접 호출하지 않고, call 함수를 사용한다. call에는 첫 번째 인수로 호출하고 싶은 함수, 두 번째 인수로 첫 번째 함수에 전달할 인수를 전달한다.

```jsx
function* getPostSaga(action) {
  yield put(startLoading(GET_POST)); // 로딩 시작
  try {
    // call을 사용하면 Promise를 반환하는 함수를 호출하고 기다릴 수 있다.
    // 첫 번째 파라미터는 함수, 나머지 파라미터는 해당 함수에 넣을 인수이다.
    const post = yield call(api.getPost, action.payload);
    yield put({ type: GET_POST_SUCCESS, payload: post.data });
  } catch (e) {
    yield put({ type: GET_POST_FAILURE, payload: e, error: true });
  }
  yield put(finishLoading(GET_POST)); // 로딩 완료
}
```

### 알아 두면 유용한 기능들

- 사가 내부에서 현재 상태를 조회할 수 있다.
  ```jsx
  import { delay, put, select } from "redux-saga/effects";

  function* increaseSaga() {
    yield delay(1000); // 1초 대기
    yield put(increase()); // 특정 액션 디스패치
    const number = yield select((state) => state.counter); // state는 스토어 상태를 의미함
    console.log(`현재 값은 ${number}입니다.`);
  }
  ```
- 사가가 실행되는 주기를 제한할 수 있다.
  ```jsx
  export function* counterSaga() {
  	// increaseSaga가 3초에 단 한 번씩 호출됨
    yield throttle(3000, INCREASE_ASYNC, increaseSaga);
  	(...)
  }
  ```
- redux-saga는 이 외에도 여러 기능을 제공하기 때문에 비동기 작업을 처리하면서 겪을 수 있는 다양한 상황에 맞춰 개발할 수 있다. 더 알아보고 싶다면 [redux-saga의 매뉴얼](https://redu-saga.js.org/)을 참고하자.
