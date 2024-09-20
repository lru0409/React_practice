# React 개요 및 시작하기

## React

사용자 인터페이스를 만들기 위한 자바스크립트 라이브러리

- SPA를 쉽고 빠르게 만들 수 있도록 도구이다.
  - 규모가 큰 웹사이트의 경우 수백 개의 페이지를 각각 HTML로 관리하는 것보다, 하나의 HTML 틀을 만들어 놓고 사용자가 특정 페이지를 요청할 때마다 해당 내용을 채우는 SPA가 효율적이다.
- React 외에도 AngularJS와 Vue.js가 있다. 이들은 프레임워크라는 점이 React와 다르다.
- 💡 **프레임워크 VS 라이브러리**
  - 프레임워크는 프로그램의 흐름에 대한 제어 권한을 개발자가 아닌 프레임워크가 갖는다.
  - 라이브러리는 흐름에 대한 제어를 하지 않고, 개발자가 필요한 부분만 가져다 사용한다.

> **장점**

- **Virtual DOM**을 사용하여 렌더링 속도가 빠르다.
  - DOM을 직접 수정하는 것은 성능에 큰 영향을 미치고 비용이 굉장히 많이 드는 작업이다.
  - 리액트는 DOM을 직접 수정하는 것이 아니라, 업데이트해야 할 최소한의 부분만을 찾아 업데이트한다.
- 컴포넌트 기반의 구조(Component-Based)를 사용하여 재사용성이 높다.
  - 컴포넌트를 조합하여 웹사이트를 개발한다.
  - 각 컴포넌트들은 웹사이트 여러 곳에서 반복적으로 사용될 수 있다.
  - 재사용성이 높다는 것은 여러 모듈 간의 의존성이 낮다는 뜻이 된다. → 각 부분들이 잘 분리되어 있기 때문에 유지보수나 버그를 찾아 수정하기 더 쉽다.

<br/>

## React 적용해보기

- HTML에 다음 스크립트 태그를 추가한다. [리액트 공식문서](https://ko.legacy.reactjs.org/docs/add-react-to-a-website.html)
  ```html
  <script
    src="https://unpkg.com/react@18/umd/react.development.js"
    crossorigin
  ></script>
  <script
    src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    crossorigin
  ></script>
  ```
- HTML에 root라는 id를 가지는 div를 추가한다.
  ```jsx
  <div id="root"></div>
  ```
- MyButton.js 파일을 작성한다. HTML에서 스크립트 태그로 추가해준다.

  ```jsx
  function MyButton(props) {
    const [isClicked, setIsClicked] = React.useState(false);

    return React.createElement(
      "button",
      { onClick: () => setIsClicked(true) },
      isClicked ? "Clicked!" : "Click here!"
    );
  }

  const domContainer = document.querySelector("#root");
  ReactDOM.render(React.createElement(MyButton), domContainer);
  ```

<br/>

## Create React App

React로 웹 애플리케이션을 개발하는 데 필요한 모든 설정이 되어 있는 상태로 프로젝트를 생성해주는 도구

- 새로운 애플리케이션을 생성한다.
  ```bash
  npx create-react-app <your-project-name>
  ```
- 생성된 프로젝트 내부로 들어가 애플리케이션을 실행한다.
  ```bash
  npm start # 애플리케이션 실행
  ```
