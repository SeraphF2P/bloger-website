import { Fragment } from "react";
import { Field, ErrorMessage, type MultiInputProps } from "formik";
import { type ComponentProps } from "react";

import TextError from "./TextError";

function RadioButtons({ label, name, options, ...rest }: MultiInputProps) {
  return (
    <div className="form-control">
      <label>{label}</label>
      <Field name={name}>
        {({ field }: { field: ComponentProps<typeof Field> }) => {
          return options.map((option) => {
            return (
              <Fragment key={option.key}>
                <input
                  type="radio"
                  className="form-radio"
                  id={option.value}
                  {...field}
                  {...rest}
                  value={option.value}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  checked={field.value === option.value}
                />
                <label htmlFor={option.value}>{option.key}</label>
              </Fragment>
            );
          });
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}

export default RadioButtons;
