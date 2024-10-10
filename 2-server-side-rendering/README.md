# 20장. 서버 사이드 렌더링

## 서버 사이드 렌더링의 이해

UI를 서버에서 렌더링하는 것이다. 서버 사이드 렌더링을 구현하면 서버 쪽에서 초기 렌더링을 대신해주고, 사용자가 html을 전달받을 때는 내부에 렌더링된 결과물이 보인다.

> **장점**

1. 검색 엔진 최적화
   - 검색 엔진이 웹 페이지를 원활하게 수집할 수 있다.
   - 리액트로 만든 SPA는 검색 엔진 크롤러 봇처럼 js가 실행되지 않는 환경에서는 페이지가 제대로 나타나지 않는다.
2. 초기 렌더링 성능 개선
   - 자바스크립트 파일 다운로드가 완료되지 않은 시점에도 html 상에 사용자가 볼 수 있는 콘텐츠가 있기 때문에 대기 시간이 최소화된다.

> **단점**

1. 브라우저가 해야 할 일을 서버가 대신 처리하는 것이므로 서버 리소스가 사용된다.
   - 수많은 사용자가 동시에 접속하면 서버에 과부하가 발생할 수 있으므로, 캐싱과 로드 밸런싱을 통해 성능을 최적화해 주어야 한다.
2. 프로젝트 구조가 복잡해지거나 개발이 어려워질 수 있다.
   - 데이터 미리 불러오기, 코드 스플리팅과의 호환 등 고려해야 할 사항이 많아진다.

### 서버 사이드 렌더링과 코드 스플리팅 충돌

- 별도의 호환 작업 없이 두 기술을 함께 적용하면, 페이지에 깜빡임이 발생한다.
  - 서버 사이드 렌더링된 결과물이 브라우저에 먼저 나타났다가, 코드 스플리팅된 컴포넌트들이 아직 로딩되지 않아서 사라졌다가, 로딩 완료 후 다시 나타나기 때문이다.
- 문제를 해결하려면, 필요한 모든 코드 스플리팅된 파일을, 브라우저에서 렌더링하기 전에 미리 불러와야 한다.
  - 여기서는 Loadable Components를 사용해 서버 사이드 렌더링 후 필요한 파일의 경로를 추축하여 렌더링 결과에 스크립트/스타일 태그를 삽입해 주는 방식으로 문제를 해결할 것이다.

<br/>

## 서버 사이드 렌더링 구현하기

우선 웹팩 설정을 커스터마이징해 주어야 한다.

```jsx
git add .
git commit -m "Commit Before eject"
npm run eject
```

### 서버 사이드 렌더링용 엔트리 만들기

- 엔트리는 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일이다. (현재 프로젝트에서는 index.js를 엔트리 파일로 사용 중) 우선 서버를 위한 엔트리 파일을 따로 생성해야 한다.
- `src/index.server.js` 파일을 생성하자.

  ```jsx
  import ReactDOMServer from "react-dom/server";

  const html = ReactDOMServer.renderToString(
    <div>Hello Server Side Rendering!</div>
  );

  console.log(html);
  ```

  - 서버에서 리액트 컴포넌트 렌더링 시 `ReactDOMServer`의 `renderToString` 함수를 사용한다.

### 서버 사이드 렌더링 전용 웹팩 환경 설정과 빌드 스크립트 작성하기

- `config/paths.js`에서 ssrIndexJs(서버 사이드 렌더링 엔트리), ssrBuild(웹팩 처리 후 저장 경로) 정보를 추가하기
- 웹팩 환경 설정 파일 작성하기
  - `config/webpack.config.server.js` 파일을 생성하기
  - 빌드 시 어떤 파일에서 시작해 파일들을 불러오고, 어디에 결과물을 저장할지 정해주기
  - 로더 설정하기
  - 서버 코드에서 node_modules의 라이브러리를 불러올 수 있게 설정하기
  - 서버를 위해 번들링 할 때 node_modules에서 불러오는 것을 제외하고 번들링해야 함. 이를 위해 webpack-node-externals 라이브러리 사용하기
  - 환경 변수 주입하기 (프로젝트 내에서 `process.env.NODE_ENV` 값을 참조해 현재 개발 환경인지 아닌지 알 수 있음)
- 만든 환경 설정을 사용해 웹팩트로 프로젝트를 빌드하는 스크립트 작성하기
  - `scripts/build.server.js` 파일을 생성하고 빌드하는 스크립트 작성하기
  - `node scripts/build.server.js` 명령으로 빌드가 잘 되는지 확인하기
  - `node dist/server.js` 명령으로 작성한 결과물이 잘 작동하는지 확인하기
- packge.json에 서버를 빌드하고 시작하기 위한 스크립트 추가하기
  ```jsx
  "scripts": {
  	(...)
  	"start:server": "node dist/server.js",
  	"build:server": "node scripts/build.server.js"
  }
  ```

### 서버 코드 작성하기

- 서버 사이드 렌더링을 처리할 서버를 Express라는 Node.js 웹 프레임워크를 사용해 만들자.
  - `npm install express`
- index.server.js 코드를 다음과 같이 작성하자.

  ```jsx
  import ReactDOMServer from "react-dom/server";
  import express from "express";
  import { StaticRouter } from "react-router-dom/server"; //
  import App from "./App";

  const app = express();

  // 서버 사이드 렌더링을 처리할 핸들러 함수
  const serverRender = (req, res, next) => {
    // 404가 떠야 하는 상황에서 404를 띄우지 않고 서버 사이드 렌더링을 해줌
    const context = {};
    const jsx = (
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    );
    const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
    res.send(root); // 클라이언트에게 결과물을 응답함
  };

  app.use(serverRender);

  // 5000 포트로 서버 가동
  app.listen(5000, () => {
    console.log("Running on http://localhost:5000");
  });
  ```

  - StaticRouter는 서버 사이드 렌더링 용도로 사용되는 라우터 컴포넌트이다. location 값에 따라 라우팅해주고, context 값을 사용해 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정해 줄 수 있다.
  - StaticRouter를 "react-router-dom”로부터 임포트하면 오류가 났다. "react-router-dom/server”로부터 임포트함으로써 문제를 해결했다.

- 빌드하고 서버를 실행하면, 서버 사이드 렌더링 결과물이 브라우저에 표시된다. CSS를 불러오지 않기 때문에 스타일이 적용되어있지 않아도 걱정 말자.
- Express에 내장된 static 미들웨어를 사용하여 서버를 통해 build에 있는 JS, CSS 정적 파일들에 접근할 수 있도록 해준다.

<br/>

## 데이터 로딩

일반적인 브라우저 환경에서는 API 응답을 리액트 state 혹은 리덕스 스토어에 넣으면 자동으로 리렌더링된다. 하지만 서버의 경우 문자열 형태로 렌더링하는 것이므로 자동 리렌더링이 안 된다. 서버 사이드 렌더링 시 데이터 로딩을 해결하는 방법을 알아보자.

```jsx
const UsersContainer = ({ users, getUsers }) => {
  useEffect(() => {
    if (users) return; // users가 이미 유효하다면 요청하지 않음
    getUsers();
  }, [getUsers, users]);
  return <Users users={users} />;
};
```

- 서버 사이드 렌더링을 할 때는 이미 이쓴 정보를 재요청하지 않게 처리하는 작업이 중요하다. 이 작업을 하지 않으면 서버 사이드 렌더링 후 브라우저에서 페이지를 확인할 때 이미 데이터를 가지고 있음에도 불구하고 불필요한 API를 호출하게 된다.

### PreloadContext 만들기

- 서버 사이드 렌더링을 할 때는 `useEffect`나 `componentDidMount`에서 설정한 작업이 호출되지 않는다. 따라서 렌더링하기 전에 API를 요청한 뒤 스토어에 데이터를 담아야 한다.
- 서버 환경에서 이러한 작업을 하려면 클래스형 컴포넌트의 constructor나 render 메서드에서 API를 요청하고 응답이 오면 다시 렌더링해 주어야 한다.
- 이 작업을 `PreloadContext`와 이를 사용하는 `Preloader` 컴포넌트를 만들어 처리해보자.

  ```jsx
  import { createContext, useContext } from "react";

  // 클라이언트 환경: null
  // 서버 환경: { done: false, promises: [] }
  const PreloadContext = createContext(null);
  export default PreloadContext;

  export const Preloader = ({ resolve }) => {
    const preloadContext = useContext(PreloadContext);
    if (!preloadContext) return null; // context 값이 유효하지 않다면 아무것도 하지 않음
    if (preloadContext.done) return null; // 이미 작업이 끝났다면 아무것도 하지 않음

    // promises 배열에 프로미스 등록
    // 설령 resolve 함수가 프로미스를 반환하지 않더라고 프로미스 취급을 하기 위해 Promise.resolve 함수 사용
    preloadContext.promises.push(Promise.resolve(resolve()));
    return null;
  };
  ```

  - PreloadContext는 서버 사이드 렌더링을 하는 과정에서 처리해야 할 작업들을 실행하고, 만약 기다려야 하는 프로미스가 있다면 프로미스를 수집한다.
  - 수집된 프로미스들이 끝날 때까지 기다렸다가 그다음에 다시 렌더링하면 데이터가 채워진 상태로 컴포넌트들이 나타나게 된다.
  - Preloader 컴포넌트는 resolve라는 함수는 props로 받아오며, 컴포넌트가 렌더링될 때 서버 환경에서만 resolve 함수를 호출해준다.

### 스크립트로 스토어 초기 상태 주입하기

- 서버에서 만들어 준 store(상태)를 브라우저에서 재사용하려면, 현재 스토어 상태를 문자열로 변환한 뒤 스크립트로 주입해야 한다.

### redux-saga로 User 컴포넌트 렌더링하기

- 이 부분에서 코드가 원하는 대로 작동하지 않았다.
- `UserContainer`의 `useEffect`에 전달한 함수가 아예 실행이 되지 않았는데, 원인을 파악할 수 없었다.

  ```jsx
  const UserContainer = () => {
    const { id } = useParams();

    const user = useSelector((state) => state.users.user);
    const dispatch = useDispatch();

    useEffect(() => {
      if (user && user.id === parseInt(id, 10)) return; // 사용자가 존재하고 id가 일치한다면 요청 x
      dispatch(getUser(id));
    }, [dispatch, id, user]);

    if (!user) {
      // null 대신 Preloader 반환
      return <Preloader resolve={() => dispatch(getUser(id))} />;
    }
    return <User user={user} />;
  };
  ```

- 다음 스텝에서 index.server.js에서 redux-saga 미들웨어를 적용하고, 리덕스 스토어에 데이터를 채운 후에 렌더링하는 코드를 추가하여 문제가 해결되었다.

<br/>

## 서버 사이드 렌더링과 코드 스플리팅

- Loadable Components를 사용해서 코드 스플리팅을 해본다.
  - `npm insall @loadable/component @loadable/server @loadable/webpack-plugin @loadable/babel-plugin`
  ```jsx
  import loadable from "@loadable/component";
  const RedPage = loadable(() => import("./pages/RedPage"));
  const BluePage = loadable(() => import("./pages/BluePage"));
  const UsersPage = loadable(() => import("./pages/UsersPage"));
  ```
- 웹팩과 babel 플러그인을 적용해 깜빡임 현상을 해결하자.
- npm run build를 하면, build 디렉터리에 loadable-stats.json 이라는 파일이 만들어지는데, 이 파일은 각 컴포넌트의 코드가 어떤 청크 파일에 들어가 있는지에 대한 정보를 가지고 있다.
- 서버 사이드 렌더링 후 브라우저에서 어떤 파일을 불러와야 할지 알아내고 해당 파일의 경로를 추출하기 위해 Loadable Components에서 제공하는 `ChunkExtractor`와 `ChunkExtractorManager`를 사용한다.
- 모든 스크립트가 로딩되고 나서 렌더링하도록 처리하기 위해서는 `loadableReady` 라는 함수를 사용해 주어야 한다. 또한 `render` 함수 대신 사용할 수 있는 `hydrate` 함수는 기존에 서버 사이드 렌더링된 결과물이 이미 있을 경우 새로 렌더링하지 않고 기존에 존재하는 UI에 이벤트만 연동한다. 이는 애플리케이션을 초기 구동할 때 필요한 리소를 최소화함으로써 성능을 최적화해 준다.
  ```jsx
  // 프로덕션 환경에서는 loadableReady와 hydrate를 사용하고
  // 개발 환경에서 기존 처리
  if (process.env.NODE_ENV === "production") {
    loadableReady(() => {
      ReactDOM.hydrate(<Root />, root);
    });
  } else {
    ReactDOM.render(<Root />, root);
  }
  ```

<br/>

## 서버 사이드 렌더링의 환경 구축을 위한 대안

서버 사이드 렌더링은 번거로운 작업이다. (데이터 로딩, 코드 스플리팅 ..)
설정을 하나하나 직업 하는 것이 귀찮다면, 다른 대안이 있다.

### Next.js

- 리액트 프레임워크
- 서버 사이드 렌더링을 최소한의 설정으로 간단하게 처리할 수 있다.
- 리액트 라우터와 호환되지 않는 등 몇 가지 제한이 있다.
  - 이미 작성된 프로젝트에 적용하기 매우 까다로울 수 있다.
  - 리액트 라우터는 컴포넌트 기반, Next.js는 파일 시스템 기반으로 라우트를 설정한다.
- 복잡한 작업들을 모두 Next.js가 대신해주기 때문에 실제 작동 원리 파악이 힘들 수 있다.

### Razzle

- 프로젝트 구성이 CRA와 매우 유사하다는 장점이 있다.
- 리액트 라우터와도 호환된다.
- 코드 스플리팅 시 발생하는 깜빡임을 해결하기 어렵다는 단점이 있다.
- 최신 버전의 Loadable Components 가 기본 설정으로 작동하지 않아서 적용하기 까다롭다.

<br/>
<br/>

> **서버 사이드 렌더링은 서비스를 사용하는 사람이 많아진다면, 사용자 경험을 향상시키길 원한다면, 도입을 고려해 볼 만한 가치가 있는 기술이다. 다만 이를 도입하면 프로젝트가 조금 복잡해 질 수 있다.**
