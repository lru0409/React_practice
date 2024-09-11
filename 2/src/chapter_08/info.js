import { useState, useEffect, useReducer } from "react";
import useInputs from "./useInputs";

const Info = () => {
  //   const [name, setName] = useState("");
  //   const [nickname, setNickname] = useState("");
  const [state, onChange] = useInputs({
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
