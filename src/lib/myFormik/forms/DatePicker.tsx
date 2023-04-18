import { ErrorMessage, Field, InputProps } from "formik";
import React, { ComponentProps } from "react";
import DateView from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextError from "./TextError";

function DatePicker({ label, name, ...rest }: InputProps) {
  return (
    <div className="form-control">
      <label htmlFor={name}>{label}</label>
      <Field name={name}>
        {({
          form,
          field,
        }: {
          form: any;
          field: ComponentProps<typeof Field>;
        }) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <DateView
              id={name}
              {...field}
              {...rest}
              closeOnScroll
              popperPlacement="top-start"
              selected={value}
              onChange={(val) => setFieldValue(name, val)}
            />
          );
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}

export default DatePicker;
