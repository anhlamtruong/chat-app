import { useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Loader from "@/components/Loader";

import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentUsername,
  // selectCurrentPhotoURL,
} from "../store/user/user.selector";
import { UserData } from "@/lib/firebase";

const LIMIT = 1;

export default function Home() {
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  return (
    <>
      {currentUser ? (
        <div className={styles.homePageContainer}>
          <Link
            prefetch={false}
            href={{
              pathname: "/[username]",
              query: { username: username },
            }}
          >
            Go to Profile
          </Link>
          <button onClick={() => toast.success("hello toast!")}>
            Toast Me
          </button>
        </div>
      ) : (
        <div>
          <h1>No User yet</h1>
        </div>
      )}
    </>
  );
}
