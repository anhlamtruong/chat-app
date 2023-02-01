import { takeLatest, all, call, put } from "typed-redux-saga";
import { User } from "firebase/auth";
import { AdditionalInformation, UserData } from "../../lib/firebase";

import { USER_ACTION_TYPES } from "./user.types";

import {
  signInSuccess,
  signInFailed,
  signUpFailed,
  signUpSuccess,
  signOutFailed,
  signOutSuccess,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess,
  addUsernameStart,
  addUsernameFailed,
  addUsernameSuccess,
  AddUsernameStart,
} from "./user.action";

import {
  getCurrentUser,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  // signInAuthUserWithEmailAndPassword,
  // createAuthUserWithEmailAndPassword,
  signOutUser,
  addUsername,
} from "../../lib/firebase";
import { PayloadAction } from "@reduxjs/toolkit";
//! THE FUNCTION IN SAGA

//function get the userSnapshot from current Auth
export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalDetails?: AdditionalInformation
) {
  try {
    console.log("GET SNAPSHOT FIRE");
    const userSnapshot = yield* call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    );
    if (userSnapshot) {
      console.log("GOOGLE SIGN IN RUN");
      console.log(userSnapshot);
      yield* put(
        signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() })
      );
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}
//function simply call signInWithGooglePopUp
export function* signInWithGoogle() {
  try {
    const { user } = yield* call(signInWithGooglePopup);
    const addDetails: AdditionalInformation = {
      displayName: user.displayName as string,
      photoURL: user.photoURL as string,
    };
    yield* call(getSnapshotFromUserAuth, user, addDetails);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}
//function generator checking user authentication
export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (err) {
    yield* put(signInFailed(err as Error));
  }
}
//function generate add username
export function* addingUsername({
  payload: { user, username },
}: AddUsernameStart) {
  try {
    if (!user) return;
    // console.log("ADDING USERNAME RUN");
    // console.log(user);
    // console.log(username);
    yield* call(addUsername, username);
    user.username = username;
    yield* put(addUsernameSuccess(user, username));
  } catch (error) {
    yield* put(addUsernameFailed(error as Error));
  }
}
//function signInAfterSignUp
export function* signInAfterSignUp({
  payload: { user, additionalDetails },
}: SignUpSuccess) {
  try {
    yield* call(getSnapshotFromUserAuth, user, additionalDetails);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

//function generator sign out
export function* signOut() {
  try {
    yield* call(signOutUser);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

//! THE LISTENER IN SAGA
export function* onGoogleSignInStart() {
  yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

// export function* onEmailSignInStart() {
//   yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
// }

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

// export function* onSignUpStart() {
//   yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
// }

// export function* onSignUpSuccess() {
//   yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
// }

export function* onAddUserStart() {
  yield* takeLatest(USER_ACTION_TYPES.ADD_USERNAME_START, addingUsername);
}
export function* onAddUserSuccess() {
  yield* takeLatest(
    USER_ACTION_TYPES.ADD_USERNAME_SUCCESS,
    isUserAuthenticated
  );
}
export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}
export function* userSagas() {
  yield* all([
    call(onCheckUserSession),
    call(onGoogleSignInStart),
    call(onAddUserStart),
    call(onAddUserSuccess),
    // call(onEmailSignInStart),
    // call(onSignUpStart),
    // call(onSignUpSuccess),
    call(onSignOutStart),
  ]);
}
