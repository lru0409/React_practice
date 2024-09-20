# 3장. 컴포넌트

## props 기본 값 설정: defaultProps

- 상위 컴포넌트에서 props 값을 따로 지정하지 않았을 때 보여 줄 기본 값을 설정할 수 있다.

```jsx
const MyComponent = (props) => {
  return <div>안녕하세요, 제 이름은 {props.name}입니다.</div>;
};

MyComponent.defaultProps = {
  name: "기본 이름",
};
```

<br/>

## propTypes를 통한 props 검증

- 컴포넌트의 필수 props를 지정하거나 props의 타입을 지정할 수 있다.

```jsx
import PropTypes from 'prop-types';

(...)

MyComponent.propTypes = {
	name: PropTypes.string // name prop은 무조건 문자열 형태로 전달되어야 함
	favoriteNumber: PropTypes.number.isRequire // favoriteNumber prop은 필수적으로 전달되어야 하고, 타입이 숫자여야 함
};
```

- PropTypes를 통해 여러 가지 종류의 타입을 설정할 수 있다.
  | array                       | 배열                                                       |
  | --------------------------- | ---------------------------------------------------------- |
  | arrayOf(PropType)           | 특정 PropType으로 이루어진 배열                            |
  | bool                        | true나 false                                               |
  | func                        | 함수                                                       |
  | number                      | 숫자                                                       |
  | object                      | 객체                                                       |
  | string                      | 문자열                                                     |
  | symbol                      | ES6의 symbol                                               |
  | node                        | 렌더링할 수 있는 모든 것(숫자, 문자열, JSX 코드, children) |
  | instanceOf(클래스)          | 특정 클래스의 인스턴스                                     |
  | oneOf([’dog’, ‘cat’])       | 주어진 배열 요소 중 값 하나                                |
  | oneOfType([PropType, …])    | 주어진 배열 요소 중 타입 하나                              |
  | ObjectOf(PropType)          | 객체의 모든 키 값이 인자로 주어진 타입인 객체              |
  | shape({name: PropType, ..}) | 주어진 스키마를 가진 객체                                  |
  | any                         | 아무 종류                                                  |

<br/>

## 클래스 컴포넌트의 setState()

- this.setState를 사용하여 state 값을 업데이트할 때, 상태가 비동기적으로 업데이트된다.
  ```jsx
  onClick={() => {
  	this.setState({ number: number + 1 });
  	this.setState({ number: this.state.number + 1 });
  }}
  ```
  - setState를 두 번 사용했음에도 버튼 클릭 시 숫자가 1씩 업데이트된다.
  - setState를 한다고 해서 state 값이 바로 바뀌지는 않기 때문이다.
  - setState에 객체 대신 함수를 인자로 넣어 이 문제를 해결할 수 있다.
    ```jsx
    onClick={() => {
    	this.setState((prevState) => ({ number: prevState.number + 1});
    	this.setState((prevState) => ({ number: prevState.number + 1});
    }}
    ```
- setState를 통해 값을 업데이트한 다음 특정 작업을 하고 싶을 때, setState의 두 번째 파라미터로 콜백 함수를 등록할 수 있다.
