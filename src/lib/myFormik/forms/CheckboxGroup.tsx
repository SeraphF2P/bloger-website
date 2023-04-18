import { ErrorMessage, Field, MultiInputProps } from "formik";
import { ComponentProps } from "react";
import TextError from "./TextError";

function CheckboxGroup({ label, name, options, ...rest }: MultiInputProps) {
  return (
    <div className="form-control">
      <label>{label}</label>
      <Field name={name}>
        {({ field }: { field: ComponentProps<typeof Field> }) => {
          return options.map(({ key, value }) => {
            return (
              <div
                className="flex items-center justify-center gap-2 "
                key={key}
              >
                <input
                  type="checkbox"
                  className="form-checkbox"
                  id={value}
                  {...field}
                  {...rest}
                  value={value}
                  checked={field.value ? field.value.includes(value) : false}
                />
                <label htmlFor={value}>{key}</label>
              </div>
            );
          });
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}

export default CheckboxGroup;
