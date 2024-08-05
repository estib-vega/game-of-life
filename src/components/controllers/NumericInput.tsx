import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface NumericInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const NumericInput = (props: NumericInputProps): JSX.Element => {
  const { name, value, min, max, onChange, disabled } = props;

  return (
    <div className="max-w-72">
      <Label htmlFor={name}>{name}</Label>
      <Input
        type="number"
        id={name}
        {...{ value, min, max, disabled }}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </div>
  );
};

NumericInput.displayName = "NumericInput";

export default NumericInput;
