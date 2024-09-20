# 12장. immer를 사용하여 더 쉽게 불변성 유지하기

> **immer 라이브러리를 사용하면 구조가 복잡한 객체도 매우 쉽고 짧은 코드를 사용하여 불변성을 유지하면서 업데이트해 줄 수 있다.**

## immer를 설치하고 사용법 알아보기

- `npm install immer` : immer 설치하기
- immer 라이브러리의 `produce` 함수는 수정하고 싶은 상태와 상태를 어떻게 업데이트할지 정의하는 함수를 파라미터를 받는다.
- 두 번째 파라미터로 전달되는 함수 내부에서 원하는 값을 변경하면, produce 함수가 불변성 유지를 대신해 주면서 새로운 상태를 생성해준다.
- 이 라이브러리의 핵심은 ‘불변성에 신경 쓰지 않는 것처럼 코드를 작성하되 불변성 관리는 제대로 해주는 것’이다.

```jsx
import produce from "immer";
const nextState = produce(originalState, (draft) => {
  // 바꾸고 싶은 값 바꾸기
  draft.somewhere.deep.inside = 5;
});
```

- immer를 사용한다고 해서 무조건 코드가 간결해지지는 않는다. immer는 불변성을 유지하는 코드가 복잡할 때만 사용해도 충분하다.

<br/>

## useState의 함수형 업데이트와 immer 함께 쓰기

- produce 함수를 호출할 때, 첫 번째 파라미터가 함수 형태라면 업데이트 함수를 반환한다.

  ```jsx
  const update = produce((draft) => {
    draft.value = 2;
  });
  const originalState = { value: 1 };
  const nextState = update(originalState);
  ```

- 따라서 immer과 useState의 함수형 업데이트를 함께 활용하면 코드를 더욱 깔끔하게 만들 수 있다.

  ```jsx
  setData(
    produce((draft) => {
      draft.array.push(info);
    })
  );

  setForm(
    produce((draft) => {
      draft[name] = value;
    })
  );
  ```
