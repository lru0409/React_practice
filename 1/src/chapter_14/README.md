# Composition vs Inheritance

## Composition

- 여러 개의 컴포넌트를 합쳐서 새로운 컴포넌트를 만드는 것
- 여러 개의 컴포넌트들을 어떻게 조합할 것인가?
- 조합 방법에 따라 컴포지션 사용 기법이 나뉜다.

### 대표적인 컴포지션 사용 기법

- **Containment**

  - 하위 컴포넌트를 포함하는 형태의 합성 방법
  - 자신의 하위 컴포넌트를 미리 알 수 없을 때 사용할 수 있다.
  - props에 기본적으로 들어있는 children 속성을 사용한다.
  - 자신의 하위 컴포넌트를 모두 포함하여 예쁜 테두리를 감싸주는 FancyBorder 컴포넌트
    ```jsx
    function FancyBorder(props) {
      return (
        <div className={"FandyBorder FancyBorder-" + props.color}>
          {props.children}
        </div>
      );
    }
    ```
  - 직접 정의한 props를 사용할 수도 있다.

    ```jsx
    function SplitPane(props) {
      return (
        <div className="SplitPane">
          <div className="SplitPane-left">{props.left}</div>
          <div className="SplitPane-right">{props.right}</div>
        </div>
      );
    }

    function App(props) {
      return <SplitPane left={<Contacts />} right={<Chat />} />;
    }
    ```

    ⇒ props.children이나 직접 정의한 props를 이용하여 하위 컴포넌트를 포함하는 형태로 합성하는 방법

- **Specialization**

  - 범용적인 개념을 구별이 되게 구체화하는 것을 말한다.
  - 객체지향 언어에서 상속을 사용해 Specialization을 구현한 것처럼, React에서는 합성을 사용하여 Specialization을 구현한다.
  - 범용적인 Dialog 컴포넌트와 구체화된 WelcomeDialog 컴포넌트

    ```jsx
    function Dialog(props) {
      return (
        <FancyBorder color="blue">
          <h1 className="Dialog-title">{props.title}</h1>
          <p className="Dialog-message">{props.message}</p>
        </FancyBorder>
      );
    }

    function WelcomeDialog(props) {
      return (
        <Dialog
          title="어서 오세요"
          message="우리 사이트에 방문하신 것을 환영합니다!"
        />
      );
    }
    ```

    ⇒ 범용적으로 쓸 수 있는 컴포넌트를 만들어 놓고, 이를 특수화시켜서 컴포넌트를 사용하는 방법

→ 각 방법을 따로 또는 동시에 사용하면 다양하고 복잡한 컴포넌트를 효율적으로 만들 수 있다.

<br/>

## Inheritance

- 다른 컴포넌트로부터 상속을 받아서 새로운 컴포넌트를 만들 수 있다.
- React를 개발한 Meta에서 상속을 사용하여 컴포넌트를 만드는 것을 추천할 만한 사용 사례를 찾지 못했다고 한다. → 상속보다는 컴포지션을 활용하자.

<br/>

## Card 컴포넌트 만들기 실습

```jsx
function Card(props) {
  const { title, backgroundColor, children } = props;

  return (
    <div
      style={{
        margin: 8,
        padding: 8,
        borderRadius: 8,
        boxShadow: "0px 0px 4px grey",
        backgroundColor: backgroundColor || "white",
      }}
    >
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
}
```

```jsx
function ProfileCard(props) {
  return (
    <Card title="Rowoon Lee" backgroundColor="skyblue">
      <p>안녕하세요. 이로운입니다.</p>
      <p>저는 리액트를 사용해서 개발하고 있습니다.</p>
    </Card>
  );
}
```
