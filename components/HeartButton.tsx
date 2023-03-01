import { DocumentHook, useDocument } from "react-firebase-hooks/firestore";
import {
  doc,
  DocumentData,
  DocumentReference,
  increment,
  writeBatch,
  collection,
  DocumentSnapshot,
} from "firebase/firestore";
import { db, auth, increaseHeart, reduceHeart } from "@/lib/firebase";
import { NextPage } from "next";

interface HeartProps {
  postRef: DocumentReference<DocumentData>;
}
//Allows user to heart or like a post
const Heart: NextPage<HeartProps> = ({ postRef }) => {
  // Listen to heart document for currently logged in user

  const heartCollectRef = collection(postRef, "hearts");
  const heartDocRef = doc(
    heartCollectRef,
    auth.currentUser ? auth.currentUser.uid : undefined
  );
  const [heartDoc] = useDocument(heartDocRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    await increaseHeart(postRef, heartDocRef, heartCollectRef);
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    await reduceHeart(postRef, heartDocRef);
  };
  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
};

export default Heart;
