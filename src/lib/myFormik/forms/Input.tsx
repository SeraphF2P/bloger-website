"use client";
import { ErrorMessage, Field, InputProps } from "formik";
import TextError from "./TextError";

function Input({ label, name, className, ...rest }: InputProps) {
  return (
    <div className="form-control">
      <label htmlFor={name}>{label}</label>
      <Field
        className={`form-input ${className}`}
        id={name}
        name={name}
        {...rest}
      />
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}

export default Input;
