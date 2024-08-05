import React from "react";
import { useEngine, useScene } from "./hooks";

interface CanvasProps {
  size: number;
  frameRate: number;
}

const Canvas = (props: CanvasProps): JSX.Element => {
  const { size, frameRate } = props;
  const EngineHook = useEngine();
  const SceneHook = useScene();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      throw new Error("Unable to init canvas context");
    }

    EngineHook.start({ ctx });

    () => {
      EngineHook.destroy();
    };
  }, []);

  React.useEffect(() => {
    EngineHook.setFrameRate(frameRate);
  }, [frameRate]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    SceneHook.toggleCell({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.buttons === 1) {
      const { offsetX, offsetY } = event.nativeEvent;
      SceneHook.toggleCell({ x: offsetX, y: offsetY });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    />
  );
};

Canvas.displayName = "Canvas";

export default Canvas;
