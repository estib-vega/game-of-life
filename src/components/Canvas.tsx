import Engine from "@/lib/engine";
import React from "react";

interface CanvasProps {
  size: number;
  numberOfCells: number;
  frameRate: number;
}

const Canvas = (props: CanvasProps): JSX.Element => {
  const { size, numberOfCells, frameRate } = props;
  const engineRef = React.useRef<Engine>(Engine.getInstance());
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      throw new Error("Unable to init canvas context");
    }

    const engine = engineRef.current;
    engine.start({ ctx, numberOfCells });

    () => {
      engine.destroy();
    };
  }, [numberOfCells]);

  React.useEffect(() => {
    const engine = engineRef.current;
    engine.setFrameRate(frameRate);
  }, [frameRate]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

Canvas.displayName = "Canvas";

export default Canvas;
