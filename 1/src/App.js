import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import MainPage from "./chapter_17_miniblog/page/MainPage";
import PostWritePage from "./chapter_17_miniblog/page/PostWritePage";
import PostViewPage from "./chapter_17_miniblog/page/PostViewPage";

const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bolid;
  text-align: center;
`;

function App(props) {
  return (
    <BrowserRouter>
      <MainTitleText>론의 미니 블로그</MainTitleText>
      <Routes>
        <Route index element={<MainPage />} />
        <Route path="post-write" element={<PostWritePage />} />
        <Route path="post/:postId" element={<PostViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
