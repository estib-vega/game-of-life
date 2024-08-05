import React from "react";
import { useEngine } from "./hooks";

interface CanvasProps {
  size: number;
  numberOfCells: number;
  frameRate: number;
}

const Canvas = (props: CanvasProps): JSX.Element => {
  const { size, numberOfCells, frameRate } = props;
  const EngineHook = useEngine();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      throw new Error("Unable to init canvas context");
    }

    EngineHook.start({ ctx, numberOfCells });

    () => {
      EngineHook.destroy();
    };
  }, [numberOfCells]);

  React.useEffect(() => {
    EngineHook.setFrameRate(frameRate);
  }, [frameRate]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

Canvas.displayName = "Canvas";

export default Canvas;
