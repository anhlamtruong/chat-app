import { InputHTMLAttributes, FC } from "react";
import { Form, FormInputLabel, Input } from "./form-input.styles";

type FormInputProps = { label: string } & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<FormInputProps> = ({ label, ...otherProps }) => {
  //! If label exist, return label
  //* In className, we can use a ${} to make advanvce SCSS
  return (
    <Form>
      <Input {...otherProps} />
      {label && (
        <FormInputLabel
          shrink={Boolean(
            otherProps.value &&
              typeof otherProps.value === "string" &&
              otherProps.value.length
          )}
        >
          {label}
        </FormInputLabel>
      )}
    </Form>
  );
};
export default FormInput;
