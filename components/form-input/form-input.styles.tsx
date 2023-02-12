import styled, { css } from "styled-components";

const subColor = "grey";
const MainColor = "black";
// $sub-color: grey;
// $main-color: black;

const shrinkLabelStyles = css`
  top: -1.2rem;
  font-size: 0.8rem;
  color: ${MainColor};
`;

type FormInputLabelProps = {
  shrink?: boolean;
};

export const FormInputLabel = styled.label<FormInputLabelProps>`
  color: ${subColor};
  font-size: 1.2rem;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 0.5rem;
  top: 0.8rem;
  transition: 300ms ease all;
  ${({ shrink }) => shrink && shrinkLabelStyles}
`;
export const Input = styled.input`
  background: none;
  background-color: white;
  color: ${subColor};
  font-size: 1rem;
  padding: 1rem 1rem 1rem 0.5rem;
  display: block;
  width: 100%;
  border: none;
  border-radius: 2px;
  border-bottom: 1px solid ${subColor};
  margin: 2.5rem 0;
  &:focus {
    outline: none;
  }
  &:focus ~ ${FormInputLabel} {
    ${shrinkLabelStyles};
  }
`;

export const Form = styled.div`
  position: relative;
  margin: 2.5rem 0;
  input[type="password"] {
    letter-spacing: 0.3em;
  }
`;

// .form {
//   position: relative;
//   margin: 4.5rem 0;
// &__input {
//   background: none;
//   background-color: white;
//   color: $sub-color;
//   font-size: 1.8rem;
//   padding: 1rem 1rem 1rem 0.5rem;
//   display: block;
//   width: 100%;
//   border: none;
//   border-radius: 2px;
//   border-bottom: 1px solid $sub-color;
//   margin: 2.5rem 0;
//   &:focus {
//     outline: none;
//   }
//   &:focus ~ .form__label {
//     @include shrinkLabel();
//   }
// }
// input[type="password"] {
//   letter-spacing: 0.3em;
// }
//   &__label {
//     color: $sub-color;
//     font-size: 1.6rem;
//     font-weight: normal;
//     position: absolute;
//     pointer-events: none;
//     left: 0.5rem;
//     top: 1rem;
//     transition: 300ms ease all;

//     &.shrink {
//       @include shrinkLabel();
//     }
//   }
// }
