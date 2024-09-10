import React from "react";
import Comment from "./Comment";

const comments = [
  {
    name: "로운",
    comment: "안녕하세요",
  },
  {
    name: "롤리",
    comment: "롤리입니다.",
  },
];

function CommentList(props) {
  return (
    <div>
      {comments.map((comment) => {
        return <Comment name={comment.name} comment={comment.comment} />;
      })}
    </div>
  );
}

export default CommentList;
