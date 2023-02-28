import { useState } from "react";
import { FC } from "react";

import { GetServerSideProps } from "next";

import { Inter } from "@next/font/google";

import Loader from "@/components/Loader";
import MetaTags from "@/components/Metatags";
const inter = Inter({ subsets: ["latin"] });
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentUsername,
  // selectCurrentPhotoURL,
} from "../store/user/user.selector";
import {
  getAllPostsWithID,
  PostWithUsername,
  fromMillis,
  getMorePostsWithID,
} from "@/lib/firebase";
import PostFeed from "@/components/PostFeed";
import { Timestamp } from "firebase/firestore";

interface Props {
  postsWithUsernameArray: PostWithUsername[];
}
export const LIMIT = 1;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const postsWithUsernameArray = await getAllPostsWithID();
  return {
    props: { postsWithUsernameArray },
  };
};

export const Home: FC<Props> = ({ postsWithUsernameArray }) => {
  const currentUser = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  const [posts, setPosts] = useState(postsWithUsernameArray);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor =
      typeof last.post.createdAt === "number"
        ? fromMillis(last.post.createdAt)
        : last.post.createdAt;

    const newPostsWithUsernameArray = await getMorePostsWithID(
      cursor as Timestamp
    );
    setPosts(posts.concat(newPostsWithUsernameArray));
    setLoading(false);
    if (newPostsWithUsernameArray.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  return (
    <main>
      <MetaTags
        title="Creata Homepage"
        image=""
        description="Home page of Creata social media"
      />
      {/* //!This admin needed to be fixed because only user can see their own post as an admin */}
      {posts ? (
        posts.map((postWithUsername) => (
          <PostFeed
            post={postWithUsername.post}
            key={postWithUsername.username}
            admin={postWithUsername.username === currentUser?.username}
          />
        ))
      ) : (
        <div>Error</div>
      )}
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading}></Loader>
      {postsEnd && "You have reach the end"}
    </main>
  );
};

export default Home;
