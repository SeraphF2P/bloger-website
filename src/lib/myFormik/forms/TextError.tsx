import {
  ReactNode
} from "react";

function TextError({ children }: { children?: ReactNode }) {
  return <div className="form-error">{children}</div>;
}

export default TextError;
