# Conditional Rendering

## 조건부 렌더링

```jsx
function UserGreeting(props) {
  return <h1>다시 오셨군요!</h1>;
}

function GuestGreeting(props) {
  return <h1>회원가입을 해주세요.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;

  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGretting />;
}
```

<br/>

## 엘리먼트 변수

- 렌더링할 컴포넌트를 변수처럼 다루고 싶을 때 쓸 수 있는 방법

```jsx
function LoginButton(props) {
  return <button onClick={props.onClick}>로그인</button>;
}

function LogoutButton(props) {
  return <button onClick={props.onClick}>로그아웃</button>;
}
```

```jsx
function LoginControl(props) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLoginClick = () => {
		setIsLoggedIn(true);
	};

	const handleLogoutClick = () => {
		setIsLoggedIn(false);
	};

	let button;
	if (isLoggedIn) {
		button = <LogoutButton onClick={handleLogoutClick} />;
	} else {
		button <LoginButton onClick={handleLoginClick} />;
	}

	return (
		<div>
			<Greeting isLoggedIn={isLoggedIn} />
			{button}
		</div>
	);
}
```

<br/>

## 인라인 조건문

- && 연산자를 조건문처럼 활용한다.

  - 첫 번째 expression이 false를 반환하면 두 번째 expression은 평가되지 않지만, 첫 번째 expression의 결과 값이 그대로 리턴된다는 점에 유의해야 한다.
    다음 예시에서는 첫 표현식에서 false가 반환됐을 때 문제 없나?

  ```jsx
  function MailBox(props) {
    const unreadMessages = props.unreadMessages;

    return (
      <div>
        <h1> 안녕하세요! </h1>
        {unreadMessages.length > 0 && (
          <h2>현재 {unreadMessages.length}개의 읽지 않은 메시지가 있습니다.</h2>
        )}
      </div>
    );
  }
  ```

- 삼항 연산자를 활용한다.
  ```jsx
  function UserStatus(props) {
    return (
      <div>
        이 사용자는 현재 {props.isLoggedIn ? "로그인" : "로그인하지 않은"}{" "}
        상태입니다.
      </div>
    );
  }
  ```

<br/>

## 컴포넌트 렌더링 막기

- null을 리턴하면 된다.

```jsx
function WarnningBanner(props) {
  if (!props.warning) {
    return null;
  }
  return <div>경고!</div>;
}
```
