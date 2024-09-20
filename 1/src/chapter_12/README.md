# Forms

## Controlled Components

- 사용자가 입력한 값에 접근하고 제어할 수 있도록 해주는 컴포넌트
- 값이 리액트의 통제를 받는 Input Form Element
- HTML의 Form에서는 각 엘리먼트가 자체적으로 state를 관리한다.
  ```jsx
  <form>
    <label>
      이름:
      <input type="text" name="name" />
    </label>
    <button type="submit">제출</button>
  </form>
  ```
  - 이렇게 되면, 자바스크립트 코드를 통해 각각의 값에 접근하기가 쉽지 않다?
- Controlled Conponent에서는 모든 데이터를 state에서 관리한다.

  ```jsx
  function NameForm(props) {
    const [value, setValue] = useState("");

    const handleChange = (event) => {
      setValue(event.target.value);
    };

    const handleSubmit = (event) => {
      alert("입력한 이름: " + value);
      event.preventDefault();
    };

    return (
      <form onSubmit={handleSubmit}>
        <label>
          이름:
          <input type="text" value={value} onChange={handleChange} />
        </label>
        <button type="submit">제출</button>
      </form>
    );
  }
  ```

  - 입력 값이 React 컴포넌트의 state를 통해 관리된다.
  - 사용자의 입력을 직접적으로 제어할 수 있다.

<br/>

## 다양한 Forms

- **textarea**
  ```jsx
  <textarea value={value} onChange={handleChange} />
  ```
- **select**
  ```jsx
  <select value={value} onChange={handleChange}>
    <option value="apple">사과</option>
    <option value="apple">바나나</option>
    <option value="apple">포도</option>
  </select>
  ```
  - 다중 선택이 가능하게 하고 싶다면, select 요소에서 multiple 속성 값을 true로 하고, value로 선택된 옵션 값이 들어있는 배열을 넣어주면 된다.
- **file input** : 디바이스의 저장 장치로부터 하나 이상의 파일을 선택할 수 있게 해주는 HTML 태그
  ```jsx
  <input type="file" />
  ```
  - 값이 읽기 전용이기 때문에 React에서는 Uncontrolled Component가 된다.

<br/>

## 하나의 컴포넌트에서 여러 개의 입력 다루기

- 여러 개의 state를 선언하여 각각의 입력에 대해 사용한다.

```jsx
function Reservation(props) {
  const [haveBreakfast, setHaveBreakfast] = useState(true);
  const [numberOfGuest, setNumberOfGuest] = useState(2);

  return (
    <form>
      <label>
        아침식사 여부:
        <input
          type="checkbox"
          checked={haveBreakfast}
          onChange={(event) => {
            setHaveBreakfast(event.target.checked);
          }}
        />
      </label>
      <label>
        방문객 수:
        <input
          type="number"
          value={numberOfGuest}
          onChange={(event) => {
            setNumberOfGuest(event.target.value);
          }}
        />
      </label>
      <button type="submit">제출</button>
    </form>
  );
}
```

- 💡 만약 입력 요소에 value 속성은 넣되 자유롭게 입력할 수 있게 만들고 싶다면, value에 undefined 또는 null을 넣어주면 된다? → 입력 요소를 비제어된 컴포넌트처럼 만들 수 있음

<br/>

## 사용자 정보 입력받기 실습

```jsx
import React, { useState } from "react";

function Signup(props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남자");

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = (event) => {
    alert(`이름: ${name}, 성별: ${gender}`);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        이름:
        <input type="text" value={name} onChange={handleChangeName} />
      </label>
      <br />
      <label>
        성별:
        <select value={gender} onChange={handleChangeGender}>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
      </label>
      <button type="submit">제출</button>
    </form>
  );
}

export default Signup;
```
