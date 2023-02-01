import styled from "styled-components";

export const BaseButton = styled.button`
  min-width: 16.5rem;
  width: 60%;
  height: 5rem;
  letter-spacing: 0.15rem;
  line-height: 5rem;
  // padding: 0 3.5rem 0 3.5rem;
  font-size: 1.6rem;
  background-color: black;
  color: white;
  text-transform: uppercase;
  font-family: "Open Sans Condensed";
  font-weight: bolder;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: all 0.1s ease-in-out;
  &:hover {
    background-color: white;
    color: black;
    border: 1px solid black;
  }
`;

export const GoogleSignInButton = styled(BaseButton)`
  background-color: #4285f4;
  color: white;
  width: auto;
  min-width: 0;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #80b1ff;
    color: #ffffff;
    border: 1px solid #80b1ff;
  }
  /* &:hover .google-logo {
    transform: translateY(-0.2rem);
    // box-shadow: 0.1rem 0.1rem 0.5px 0px rgba(0, 0, 0, 0.2);
  } */
`;

export const InvertedButton = styled(BaseButton)`
  background-color: white;
  color: black;
  border: 1px solid black;

  &:hover {
    background-color: black;
    color: white;
  }
`;

// .button-container {
// min-width: 16.5rem;
// width: 60%;
// height: 5rem;
// letter-spacing: 0.15rem;
// line-height: 5rem;
// // padding: 0 3.5rem 0 3.5rem;
// font-size: 1.6rem;
// background-color: black;
// color: white;
// text-transform: uppercase;
// font-family: "Open Sans Condensed";
// font-weight: bolder;
// border: none;
// cursor: pointer;
// display: flex;
// justify-content: center;
// border-radius: 3px;
// border: 1px solid rgba(0, 0, 0, 0);
// transition: all 0.1s ease-in-out;
// &:hover {
//   background-color: white;
//   color: black;
//   border: 1px solid black;
// }
// &.google-sign-in {
//   background-color: #4285f4;
//   color: white;
//   width: auto;
//   min-width: 0;
//   transition: all 0.3s ease-in-out;
//   &:hover {
//     background-color: #80b1ff;
//     color: #ffffff;
//     border: 1px solid #80b1ff;
//   }
//   &:hover .google-logo {
//     transform: translateY(-0.2rem);
//     // box-shadow: 0.1rem 0.1rem 0.5px 0px rgba(0, 0, 0, 0.2);
//   }
// }
// &.inverted {
//   background-color: white;
//   color: black;
//   border: 1px solid black;

//   &:hover {
//     background-color: black;
//     color: white;
//   }
// }
// }
