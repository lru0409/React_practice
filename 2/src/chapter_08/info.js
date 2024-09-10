import { useState, useEffect, useReducer } from "react";

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

const Info = () => {
  //   const [name, setName] = useState("");
  //   const [nickname, setNickname] = useState("");
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    nickname: "",
  });
  const { name, nickname } = state;
  useEffect(() => {
    console.log("렌더링이 완료되었습니다.");
    console.log({ name, nickname });
    return () => {
      // 뒷정리 함수 반환
      console.log("렌더링 되기 직전입니다.");
      console.log({ name, nickname });
    };
  });

  //   const onChangeName = (e) => setName(e.target.value);
  //   const onChangeNickname = (e) => setNickname(e.target.value);
  const onChange = (e) => dispatch(e.target);

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
