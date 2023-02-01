import Image from "next/image";
import googleLogo from "../public/google.png";
import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentUsername,
} from "../store/user/user.selector";
import {
  googleSignInStart,
  emailSignInStart,
  signOutStart,
  addUsernameStart,
} from "../store/user/user.action";

import FormInput from "../components/form-input/form-input.component";
import Button from "../components/button/button.component";
import { BUTTON_TYPE_CLASSES } from "../components/button/button.component";
import { getCurrentUserName, UserData } from "../lib/firebase";

export default function EnterPage({}) {
  // const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  // console.log(username);
  //* User signed out <SignInButton/>
  //* User signed in, but missing username <Username Form/>
  //* User signed in, has username <SignOutButton/>
  return (
    <main>
      {currentUser ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const dispatch = useDispatch();
  const signInWithGoogle = async () => {
    try {
      dispatch(googleSignInStart());
    } catch (error) {
      console.error(error as Error);
    }
  };
  return (
    <button type="button" className="btn-google" onClick={signInWithGoogle}>
      <Image priority={false} src={googleLogo} alt="google logo" width={30} />
      Sign In With Google
    </button>
  );
}
function SignOutButton() {
  const dispatch = useDispatch();
  const signUserOut = () => dispatch(signOutStart());
  return <button onClick={signUserOut}>Sign Out</button>;
}
function UsernameForm() {
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState("");
  // const [formFields, setFromFields] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);

  //*function reset the form after filling
  const restFromFields = () => {
    setFormValue("");
  };

  //*function Event handler to set the state dynamically
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Force form value typed in form to match correct format
    const val = event.target.value;
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    // const { value } = event.target;
    // setFromFields(value);
    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };
  //*function checking usernames
  const checkUsername = useMemo(
    () =>
      debounce(async (username: string) => {
        if (username.length >= 3) {
          // console.log("FIRESTORE READ EXECUTED");
          const exists = await getCurrentUserName(username);
          console.log(exists);
          setIsValid(!exists);
          setLoading(false);
        }
      }, 500),
    []
  );
  //* Use effect Hooks
  useEffect(() => {
    checkUsername(formValue);
  }, [checkUsername, formValue]);

  //*function OnSubmit handler
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Reset the field form value
    restFromFields();
    //Call Dispatch
    dispatch(addUsernameStart(currentUser as UserData, formValue));
  };

  return (
    <section>
      <h3> Choose your Username</h3>
      <form onSubmit={onSubmit}>
        <FormInput
          label="Username"
          type="text"
          required
          onChange={handleChange}
          name="username"
          value={formValue}
        />
        <Button
          type="submit"
          buttonType={BUTTON_TYPE_CLASSES.base}
          disabled={!isValid}
        >
          Choose
        </Button>
        <h3>Debug State</h3>
        <div>
          Username:{formValue}
          <br />
          Loading:{loading.toString()}
          <br />
          Username Valid:{isValid.toString()}
        </div>
      </form>
      {/* <button onClick={signUserOut}>Username Form</button> */}
    </section>
  );
}
