import Link from "next/link";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  // selectCurrentPhotoURL,
} from "../store/user/user.selector";
import { ReactNode } from "react";
import { JsxElement } from "typescript";
type AuthCheckProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function AuthCheck(props: AuthCheckProps) {
  const user = useSelector(selectCurrentUser);

  return (
    <>
      {user
        ? props.children
        : props.fallback || <Link href="/enter">You must be signed in</Link>}
    </>
  );
}
