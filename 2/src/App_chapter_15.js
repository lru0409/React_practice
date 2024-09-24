import IterationSample from "./chapter_06/IterationSample";
import LifecycleSampleApp from "./chapter_07/LifeCycleSample";
import Info from "./chapter_08/info";
import Counter from "./chapter_08/Counter";
import Average from "./chapter_08/Average";
import SassComponent from "./chapter_09/SassComponent";
import CSSModule from "./chapter_09/CSSModule";
import StyledComponent from "./chapter_09/StyledComponent";
import Form from "./chapter_12/Form";
import ColorBox from "./chapter_15/components/ColorBox";
import ColorContext from "./chapter_15/contexts/color";
import { ColorProvider } from "./chapter_15/contexts/color";
import SelectColors from "./chapter_15/components/SelectColors";

function App() {
  return (
    <ColorProvider>
      <div>
        <SelectColors />
        <ColorBox />
      </div>
    </ColorProvider>
  );
}

export default App;
