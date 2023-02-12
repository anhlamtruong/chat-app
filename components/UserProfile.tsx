import Image from "next/image";
import { UserData } from "@/lib/firebase";
import { FC } from "react";
import { NextPage } from "next";

type UserProfileType = {
  user: UserData;
};

const UserProfile: NextPage<UserProfileType> = ({ user }) => {
  const photoURL2 = "/../public/random-user.png";
  // console.log(username);
  return (
    <div className="box-center">
      <Image
        src={user ? (user.photoURL ? user.photoURL : photoURL2) : photoURL2}
        alt={`User ${user.username} avatar`}
        className="card-img-center"
        width={100}
        height={100}
        quality={100}
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  );
};
export default UserProfile;
