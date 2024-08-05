import { Pause, Play, RotateCcw, SquareX } from "lucide-react";

export type IconName = "play" | "pause" | "restart" | "clear";

interface IconProps {
  name: IconName;
  size?: number;
}

const Icon = (props: IconProps): JSX.Element => {
  const { name, size } = props;

  switch (name) {
    case "play":
      return <Play size={size} />;
    case "pause":
      return <Pause size={size} />;
    case "restart":
      return <RotateCcw size={size} />;
    case "clear":
      return <SquareX size={size} />;
  }
};

Icon.displayName = "Icon";

export default Icon;
