import { Pause, Play, RotateCcw } from "lucide-react";

export type IconName = "play" | "pause" | "restart";

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
  }
};

Icon.displayName = "Icon";

export default Icon;
