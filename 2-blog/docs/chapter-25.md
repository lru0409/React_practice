# 25장. 프론트엔드 프로젝트: 글쓰기 기능 구현하기

## 에디터 UI 구현하기

- 에디터 라이브러리 설치
    - `yarn add quill`
- 제목과 내용을 입력할 수 있는 `Editor` 컴포넌트 구현
    - 제목은 input, 내용은 Quill 에디터 사용
- `quillInstance` 생성 시, `toolbar`에 `code-block`이 포함되어 있으면, 초기 텍스트에 코드 블럭에 포함되어 있는 버그가 있음 → 인스턴스 생성 후 `setText('')`로 초기화해줌

<br>

## 에디터 하단 컴포넌트 UI 구현하기

- 에디터 하단에 태그를 추가하는 `TagBox` 컴포넌트 구현
- 포스트 작성을 완료하거나 취소하는 버튼을 보여주는 `WriteActionButtons` 컴포넌트 구현

### TagBox 만들기

- 태그를 입력해 추가하고, 삭제할 수 있는 컴포넌트
- `TagItem`, `TagList` 컴포넌트를 분리해 `React.memo()`를 사용해 렌더링 최적화
- 만약 `TagList` 컴포넌트를 분리하지 않았다면 input 값이 바뀔 때마다 목록도 리렌더링됨
- 만약 `TagItem` 컴포넌트를 분리하지 않았다면, 태그가 추가 및 삭제될 때마다 목록이 리렌더링됨

### WriteActionButtons 만들기

- 포스트 등록 버튼과 취소 버튼을 포함하는 컴포넌트
- `onPublish`, `onCancel`을 prop으로 받아 버튼 클릭 시 호출하도록 구현

<br>

## 리덕스로 글쓰기 상태 관리하기

- `initialize`, `changeField` 액션을 다루는 `write` 리덕스 모듈 작성

### EditorContainer 만들기

- `title` 값과 `body` 값을 리덕스 스토어에서 불러와 `Editor` 컴포넌트에 전달
- Quill 에디터는 `onChange`와 `value` 값을 사용해 상태를 관리할 수 없음 → 에디터에서 값이 바뀔 때 리덕스 스토어에 값을 넣는 작업만 진행하자 (스토어의 값이 바뀔 때 에디터 값이 바뀌게 하는 작업은 나중에)
- `onChangeField` 함수는 `useCallback`으로 감싸서 `Editor`에서 사용할 `useEffect`가 컴포넌트가 화면에 나타났을 때 딱 한 번만 실행되도록 하기
- 사용자가 WritePage를 벗어날 때 `initialize` 액션을 발생시켜 데이터 초기화

### TagBoxContainer 만들기

- `tags` 값을 리덕스 스토어에서 불러와 `TagBox` 컴포넌트에 전달
- `TagBox`에서는 `setLocalTags`를 호출해야 하는 상황에서 `onChangeTags`도 함께 호출
    - 또한 props로 받아온 `tags`가 바뀔 때 `setLocalTags`를 호출해 동기화

### 글쓰기 API 연동하기

- 포스트에 관련된 API를 요청하는 함수를 `lib/api/post.js`에 작성
    - `writePost` api 호출 함수 구현
- `writePost` 함수를 호출하는 리덕스 액션과 사가 준비
- `WriteActionButtonsContainer` 컴포넌트를 만들어 `onPublish`, `onCancel` 함수를 구현해 `WriteActionButtons`에 전달