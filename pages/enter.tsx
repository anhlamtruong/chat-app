import Image from "next/image";
import googleLogo from "../public/google.png";

import { useDispatch } from "react-redux";

import { googleSignInStart, emailSignInStart } from "../store/user/user.action";
import { signInWithGooglePopup, signOutUser } from "../lib/firebase";
export default function EnterPage({}) {
  const user = null;
  const username = null;

  //* User signed out <SignInButton/>
  //* User signed in, but missing username <Username Form/>
  //* User signed in, has username <SignOutButton/>
  return (
    <main>
      {user ? (
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
  return <button onClick={() => signOutUser}>Sign Out</button>;
}
function UsernameForm() {
  return <button>User Form</button>;
}
