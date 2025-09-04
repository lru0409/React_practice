# 25장. 프론트엔드 프로젝트: 글쓰기 기능 구현하기

## 에디터 UI 구현하기

- 에디터 라이브러리 설치
    - `yarn add quill`
- 제목과 내용을 입력할 수 있는 `Editor` 컴포넌트 구현
    - 제목은 input, 내용은 Quill 에디터 사용
- `quillInstance` 생성 시, `toolbar`에 `code-block`이 포함되어 있으면, 초기 텍스트에 코드 블럭에 포함되어 있는 버그가 있음 → 인스턴스 생성 후 `setText('')`로 초기화해줌