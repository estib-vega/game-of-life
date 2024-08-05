import Engine, { DrawParams } from "@/lib/engine";
import Scene from "@/lib/scene";
import React from "react";

interface SceneHook {
  restart: () => void;
  play: () => void;
  pause: () => void;
  toggleCell: (point: { x: number; y: number }) => void;
}

export function useScene(): SceneHook {
  const sceneRef = React.useRef<Scene>(Scene.getInstance());

  const restart = () => {
    const scene = sceneRef.current;
    scene.restart();
  };

  const play = () => {
    const scene = sceneRef.current;
    scene.play();
  };

  const pause = () => {
    const scene = sceneRef.current;
    scene.pause();
  };

  const toggleCell = (point: { x: number; y: number }) => {
    const scene = sceneRef.current;
    scene.toggleCell(point);
  };

  return { restart, play, pause, toggleCell };
}

interface EngineHook {
  start: (params: DrawParams) => void;
  setFrameRate: (frameRate: number) => void;
  destroy: () => void;
}

export function useEngine(): EngineHook {
  const engineRef = React.useRef<Engine>(Engine.getInstance());

  const start = (params: DrawParams) => {
    const engine = engineRef.current;
    engine.start(params);
  };

  const setFrameRate = (frameRate: number) => {
    const engine = engineRef.current;
    engine.setFrameRate(frameRate);
  };

  const destroy = () => {
    const engine = engineRef.current;
    engine.destroy();
  };

  return { start, setFrameRate, destroy };
}
