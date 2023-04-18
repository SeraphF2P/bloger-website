import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

declare module "formik" {
  type option = {
    key: string;
    value: string;
  };
  interface InputProps
    extends DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > {
    label: string;
    name: string;
  }
  interface MultiInputProps extends InputProps {
    options: option[];
  }
  interface controlInput extends InputProps {
    control: "input" | "textarea" | "date";
  }
  interface controlMultiInput extends MultiInputProps {
    control: "select" | "radio" | "checkbox";
  }
  type FormikControlProps = controlInput | controlMultiInput;
}
