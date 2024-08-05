import React from "react";
import Canvas from "./components/Canvas";
import RangeInput from "./components/controllers/RangeInput";
import { DEFAULT_FRAME_RATE } from "./lib/engine";
import IconButton from "./components/generic/IconButton";
import ToggleButtonIcon from "./components/generic/ToggleButtonIcon";
import { useScene } from "./components/hooks";

const CANVAS_SIZE = 1000;
const NUM_OF_CELLS = 400;

function App() {
  const SceneHook = useScene();
  const [frameRate, setFrameRate] = React.useState<number>(DEFAULT_FRAME_RATE);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const toggleSceneState = () => {
    setIsPlaying((prev) => {
      const playing = !prev;
      if (playing) SceneHook.play();
      if (!playing) SceneHook.pause();

      return playing;
    });
  };

  return (
    <div className="dark w-full h-dvh bg-background fixed overflow-hidden">
      <div className="container h-full overflow-hidden flex">
        <header>
          <h1 className="text-md text-primary">game of life 🌳</h1>
        </header>
        <main className="box-border h-full flex justify-center items-center text-primary">
          <div className="container py-2 w-full flex flex-col justify-start items-center gap-4">
            <ToggleButtonIcon
              iconOn="pause"
              iconOff="play"
              value={isPlaying}
              onClick={toggleSceneState}
            />
            <IconButton icon="restart" onClick={SceneHook.restart} />
            <IconButton
              icon="clear"
              onClick={SceneHook.clear}
              disabled={isPlaying}
            />
            <RangeInput
              name="Frame Rate"
              value={frameRate}
              min={1}
              max={60}
              step={1}
              onChange={setFrameRate}
            />
          </div>
          <Canvas
            size={CANVAS_SIZE}
            numberOfCells={NUM_OF_CELLS}
            frameRate={frameRate}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
