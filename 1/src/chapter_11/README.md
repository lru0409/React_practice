# Lists and Keys

> React에서는 배열을 사용해 리스트 형태로 엘리먼트들을 렌더링할 수 있다.

<br/>

## 여러 개의 컴포넌트 렌더링하기

- React에서는 리스트와 키를 사용해서, 반복되는 여러 개의 컴포넌트들을 쉽게 렌더링할 수 있다.
- 같은 컴포넌트들이 화면에 반복적으로 나타나는 경우, 이를 코드 상에 하나씩 직접 넣는 것은 굉장히 비효율적이며 동적으로 화면의 내용이 바뀌어야 하는 상황에 대비하지 못한다.

```jsx
function NumberList(props) {
	const { numbers } = props;
	const listItems = numbers.map((number) => (
		<li>{number}<li>
	);
	return (
		<ul>{listItems}</ul>
	);
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
	<NumberList numbers={numbers} } />,
	document.getElementById('root')
);
```

- 이 코드를 실행해보면, “리스트의 각 아이템은 무조건 고유한 키를 갖고 있어야 한다”는 경고 문구가 나온다.

<br/>

## List의 Key

- 키는 리스트에 존재하는 아이템을 구분하기 위한 고유한 문자열이다.
- 리스트에서 어떤 아이템이 변경/추가/삭제되었는지 구분하기 위해 사용한다.
- React에서 Key 값은 같은 List에 있는 Elements 사이에서만 고유한 값이면 된다.
- 아이디가 있는 경우에는 보통 아이디 값을 키로 사용하게 된다.
- 또는 인덱스를 키로 사용할 수 있다. 다만 리스트에서 아이템의 순서가 바뀔 수 있는 경우, 인덱스를 키로 사용하는 것은 권장되지 않는다.
  - React에서는 키를 명시적으로 넣어주지 않으면, 기본적으로 인덱스 값을 키로 사용한다.

```jsx
const todoItems = todos.map((todo) => <li key={todo.id}>{todo.text}</li>);
```

<br/>

## 출석부 출력하기 실습

```jsx
import React from "react";

const students = [
  { id: 1, name: "Ron" },
  { id: 2, name: "Steve" },
  { id: 3, name: "Jane" },
  { id: 4, name: "Jeff" },
];

function AttendanceBook(props) {
  return (
    <ul>
      {students.map((student) => {
        return <li key={student.id}>{student.name}</li>;
      })}
    </ul>
  );
}

export default AttendanceBook;
```
