import { useEffect } from "react";
// import { useDispatch } from "react-redux";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Loader from "@/components/Loader";

import toast from "react-hot-toast";

// import { checkUserSession } from "../store/user/user.action";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // const dispatch = useDispatch();
  // //*We want to mount this function 1 times only, to run the onAuthStateChangedListener once
  // useEffect(() => {
  //   //! Using saga instead of synchronous hook function
  //   dispatch(checkUserSession());
  // }, [dispatch]);
  return (
    <div>
      <Loader show={true}></Loader>
      <Link
        prefetch={false}
        href={{
          pathname: "/[username]",
          query: { username: "anh124" },
        }}
      >
        Anh profiles
      </Link>
      <button onClick={() => toast.success("hello toast!")}>Toast Me</button>
    </div>
  );
}
