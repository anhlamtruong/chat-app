import AuthCheck from "@/components/AuthCheck";
import Loader from "@/components/Loader";
import PostFeed from "@/components/PostFeed";
import { writePostToStore } from "@/lib/firebase";
import { fetchPostsStart } from "@/store/posts/post.actions";
import { selectPosts, selectPostsIsLoading } from "@/store/posts/post.selector";
import {
  selectCurrentUser,
  selectCurrentIsLoading,
  selectCurrentUsername,
} from "@/store/user/user.selector";
import { useRouter } from "next/router";
import { useEffect, useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import kebabCase from "lodash.kebabcase";
import styles from "../../styles/Admin.module.css";
import toast from "react-hot-toast";

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const router = useRouter();
  const username = useSelector(selectCurrentUsername) as string;
  const dispatch = useDispatch();
  const currentPosts = useSelector(selectPosts);
  const currentUser = useSelector(selectCurrentUser);
  const currentUserIsLoading = useSelector(selectCurrentIsLoading);
  const currentPostsIsLoading = useSelector(selectPostsIsLoading);
  //Use to start a dispatch
  useEffect(() => {
    dispatch(fetchPostsStart(username as string));
  }, [dispatch, username]);
  return (
    <main>
      <h1>Manage your Post</h1>
      {currentUserIsLoading === true ? (
        <Loader show={currentUserIsLoading}></Loader>
      ) : currentUser ? (
        <>
          {/* <UserProfile user={currentUser as UserData}></UserProfile> */}
          {currentPostsIsLoading === true ? (
            <Loader show={currentPostsIsLoading}></Loader>
          ) : (
            <>
              {currentPosts.map((currPost) => (
                <PostFeed post={currPost} key={currPost.uid} admin={true} />
              ))}
            </>
          )}
        </>
      ) : (
        <div>No user found</div>
      )}
    </main>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const username = useSelector(selectCurrentUsername) as string;
  const [title, setTitle] = useState("");
  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));
  // Validate length
  const isValid = title.length > 3 && title.length < 100;
  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    writePostToStore(title, slug, username);
    toast.success("Post created!");
    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };
  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder=" My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong>
        {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
