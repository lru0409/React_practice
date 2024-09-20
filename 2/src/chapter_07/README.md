# 7장. 컴포넌트의 라이프사이클 메서드

> **컴포넌트를 처음 렌더링할 때 어떤 작업을 처리해야 하거나, 컴포넌트를 업데이트하기 전후로 어떤 작업을 처리해야 할 수도 있고, 또 불필요한 업데이트를 방지해야 할 수도 있다. → 이때 라이프사이클 메서드 사용**

<br/>

## 라이프사이클 메서드의 이해

> **마운트 : DOM이 생성되고 웹 브라우저 상에 나타남**

- 다음 메서드가 호출된다.
  - constructor: 컴포넌트를 새로 만들 때마다 호출되는 클래스 생성자 메서드
  - getDerivedStateFromProps: props에 있는 값을 state에 넣을 때 사용하는 메서드
  - render: 준비한 UI를 렌더링하는 메서드
  - componentDidMount: 컴포넌트가 웹 브라우저 상에 나타난 후 호출하는 메서드

> **업데이트**

- 컴포넌트는 다음 네 가지 경우에 업데이트된다.
  - props가 바뀔 때
  - state가 바뀔 때
  - 부모 컴포넌트가 리렌더링될 때
  - this.forceUpdate로 강제로 렌더링을 트리거할 때
- 다음 메서드가 호출된다.
  - getDerivedStateFromProps: 업데이트 시작 전에, props의 변화에 따라 state 값에 변화를 주고 싶을 때 사용한다. (마운트 과정에서도 호출됨)
  - shouldComponentUpdate: 불리언을 반환해 리렌더링을 해야 할지 말아야 할지 결정한다.
    - this.forceUpdate() 함수를 호출한다면 이 과정을 생략하고 바로 render 함수를 호출한다.
  - render: 컴포넌트를 리렌더링한다.
  - getSnapshotBeforeUpdate: 컴포넌트 변화를 DOM에 반영하기 바로 직전에 호출한다.
  - componentDidUpdate: 컴포넌트의 업데이트 작업이 끝난 후 호출한다.

> **언마운트 : 컴포넌트를 DOM제거 제거**

- 다음 메서드가 호출된다.
  - componentWillUnmount: 컴포넌트가 웹 브라우저 상에서 사라지기 전에 호출한다.

<br/>

## 라이프사이클 메서드 살펴보기

> **render()**

- 라이프사이클 메서드 중 유일한 필수 메서드
- 아무것도 보여주고 싶지 않다면, null이나 false를 반환하자.
- 이 메서드 안에서는 이벤트 설정이 아닌 곳에서 setState를 사용하면 안 되며, 브라우저의 DOM에 접근해서도 안 된다.
  - DOM 정보를 가져오거나 state에 변화를 줄 때는 componentDidMount에서 처리해야 한다.

> **getDerivedStateFromProps()**

- props로 받아온 값을 state에 동기화시키는 용도로 사용된다.
- 컴포넌트가 마운트될 때, 업데이트될 때 호출된다.

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
	if (nextProps.value !== prevState.value) {
		return { value: nextProps.value };
	return null;
}
```

> **componentDidMount()**

- 렌더링을 마친 후 실행한다.
- 이 안에서 자바스크립트 라이브러리 또는 프레임워크 함수를 호출하거나 이벤트 등록, setTimeout, setInterval, 네트워크 요청 같은 비동기 작업을 처리하면 된다.

> **shouldComponentUpdate()**

- 따로 생성하지 않으면 언제나 true를 반환한다.
- 이 메서드 안에서 현재 props와 state는 this.props와 this.state로 접근하고, 새로 설정될 props와 state는 nextProps와 nextState로 접근할 수 있다.

```jsx
shouldComponentUpdate(nextProps, nextState) { ... }
```

> **getSnapshotBeforeUpdate()**

- 이 메서드에서 반환하는 값은 componentDidUpdate에서 snapshot이라는 세 번째 파라미터로 전달받을 수 있다.
- 주로 업데이트하기 직전의 값을 참고할 일이 있을 때 사용된다. (예: 스크롤바 위치 유지)

```jsx
getSnapshotBeforeUpdate(prevProps, prevState) {
	if (prevState.array !== this.state.array) {
		const { scrollTop, scrollHeight } = this.list;
		return { scrollTop, scrollHeight };
	}
}
```

> **componentDidUpdate()**

- 업데이트가 끝난 직후이므로, DOM 관련 처리를 해도 무방하다.
- prevProps 또는 prevState를 통해 컴포넌트가 이전에 가졌던 데이터에 접근할 수 있다.
- getSnapshotBeforeUpdate가 반환했던 값이 있다면 여기서 snapshot 값을 전달받을 수 있다.

```jsx
componentDidUpdate(prevProps, prevState, snapshot) { ... }
```

> **componentWillUnmount()**

- componentDidMount에서 등록된 이벤트, 타이머, 직접 생성한 DOM이 있다면 여기서 제거 작업을 해야 한다.

> **componentDidCatch()**

- 컴포넌트 렌더링 도중 에러를 잡아낼 수 있게 해준다.
- error는 어떤 에러가 발생했는지, info는 어이에 있는 코드에서 오류가 발생했는지에 대한 정보를 준다.
- 컴포넌트 자신에게 발생하는 에러를 잡아낼 수 없으며, 자신의 this.props.children으로 전달되는 컴포넌트에서 발생하는 에러만 잡아낼 수 있다.

```jsx
componentDidCatch(error, info) {
	this.setState({
		error: true
	});
	console.log({error, info});
}
```
