import { Button } from "../ui/button";
import Icon, { IconName } from "./Icon";

interface IconButtonProps {
  icon: IconName;
  onClick: () => void;
}

const IconButton = (props: IconButtonProps): JSX.Element => {
  const { icon, onClick } = props;

  return (
    <Button onClick={onClick} size={"icon"}>
      <Icon name={icon} />
    </Button>
  );
};

IconButton.displayName = "IconButton";

export default IconButton;
