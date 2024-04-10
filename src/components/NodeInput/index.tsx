import { ChangeEvent, FC, memo, useState } from "react";

interface INodeInput {
  label: string;
  onSubmit: (value: string) => void;
}

const NodeInput: FC<INodeInput> = memo(({ label, onSubmit }) => {
  const [value, setValue] = useState<string>(label);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target?.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      onSubmit(value);
    }
  };

  const handleBlur = () => {
    onSubmit(value);
  };

  return (
    <input
      type="text"
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
});

export default NodeInput;
