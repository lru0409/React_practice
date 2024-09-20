# 10장. 일정 관리 웹 애플리케이션 만들기

- react-icons는 리액트에서 다양한 아이콘을 사용할 수 있는 라이브러리이다. SVG 형태로 이루어진 아이콘을 리액트 컴포넌트처럼 쉽게 사용할 수 있다.
- 컴포넌트 파일들을 src/components 디렉터리에 저장하는 것은 자주 사용되는 관습이다.
- 프로젝트 최상위 디렉토리에서 jsconfig.json 파일을 다음과 같이 작성하면, 불러오져는 컴포넌트 파일이 열려 있지 않아도 자동 완성을 통해 컴포넌트를 불러와서 사용할 수 있다.
  ```json
  {
    "compilerOptions": {
      "target": "es6"
    }
  }
  ```

<br />
<br/>

# 11장. 컴포넌트 성능 최적화

## 많은 데이터 렌더링하기

```jsx
const [todos, setTodos] = useState(createBulkTodos);
```

- useState의 기본 값에 함수를 호출하는 형태를 넣으면 리렌더링될 때마다 해당 함수가 호출되고, 함수 이름을 파라미터로 넣으면 컴포넌트가 처음 렌더링될 때만 실행된다.

<br/>

## 크롬 개발자 도구를 통한 성능 모니터링

- 성능을 분석해야 할 때는 느려졌다는 느낌만으로 충분하지 않다. 정확히 몇 초가 걸리는지 측정하려면 **React DevTools**를 사용하면 된다.
- 리액트 개발 도구의 Profiler 탭을 열고 → 좌측 상단 파란색 녹화 버튼을 누르고 → 리렌더링을 발생시키는 작업을 수행하고 → 녹화 버튼을 한 번 더 누르면 → 성능 분석 결과가 나타난다.
- 우측의 Render duration은 리렌더링에 소요된 시간을 의미한다.
- Profiler 탭의 상단에 있는 불꽃 모양 아이콘 우측의 랭크 차트 아이콘을 누르면, 리렌더링된 컴포넌트를 오래 걸린 순으로 정렬하여 나열해준다.

<br/>

## 컴포넌트에서 리렌더링이 발생하는 상황

1. 자신이 전달받은 props가 변경될 때
2. 자신의 state가 바뀔 때
3. 부모 컴포넌트가 리렌더링될 때
4. forceUpdate 함수가 실행될 때

<br/>

## React.memo를 사용하여 컴포넌트 성능 최적화

- 컴포넌트의 리렌더링을 방지하기 위해 `shouldComponentUpdate` 라는 라이프사이클을 사용하면 된다. 함수 컴포넌트에서는 `React.memo` 함수를 사용하면 된다.
- React.memo는 컴포넌트의 props가 바뀌지 않았다면 리렌더링하지 않도록 설정한다.

```jsx
import React from 'react';

const TodoListItem({todo, onRemove, onToggle}) => { ... };

export default React.memo(TodoListItem);
```

- TodoListItem 컴포넌트는 todo, onRemove, onToggle이 바뀌지 않으면 리렌더링하지 않는다.

<br/>

## onToggle, onRemve 함수가 바뀌지 않게 하기

- todos 배열이 업데이트되면 onRemove, onToggle 함수도 새롭게 바뀐다.
- 함수가 계속 만들어지는 상황을 방지하는 방법은 useState의 함수형 업데이트 기능을 사용하거나, useReducer를 사용하는 것이다.

> **useState의 함수형 업데이트**

- setTodos를 사용할 때 새로운 상태를 파라미터로 넣는 대신, 상태 업데이트를 어떻게 할지 정의해주는 업데이트 함수를 넣을 수 있다. (함수형 업데이트)
- setTodos에 업데이트 함수를 넣으면, 더이상 todos를 참조하지 않아도 되기 때문에 useCallback을 사용할 때 두 번째 파라미터로 넣는 배열에 todos를 넣지 않아도 된다.
- **before**

  ```jsx
  const onInsert = useCallback(
    (text) => {
      const todo = { id: nextId.current, text, checked: false };
      setTodos(todos.concat(todo));
      nextId.current += 1;
    },
    [todos],
  );

  const onRemove = useCallback(
    (id) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    },
    [todos],
  );

  const onToggle = useCallback((id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo,
      ),
    );
  });
  ```

- **after**

  ```jsx
  const onInsert = useCallback((text) => {
    const todo = { id: nextId.current, text, checked: false };
    setTodos((todos) => todos.concat(todo));
    nextId.current += 1;
  }, []);

  const onRemove = useCallback((id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }, []);

  const onToggle = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo,
      ),
    );
  }, []);
  ```

> **useReducer 사용하기**

useReducer에 두 번째 파라미터(초기 상태) 대신 세 번째 파라미터로 초기 상태를 만들어주는 함수를 전달할 수 있다.

```jsx
function todoReducer(todos, action) {
  switch (action.type) {
    case 'INSERT':
      return todos.concat(action.todo);
    case 'REMOVE':
      return todos.filter((todo) => todo.id !== action.id);
    case 'TOGGLE':
      return todos.map((todo) =>
        todo.id == action.id ? { ...todo, checked: !todo.checked } : todo,
      );
    default:
      return todos;
  }
}
```

```jsx
const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);

const onInsert = useCallback((text) => {
  const todo = { id: nextId.current, text, checked: false };
  dispatch({ type: 'INSERT', todo });
  nextId.current += 1;
}, []);

const onRemove = useCallback((id) => {
  dispatch({ type: 'REMOVE', id });
}, []);

const onToggle = useCallback((id) => {
  dispatch({ type: 'TOGGLE', id });
}, []);
```

<br/>

## 불변성의 중요성

- 상태를 업데이트할 때 불변성을 지키면, 객체 내부의 값이 바뀐 것을 감지할 수 있다. React.memo를 사용했을 때 props가 바뀌었는지 여부를 알아내서 리렌더링 성능을 최적화할 수 있다. → 리액트에서 불변성은 성능 최적화와 직결되는구나
- 배열 혹은 객체의 구조가 복잡해지면, 불변성을 유지하면서 업데이트하는 것도 까다로워진다. → immer 라이브러리의 도움을 받을 수 있다.

<br/>

## react-virtualized를 사용한 렌더링

- react-virtualized를 사용하면 리스트 컴포넌트에서 스크롤되기 전에 보이지 않는 컴포넌트는 렌더링하지 않고 크기만 차지하게끔 할 수 있다. 스크롤되면 해당 스크롤 위치에서 보여주어야 할 컴포넌트를 자연스럽게 렌더링시킨다.
- `npm install react-virtualized` : 라이브러리 설치

```jsx
import { List } from 'react-virtualized';

const TodoList = ({ todos, onRemove, onToggle }) => {
  const rowRender = useCallback(
    ({ index, key, style }) => {
      const todo = todos[index];
      return (
        <TodoListItem
          todo={todo}
          key={key}
          onRemove={onRemove}
          onToggle={onToggle}
          style={style}
        />
      );
    },
    [onRemove, onToggle, todos],
  );

  return (
    <List
      className="TodoList"
      width={512} // 전체 너비
      height={513} // 전체 높이
      rowCount={todos.length} // 항목 개수
      rowHeight={57} // 항목 높이
      rowRenderer={rowRender} // 항목을 렌더링하는 함수
      list={todos} // 배열
      style={{ outline: 'none' }} // List에 기본 적용되는 outline 스타일 제거
    />
  );
};
```

<br/>

> **리액트 컴포넌트 렌더링은 기본적으로 빠르기 때문에 컴포넌트를 개발할 때 최적화 작업에 대해 너무 큰 스트레스를 받을 필요 없다. 단, 리스트와 관련된 컴포넌트를 만들 때 보여줄 항목이 100개 이상이고 업데이트가 자주 발생한다면, 학습한 방식을 꼭 사용하여 최적화자.**
