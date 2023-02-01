import { useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Loader from "@/components/Loader";

import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
