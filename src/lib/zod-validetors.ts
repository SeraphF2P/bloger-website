import { z } from "zod";

function createTypeValidator<T extends string>(validValues: T[]) {
  return z.custom<T>((value) => {
    if (validValues.includes(value as T)) {
      return value;
    } else {
      throw new Error("Invalid note type");
    }
  });
}

const noteTypeValidator = createTypeValidator<NoteType>([
  "friendrequest",
  "friendrequestconfirmed",
  "newlike",
  "newcomment",
]);
export {noteTypeValidator}