import { Route, Routes } from "react-router-dom";
import Layout from "./chapter_13/Layout";
import HomePage from "./chapter_13/HomePage";
import AboutPage from "./chapter_13/AboutPage";
import ProfilePage from "./chapter_13/ProfilePage";
import ArticlesPage from "./chapter_13/ArticlesPage";
import ArticlePage from "./chapter_13/ArticlePage";
import NotFoundPage from "./chapter_13/NotFoundPage";
import MyPage from "./chapter_13/MyPage";
import LoginPage from "./chapter_13/LoginPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profiles/:username" element={<ProfilePage />} />
      </Route>
      <Route path="/articles" element={<ArticlesPage />}>
        <Route path="/articles/:id" element={<ArticlePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
