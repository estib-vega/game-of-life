import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RangeInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const RangeInput = (props: RangeInputProps): JSX.Element => {
  const { name, value, min, max, step, onChange } = props;

  return (
    <div className="max-w-72">
      <Label htmlFor={name}>{`${name}: ${value}`}</Label>
      <Input
        type="range"
        id={name}
        {...{ value, min, max, step }}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </div>
  );
};

RangeInput.displayName = "RangeInput";

export default RangeInput;
