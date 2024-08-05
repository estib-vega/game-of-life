import React from "react";
import Canvas from "./components/Canvas";
import RangeInput from "./components/controllers/RangeInput";
import { DEFAULT_FRAME_RATE } from "./lib/engine";
import IconButton from "./components/generic/IconButton";
import ToggleButtonIcon from "./components/generic/ToggleButtonIcon";

const CANVAS_SIZE = 600;
const NUM_OF_CELLS = 100;

function App() {
  const [frameRate, setFrameRate] = React.useState<number>(DEFAULT_FRAME_RATE);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  return (
    <div className="dark w-full h-dvh bg-background fixed overflow-hidden">
      <div className="container h-full overflow-hidden flex flex-col">
        <header className="py-4">
          <h1 className="text-2xl text-primary">game of life 🌳</h1>
        </header>
        <main className="box-border h-full flex flex-col justify-center items-center text-primary">
          <Canvas
            size={CANVAS_SIZE}
            numberOfCells={NUM_OF_CELLS}
            frameRate={frameRate}
          />
          <div className="container py-4 w-full flex justify-center items-center gap-4">
            <ToggleButtonIcon
              iconOn="play"
              iconOff="pause"
              value={isPlaying}
              onClick={() => setIsPlaying((prev) => !prev)}
            />
            <IconButton icon="restart" onClick={() => console.log("restart")} />
            <RangeInput
              name="Frame Rate"
              value={frameRate}
              min={1}
              max={60}
              step={1}
              onChange={setFrameRate}
            />
          </div>
        </main>
        <div>
          <footer className="py-4 text-center text-primary">hello</footer>
        </div>
      </div>
    </div>
  );
}

export default App;
