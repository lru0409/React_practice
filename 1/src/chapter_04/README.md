# JSX

> **A syntax extension to JavaScript**
>
> - **자바스크립트의 확장 문법**
> - **JavaScript + XML/HTML**
>
> ```jsx
> const element = <h1>Hello, world!</h1>;
> ```

<br/>

## JSX ↔ React.createElement()

React는 내부적으로 JSX 코드를 `React.createElement()` 함수를 사용하는 코드로 변환한다.

```jsx
// JSX를 사용한 코드
const element = <h1 className="greeting">Hello, world!</h1>;
// JSX를 사용하지 않은 코드
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

> **React.createElement()**
>
> `React.createElement()`에는 다음과 같은 파라미터가 전달된다.
>
> ```jsx
> React.createElement(
> 	type, // element의 유형 (div, button)
> 	[props], // element의 속성
> 	[...children] // 자식 element
> }
> ```
>
> `React.createElement()`의 결과로 다음과 같은 객체가 생성된다.
>
> ```jsx
> const element = {
>   type: "h1",
>   props: {
>     className: "greeting",
>     children: "Hello, world!",
>   },
> };
> ```
>
> - React는 이 객체들을 읽어서 DOM을 만드는 데 사용하고, 항상 최신 상태로 유지한다.

<br/>

## JSX 사용법

중괄호를 사용해서 HTML 코드 중간에 JavaScript 코드를 섞어 작성할 수 있다.

```jsx
const element = <h1>안녕, {name}</h1>;
const element = <h1>Hello, {formatUser(user)}</h1>;
const element = <img src={user.avatarUrl}></img>;
```

<br/>

## JSX의 장점

1. 코드가 더욱 간결해진다.
2. 생산성과 가독성이 향상되어, 코드의 의미가 더 빠르게 와닿는다.
3. Injection Attacks 이라고 불리는 해킹 방법을 방어해 보안성이 올라간다.
   - Injection Attacks은 입력창에 소스 코드를 입력하여 해당 코드가 실행되도록 만드는 해킹 방법이다.
   - 기본적으로 React DOM은 렌더링 전에 중괄호 내부의 표현식을 모두 문자열로 변환한다.
     그렇기 때문에 명시적으로 선언되지 않은 값은 중괄호 사이에 들어갈 수 없다?

<br/>

## JSX 실습

```jsx
import React from "react";

function Book(props) {
  return (
    <div>
      <h1>{`이 책의 이름은 ${props.name}입니다.`}</h1>
      <h2>{`이 책은 총 ${props.numOfPage}페이지로 이뤄져 있습니다.`}</h2>
    </div>
  );
}

export default Book;
```

```jsx
import React from "react";
import Book from "./Book";

function Library(props) {
  return (
    <div>
      <Book name="처음 만난 파이썬" numOfPage={300} />
      <Book name="처음 만난 AWS" numOfPage={400} />
      <Book name="처음 만난 리액트" numOfPage={500} />
    </div>
  );
}

export default Library;
```
