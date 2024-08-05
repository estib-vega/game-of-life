import { Button } from "../ui/button";
import Icon, { IconName } from "./Icon";

interface IconButtonProps {
  icon: IconName;
  onClick: () => void;
  disabled?: boolean;
}

const IconButton = (props: IconButtonProps): JSX.Element => {
  const { icon, onClick, disabled } = props;

  return (
    <Button onClick={onClick} size={"icon"} disabled={disabled}>
      <Icon name={icon} />
    </Button>
  );
};

IconButton.displayName = "IconButton";

export default IconButton;
