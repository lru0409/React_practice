# Context

## Context

- 일반적으로 데이터가 컴포넌트의 props를 통해 부모에서 자식으로 단방향으로 전달되었다.
- 하지만 여러 컴포넌트에 걸쳐 자주 사용되는 데이터의 경우, 기존 방식을 사용하면 코드가 복잡해지고 사용하기 불편해진다. → 그래서 컨텍스트가 나왔다.
- 컨텍스트를 사용하면, 데이터를 필요로 하는 컴포넌트에 데이터를 곧바로 전달할 수 있다.
  <img width="805" alt="스크린샷 2024-09-03 오후 12 48 20" src="https://gist.github.com/user-attachments/assets/4a03e46b-7cd8-42c5-933d-d03c6bf3aa9b">
- 로그인 여부, 로그인 정보, UI 테마, 현재 언어 등 곳곳의 컴포넌트에서 필요한 데이터의 경우 컨텍스트를 사용해야 한다.

```jsx
const ThemeContext = React.createContext("light");

function App(props) {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 중간에 위치한 컴포너트가 메타 데이터를 하위 컴포넌트로 전달할 필요가 없다.
function Toolbar(props) {
  return (
    <div>
      <ThemeButton />
    </div>
  );
}

function ThemeButton(props) {
  return (
    // 가장 가까운 상위 테마 Provider를 찾아 해당되는 값을 사용하게 된다.
    // 만약 해당되는 Provider가 없을 경우 기본값(light)를 사용한다.
    // 여기서는 상위 Provider가 있으므로 drak 값을 사용한다.
    <ThemeContext.Consumer>
      {(value) => <Button theme={value} />}
    </ThemeContext.Consumer>
  );
}
```

<br/>

## 컴포넌트와 Context가 연동되면 컴포넌트의 재사용성이 떨어짐

- 컴포넌트가 특정 컨텍스트에 의존하게 되면, 해당 컴포넌트는 그 컨텍스트의 프로바이더가 존재하는 컴포넌트 트리 내에서만 사용될 수 있다는 문제점이 있다고 하는 것 같다.
- 다른 레벨의 많은 컴포넌트가 데이터를 필요로 하는 경우가 아니라면, props를 통해 데이터 전달하는 방법이 적합하다.

<br/>

## 중간 단계 컴포넌트가 불필요한 props를 전달해야 하는 상황

<img width="923" alt="스크린샷 2024-09-03 오후 1 02 28" src="https://gist.github.com/user-attachments/assets/1c3c059b-50f1-4bd5-8494-3077ad1c4ad5">

- 컨텍스트를 사용하지 않고 문제를 해결하는 방법 : 아바타 컴포넌트를 변수에 저장하여 직접 넘겨주기

<img width="759" alt="스크린샷 2024-09-03 오후 1 07 29" src="https://gist.github.com/user-attachments/assets/94c4806d-584f-4a31-aa55-fa5a906f054a">

- 가장 상위 레벨의 Page 컴포넌트만 아바타 컴포넌트에서 필요한 정보를 알고 있으면 된다.
- 최상위에 있는 컴포넌트에 좀 더 많은 권한을 부여해주는 방법이다. → 데이터가 많아질수록 상위 컴포넌트에 몰리기 때문에 상위 컴포넌트가 복잡해질 수 있다는 단점이 있다.

<br/>

## ContextAPI

> **컨텍스트 생성하기**
>
> ```jsx
> const MyContext = React.createContext(기본값);
> ```
>
> - 기본값으로 undefined를 넣으면 기본값이 사용되지 않는다.

> **하위 컴포넌트들이 해당 컨텍스트의 데이터를 받을 수 있도록 설정하기**
>
> ```jsx
> <MyContext.Provider value={}>
> ```
>
> - 데이터를 제공해주는 컴포넌트이다.
> - Context.Provider 컴포넌트로 하위 컴포넌트들을 감싸주면, 모든 하위 컴포넌트들이 해당 컨텍스트의 데이터에 접근할 수 있게 된다
> - 하위 컴포넌트들이 제공되는 데이터를 소비한다는 의미에서, 컨슈머 컴포넌트라고 부른다.
>   - 컨슈머 컴포넌트들은 컨텍스트 값의 변화를 지켜보다가, 값이 변경되면 재렌더링된다.

> **클래스 컴포넌트에서 컨텍스트의 데이터에 접근하기**
>
> ```jsx
> class MyClass extends React.Component {
> 	comoponentDidMount() {
> 		let value = this.context;
> 		// MyContext의 값을 이용해 원하는 작업 수행 가능
> 	}
> 	...
> }
> MyClass.contextType = MyContext;
> ```
>
> - Class.contextType을 사용하면, 클래스가 컴포넌트가 해당 컨텍스트의 데이터에 접근할 수 있다.
> - this.context를 통해서 컨텍스트의 값을 가져올 수 있다.
> - 이 방법은 단 하나의 컨텍스트만 구독할 수 있다.

> **함수 컴포넌트에서 컨텍스트의 데이터를 구독하기**
>
> ```jsx
> <MyContext.Consumer>
> 	{value => /* 컨텍스트의 값에 따라서 컴포넌트들을 렌더링 */ }
> </MyContext.Consumer>
> ```
>
> - 컨텍스트의 데이터를 구독하는 컴포넌트이다.
> - 컴포넌트의 자식으로 함수가 올 수 있는데, 이것을 function as a child라고 한다.
> - 자식으로 들어간 함수가 현재 컨텍스트의 value를 받아서 react node로 리턴하게 된다.

### Provider value에서 주의해야 할 사항

- 프로바이더 컴포넌트가 재렌더링될 때마다 모든 하위 컨슈머 컴포넌트를 재렌더링하게 될 수 있다.
- 프로바이더 컴포넌트의 value 속성에 담기는 객체가 매번 새롭게 생성되기 때문이다.
- 이를 방지하기 위해서 value를 직접 넣는 대신 컴포넌트의 State로 옮기고, 해당 State의 값을 넣어주어야 한다.

```jsx
function App(props) {
  const [value, setValue] = useState({ something: "something" });

  return (
    <MyContext.Provider value={value}>
      <Toolbar />
    </MyContext.Provider>
  );
}
```

<br/>

## function as a child

```jsx
// children이라는 prop을 직접 선언하는 방식
<Profile children={name => <p>이름: {name}</p>} />

// Profile 컴포넌트로 감싸서 children으로 만드는 방식
<Profile>{name => <p>이름: {name}</p>}</Profile>
```

- 두 번째 방법은 Profile 컴포넌트에 children prop으로 함수를 전달한다.

<br/>

## Context.displayName

```jsx
const MyContext = React.createConext();
MyContext.displayName = "MyDisplayName";

<MyContext.Provider> // 개발자 도구에 "MyDisplayName.Provider"로 표시됨
<MyContext.Consumer> // 개발자 도구에 "MyDisplayName.Consumer"로 표시됨
```

- 크롬의 React 개발자 도구에서 컨텍스트의 Provider나 Consumer를 표시할 때 displayName을 함께 표시해준다.

<br/>

## 여러 개의 Context 사용하기

- Context.Provider를 중첩해서 사용해야 한다.

  ```jsx
  const ThemeContext = React.createContext('light');
  const UserContext = React.createContext({
  	name: "Guest",
  });

  class App extends React.Component {
  	render() {
  		const { signedInUser, theme } = this.props;
  		return (
  			<ThemeContext.Provider value={theme}>
  				<UserContext.Provider value={signedInUser}>
  					<Layout />
  				</UserContext.Provider>
  			</ThemeContext>
  }

  function Layout() {
  	return (
  		<ThemeContext.Consumer>
  			{theme => (
  				<UserContext.Consumer>
  					{user => (
  						<ProfilePage user={user} theme={theme} />
  					)}
  				</UserContext.Consumer>
  			)}
  		</ThemeContext.Consumer>
  	);
  }
  ```

- 두 개 이상의 컨텍스트 값이 자주 함께 사용될 경우, 모든 값을 한 번에 제공해주는 별도의 컴포넌트를 직접 만드는 것을 고려하는 것이 좋다.

<br/>

## useContext()

- 함수 컴포넌트에서 컨텍스트를 쉽게 사용할 수 있도록 해주는 훅이다.
- 컨텍스트를 사용하기 위해 컴포넌트를 매번 컨슈머 컴포넌트로 감싸지 않게 해준다.

```jsx
function MyComponent(props) {
	const value = useContext(MyContext);

	return (
		...
	)
}
```

- 컨텍스트의 값이 변경되면, 변경된 값과 함께 useContext 훅을 사용하는 컴포넌트가 재렌더링된다.
- 따라서 useContext 훅을 사용하는 컨텍스트의 렌더링이 무거운 작업일 경우, 별도로 최적화 작업을 해줄 필요가 있다.

<br/>

## Context 사용하여 테마 변경 기능 만들기

```jsx
const ThemeContext = React.createContext();
ThemeContext.displayName = "ThemeContext";
```

```jsx
function DarkOrLight(props) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    if (theme == "light") {
      setTheme("dark");
    } else if (theme == "dark") {
      setTheme("light");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MainContent />
    </ThemeContext.Provider>
  );
}
```

```jsx
function MainContent(props) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: "1.5rem",
        backgroundColor: theme == "light" ? "white" : "black",
        color: theme == "light" ? "black" : "white",
      }}
    >
      <p>안녕하세요. 테마 변경이 가능한 웹사이트입니다.</p>
      <button onClick={toggleTheme}>테마 변경</button>
    </div>
  );
}
```
