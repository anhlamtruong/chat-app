import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import googleLogo from "../public/google.png";
import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import debounce from "lodash.debounce";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  selectCurrentUser,
  selectCurrentUsername,
  selectCurrentIsLoading,
} from "../store/user/user.selector";
import {
  googleSignInStart,
  emailSignInStart,
  signOutStart,
  addUsernameStart,
} from "../store/user/user.action";

import FormInput from "../components/form-input/form-input.component";
import Button from "../components/button/button.component";
import SignUpForm from "../components/sign-up/sign-up.component";
import { BUTTON_TYPE_CLASSES } from "../components/button/button.component";
import { getCurrentUserName, UserData } from "../lib/firebase";
import Loader from "@/components/Loader";
import styles from "../styles/sign-in-form.module.css";

export default function EnterPage({}) {
  // const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  const isLoading = useSelector(selectCurrentIsLoading);
  const router = useRouter();
  // console.log(username);
  //* User signed out <SignInButton/>
  //* User signed in, but missing username <Username Form/>
  //* User signed in, has username <SignOutButton/>
  useEffect(() => {
    if (currentUser?.username) {
      router.push("/");
    }
  }, [currentUser, router]);
  return (
    <main>
      {isLoading ? (
        <Loader show={isLoading} />
      ) : currentUser ? (
        !username ? (
          <UsernameForm />
        ) : (
          <h1>
            <Link href="/">
              <button>Back to main page...</button>
            </Link>
            <Loader show={true} />
          </h1>
        )
      ) : (
        <div className={styles.enterContainer}>
          <div>
            <SignInWithEmail />
            <SignWithGoogleInButton />
          </div>
          <div>
            <SignUpForm />
          </div>
        </div>
      )}
    </main>
  );
}

function SignInWithEmail() {
  //*setState
  const defaultFormFields = {
    email: "",
    password: "",
  };
  const [formFields, setFromFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const dispatch = useDispatch();
  const restFromFields = () => {
    setFromFields(defaultFormFields);
  };
  const logUserWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      //*See that if it's already authenticated
      dispatch(emailSignInStart(email, password));
      //*create the user document
      restFromFields();
    } catch (err: unknown) {
      if (err instanceof Error) {
        switch (err.name) {
          case "auth/user-not-found":
            toast.error("User not found");
            break;
          case "auth/invalid-password":
            toast.error("Wrong password");
            break;
          default:
            toast.error(
              `Something went wrong: Code-${err.name}\nMessage-${err.message}`
            );
            console.error(err);
        }
        restFromFields();
      }
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFromFields({ ...formFields, [name]: value });
  };
  return (
    <div className={styles.signIn}>
      <h1>I already have an account 🙌</h1>
      <span>Sign in with your email and password</span>
      <form onSubmit={logUserWithEmail}>
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
        <div className="btn-con">
          <Button type="submit">Sign in</Button>
        </div>
      </form>
    </div>
  );
}

function SignWithGoogleInButton() {
  const dispatch = useDispatch();
  const signInWithGoogle = async () => {
    try {
      dispatch(googleSignInStart());
    } catch (error) {
      console.error(error as Error);
    }
  };
  return (
    <div className={styles.googleSignIn}>
      <button type="button" className="btn-google" onClick={signInWithGoogle}>
        <Image priority={false} src={googleLogo} alt="google logo" width={30} />
        Sign In With Google
      </button>
    </div>
  );
}
export function SignOutButton() {
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
          // console.log(exists);
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
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        <Button
          type="submit"
          buttonType={BUTTON_TYPE_CLASSES.base}
          disabled={!isValid}
        >
          Choose
        </Button>
        {/* <h3>Debug State</h3>
        <div>
          Username:{formValue}
          <br />
          Loading:{loading.toString()}
          <br />
          Username Valid:{isValid.toString()}
        </div> */}
      </form>
      {/* <button onClick={signUserOut}>Username Form</button> */}
    </section>
  );
}
type UsernameMess = {
  username: string;
  isValid: boolean;
  loading: boolean;
};
function UsernameMessage<T extends UsernameMess>({
  username,
  isValid,
  loading,
}: UsernameMess) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken or invalid!</p>;
  } else {
    return <p></p>;
  }
}
