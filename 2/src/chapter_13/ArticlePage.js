import { useParams } from "react-router-dom";

const ArticlePage = () => {
  const { id } = useParams();
  return (
    <div>
      <h2>게시글 {id}</h2>
    </div>
  );
};

export default ArticlePage;
