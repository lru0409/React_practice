# 2장. JSX

## 모듈 불러오기, 번들러

- 자바스크립트 파일에서는 import를 사용하여 다른 파일들을 불러와 사용할 수 있다.
  - 모듈을 불러와서 사용하는 것은 브라우저가 아닌 Node.js에서 제공하는 기능이다.
  - 참고로 Node.js에서는 import가 아닌 require 구문으로 패키지를 불러올 수도 있다.
- 이러한 기능을 브라우저에서도 사용하기 위해 번들러(bundler)를 사용한다.
  - 파일을 묶듯이 연결하는 것이다.
  - 번들러 도구를 사용하면 import(require)로 모듈을 불러왔을 때, 불러온 모듈을 모두 합쳐서 하나의 파일을 생성해준다.
  - 대표적인 번들러로 Webpack, Parcel, browerify라는 도구들이 있다.
    - 리액트에서는 주로 (편의성, 확장성이 뛰어나므로) 웹팩을 사용하는 추세이다.

<br/>

## 웹팩의 로더

- 웹팩(의 로더)을 사용하면 SVG 파일과 CSS 파일로 불러와서 사용할 수 있다.
- css-loader는 CSS 파일을, file-loader는 웹 폰트나 미디어 파일 등을 불러올 수 있게 해준다.
- babel-loader는 자바스크립트 파일을 불러오면서 최신 자바스크립트 문법으로 작성된 코드를 바벨이라는 도구를 사용해 ES5 문법으로 변환해 준다.
  - 구버전 웹 브라우저와 호환하기 위해서 ES5 형태의 코드로 변환하는 것이다.
- create-react-app이 작업을 대신 해주기 때문에, 웹팩의 로더를 직접 설치 및 설정하지 않아도 된다.

<br/>

## JSX

- 자바스크립트의 확장 문법으로, XML과 비슷하게 생겼다.
- JSX 코드는 브라우저에서 실행되기 전에 코드가 번들링되는 과정에서 바벨을 사용하여 일반 자바스크립트의 형태의 코드로 변환된다.
  ```jsx
  function App() {
    return (
      <div>
        Hello <b>react</b>
      </div>
    );
  }
  ```
  ```jsx
  function App() {
  	return React.createElement("div", null, "Hello ", React.createElement("b", null, "react");
  }
  ```
- 리액트로 프로젝트 개발 시 사용되므로 공식 자바스크립트 문법이 아니다.

### JSX 규칙

- 컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다.

  - Virtual DOM에서 컴포넌트 변화를 감지해 낼 때 효율적으로 비교할 수 있도록 컴포넌트 내부는 하나의 DOM 트리 구조로 이루어져야 한다는 규칙이 있기 때문이다.
  - div 요소로 감싸고 싶지 않다면, 리액트 v16 이상부터 도입된 Fragment라는 기능을 사용할 수 있다.

    ```jsx
    import { Fragment } from "react";

    function App() {
      return (
        <Fragment>
          <h1>리액트 안녕!</h1>
          <h2>잘 동작하니?</h2>
        </Fragment>
      );
    }
    ```

    - 꺽쇠 내부에 아무것도 적지 않는 방식으로 Fragment를 표현할 수도 있다. `<> … </>`

- 클래스 이름을 class가 아닌 className으로 설정해 주어야 한다.
- 태그를 무조건 닫아야 한다.
  - HTML에서 input, br 태그 같은 경우 닫지 않아도 문제 없이 작동했지만, JSX는 아니다.
  - 태그 사이에 별 내용이 들어가지 않는 경우 self-closing 태그로 작성할 수 있다.
    ```jsx
    <input />
    ```

> **React.StrictMode**

- 리액트 프로젝트에서 리액트의 레거시 기능을 사용하지 못하게 하는 기능이다.
- 문자열 ref, componentWillMount 등 나중에는 완전히 사라지게 될 옛날 기능을 사용했을 때 경고를 출력한다.
