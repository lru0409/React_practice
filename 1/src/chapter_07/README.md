# State and Lifecycle

## State

- 리액트 컴포넌트의 상태
- 리액트 컴포넌트의 변경 가능한 데이터
- state는 사전에 정해진 것이 아니라, 개발자가 직접 정의한다.
- 렌더링이나 데이터 흐름에 사용되는 값만 state에 포함시켜야 한다.
  - state가 변경되면 컴포넌트가 재렌더링되기 때문에, 렌더링과 데이터 흐름에 관련 없는 값을 포함하면 불필요한 경우에 컴포넌트가 다시 렌더링되어 성능을 저하시킬 수 있다.
  - 렌더링, 데이터 흐름과 관련 없는 값은 컴포넌트의 인스턴스 필드로 정의하면 된다?
- state는 자바스크립트 객체이다.
- 클래스 컴포넌트의 경우, state를 생성자에 정의한다.

  ```jsx
  class LikeButton extends React.Component {
  	constructor(props) {
  		super(props);

  		this.state = {
  			liked: false
  		};
  	}
  	...
  }
  ```

- state는 정의된 이후 직접 수정하면 안 된다. 클래스 컴포넌트에서 state를 변경하고자 할 땐 setState 라는 함수를 사용해야 한다.
  ```jsx
  this.setState({
    name: "로운",
  });
  ```

<br/>

## Lifecycle

리액트 컴포넌트의 생명주기

<img width="1000" alt="스크린샷 2024-08-28 오후 4 23 57" src="https://gist.github.com/user-attachments/assets/909d6643-bba6-45a7-ab45-031840df03c5">

- 상위 컴포넌트에서 현재 컴포넌트를 더 이상 화면에 표시하지 않게 되면 Unmount된다.
- `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`는 라이프사이클 메소드이며, 생명주기에 따라 호출된다.
  - 클래스 컴포넌트의 함수이다.
- Component는 계속 존재하는 것이 아니라, 시간의 흐름에 따라 생성되고 업데이트되다가 사라진다.

<br/>

## State 사용하기

- state 객체에 notifications을 추가하여 화면에 표시할 알림 정보를 관리한다.

```jsx
var timer;

class NotificationList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
    };
  }

  componentDidMount() {
    timer = setInterval(() => {
      if (this.state.notifications.length < reservedNotifications.length) {
        const index = this.state.notifications.length;
        this.setState({
          notifications: this.state.notifications.concat(
            reservedNotifications[index]
          ),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  render() {
    return (
      <div>
        {this.state.notifications.map((notification) => {
          return <Notification message={notification.message} />;
        })}
      </div>
    );
  }
}
```

<br/>

## React Developer Tools 사용하기

[React Developer Tools - Chrome Web Store](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

- React 애플리케이션을 개발할 때에는 크롬 개발자 도구의 Elements 탭을 사용하는 것보다 React를 위해 별도로 개발된 React Developer Tools라는 도구를 이용하는 것이 좋다.

<br/>

## Lifecycle method 사용하기

- `componentDidMount()` : 컴포넌트가 마운트된 이후
- `componentDidUpdate()` : 컴포넌트가 업데이트된 이후
- `componentWillUnmount()` : 컴포넌트가 언마운트되기 전
- 생명주기 함수 들은 지금은 거의 사용하지 않는 클래스 컴포넌트의 기능이다.
- 💡 `key`는 React 엘리먼트를 구분하기 위한 고유의 값이다. `map` 함수를 사용할 때는 필수적으로 들어가야 한다.
  ```jsx
  render() {
  return (
      <div>
      {this.state.notifications.map((notification) => {
          return (
          <Notification
              key={notification.id}
              id={notification.id}
              message={notification.message}
          />
          );
      })}
      </div>
  );
  }
  ```
