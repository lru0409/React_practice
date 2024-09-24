# 15장. Context API

> **Context API는 리액트 프로젝트에서 전역적으로 사용할 데이터가 있을 때 유용한 기능이다.**
>
> - 사용자 로그인 정보, 애플리케이션 환경 설정, 테마 등의 데이터가 있다.
> - 리액트 관련 라이브러리에서도 많이 사용되고 있다. (리덕스, 리액트 라우터 등)

<br/>

## Context API를 사용한 전역 상태 관리 흐름 이해하기

- 리액트에서는 컴포넌트 간 데이터를 props로 전달하기 때문에, 컴포넌트 여기저기서 필요한 데이터를 최상위 컴포넌트인 App의 state에 넣어서 관리해야 한다.
- 위 방식은 하위 컴포넌트로 데이터를 전달하기 위해 많은 컴포넌트를 거쳐야 하므로 유지보수성이 낮아진다. → 이를 위해 Context API를 사용할 수 있다.
- 리액트 v16.3 업데이트 이후에는 Context API가 많이 개선되어 별도의 라이브러리를 사용하지 않아도 전역 상태를 손쉽게 관리할 수 있다.

<br/>

## Context API 사용법 익히기

- `createContext` 함수로 새 Context를 만든다. 파라미터에는 해당 Context의 기본 상태를 전달한다.
  ```jsx
  import { createContext } from "react";
  const ColorContext = createContext({ color: "black" });
  ```
- Context 안에 들어 있는 `Consumer` 컴포넌트를 통해 데이터를 조회할 수 있다.
  ```jsx
  const ColorBox = () => {
    <ColorContext.Consumer>
      {(value) => (
        <div
          style={{ width: "64px", height: "64px", background: value.color }}
        />
      )}
    </ColorContext.Consumer>;
  };
  ```
  - Consumer 컴포넌트 사이에 중괄호를 열어 함수를 넣었다. 컴포넌트의 children이 있어야 할 자리에 함수를 전달하는 이러한 패턴을 `Function as a child` 또는 `Render Props` 라고 한다.
- `Provider`를 사용하면 Context의 value를 변경할 수 있다. (value 값을 명시해야 제대로 작동함!)
  ```jsx
  function App() {
    return (
      <ColorContext.Provider value={{ color: "red" }}>
        <div>
          <ColorBox />
        </div>
      </ColorContext.Provider>
    );
  }
  ```

<br/>

## 동적 Context 사용하기

```jsx
const ColorContext = createContext({
  state: { color: "black", subcolor: "red" },
  actions: {
    setColor: () => {},
    setSubColor: () => {},
  },
});

const ColorProvider = ({ children }) => {
  const [color, setColor] = useState("black");
  const [subcolor, setSubcolor] = useState("red");

  const value = {
    state: { color, subcolor },
    actions: { setColor, setSubcolor },
  };
  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

// const ColorConsumer = ColorContext.Consumer와 같은 의미
const { Consumer: ColorConsumer } = ColorContext;
```

- Context의 value에는 무조건 상태 값만 있어야 하는 것은 아니다. 함수를 전달할 수도 있다.
- ColorProvider라는 컴포넌트를 새로 작성해 주었고, 이 컴포넌트에서 ColorContext.Provider를 렌더링하고 있다.
- Provider의 value에는 상태는 state, 업데이트 함수는 actions로 묶어서 전달하고 있는데, 이렇게 객체를 분리해주면 나중에 Context의 값을 사용할 때 편하다.

<br/>

## Consumer 대신 Hook 또는 static contextType 사용하기

> **useContext Hook 사용하기**

- 함수 컴포넌트에서 Context를 아주 편하게 사용할 수 있는 방법이다.
- children에 함수를 전달하는 Render Props 패턴이 불편하다면, `useContext` Hook을 사용할 수 있다.

```jsx
import { useContext } from "react";
import ColorContext from "../contexts/color";

const ColorBox = () => {
  const { state } = useContext(ColorContext);

  return (
    <>
      <div style={{ width: "64px", height: "64px", background: state.color }} />
      <div
        style={{ width: "32px", height: "32px", background: state.subcolor }}
      />
    </>
  );
};
```

> **static contextType 사용하기**

- 클래스형 컴포넌트에서 Context를 좀 더 쉽게 사용할 수 있는 방법이다.
- `static contextType`을 정의하면, this.context를 통해 현재 Context의 value를 조회할 수 있다.
- 클래스 메서드에서도 Context에 넣어 둔 함수를 쉽게 호출할 수 있다는 장점이 있다.
- 한 클래스에서 하나의 Context 밖에 사용하지 못한다는 단점이 있다.

```jsx
class SelectColors extends Component {
	static contextType = ColorContext;
	(...)
}
```
