import Engine from "@/lib/engine";
import React from "react";

interface CanvasProps {
  size: number;
  numberOfCells: number;
}

const Canvas = (props: CanvasProps): JSX.Element => {
  const { size, numberOfCells } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      throw new Error("Unable to init canvas context");
    }

    const engine = Engine.getInstance();
    engine.start({ ctx, numberOfCells });

    () => {
      engine.destroy();
    };
  }, [numberOfCells]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

Canvas.displayName = "Canvas";

export default Canvas;
