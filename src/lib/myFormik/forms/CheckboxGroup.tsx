import { ErrorMessage, Field, type MultiInputProps } from "formik";
import { type ComponentProps } from "react";
import TextError from "./TextError";

function CheckboxGroup({ label, name, options, ...rest }: MultiInputProps) {
  return (
    <div className="form-control">
      <label>{label}</label>
      <Field name={name}>
        {({ field }: { field: ComponentProps<typeof Field> }) => {
          return options.map(({ key, value }): JSX.Element => {
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
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
