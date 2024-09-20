# 4장. 이벤트 핸들링

## 이벤트 사용 시 주의 사항

- 리액트의 이벤트 시스템은, 일반 HTML 이벤트와 사용법이 꽤 비슷하다.

1. 이벤트 이름은 카멜 표기법으로 작성한다. HTML의 onclick → React의 onClick
2. 이벤트에 자바스크립트 코드 대신 함수 형태의 값을 전달한다.
3. DOM 요소에만 이벤트를 설정할 수 있다. (우리가 만든 컴포넌트에는 x)
4. 이벤트가 끝나고 나면, 이벤트 객체의 정보가 초기화된다.
   - 이벤트 객체는 SyntheticEvent로 웹 브라우저의 네이티브 이벤트를 감싸는 객체이다.(인터페이스가 같아 HTML 이벤트를 다룰 때와 똑같이 사용 가능)
   - SyntheticEvent는 네이티브 이벤트와 달리 이벤트가 끝나고 나면 이벤트가 초기화되므로 정보 참조가 불가능하다. 예를 들어 0.5초 뒤에 이벤트 객체를 참조하면, 이벤트 객체 내부의 모든 값이 비워진다.
   - 만약 비동기적으로 이벤트 객체를 참조할 일이 있다면, event.persist() 함수를 호출하자.

> **리액트에서 지원하는 이벤트 종류 :** Clipboard, Composition, Keyboard, Focus, Form, Mouse, Selection, Touch, UI, Wheel, MEdia, Image, Animation, Transition
