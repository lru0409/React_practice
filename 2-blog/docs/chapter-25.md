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