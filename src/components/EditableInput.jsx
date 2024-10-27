import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditableInput = ({
  id,
  name = "",
  label,
  type,
  defaultValue,
  placeholder = null,
  handleChange,
  disabled = false,
}) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        className="text-lg"
      />
    </div>
  );
};

export default EditableInput;
