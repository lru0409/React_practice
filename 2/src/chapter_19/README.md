# 19장. 코드 스플리팅

- 리액트 프로젝트를 완성하면 빌드 작업을 거쳐 배포해야 한다.
- 빌드 작업은 웹팩(webpack)이 담당하는데, 별도의 설정을 하지 않으면 모든 js 파일과 css 파일이 각각 하나의 파일로 합쳐진다. CRA의 기본 웹팩 설정에는 `SplitChunks`라는 기능이 적용되어 node_mouldes에서 불러온 파일, 일정 크기 이상의 파일, 여러 파일 간 공유된 파일 등을 자동으로 분리시켜서 캐싱의 효과를 누릴 수 있게 해준다.
- 이렇게 파일을 분리하는 작업을 **코드 스플리팅**이라고 한다.
- `SplitChunks` 기능을 통한 코드 스플리팅은 단순히 효율적인 캐싱 효과가 있을 뿐이다. 애플리케이션 규모 큰 경우, 지금 당장 필요하지 않은 컴포넌트까지 불러오면 로딩이 느려진다. → 이를 **코드 비동기 로딩**이 해결할 수 있다. 코드 비동기 로딩을 통해 함수, 객체, 컴포넌트를 필요한 시점에 불러와서 사용할 수 있다.

<br/>

## 자바스크립트 함수 비동기 로딩

- 일반적인 방식으로 import하면 파일이 합쳐진다.
- import를 상단에서 하지 않고 `import()` 함수 형태로 메서드 안에서 사용하면, 파일을 따로 분리시켜서 저장한다. → 실제 함수가 필요한 지점에 파일을 불러와 함수를 사용할 수 있다.
  - dynamic import 문법으로, 웹팩에서 지원한다.
- `import` 함수는 `Promise`를 반환한다. 모듈에서 `default`로 내보낸 것은 `result.default`를 참조해야 한다.

```jsx
function DynamicImport() {
  const onClick = () => {
    import("./notify").then((result) => result.default());
  };
  return <p onClick={onClick}>Hello React!</p>;
}
```

<br/>

## React.lazy와 Suspense를 통한 컴포넌트 코드 스플리팅

- 코드 스플리팅을 위해 리액트에 내장된 기능이다.
- `React.lazy`와 `Suspense` 없이 코드를 스플리팅하려면, import 함수를 통해 불러온 컴포넌트 자체를 state에 넣는 방식으로 구현해야 한다. → 매번 state를 선언해 주어야 한다는 점이 불편하다.
- `React.lazy`는 컴포넌트를 렌더링하는 시점에 비동기적으로 로딩할 수 있게 해주는 유틸 함수이다.
  ```jsx
  const SplitMe = React.lazy(() => import("./SplitMe"));
  ```
- `Suspense`는 코드 스플리팅된 컴포넌트를 로딩하도록 발동시킬 수 있고, 로딩이 끝나지 않았을 때 보여줄 UI를 설정할 수 있는 컴포넌트이다.
  ```jsx
  <Suspense fallback={<div>loading...</div>}>
    <SplitMe />
  </Suspense>
  ```
- 다음과 같이 사용할 수 있다.

  ```jsx
  const SplitMe = React.lazy(() => import("./SplitMe"));

  function ReactLazy() {
    const [visible, setVisible] = useState(false);
    const onClick = () => {
      setVisible(true);
    };
    return (
      <div>
        <p onClick={onClick}>Hello React</p>
        <Suspense fallback={<div>loading...</div>}>
          {visible && <SplitMe />}
        </Suspense>
      </div>
    );
  }
  ```

<br/>

## Loadable Components를 통한 코드 스플리팅

- 코드 스플리팅을 편하게 하도록 도와주는 서드파티 라이브러리이다.
- 이점은 서버 사이드 렌더링을 지원하는 것이다. 또한 렌더링 전에 필요할 때 스플리팅된 파일을 미리 불러올 수 있는 기능도 있다.
- `npm install @loadable/component` : 라이브러리 설치
- 사용법이 React.lazy와 비슷하다. 단 Suspense를 사용할 필요가 없다.
  ```jsx
  const SplitMe = loadable(() => import("./SplitMe"), {
    fallback: <div>loading...</div>,
  });
  ```
- 컴포넌트를 미리 불러올 수도 있다.
  ```jsx
  function CodeSplitting() {
    const [visible, setVisible] = useState(false);
    const onClick = () => {
      setVisible(true);
    };
    const onMouseOver = () => {
      SplitMe.preload();
    }; // preload 호출
    return (
      <div>
        <p onClick={onClick} onMouseOver={onMouseOver}>
          Hello React
        </p>
        {visible && <SplitMe />}
      </div>
    );
  }
  ```
  - 이렇게 하면 마우스 커서를 Hello React! 위에 올려두기만 해도 로딩이 시작된다. 그리고 클릭했을 때 렌더링된다.
- Loadable Components는 이 외에도 타임아웃, 로딩 UI 딜레이, 서버 사이드 렌더링 호환 등의 기능을 제공한다. 자세한 내용은 [공식 문서](https://www.notion.so/e57273cdf6a24e038036ca89ed8c79f8?pvs=21)를 참고하자.

<br/>

> **컴포넌트를 어떻게 분리된 파일로 저장하고 또 비동기적으로 불러와 사용하는지 알아보았다.
> 서버 사이드 렌더링을 할 계획이 없다면 React.lazy와 Suspense를 사용하고, 있다면 Loadable Componenets를 사용해야 한다.**
