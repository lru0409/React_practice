import ReactDOMServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import path from "path";
import fs from "fs";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import createSagaMiddleware, { END } from "redux-saga";
import rootReducer, { rootSaga } from "./modules";
import PreloadContext from "./lib/PreloadContext";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";

const statsFile = path.resolve("./build/loadable-stats.json");

// // asset-manifest.json에서 파일 경로를 조회
// const manifest = JSON.parse(
//   fs.readFileSync(path.resolve("./build/asset-manifest.json"), "utf8")
// );

// const chunks = Object.keys(manifest)
//   .filter((key) => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
//   .map((key) => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
//   .join(" "); // 합침

function createPage(root, tags) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="there-color" content="#000000" />
    <title>React App</title>
    ${tags.styles}
    ${tags.links}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">${root}</div>
    ${tags.scripts}
  </body>
  </html>
  `;
}

const app = express();

// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = async (req, res, next) => {
  // 404가 떠야 하는 상황에서 404를 띄우지 않고 서버 사이드 렌더링을 해줌
  const context = {};
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thunk, sagaMiddleware),
  });
  const sagaPromise = sagaMiddleware.run(rootSaga).toPromise();
  const preloadContext = { done: false, promises: [] };
  const extractor = new ChunkExtractor({ statsFile }); // 필요한 파일을 추출하기 위한 ChunkExtractor
  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </PreloadContext.Provider>
    </ChunkExtractorManager>
  );

  ReactDOMServer.renderToStaticMarkup(jsx); // renderToStaticMarkup으로 한 번 렌더링함
  store.dispatch(END); // redux-saga의 END 액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료됨
  try {
    await sagaPromise; // 기존에 진행 중이던 사가들이 모두 끝날 때까지 기다림
    await Promise.all(preloadContext.promises); // 모든 프로미스를 기다림
  } catch (e) {
    return res.status(500);
  }
  preloadContext.done = true;
  const root = ReactDOMServer.renderToString(jsx); // 렌더링을 함
  // JSON을 문자열로 변환하고 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
  const stateString = JSON.stringify(store.getState()).replace(/</g, "\\u003c");
  const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // 리덕스 초기 상태를 스크립트로 주입

  // 미리 불러와야 하는 스타일/스크립트 추출
  const tags = {
    scripts: stateScript + extractor.getScriptTags(), // 스크립트 앞 부분에 리덕스 상태 넣기
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags(),
  };

  res.send(createPage(root, tags)); // 클라이언트에게 결과물을 응답함
};

const serve = express.static(path.resolve("./build"), {
  index: false,
}); // "/" 경로에서 index.html을 보여주지 안도록 설정

app.use(serve); // 순서가 중요함. serverRender 전에 위치해야 함.
app.use(serverRender);
app.listen(5001, () => {
  // 5001 포트로 서버 가동
  console.log("Running on http://localhost:5001");
});
