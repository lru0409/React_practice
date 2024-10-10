import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../modules/users";
import { Preloader } from "../lib/PreloadContext";
import User from "../components/User";
import { useParams } from "react-router-dom";
import { usePreloader } from "../lib/PreloadContext";

const UserContainer = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  // 서버 사이드 렌더링을 할 때 PI 호출하기
  usePreloader(() => dispatch(getUser(id)));

  useEffect(() => {
    if (user && user.id === parseInt(id, 10)) return; // 사용자가 존재하고 id가 일치한다면 요청 x
    dispatch(getUser(id));
  }, [dispatch, id, user]);

  if (!user) return null;
  return <User user={user} />;
};

export default UserContainer;
