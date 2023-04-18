import type { FormikControl } from "formik";
import CheckboxGroup from "./CheckboxGroup";
import DatePicker from "./DatePicker";
import Input from "./Input";
import RadioButtons from "./RadioButtons";
import Select from "./Select";
import Textarea from "./Textarea";

const Col = {
  input: Input,
  textarea: Textarea,
  select: Select,
  radio: RadioButtons,
  checkbox: CheckboxGroup,
  date: DatePicker,
};
export default ({ control, ...rest }: FormikControl) => {
  const Component = Col[control] || null;
  // @ts-ignore
  return <Component {...rest} />;
};
