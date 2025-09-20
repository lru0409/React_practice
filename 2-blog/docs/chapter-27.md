# 27장. 프론트엔드 프로젝트: 수정/삭제 기능 구현 및 마무리

## 포스트 수정

### PostActionButtons 컴포넌트 만들기

- 포스트를 읽는 화면에서 포스트 작성자에게만 상단에 수정/삭제 버튼이 나타나도록 렌더링
- `PostActionButtons` 컴포넌트를 `PostViewer`에서 직접 렌더링하면, `PostActionButtons`에 `onEdit`, `onRemove` 등의 props를 전달할 때 무조건 `PostViewer`를 거쳐서 전달해야 함 → `PostViewer`에서 `PostActionButtons`를 JSX 형태의 props으로 받아와 렌더링하자
- chapter 27 implement PostActionButtons component

### 수정 버튼 클릭 시 글쓰기 페이지로 이동하기

- `write` 리덕스 모듈에 `SET_ORIGINAL_POST` 액션 추가
    - 이 액션은 현재 보고 있는 포스트 정보를 `write` 모듈에서 관리하는 상태에 넣음
- `PostActionButtons` 컴포넌트에 `onEdit` 함수 전달
    - `onEdit`는 `setOriginalPost` 액션 디스패치 → 작성 화면으로 이동
- 현재 사용자가 보고 있는 포스트가 자신의 포스트인 경우에만 `PostActionButtons`이 나타나도록 설정
- 작성 화면으로 이동 시, 제목과 태그 뿐 아니라 내용의 초깃값도 설정되도록 `Editor` 컴포넌트 수정
    - 에디터 컴포넌트 마운트 후 단 한 번만 `useEffect`에 등록한 작업이 실행되어야 하므로, `useRef`를 사용하여 mount 상태에 따라 작업 처리
    - 물론 `useEffect`의 두 번째 파라미터로 빈 배열을 넣을 수도 있지만, ESLint 규칙은 모든 외부 값을 두 번째 파라미터 배열에 포함시키는 것을 권장하므로 이렇게 처리

### 포스트 수정하기

- `WriteActionButtonsContainer`에서 `originalPostId`가 존재하는 경우 새로 작성이 아닌 수정하는 상황으로 판단
    - publish 시에 포스트 작성 API 대신 수정 API 사용
    - WriteActionButtons에서 `포스트 등록` 대신 `포스트 수정` 을 버튼에 표시

<br>

## 포스트 삭제

- 삭제 버튼을 누를 때, 사용자의 확인을 한 번 더 요청한 후 삭제 수행
    - 사용자가 실수로 삭제하는 것을 방지하기 위함
- 사용자에게 확인을 한 번 더 요청하기 위한 모달 컴포넌트 구현
    - 만든 컴포넌트를 바탕으로 AskRemoveModal 컴포넌트 구현 후 사용
    - 모달 사용 시 굳이 별도의 파일로 분리할 필요는 없지만, 모달별로 파일을 만들어 주면 나중에 모달의 개수가 많아졌을 때 관리하기 매우 편해짐
- 모달에서 삭제 버튼 클릭 시 `removePost` api 호출
    - 포스트 삭제 후 따로 보여 주어야 할 결과가 없으므로 리덕스 액션과 사가를 만드는 작업 생략

<br>

## react-helmet-async로 meta 태그 설정하기

- react-helmet-async 라이브러리 설치
    - `yarn add react-helmet-async`
- src/index.js 파일에서 `HelmetProvider` 컴포넌트로 `App` 컴포넌트 감싸기
- meta 태그를 설정하고 싶은 곳에서 `Helmet` 컴포넌트 사용
    
    ```jsx
    <Helmet>
      <title>REACTERS</title>
    </Helmet>
    ```
    
    - 더 깊숙한 곳에 위치한 `Helmet`이 우선권을 차지함