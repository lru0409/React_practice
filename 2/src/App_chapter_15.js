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
