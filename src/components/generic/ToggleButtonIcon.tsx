import { IconName } from "./Icon";
import IconButton from "./IconButton";

interface ToggleButtonIconProps {
  iconOn: IconName;
  iconOff: IconName;
  value: boolean;
  onClick: () => void;
}

const ToggleButtonIcon = (props: ToggleButtonIconProps): JSX.Element => {
  const { iconOn, iconOff, value, onClick } = props;

  return <IconButton icon={value ? iconOn : iconOff} onClick={onClick} />;
};

ToggleButtonIcon.displayName = "ToggleButtonIcon";

export default ToggleButtonIcon;
