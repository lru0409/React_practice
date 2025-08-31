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