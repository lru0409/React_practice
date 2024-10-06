import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

// // === chapter_17 ====
// import { configureStore } from "@reduxjs/toolkit";
// import { Provider } from "react-redux";
// import App from "./App_chapter_17";
// import rootReducer from "./chapter_17/modules";
// const store = configureStore({ reducer: rootReducer });

// === chapter_18 ====
// import { configureStore } from "@reduxjs/toolkit";
// import { Provider } from "react-redux";
// import { thunk } from "redux-thunk";
// import rootReducer, { rootSaga } from "./chapter_18/modules";
// import CounterContainer from "./chapter_18/containers/CounterContainer";
// import loggerMiddleware from "./chapter_18/lib/loggerMiddleware";
// import App from "./App_chapter_18";
// import createSagaMiddleware from "redux-saga";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);

// // === chapter_17 ====
// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

// === chapter_18 ====
// const sagaMiddleware = createSagaMiddleware();
// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(loggerMiddleware, thunk, sagaMiddleware), // 기존 미들웨어에 추가
// });
// sagaMiddleware.run(rootSaga);

// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
