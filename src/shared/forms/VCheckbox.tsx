import { useEffect, useState } from "react";
import { Checkbox, CheckboxProps, Typography } from "@mui/material";
import { useField } from "@unform/core";

type TVCheckboxProps = CheckboxProps & {
  label: string;
  name: string;
};
export const VCheckbox: React.FC<TVCheckboxProps> = ({
  label,
  name,
  ...rest
}) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name);

  const [value, setValue] = useState(defaultValue || false);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox
        {...rest}
        defaultChecked={defaultValue}
        checked={value || false}
        onChange={(e, checked) => {
          setValue(checked);
          rest.onChange?.(e, checked);
          error && clearError();
        }}
      />
      <Typography variant="body2">{label}</Typography>
    </div>
  );
};
