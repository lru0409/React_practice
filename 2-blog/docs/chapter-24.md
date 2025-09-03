# 24장. 프런트엔드 프로젝트: 시작 및 회원 인증 구현

앞으로 개발할 기능은…

1. 회원가입/로그인 기능
2. 글쓰기 기능 → Quill이라는 WYSIWYG 라이브러리 사용
3. 블로그 포스트의 목록을 보여주는 기능 + 포스트를 읽는 기능


> **WYSIWYG(What You See Is What You Get)**
> - 사용자가 보는 대로 결과를 얻는다는 의미
> - ‘위지윅’이라고 읽음
> - 위지윅 에디터에서는 글을 쓸 때 HTML을 직접 입력하면서 스타일을 설정하는 것이 아니라, 에디터에서 지원되는 기능을 사용해 간편하게 스타일 설정 가능

<br>

## 작업 환경 준비하기

1. 리액트 프로젝트 생성하기
    - `yarn create react-app blog-frontend`
2. `.prettierrc`, `jsconfig.json` 설정 파일 만들기
3. 라우터 적용하기
    - `yarn add react-router-dom`
    - 로그인, 회원가입, 글쓰기, 포스트 읽기, 포스트 목록 페이지 만들기
    - @가 붙은 동적 경로를 매칭하지 못하는데, 이유를 찾지 못함 🥲 → 일단 @ 제거
4. 스타일 설정하기
    - `yarn add styled-components`
    - 나중에 색상을 쉽게 뽑아서 쓸 수 있도록 색상 팔레트 파일 만들기
        - `src/lib/styles/palette.js`
        - https://bit.ly/mypalette 경로에서 코드를 복사해 사용
    - 프로젝트의 글로벌 스타일 수정하기
5. `Button` 컴포넌트 만들기
6. 리덕스 적용하기
    - `yarn add redux react-redux redux-actions immer redux-devtools-extension`
    - `auth` 모듈과 루트 리듀서 만들어 적용하기

<br>

## 회원가입과 로그인 구현

### UI 준비하기

- 회원가입 또는 로그인 폼을 보여주기 위한 `AuthForm` 컴포넌트 작성하기
- 회원가입/로그인 페이지의 레이아웃을 담당하는 `AuthTemplate` 컴포넌트 작성하기
- VS Code의 Snippet 기능을 사용하면, 반복되는 컴포넌트 초기 코드 작성 시간을 줄일 수 있음

### 리덕스로 폼 상태 관리하기

- `auth` 모듈에 `changeField`, `initializeForm` 액션 추가
- `LoginForm`과 `RegisterForm` 컨테이너 컴포넌트 작성하기
    - `useSelector`로 리덕스 스토어의 form 상태를 꺼내와 `AuthForm`에 전달
    - `AuthForm`의 인풋 변경 이벤트 핸들러에서 `changeField` 이벤트 dispatch
    - 컴포넌트가 처음 렌더링될 때 form을 초기화해 이전에 작성했던 내용이 유지되지 않도록 함

### API 연동하기

- 필요한 라이브러리 설치
    - `yarn add axios redux-saga`
- `lib/api/client.js`에 axios 클라이언트 생성
    - 나중에 API 클라이언트에 공통된 설정을 쉽게 넣어 줄 수 있음
    - 나중에 axios를 사용하지 않는 상황이 왔을 때 클라이언트를 쉽게 교체할 수 있음
- CORS 오류를 해결하기 위해 웹백 개발 서버에서 지원하는 프록시(proxy) 기능 사용하기
    - 이 프록시 기능은 개발 서버로 요청하는 API들을 프록시로 정해 둔 서버로 그대로 전달해 주고, 그 응답을 웹 애플리케이션에서 사용할 수 있게 해줌
    - 사실 CORS 오류를 해결하려면 다른 주소에서도 API를 호출할 수 있도록 서버 쪽 코드를 수정해야 하지만, 최종적으로 결국 리액트 앱과 백엔드 서버를 같은 호스트에서 제공할 것이기 때문에 이러한 설정을 하는 것이 불필요함
    - CRA로 만든 프로젝트에서 프록시 설정 시, package.json을 수정해주면 됨
        
        ```jsx
        "proxy": "http://localhost:4000/"
        ```
        
        - 이렇게 하면 웹팩 개발 서버가 프록시 역할을 해서 http://localhost:4000에 대신 요청한 뒤 결과물을 응답해줌
- axios 클라이언트를 통해 `login`, `register`, `check` api 호출하는 함수 작성
- api 호출 시 로딩 상태를 redux로 관리할 수 있도록 `loading` 리덕스 모듈 작성 후 루트 리듀서에 등록
- saga 팩토리 함수인 `createRequestSaga` 함수 작성
- auth 리덕스 모듈에서 register/login 액션 추가, register/login 사가 생성, 리듀서 구현
- rootSaga를 만들어 authSaga 등록, 스토어에 saga 미들웨어 적용

### 회원가입 구현

- `RegisterForm`에서 회원가입 성공/실패 처리
- 사용자의 상태를 담을 `user` 리덕스 모듈 작성 후 루트 리듀서에 등록
- 회원가입 성공 후 `user` 모듈의 `check`를 호출해 사용자가 로그인 상태가 되었는지 확인
- 회원가입 성공 시 홈 화면으로 라우트 이동

### 로그인 구현

- LoginForm에서 로그인 성공/실패 처리
- 회원가입 성공 후 user 모듈의 `check`를 호출해 사용자가 로그인 상태가 되었는지 확인
- 회원가입 성공 시 홈 화면으로 라우트 이동

### 회원 인증 에러 처리하기

- `AuthForm` 컴포넌트에서 `error` prop을 받아 에러 메시지 표시하도록 구현
- `LoginForm`에서는 로그인 실패 시 오류 메시지 표시
- `RegisterForm`에서는 다음과 같은 경우 오류 메시지 표시
    - `username`, `password`, `passwordConfirm` 중 빈 필드가 있거나
    - `password`와 `passwordConfirm`이 일치하지 않거나
    - `username`이 중복되어 회원가입이 실패했거나
    - 기타 이유로 회원가입 실패 시

<br>

## 헤더 컴포넌트 생성 및 로그인 유지

### 헤더 컴포넌트 만들기

- 반응형 디자인을 편하게 하기 위한 `Responsive` 컴포넌트 작성
- `Responsive`  컴포넌트를 활용해 로고와 로그인한 사용자 이름, 로그인/로그아웃 버튼을 표시하는 `Header` 컴포넌트 구현
- 로그인 버튼을 눌렀을 때 /login 페이지로 이동을 구현하는 두 가지 방법
    1. 버튼 컴포넌트에서 `to` prop을 받아, 클릭 시 해당 경로로 `navigate`
    2. 버튼 컴포넌트에 `to` prop이 전달되면, `button` 대신 `Link` 컴포넌트 사용
        1. 기존에 사용하던 스타일을 `buttonStyle`에 담아 재사용
        2. `to` prop 여부에 따라 `StyledLink`를 사용할지, `StyledButton`을 사용할지 결정
        3. `StyledLink` 사용 시 `props.cyan` 값을 숫자 1과 0으로 변환해주기
            1. `styled()` 함수로 감싸서 만든 컴포넌트의 경우 임의 props가 필터링되지 않고 실제 엘리먼트까지 전달되기 때문
            2. `a` 태그는 `boolean` 값이 임의 props로 설정되는 것을 허용하지 않으므로, 숫자로 변환해 전달
            
            ```jsx
            const Button = (props) => {
              return props.to ? (
                <StyledLink {...props} cyan={props.cyan ? 1 : 0} />
              ) : (
                <StyledButton {...props} />
              );
            };
            ```
            
    - 두 방법 중 `Link` 컴포넌트를 사용하는 방법을 권장함 (웹 접근성을 따졌을 때 더 옳은 방식)

### 로그인 상태를 보여주고 유지하기

- `user` 상태를 받아 `Header` 컴포넌트로 전달하는 `HeaderContainer` 컴포넌트 구현
- `Header` 컴포넌트에선 `user` prop이 전달된 경우, 계정명과 (로그인 대신) 로그아웃 버튼 표시
- 로그인 상태 유지하기 (localStorage 이용)
    - `LoginForm`, `RegisterForm`에서 로그인/회원가입 성공 시 사용자 정보를 localStorage에 저장
    - 리액트 앱에 브라우저에서 맨 처음 렌더링될 때 localStorage에서 user 정보를 불러와 리덕스 스토어 안에 넣도록 구현
    - 로그인 검증(check) 실패 시 localStorage에서 `user` 정보를 제거

### 로그아웃 기능 구현

- logout api 함수, 액션, saga, 리듀서 추가
- logoutSaga에서 localStorage의 user 정보 제거하도록 구현
- 리듀서에서 user 상태를 null로 변경하도록 구현
- `HeaderContainer`에서 logout 액션을 디스패치하는 `onLogout` 함수를 만들어 `Header` 컴포넌트에 전달
- `Header` 컴포넌트에서 로그아웃 버튼 클릭 시 `onLogout`이 호출되도록 구현