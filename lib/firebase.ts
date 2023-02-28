// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  NextOrObserver,
  User,
  UserCredential,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  updateDoc,
  limit,
  where,
  orderBy,
  collectionGroup,
  Timestamp,
  startAfter,
  DocumentSnapshot,
  DocumentReference,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { PostItem, Posts } from "@/store/posts/post.types";
import { LIMIT } from "@/pages";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNh5g2idn3BrtI-ujaIgXOzJWclzZ8MSA",
  authDomain: "chat-app-46be9.firebaseapp.com",
  projectId: "chat-app-46be9",
  storageBucket: "chat-app-46be9.appspot.com",
  messagingSenderId: "52721516111",
  appId: "1:52721516111:web:40acb4ed5950cccf80343a",
  measurementId: "G-EP74MTXQP4",
};

// Initialize Firebase
if (!firebase.apps.length) {
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
}
export const auth = getAuth();
export const db = getFirestore();

// export const storage = firebase.storage();

//*function LOGIN WITH GOOGLE OR FACEBOOK **/
const provider_google = new GoogleAuthProvider();
provider_google.setCustomParameters({
  //* Alway force user to select an account
  prompt: "select_account",
});
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, provider_google);

//*function SIGN OUT USER**//
export const signOutUser = async () => await signOut(auth);

//*function CALL AuthStateChangedListener**//
export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
  onAuthStateChanged(auth, callback as NextOrObserver<User>);

//!TYPING
export type AdditionalInformation = {
  displayName?: string;
  username?: string | null;
  photoURL?: string;
};
export type UserData = {
  createdAt: Date;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
};
//*function SIGNUP WITH EMAIL AND PASSWORD **//
export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    if (!email || !password) return;
    return createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log("FAIL");
    throw err;
  }
};

//*function SIGN IN WITH EMAIL AND PASSWORD **//
export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    if (!email || !password) return;
    return signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw err;
  }
};

//*function STORING USER DATA INTO FIRESTORE => USER SNAPSHOT **//
export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: AdditionalInformation = {}
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  try {
    if (!userAuth) return;
    //param doc (DATABASE,COLLECTION,UNIQUE IDENTIFIER)
    const userDocRef = doc(db, "users", userAuth.uid);
    // console.log(userDocRef);

    //* Get and check data function
    const userSnapshot = await getDoc(userDocRef);
    // console.log(userSnapshot);

    //* If the data doesn't exist in the database
    //* create / set the document with the data from userAuth in my collection
    if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
      try {
        const { displayName } = additionalInformation;
        await setDoc(userDocRef, {
          displayName,
          email,
          createdAt,
          ...additionalInformation,
        });
      } catch (error) {
        console.error(`ERROR: CREATING THE USER, ${error}`);
        throw error;
      }
    }
    //* If the data exists in the database
    //* return userDocRef
    return userSnapshot as QueryDocumentSnapshot<UserData>;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
//*function GET CURRENT USER => PROMISE**//
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    //*function CALL AuthStateChangedListener**//
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};
//*function GET CURRENT USERNAME => PROMISE**//
export const getCurrentUserName = async (username: string) => {
  const usernameDocRef = doc(db, "usernames", username);
  const userSnapshot = await getDoc(usernameDocRef);
  // console.log("db READ EXECUTE");
  return userSnapshot.exists();
};
//*function ADD USERNAME AND USER TO FIREBASE => PROMISE**//
export const addUsername = async (newUsername: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    const usernameDoc = doc(db, "usernames", newUsername);
    // Commit both docs together as a batch write.
    const batch = writeBatch(db);
    console.log(userDoc);
    batch.update(userDoc, { username: newUsername });

    // batch.set(userDoc, { username: newUsername, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });
    await batch.commit();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export async function getUserID(username: string): Promise<void | string> {
  const usernameDocRef = doc(db, "usernames", username);
  //* Get and check data function
  const usernameSnapshot = await getDoc(usernameDocRef);
  if (!usernameSnapshot.exists()) return;
  return usernameSnapshot.get("uid") as string;
}
export async function getUserWithUserID(
  username: string
): Promise<void | QueryDocumentSnapshot<UserData>> {
  const userID = await getUserID(username);
  if (!userID) return;
  const userDocRef = doc(db, "users", userID);
  const userSnapshot = await getDoc(userDocRef);
  if (!userSnapshot.exists()) return;
  //* Return "user" base on their uid
  return userSnapshot as QueryDocumentSnapshot<UserData>;
}

export type PostItemsAndUserData = {
  posts: PostItem[];
  user: UserData;
};
//function that will get Categories and Documents
export const getPostsFromUsername = async (
  username: string
): Promise<void | PostItemsAndUserData> => {
  try {
    const userDoc = await getUserWithUserID(username);
    const userID = await getUserID(username);
    if (!userID || !userDoc) return;
    // If there is a user documents and the postsCol
    let user: UserData;
    let posts: PostItem[];
    // Find the collections in db
    let postsCol = collection(db, "users", `${userID}`, "posts");
    // Create userData from user Doc
    // Query the postsData
    user = userDoc.data();
    const postsQuery = query(postsCol, orderBy("createdAt", "desc"));
    posts = (await getDocs(postsQuery)).docs.map((snap) => {
      const data = snap.data() as PostItem;
      return data;
    });
    return { posts, user };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export type PostWithUsername = {
  post: PostItem;
  username: string;
};
export const getAllPostsWithID = async (
  start?: Timestamp
): Promise<PostWithUsername[]> => {
  try {
    // Find the all collections in db
    let allPostsCol = collectionGroup(db, "posts");
    // Create userData from user Doc
    // Query the postsData
    const allPostsQuery = query(
      allPostsCol,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT)
    );
    const postsAndID = (await getDocs(allPostsQuery)).docs.map((snap) => {
      const post = postToJSON(snap);
      const username = getIDFromPost(snap);
      console.log("POST :", post);
      console.log("USERNAME :", username);
      return { post, username };
    });
    return postsAndID as PostWithUsername[];
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getMorePostsWithID = async (
  start: Timestamp
): Promise<PostWithUsername[]> => {
  try {
    // Find the all collections in db
    let allPostsCol = collectionGroup(db, "posts");
    // Create userData from user Doc
    // Query the postsData
    const allPostsQuery = query(
      allPostsCol,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(LIMIT),
      startAfter(start)
    );
    const postsAndID = (await getDocs(allPostsQuery)).docs.map((snap) => {
      const post = postToJSON(snap);
      const username = getIDFromPost(snap);
      console.log("POST :", post);
      console.log("USERNAME :", username);
      return { post, username };
    });
    console.log(typeof postsAndID);
    return postsAndID as PostWithUsername[];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export type PostWithPath = {
  post: PostItem;
  path: string;
};
export const getPostPath = async (
  username: string,
  slug: string
): Promise<PostWithPath | undefined> => {
  try {
    const userDoc = await getUserWithUserID(username);
    const userID = await getUserID(username);
    // console.log("USERDOC:", userDoc);
    // console.log("USERDOC:", userID);
    let path, post;
    if (userDoc) {
      const docRef = doc(db, "users", userID as string);
      const nestedCollectionRef = collection(docRef, "posts");
      const nestedDocRef = doc(nestedCollectionRef, slug);
      const nestedDocSnapshot = await getDoc(nestedDocRef);
      post = postToJSON(nestedDocSnapshot);
      path = nestedDocRef.path;
      return { post, path } as PostWithPath;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getDocWithPath = (path: string): DocumentReference => {
  try {
    return doc(db, path);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export function getIDFromPost(doc: QueryDocumentSnapshot<DocumentData>) {
  const data = doc.data();
  return data.username as string;
}
export function postToJSON(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
) {
  const data = doc.data() as DocumentData;
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  } as PostItem;
}

export const fromMillis = (milliseconds: number) => {
  return Timestamp.fromMillis(milliseconds);
};

//* Using for editing page
export const writePostToStore = async (
  title: string,
  slug: string,
  username: string
) => {
  try {
    let uid = auth.currentUser?.uid;
    if (!uid) {
      const userID = await getUserID(username);
      uid = userID as string;
      if (!userID) {
        return;
      }
    }

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    const docRef = doc(db, "users", uid as string);
    const nestedCollectionRef = collection(docRef, "posts");
    // Create a new doc in collection
    const nestedNewDocRef = doc(nestedCollectionRef, slug);
    // Commit both docs together as a batch write.
    const batch = writeBatch(db);
    batch.set(nestedNewDocRef, data);
    await batch.commit();
  } catch (error: unknown) {
    console.log(error as Error);
    throw error as Error;
  }
};
