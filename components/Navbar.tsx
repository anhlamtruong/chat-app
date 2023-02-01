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

export default function NavBar({}) {
  const dispatch = useDispatch();
  const signOutUser = () => dispatch(signOutStart());
  // const [username, setUsername] = useState(null);
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  // console.log(username);
  const photoURL2 =
    "https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819_960_720.jpg";

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
              <li>
                <Link href={`/${username}`}>
                  <Image
                    priority={false}
                    src={currentUser ? currentUser?.photoURL : photoURL2}
                    alt={`User ${username} avatar`}
                    width={30}
                    height={30}
                    quality={15}
                  />
                </Link>
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
