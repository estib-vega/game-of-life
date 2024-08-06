import Engine, { DrawParams } from "@/lib/engine";
import Scene, { SceneDescription } from "@/lib/scene";
import { isStr } from "@/utils/typing";
import React from "react";

interface SceneHook {
  restart: () => void;
  play: () => void;
  pause: () => void;
  clear: () => void;
  toggleCell: (point: { x: number; y: number }) => void;
  setNumberOfCells: (numOfCells: number) => void;
  toJson: () => string;
  fromJson: (data: string) => SceneDescription | undefined;
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

  const clear = () => {
    const scene = sceneRef.current;
    scene.clear();
  };

  const setNumberOfCells = (numOfCells: number) => {
    const scene = sceneRef.current;
    scene.setNumberOfCells(numOfCells);
  };

  const toJson = () => {
    const scene = sceneRef.current;
    return scene.toJsonString();
  };

  const fromJson = (data: string) => {
    const scene = sceneRef.current;
    return scene.fromJsonString(data);
  };

  return {
    restart,
    play,
    pause,
    toggleCell,
    clear,
    setNumberOfCells,
    toJson,
    fromJson,
  };
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

interface UploadTextFileHook {
  upload: () => void;
}

export function useUploadTextFile(
  ext: string,
  onUpload: (data: string) => void
): UploadTextFileHook {
  const upload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ext;
    input.style.display = "none";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        if (isStr(data)) onUpload(data);
      };

      reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  return { upload };
}

interface DownloadTextFileHook {
  download: (data: string) => void;
}

export function useDownloadTextFile(mimeType: string): DownloadTextFileHook {
  const download = (data: string) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "game-of-life.json";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return { download };
}
