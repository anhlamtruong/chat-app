import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  selectCurrentUser,
  selectCurrentUsername,
  // selectCurrentPhotoURL,
} from "../store/user/user.selector";
import { signOutStart, checkUserSession } from "../store/user/user.action";
import { SignOutButton } from "@/pages/enter";
export default function NavBar({}) {
  const dispatch = useDispatch();
  const signOutUser = () => dispatch(signOutStart());
  // const [username, setUsername] = useState(null);
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  // console.log(username);
  const photoURL2 = "/../public/random-user.png";

  //*We want to mount this function 1 times only, to run the onAuthStateChangedListener once
  useEffect(() => {
    //! Using saga instead of synchronous hook function
    dispatch(checkUserSession());
  }, [dispatch]);
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {
          //*User is signed-in and has a username
          username && (
            <>
              <li className="push-left">
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>
              <li className="navbar-username">
                {currentUser
                  ? currentUser.username
                    ? currentUser.username
                    : "Unknown User"
                  : "Unknown User"}
              </li>
              <li>
                <Link href={`/${username}`}>
                  <Image
                    priority={false}
                    src={
                      currentUser
                        ? currentUser.photoURL
                          ? currentUser.photoURL
                          : photoURL2
                        : photoURL2
                    }
                    alt={`User ${username} avatar`}
                    width={30}
                    height={30}
                    quality={100}
                  />
                </Link>
              </li>
              <li>
                <SignOutButton />
              </li>
            </>
          )
        }
        {
          //* User is not signed in OR has not created a user name
          !username && (
            <>
              <li>
                <Link href="/enter">
                  <button className="btn-blue">Log in</button>
                </Link>
              </li>
            </>
          )
        }
      </ul>
    </nav>
  );
}
