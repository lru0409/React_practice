import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>홈</h1>
      <p>가장 먼저 보여지는 페이지입니다.</p>
      <ul>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profiles/rowoon">로운의 프로필</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">길동의 프로필</Link>
        </li>
        <li>
          <Link to="/profiles/void">존재하지 않는 프로필</Link>
        </li>
        <li>
          <Link to="/articles">게시물 목록</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
