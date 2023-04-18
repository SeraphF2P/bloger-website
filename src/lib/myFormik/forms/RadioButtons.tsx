import { Fragment } from "react";
import { Field, ErrorMessage, MultiInputProps } from "formik";
import { ComponentProps } from "react";

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
