/* eslint-disable react/no-unescaped-entities */
import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import FormInput from "../form-input/form-input.component";

// import {
//   createAuthUserWithEmailAndPassword,
//   createUserDocumentFromAuth,
// } from "../../utils/firebase.utils";

// import { UserContext } from "../../contexts/user.context";
import { signUpStart } from "../../store/user/user.action";
import Button from "../button/button.component";
import styles from "../../styles/sign-in-form.module.css";
import toast from "react-hot-toast";
import { createGlobalStyle } from "styled-components";
const defaultFormFields = {
  displayName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function SignUpForm() {
  //*setState
  const [formFields, setFromFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword, username } =
    formFields;
  const dispatch = useDispatch();
  //*initailize the user context with an empty object
  // const { setCurrentUser } = useContext(UserContext);

  //*function reset the form after filling
  const restFromFields = () => {
    setFromFields(defaultFormFields);
  };

  //*function log user in firebase db using email and password
  const logUserWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //*Confirm password and email
    if (password !== confirmPassword) {
      alert("Password do not match!");
      return;
    }
    try {
      //*See that if it's already authenticated
      // const { user } = await createAuthUserWithEmailAndPassword(
      //   email,
      //   password
      // );
      // // setCurrentUser(user);
      console.log(email);
      console.log(password);
      console.log(displayName);
      console.log(username);
      dispatch(signUpStart(email, password, displayName));
      // //*create the user document
      // await createUserDocumentFromAuth(user, { displayName });
      restFromFields();
      //*Saying to user that we are success
    } catch (err: unknown) {
      if (err instanceof Error) {
        //*If user already email in used
        if (err.name === "auth/email-already-in-use") {
          toast.error("Cannot create user, email already in use");
        }
      } else {
        toast.error("USER CREATED ENCOUNTERED AN ERROR");
        throw err;
      }
    }
  };

  //*function Event handler to set the state dynamicailly
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFromFields({ ...formFields, [name]: value });
  };

  return (
    <div className={styles.signUp}>
      <h1>Don't have an account ?</h1>
      <span>Sign up with your email and password</span>
      <form onSubmit={logUserWithEmail}>
        <FormInput
          label="Full Name"
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
export default SignUpForm;
