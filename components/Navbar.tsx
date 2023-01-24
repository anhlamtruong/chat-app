import Link from "next/link";
import Image from "next/image";
import ava from "../public/author-image.jpg";
import { lazy } from "react";
type User = {
  username: string;
  photoURL: string;
};
type ImageLoader = {
  src: string;
  width: number;
  quality: number;
};

export default function NavBar({}) {
  const user = {
    username: "Anh234",
    photoURL:
      "https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819_960_720.jpg",
  } as User;
  const { username, photoURL } = user;
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
                    src={user?.photoURL}
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
