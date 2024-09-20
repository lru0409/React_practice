# Handling Events

## DOM의 이벤트 처리 vs React의 이벤트 처리

- DOM에서 클릭 이벤트를 처리하는 코드
  ```jsx
  <button onclick="activate()">Activate</button>
  ```
- React에서 클릭 이벤트를 처리하는 코드
  ```jsx
  <button onClick={activate}>Activate</button>
  ```
  - onClick이 카멜 케이스로 작성되어 있다.
  - 이벤트를 처리할 함수를 문자열로 전달하지 않고, 함수 그대로 전달하고 있다.

⇒ 둘 사이에는 이벤트 이름의 표기법, 함수를 전달하는 방식에 차이가 있다.

<br/>

## 클래스 컴포넌트 이벤트 핸들러 추가 예시

- 메소드가 onClick에 전달되면서 외부에서 호출되면 this 바인딩이 올바르게 설정되지 않는다. 따라서 handleClick 메소드에 this를 명시적으로 바인딩하여 변수에 담고, 이를 onClick에 전달한다.
  ```jsx
  class Toggle extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isToggleOn: true };
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.setState((prevState) => ({
        isToggleOn: !prevState.isToggleOn,
      }));
    }

    render() {
      return (
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? "켜짐" : "꺼짐"}
        </button>
      );
    }
  }
  ```
- bind를 사용하는 방식이 번거롭다면, 화살표 함수를 사용해 상위 스코프로부터 this를 상속받게 할 수 있다.
  ```jsx
  class Toggle extends React.Component {
    handleClick = () => {
      this.setState((prevState) => ({
        isToggleOn: !prevState.isToggleOn,
      }));
    };

    render() {
      return (
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? "켜짐" : "꺼짐"}
        </button>
      );
    }
  }
  ```
  ```jsx
  class Toggle extends React.Component {
    handleClick() {
      this.setState((prevState) => ({
        isToggleOn: !prevState.isToggleOn,
      }));
    }

    render() {
      return (
        <button onClick={() => this.handleClick()}>
          {this.state.isToggleOn ? "켜짐" : "꺼짐"}
        </button>
      );
    }
  }
  ```
  - 두 번째 방식은 버튼 컴포넌트가 렌더링될 때마다 콜백 함수가 다시 생성되는 단점이 있다. 만약 이 콜백 함수가 하위 컴포넌트에 props로 전달되는 경우, 하위 컴포넌트에서 추가적인 렌더링이 일어나기 때문에 주의해야 한다. → 바인딩이나 첫 번째 방식을 사용하자.

<br/>

## 함수 컴포넌트 이벤트 핸들러 추가 예시

```jsx
function Toggle(props) {
  const [isToggleOn, setIsToggleOn] = useState(true);

  // 방법 1. 함수 안에 함수로 정의
  function handleClick() {
    setIsToggleOn((isToggleOn) => !isToggleOn);
  }

  // 방법 2. 화살표 함수를 사용하여 정의
  const handleClick = () => {
    setIsToggleOn((isToggleOn) => !isToggleOn);
  };

  return <button onClick={handleClick}>{isToggleOn ? "켜짐" : "꺼짐"}</button>;
}
```

<br/>

## 이벤트 핸들러에 Arguments 전달하기

- 클래스 컴포넌트에서 이벤트 핸들러에 파라미터를 전달하는 방식이다.
  다음 코드 두 줄은 동일한 역할을 한다.
  ```jsx
  <button onClick={(event) => this.deleteItem(id, event)}>삭제하기</button>
  <button onClick={this.deleteItem.bind(this, id)}>삭제하기</button>
  ```
- 함수 컴포넌트에서 이벤트 핸들러에 파라미터를 전달하는 방식이다.
  ```jsx
  function MyButton(props) {
    const handleDelete = (id, event) => {
      console.log(id, event.target);
    };

    return (
      <button onClick={(event) => handleDelete(1, event)}>삭제하기</button>
    );
  }
  ```

<br/>

## 클릭 이벤트 처리하기 실습

- 클래스 컴포넌트
  ```jsx
  class ConfirmButton extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isConfirmed: false,
      };
    }

    handleConfirm = () => {
      this.setState((prevState) => ({
        isConfirmed: !prevState.isConfirmed,
      }));
    };

    render() {
      return (
        <button onClick={this.handleConfirm} disabled={this.state.isConfirmed}>
          {this.state.isConfirmed ? "확인됨" : "확인하기"}
        </button>
      );
    }
  }
  ```
- 함수 컴포넌트
  ```jsx
  function ConfirmButton(props) {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
      setIsConfirmed((prevConfirmed) => !prevConfirmed);
    };

    return (
      <button onClick={handleConfirm} disabled={isConfirmed}>
        {isConfirmed ? "확인됨" : "확인하기"}
      </button>
    );
  }
  ```
