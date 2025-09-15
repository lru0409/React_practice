# 27장. 프론트엔드 프로젝트: 수정/삭제 기능 구현 및 마무리

## 포스트 수정

### PostActionButtons 컴포넌트 만들기

- 포스트를 읽는 화면에서 포스트 작성자에게만 상단에 수정/삭제 버튼이 나타나도록 렌더링
- `PostActionButtons` 컴포넌트를 `PostViewer`에서 직접 렌더링하면, `PostActionButtons`에 `onEdit`, `onRemove` 등의 props를 전달할 때 무조건 `PostViewer`를 거쳐서 전달해야 함 → `PostViewer`에서 `PostActionButtons`를 JSX 형태의 props으로 받아와 렌더링하자
- chapter 27 implement PostActionButtons component