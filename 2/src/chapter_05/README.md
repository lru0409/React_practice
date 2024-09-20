# 5장. ref: DOM에 이름 달기

> **클래스 컴포넌트에서 ref를 사용하는 방법을 알아본다.**
>
> - HTML에서 DOM 요소에 이름을 달 때 id를 사용하듯이, 리액트에서는 DOM에 이름을 달 때 ref를 사용한다.
> - 리액트 컴포넌트 안에서 id를 사용하는 것은 권장되지 않는다. DOM에서 id는 유일해야 하는데 같은 컴포넌트를 여러 번 사용하게 되면, 중복 id를 가진 DOM이 생긴다.
>   - 대부분은 id를 사용하지 않고도 원하는 기능을 구현할 수 있다.
> - ref는 전역적으로 작동하지 않고 컴포넌트 내부에서만 작동하기 때문에 문제가 생기지 않는다.

<br/>

## ref는 어떤 상황에서 사용해야 할까?

- DOM을 꼭 직접적으로 건드려야 할 때 사용해야 한다.
- 리액트에서 요소의 속성을 바꾸는 작업은 굳이 DOM에 접근하지 않아도 state로 구현할 수 있다.
- 가끔 state 만으로 해결할 수 없는 기능이 있다. → 이때 ref를 사용
  - 특정 input에 포커스 주기
  - 스크롤 박스 조작하기
  - Canvas 요소에 그림 그리기 등

<br/>

## ref 사용

> **콜백 함수를 통한 ref 설정**

- ref를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달한다.
- 이 콜백 함수는 ref 값을 파라미터로 전달받고, 함수 내부에서 파라미터로 받은 ref를 컴포넌트의 멤버 변수로 설정한다.

```jsx
<input
  ref={(ref) => {
    this.input = ref;
  }}
/>
```

- 이렇게 하면, 앞으로 this.input은 input 요소의 DOM을 가리킨다.

> **createRef를 통한 ref 설정**

- 컴포넌트 내부에서 멤버 함수로 React.createRef()를 담아준다.
- 해당 멤버 변수를 ref를 달고자 하는 요소에 ref props로 넣어준다.

```jsx
import { Component } from "react";

class RefSample extends Component {
  input = React.createRef();

  handleFocus = () => {
    this.input.current.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.ref} />
      </div>
    );
  }
}
```

- 나중에 ref를 설정해 준 DOM에 접근하려면, this.input.current를 조회하면 된다.

<br/>

## 컴포넌트에 ref 달기

- 컴포넌트에 ref를 다는 것은, 주로 컴포넌트 내부에 있는 DOM을 외부에서 사용할 때 쓴다.

```jsx
<MyComponent ref={(ref) => this.myComponent=ref}}
```

- MyComponent 내부의 메서드 및 멤버 변수에 접근할 수 있다. → 내부의 ref에도 접근할 수 있게 됨
- ScrollBox 컴포넌트

  ```jsx
  import { Component } from "react";

  class ScrollBox extends Component {
    scrollToBottom = () => {
      const { scrollHeight, clientHeight } = this.box;
      this.box.scrollTop = scrollHeight - clientHeight;
    };

    render() {
  	  (...)
      return (
        <div
          style={style}
          ref={(ref) => {
            this.box = ref;
          }}
        >
          <div style={innerStyle} />
        </div>
      );
    }
  }

  export default ScrollBox;

  ```

  - scrollBox에 ref를 단다.
  - 스크롤을 가장 밑으로 내리는 scrollToBottom 메서드가 있다.

- App 컴포넌트에서 ScrollBox 컴포넌트에 ref 달아서 scrollToBottom 메서드 실행하기

  ```jsx
  class App extends Component {
    render() {
      return (
        <div>
          <ScrollBox ref={(ref) => (this.scrollBox = ref)} />
          <button onClick={() => this.scrollBox.scrollToBottom()}>
            맨 밑으로
          </button>
        </div>
      );
    }
  }

  export default App;
  ```

  - ScrollBox 컴포넌트에 ref를 달아 this.scrollBox로 저장한다.
  - 버튼 클릭 시, ScrollBox ref를 사용해 ScrollBox의 메서드를 호출한다.
  - 문법상으로는 onClick={this.scrollBox.scrollToBottom} 같이 작성해도 틀린 것은 아니다. 하지만 컴포넌트가 처음 렌더링될 때는 this.scrollBox가 undefined이므로 오류가 발생한다. → 화살표 함수 문법을 사용하자.
