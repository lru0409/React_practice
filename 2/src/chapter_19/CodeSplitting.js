import React, { useState, Suspense } from "react";
import loadable from "@loadable/component";

// const SplitMe = React.lazy(() => import("./SplitMe"));
const SplitMe = loadable(() => import("./SplitMe"), {
  fallback: <div>loading...</div>,
});

function CodeSplitting() {
  const [visible, setVisible] = useState(false);
  const onClick = () => {
    setVisible(true);
  };
  const onMouseOver = () => {
    SplitMe.preload();
  };
  return (
    <div>
      <p onClick={onClick} onMouseOver={onMouseOver}>
        Hello React
      </p>
      {/* <Suspense fallback={<div>loading...</div>}>
        {visible && <SplitMe />}
      </Suspense> */}
      {visible && <SplitMe />}
    </div>
  );
}

export default CodeSplitting;
