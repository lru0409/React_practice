# 리액트 라우터로 SPA 개발하기

## 라우팅

- 사용자가 요청한 **URL에 따라 알맞은 페이지를 보여주는 것**을 의미한다.
- 리액트에서 라우트 시스템을 구축하기 위해 사용할 수 있는 두 가지 선택지가 있다.
  - **리액트 라우터** : 리액트의 라우팅 관련 라이브러리 중 가장 오래됐고, 가장 많이 사용되고 있다. 컴포넌트 기반으로 라우팅 시스템을 설정할 수 있다.
  - **Next.js** : 리액트 프로젝트의 프레임워크이다. (Create React App 처럼) 리액트 프로젝트 설정을 하는 기능, 라우팅 시스템, 최적화, 다국어 시스템 지원, 서버 사이드 렌더링 등 다양한 기능을 제공한다. 라우팅 시스템이 파일 경로 기반으로 작동하며, 리액트 라우터의 대안으로 많이 사용된다.

<br/>

## 싱글 페이지 애플리케이션(SPA)

- **하나의 페이지로 이루어진 애플리케이션**을 의미한다.
- 리액트 라우터를 사용하면 손쉽게 싱글 페이지 애플리케이션을 만들 수 있다.
- 멀티 페이지 애플리케이션은 사용자가 다른 페이지로 이동할 때마다 새로운 html을 받아온다. 사용자 인터랙션이 별로 없는 정적인 페이지들은 이 방식이 적합하지만, 사용자 인터랙션이 많고 다양한 정보를 제공하는 모든 웹 애플리케이션에는 적합하지 않다.
- 새로운 페이지를 보여줘야 할 때마다 서버 측에서 모든 준비를 한다면 서버의 자원을 사용하게 되고 트래픽도 더 많이 나올 수 있다. → 리액트 같은 라이브러리를 사용해 html을 한 번만 받아와서 웹 애플리케이션을 실행시킨 후, 필요할 때 데이터만 받아와서 뷰 렌더링을 브라우저가 담당하는 방식을 사용하게 됐다.
- 리액트 라우터 같은 라우팅 시스템은 브라우저 주소창의 경로에 따라 알맞은 페이지를 보여준다. 링크를 눌러 다른 페이지를 이동할 때 서버에 다른 페이지의 html을 새로 요청하는 것이 아니라, 브라우저의 History API를 사용하여 브라우저의 주소창의 값만 변경하고 기존 페이지의 웹 애플리케이션을 그대로 유지하면서 라우팅 설정에 따라 또 다른 페이지를 보여주게 된다.

<br/>

## 리액트 라우터 적용 및 기본 사용법

- `npm install react-router-dom` : 리액트 라우터 라이브러리 설치
- src/index.js 파일에서 react-router-dom에 내장되어 있는 `BrowserRouter` 컴포넌트를 사용하여 감싸면, History API를 사용하여 페이지를 새로 불러오지 않고도 주소를 변경하고 현재 주소 경로에 관련된 정보를 리액트 컴포넌트에서 사용할 수 있게 된다.

  ```jsx
  import { BrowserRouter } from "react-router-dom";

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  ```

- `Route` 컴포넌트를 통해 브라우저의 주소 경로에 따라 원하는 컴포넌트를 보여줄 수 있다. Route 컴포넌트는 `Routes` 컴포넌트 내부에서 사용되어야 한다.

  ```jsx
  import { Route, Routes } from "react-router-dom";

  function App() {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    );
  }
  ```

- 다른 페이지로 이동하는 링크를 보여줄 때 원래 a 태그를 사용하지만, 리액트 라우터를 사용하는 프로젝트에서는 a 태그를 사용하면 안 된다. a 태그를 통해 페이지를 이동할 때 브라우저에서 새로운 페이지를 불러오게 되기 때문이다.
  `Link` 컴포넌트도 a 태그를 사용하긴 하지만, 페이지를 새로 불러오는 것을 막고 History API를 통해 브라우저 주소만 바꾸는 기능이 내장되어 있다.

  ```jsx
  import { Link } from "react-router-dom";

  const HomePage = () => {
    return (
      <div>
        (...)
        <Link to="/about">소개</Link>
      </div>
    );
  };
  ```

<br/>

## URL 파라미터와 쿼리스트링

- 페이지 주소를 정의할 때 가끔 유동적인 값을 사용해야 할 때도 있다.
  - URL 파라미터 예시 : /profile/gildong
  - 쿼리스트링 예시 : /articles?page=1&keyword=react
- **URL 파라미터**는 주소의 경로에 유동적인 값을 넣는 형태, **쿼리스트링**은 주소의 뒷부분에 ? 문자열 이후 key=value로 값을 정의하여 &로 구분하는 형태이다.
- URL 파라미터는 주로 ID 또는 이름을 사용하여 특정 데이터를 조회할 때, 쿼리스트링은 키워드 검색, 페이지네이션, 정렬 방식 등 데이터 조회에 필요한 옵션을 전달할 때 사용한다.

> **URL 파라미터**

- URL 파라미터는 `useParams` 라는 Hook을 사용하여 객체 형태로 조회할 수 있다.
- URL 파라미터의 이름은 Route 컴포넌트에서 path props를 통해 설정한다.

```jsx
function App() {
  return (
    <Routes>
      (...)
      <Route path="profiles/:usename" element={<ProfilePage />} />
    </Routes>
  );
}
```

```jsx
import { useParams } from "react-router-dom";

const data = {
  rowoon: { name: "이로운", description: "리액트를좋아하는 개발자" },
  gildong: { name: "홍길동", description: "고전 소설 홍길동전의 주인공" },
};

const ProfilePage = () => {
  const params = useParams();
  const profile = data[params.username];

  return (
    <div>
      <h1>사용자 프로필</h1>
      {profile ? (
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.description}</p>
        </div>
      ) : (
        <p>존재하지 않는 프로필입니다.</p>
      )}
    </div>
  );
};
```

> **쿼리스트링**

- URL 파라미터와 달리 Route 컴포넌트에서 별도로 설정해야 하는 것이 없다.
- `useLocation` 훅은 현재 사용자가 보고 있는 페이지의 정보를 지니는 location 객체를 반환한다. 쿼리스트링은 `location.search` 값을 통해 조회할 수 있다.
    <details>
        <summary>location 객체가 가진 값들</summary>
        <ul>
            <li>pathname : 현재 주소의 경로(쿼리스트링 제외)</li>
            <li>search: ? 문자를 포함한 쿼리스트링 값</li>
            <li>hash : 주소의 # 문자열 뒤의 값 (주로 History API가 지원되지 않는 구형 브라우저에서 클라이언트 라우팅을 사용할 때 쓰는 해시 라우터에서 사용함)</li>
            <li>state : 페이지를 이동할 때 임의로 넣을 수 있는 상태 값</li>
            <li>key : location 객체의 고유값, 초기에는 default이며 페이지가 변경될 때마다 고유값이 생성됨</li>
    </details>
- 리액트 라우터에서는 v6부터 `useSearchParams`라는 훅을 통해 쉽게 쿼리스트링을 다룰 수 있다.

  - useSearchParams가 반환하는 첫 번째 원소는 쿼리파라미터를 조회 및 수정할 수 있는 메서드들이 담긴 객체이다. get 메서드로 특정 파라미터 조회, set 메서드로 특정 파라미터를 업데이트할 수 있다.
  - 두 번째 원소는 쿼리파라미터를 객체 형태로 업데이트할 수 있는 함수를 반환한다.
  - 쿼리파라미터를 조회할 때 값은 무조건 문자열 타입이라는 점을 주의해야 한다.

  ```jsx
  import { useSearchParams } from "react-router-dom";

  const AboutPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const detail = searchParams.get("detail");
    const mode = searchParams.get("mode");

    const onToggleDetail = () => {
      setSearchParams({ mode, detail: detail === "true" ? false : true });
    };

    const onIncreaseMode = () => {
      const nextMode = mode === null ? 1 : parseInt(mode) + 1;
      setSearchParams({ mode: nextMode, detail });
    };

    return (
      <div>
        (...)
        <p>detail: {detail}</p>
        <p>mode: {mode}</p>
        <button onClick={onToggleDetail}>Toggle Detail</button>
        <button onClick={onIncreaseMode}>Increase Mode</button>
      </div>
    );
  };
  ```

<br/>

## 중첩된 라우트

- 게시글 페이지에서 게시글 하단에 게시글 목록을 보여주어야 하는 경우, 중첩된 라우트를 활용할 수 있다.
- ArticlesPage 컴포넌트에 리액트 라우터에서 제공하는 `Outlet` 컴포넌트를 사용하면, Route의 children으로 들어가는 JSX 엘리먼트를 보여주는 역할을 한다.
  ```jsx
  <Route path="/articles" element={<ArticlesPage />}>
    <Route path="/articles/:id" element={<ArticlePage />} />
  </Route>
  ```
- 페이지끼리 공통적으로 보여줘야 하는 레이아웃이 있는 경우에도 중첩된 라우트와 Outlet을 사용할 수 있다.
  ```jsx
  const Layout = () => {
    return (
      <div>
        <header style={{ background: "lightgray", padding: 16, fontSize: 14 }}>
          header
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    );
  };
  ```
  ```jsx
  function App() {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profiles/:username" element={<ProfilePage />} />
        </Route>
      </Routes>
    );
  }
  ```
- Route 컴포넌트의 index props은 path=”/”와 동일한 의미를 가진다.
  ```jsx
  <Route index element={<HomePage />} />
  ```

<br/>

## 리액트 라우터 부가 기능

> **useNavigate 훅**

- Link 컴포넌트를 사용하지 않고 다른 페이지로 이동해야 하는 상황에서 사용하는 훅

  ```jsx
  import { Outlet, useNavigate } from "react-router-dom";

  const Layout = () => {
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1); // 이전 페이지로 이동
    };

    const goArticles = () => {
      navigate("/articles"); // articles 경로로 이동
    };

    return (
      <div>
        <header style={{ background: "lightgray", padding: 16, fontSize: 14 }}>
          <button onClick={goBack}>뒤로가기</button>
          <button onClick={goArticles}>게시글 목록</button>
        </header>
        (...)
      </div>
    );
  };
  ```

- navigate 함수 사용 시 replace 옵션을 전달하면, 페이지를 이동할 때 현재 페이지를 기록에 남기지 않는다.
  ```jsx
  navigate("/artices", { replace: true });
  ```

> **NavLink 컴포넌트**

- 링크에서 사용하는 경로가 현재 라우트의 경로와 일치하는 경우 특정 스타일 또는 CSS 클래스를 적용하는 컴포넌트이다.
- NavLink 컴포넌트의 style, className 속성에는 { isActive: boolean }을 파라미터로 받는 함수 값을 전달한다.
  ```jsx
  <NavLink style={({isActive}) => isActive ? activeStyle : undefined} />
  <NavLink className={({isActive}) => isActive ? 'active' : undefined} />
  ```
- ArticlesPage 컴포넌트에서 사용하여 현재 보고 있는 게시물의 링크 텍스트의 스타일에 변화를 줄 수 있다.

  ```jsx
  const ArticlesPage = () => {
    const activeStyle = { color: "green", fontSize: 21 };

    return (
      <div>
        <Outlet />
        <ul>
          <li>
            <NavLink
              to="/articles/1"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
            >
              게시글 1
            </NavLink>
          </li>
          (...)
        </ul>
      </div>
    );
  };
  ```

> **NotFound 페이지 만들기**

- NotFound 페이지는 사전에 정의되지 않은 경로로 사용자가 접근했을 때 보여주는 페이지이다.
- \*는 wildcard 문자로, 아무 텍스트나 매칭한다는 뜻이다. 상단 라우트의 규칙들을 모두 확인하고, 일치하는 라우트가 없다면 이 라우트가 화면에 나타난다.
  ```jsx
  <Route path="*" element={<NotFoundPage />} />
  ```

> **Navigate 컴포넌트**

- 페이지를 리다이렉트하고 싶을 때 사용하는 컴포넌트이다.
- 예를 들어 로그인이 필요한 페이지인데 로그인을 안 했다면 로그인 페이지를 대신 보여주어야 한다.

  ```jsx
  import { Navigate } from "react-router-dom";

  const MyPage = () => {
    const isLoggedIn = false;
    if (!isLoggedIn) {
      return <Navigate to="/login" replace={true} />;
    }
    return <div>마이 페이지</div>;
  };

  export default MyPage;
  ```

  - replace 속성을 true로 전달함으로써 마이 페이지를 기록에 남기지 않는다.
