// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

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
} from "firebase/firestore";

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
export const firestore = getFirestore();
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
// export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
//   onAuthStateChanged(auth, callback as NextOrObserver<User>);

//!TYPING
export type AdditionalInformation = {
  displayName?: string;
  username?: string;
};
export type UserData = {
  createdAt: Date;
  displayName: string;
  email: string;
  username: string;
};

//*function STORING USER DATA INTO FIRESTORE => USER SNAPSHOT **//
export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation: AdditionalInformation = {}
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  try {
    if (!userAuth) return;
    //param doc (DATABASE,COLLECTION,UNIQUE IDENTIFIER)
    const userDocRef = doc(firestore, "users", userAuth.uid);
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
