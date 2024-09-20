# Components and Props

## Components

- React를 컴포넌트 기반이라고 하는 이유는, 작은 컴포넌트들이 모여 하나의 컴포넌트를 구성하고 이러한 컴포넌트들이 모여 전체 페이지를 구성하기 때문이다.
- 함수처럼, 리액트 컴포넌트도 입력을 받아서 정해진 출력을 한다. → 리액트 컴포넌트를 그냥 하나의 함수라고 생각하면 좀 더 쉽다.
- 리액트 컴포넌트는 `Props`를 입력으로 받고, `React Element`를 출력으로 내뱉는다.
  - 리액트 컴포넌트의 역할은 속성(Props)을 입력으로 받아 그에 맞는 화면에 나타날 React Element를 생성해주는 것이다.
  - 리액트 컴포넌트/엘리먼트의 개념은 객체 지향 프로그래밍에서의 클래스/인스턴스의 개념과 유사하다.
    <img width="1081" alt="스크린샷 2024-08-28 오후 3 25 41" src="https://gist.github.com/user-attachments/assets/45617a41-5714-4505-bc3f-5e39905f4ca2">

<br/>

## Props

- 같은 리액트 컴포넌트에서 글자나 색깔 등의 속성을 바꾸고 싶을 때 사용하는 컴포넌트 속 재료이다.
- 리액트 컴포넌트에 전달할 다양한 정보를 담고 있는 자바스크립트 객체이다.

  <img width="1127" alt="스크린샷 2024-08-28 오후 3 29 30" src="https://gist.github.com/user-attachments/assets/18f284a4-9107-4944-90d6-0889cbd2c05f">

<br/>

## Props의 특징

- Read-Only, 읽기 전용이다. → 값을 변경할 수 없다.
- 다른 Props로 엘리먼트를 생성하려면, 새로운 값을 컴포넌트에 전달하여 새로 엘리먼트를 생성해야 한다.
- React 공식 문서의 설명
  > _“모든 리액트 컴포넌트는 그들의 Props에 관해서는 순수 함수 같은 역할을 해야 한다.”_
  > **⇒ 모든 리액트 컴포넌트는 Props를 직접 바꿀 수 없고, 같은 Props에 대해서는 항상 같은 결과를 보여주어야 한다.**

<br/>

## Props 사용법

- JSX를 사용하는 경우, 키-값 쌍의 형태로 컴포넌트에 props를 넣을 수 있다.
  ```jsx
  function App(props) {
    return (
      <Profile
        name="로운"
        introduction="안녕하세요, 로운입니다."
        viewCount={1500}
      />
    );
  }
  ```
  - props에 값을 넣을 때 문자열 이외에 정수, 변수, 다른 컴포넌트 등이 들어갈 경우 중괄호를 사용해 감싸주어야 한다.
- Props의 값으로 다른 컴포넌트를 넣을 수도 있다.
  ```jsx
  function App(props) {
    return (
      <Layout
        width={2560}
        height={1440}
        header={<Header title="제목" />}
        footer={<Footer />}
      />
    );
  }
  ```
- `React.createElement()`를 사용하는 경우, 두 번째 인자로 전달하는 자바스크립트 객체가 곧 해당 컴포넌트의 props가 된다.
  ```jsx
  React.createElement(
    Profile,
    {
      name: "로운",
      introduction: "안녕하세요, 로운입니다.",
      viewCount: 1500,
    },
    null
  );
  ```

<br/>

## Component 만들기

- 리액트 컴포넌트는 크게 클래스 컴포넌트와 함수 컴포넌트로 나뉜다.
  - 리액트 초기 버전에서는 클래스 컴포넌트를 주로 사용했지만, 사용하기 불편하다는 의견이 많이 나왔고 함수 컴포넌트로 개선하여 주로 사용하게 되었다.

### Function Component

```jsx
function Welcome(props) {
  return <h1>안녕, {props.name}</h1>;
}
```

- 간단한 코드가 장점이다.

### Class Component

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>안녕 {this.props.name}</h1>;
  }
}
```

- 모든 클래스 컴포넌트는 `React.Component`를 상속받아 만들어진다.

> 컴포넌트의 이름은 항상 대문자로 시작해야 한다.
> 소문자로 시작하는 컴포넌트는 React가 DOM 태그로 인식하기 때문이다.

<br/>

## Componenet 렌더링하기

```jsx
function Welcome(props) {
	return <h1>안녕, {props.anem}</h1>;
}

const element = <Welcome name="로운" />;
ReactDOM.render(
	element,
	document.getElementById('root)
);
```

<br/>

## Component 합성

- 여러 개의 컴포넌트를 합쳐서 하나의 컴포넌트를 만드는 것
- 리액트에서는 컴포넌트 안에서 다른 컴포넌트를 사용할 수 있기 때문에, 복잡한 화면을 여러 개의 컴포넌트로 구현할 수 있다.

```jsx
function Welcome(props) {
  return <h1>안녕, {props.anem}</h1>;
}

function App(props) {
  return (
    <div>
      <Welcome name="Mike" />
      <Welcome name="Steve" />
      <Welcome name="Jane" />
    </div>
  );
}
```

<br/>

## Component 추출

- 복잡한 컴포넌트를 쪼개서 여러 개의 컴포넌트로 나누는 것
- 컴포넌트 추출을 잘 활용하면, 컴포넌트의 재사용성이 올라간다.
  - 컴포넌트가 작아질수록 컴포넌트의 기능과 목적이 명확해지고 props도 단순해지므로 여러 곳에서 사용할 수 있을 확률이 높아진다.

<br/>

## 댓글 컴포넌트 만들기

```jsx
function Comment(props) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.imageContainer}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          style={styles.image}
        />
      </div>
      <div style={styles.contentContainer}>
        <span style={styles.nameText}>{props.name}</span>
        <span style={styles.commentText}>{props.comment}</span>
      </div>
    </div>
  );
}
```

```jsx
function CommentList(props) {
  return (
    <div>
      {comments.map((comment) => {
        return <Comment name={comment.name} comment={comment.comment} />;
      })}
    </div>
  );
}
```
