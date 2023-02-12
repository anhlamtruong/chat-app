import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { NextPage } from "next";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import Loader from "@/components/Loader";

import { UserData } from "@/lib/firebase";

import {
  selectCurrentUser,
  selectCurrentIsLoading,
} from "@/store/user/user.selector";
import { selectPosts, selectPostsIsLoading } from "@/store/posts/post.selector";

import { fetchPostsStart } from "@/store/posts/post.actions";
import { PostItem } from "@/store/posts/post.types";

interface Props {
  user: UserData;
  posts: PostItem[];
}

const UserProfilePage: NextPage<Props> = ({ user, posts }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentUserIsLoading = useSelector(selectCurrentIsLoading);
  const currentPosts = useSelector(selectPosts);
  const currentPostsIsLoading = useSelector(selectPostsIsLoading);
  const { username } = router.query;
  //Use to start a dispatch
  useEffect(() => {
    dispatch(fetchPostsStart(username as string));
  }, [dispatch, username]);
  //use to redirect user to the main page if there is no current user
  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);
  return (
    <main>
      {currentUserIsLoading === true ? (
        <Loader show={currentUserIsLoading}></Loader>
      ) : currentUser ? (
        <>
          <UserProfile user={currentUser as UserData}></UserProfile>
          {currentPostsIsLoading === true ? (
            <Loader show={currentPostsIsLoading}></Loader>
          ) : (
            <PostFeed posts={currentPosts} admin={true}></PostFeed>
          )}
        </>
      ) : (
        <div>No user found</div>
      )}
    </main>
  );
};
export default UserProfilePage;
