import {
  getPostPath,
  getUserWithUserID,
  PostWithPath,
  db,
  getDocWithPath,
} from "@/lib/firebase";
import { PostItem } from "@/store/posts/post.types";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import {
  collectionGroup,
  DocumentData,
  DocumentReference,
  getDocs,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import styles from "@/styles/Post.module.css";
import PostContent from "@/components/PostContent";
import AuthCheck from "@/components/AuthCheck";
import Link from "next/link";
import Heart from "@/components/HeartButton";

interface Props {
  post: PostItem;
  path: string;
}
interface Params {
  username: string;
  slug: string;
}

//!ADDING SOMETHING TO MAKE TO GO FASTER
export const getStaticProps: GetStaticProps<
  Props,
  { username: string; slug: string }
> = async ({ params }) => {
  const { username, slug } = params as Params;
  // console.log("username:", username);
  // console.log("SLUG:", slug);
  const data = await getPostPath(username, slug);
  const { post, path } = data as PostWithPath;
  return {
    props: { post, path },
    revalidate: 5000,
  };
};

export const getStaticPaths: GetStaticPaths<{
  username: string;
  slug: string;
}> = async () => {
  const nestedCollectionSnapshot = collectionGroup(db, "posts");
  //Must be write in this format
  const paths = (await getDocs(nestedCollectionSnapshot)).docs.map((snap) => {
    const data = snap.data() as DocumentData;
    const { username, slug } = data;
    // console.log("Slug:", slug, "Username:", username);
    return {
      params: { username, slug } as Params,
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
};

const PostPage: NextPage<Props> = (props) => {
  //This is for Realtime Data Hydration
  const postRef = getDocWithPath(props.path);
  const [realtimePost] = useDocumentData(postRef);
  // If it is any error, we can use another jobs
  const post = (realtimePost as PostItem) || props.post;
  return (
    <main className={styles.container}>
      <section className={styles.postContent}>
        <PostContent post={post}></PostContent>
      </section>
      <aside className={`card ${styles.postControl}`}>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <Heart postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
};

export default PostPage;
