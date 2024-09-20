# 미니 블로그 프로젝트

## packge.json 파일의 의존성

- 시작하기 전 두 개의 패키지를 먼저 설치한다.
  ```jsx
  npm install --save react-router-dom styled-components
  ```
  - react-router-dom은 리액트 앱에서 화면 전환을 위해 사용하는 패키지이다.
- —save 옵션을 사용하면, 설치한 패키지가 package.json에 자동으로 의존성으로 추가된다.
- packge.json에 나열된 의존성 목록은 npm install 명령을 통해 모두 설치할 수 있으므로 편리하다.

<br/>

## 각 기능에 필요한 Component

- 글 목록 보기 (리스트 형태)
  - PostList, PostListItem
- 글 보기 기능
  - Post
- 댓글 보기 기능
  - CommentList, CommentListItem
- 댓글 작성 기능
  - CommentWrite
- 글 작성 기능
  - PostWrite

<br/>

## 폴더 구성하기

- 각 컴포넌트들을 적당한 폴더에 모아 관리함으로써 개발의 편의와 향후 유지보수가 용이하도록 한다.
- 폴더 구성에 정답은 없지만, 협업을 위해 보편적으로 많이 사용하는 방식으로 구성하는 것이 좋다.

  - 보통은 React 컴포넌트가 재사용 가능할 경우 종류 별로 모아놓거나, 각 페이지에서만 사용하고 딱히 재사용될 필요 없는 경우 각 페이지 별로 폴더를 만들고 그 안에 모아놓는다.

    <img width="1408" alt="스크린샷 2024-09-03 오후 3 29 06" src="https://gist.github.com/user-attachments/assets/4c38a553-a30a-429a-ab20-58b938e5722b">

<br/>

## react-router-dom

> **라우팅 구성**

- 리액트에서 페이지 라우팅을 쉽게 구현할 수 있도록 React 컴포넌트 형태로 제공해주는 라이브러리

```jsx
<BrowerRouter>
  <MainTitleText>론의 미니 블로그</MainTitleText>
  <Routes>
    <Route index elemet={<MainPage />} />
    <Route path="post-write" elemet={<PostWritePage />} />
    <Route path="post/:postId" elemet={<PostViewPage />} />
  </Routes>
</BrowerRouter>
```

- `BrowerRouter` : 웹브라우저에서 React 라우터를 사용하여 라우팅할 수 있도록 해주는 컴포넌트
- `Routes`, `Route` : 실제로 라우팅 경로를 구성할 수 있게 해주는 컴포넌트
- `Route`는 path와 element 속성을 가지고 있다.
  - path는 경로, element는 경로가 일치할 경우 렌더링할 엘리먼트를 의미한다.
  - 경로 값 없이 사이트 메인으로 접속하게 되면 index라는 프로퍼티를 가진 라우트로 라우팅된다.
- `:postId` 처럼 쓰면, 실제 컴포넌트에서 `useParams` 훅을 사용해 값을 가져올 수 있다.

> **useNavigate()**

- 페이지 간 이동을 위해 제공되는 훅

```jsx
const navigate = useNavigate();

const moveToMain = () => {
  navigate("/");
};
```

<br/>

## 빌드하기

- 빌드는 코드와 애플리케이션이 사용하는 이미지, CSS 파일 등의 파일을 모두 모아서 패키징하는 과정이다.
- 빌드를 위해 serve 패키지를 설치해야 한다.
  ```bash
  npm install -g serve
  ```
  - g 옵션 : 글로벌 모드로 설치함. 프로젝트 폴더 내에 설치되는 것이 아니라, 다른 경로 어디에서든지 사용할 수 있게 됨.

```bash
npm run build # 완료되면 build 폴더가 생성된다.
serve -s build # build 폴더를 서빙하여 웹 애플리케이션을 실행해본다.
```

<br/>

## 배포하기

- 빌드를 통해 생성된 정적인 파일들을 배포하려는 서버에 올리는 과정이다.
- 여기서는 다루지 않는다.
