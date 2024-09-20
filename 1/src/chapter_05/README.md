# Rendering Elements

> **Elements are the smallest building blocks of React apps.
> 엘리먼트는 리액트 앱의 구성하는 가장 작은 블록들이다.**

<br/>

## React Element와 DOM Element

- React 개발 조창기에, 화면에 나타나는 내용을 기술하는 자바스크립트 객체를 Descriptor라고 불렀다. 하지만 Descriptor가 최종적으로 나타나는 형태는 DOM Element 였기때문에 DOM과의 통일성을 위해서 Element라고 부르기로 결정했다.
- 실제 DOM에 존재하는 element는 DOM Element, React의 Virtual DOM에 존재하는 element는 React Element이다. → React Element는 DOM Element의 가상 표현이다.
- React Element를 토대로 DOM Element가 만들어진다.
- React Element는 자바스크립트 객체 형태로 존재한다.

<br/>

## React Element의 불변성

- **불변성** : 한 번 생성된 엘리먼트는 변하지 않는다.
  - 엘리먼트 생성 후에는 children이나 attributes를 바꿀 수 없다.
- 화면에 변경된 엘리먼트를 보여주려면 어떻게 해야 할까?
  → 기존 엘리먼트를 변경하는 것이 아니라 새로운 엘리먼트를 만들면 된다.

<br/>

## React Element 렌더링하기

- 다음 div 태그는 루트 DOM 노드이며, 이 태그 안에 리액트 엘리먼트들이 렌더링된다.
  ```jsx
  <div id="root"></div>
  ```
- 다음과 같이 루트 div에 리액트 엘리먼트를 렌더링할 수 있다.
  ```jsx
  const element = <h1>안녕, 리액트!</h1>;
  ReactDOM.render(element, document.getElementById("root"));
  ```
  - 첫 번째 파라미터로 리액트 엘리먼트, 두 번째 파라미터로 DOM 엘리먼트를 전달한다.

<br/>

## 렌더링된 Element 업데이트하기

tick 함수가 호출될 때마다 기존 엘리먼트가 변경되는 것이 아니라, 새로운 엘리먼트를 생성해 바꿔치기한다.

```jsx
function tick() {
	const element = {
		<div>
			<h1>안녕, 리액트!</h1>
			<h2>현재 시간: {new Date().toLocaleTimeString()}</h2>
		</div>
	};

	ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```
