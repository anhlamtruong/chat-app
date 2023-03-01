import AuthCheck from "@/components/AuthCheck";
import MetaTags from "@/components/Metatags";
import styles from "../../styles/Admin.module.css";
import { useEffect, useState } from "react";
import router from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { getPostBySlug } from "@/lib/firebase";
import PostForm from "@/components/PostForm";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/user/user.selector";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function AdminPostEdit({}) {
  return (
    <main>
      <MetaTags
        title="admin page"
        image=""
        description="Using for edit a post"
      ></MetaTags>
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </main>
  );
}
let defaultPostRef: DocumentReference<DocumentData>;
function PostManager() {
  const currentUser = useSelector(selectCurrentUser);
  const [preview, setPreview] = useState(false);
  const { slug } = router.query;
  const postRef = getPostBySlug(slug as string);
  //We don't want to have the real time update so
  // we use use useDocumentData
  const [post] = useDocumentData(postRef);

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser]);

  //! ADDING CSS TO THE PAGE
  return (
    <main className={styles.container}>
      {post ? (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef as DocumentReference<DocumentData>}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      ) : (
        <Loader show={true} />
      )}
    </main>
  );
}
