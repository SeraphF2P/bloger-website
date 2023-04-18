import { ErrorMessage, Field, type InputProps } from "formik";
import React, { type ComponentProps } from "react";
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
          return (
            <DateView
              id={name}
              {...field}
              {...rest}
              closeOnScroll
              popperPlacement="top-start"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              selected={field.value}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              onChange={(val: any) => form.setFieldValue(name, val)}
            />
          );
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}

export default DatePicker;
