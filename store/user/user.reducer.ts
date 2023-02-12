import { USER_ACTION_TYPES } from "./user.types";
import {
  signInFailed,
  signOutFailed,
  signUpFailed,
  signOutSuccess,
  signInSuccess,
  addUsernameSuccess,
  signOutStart,
  EmailSignInStart,
  GoogleSignInStart,
  SignUpStart,
  AddUsernameStart,
  signUpStart,
  emailSignInStart,
  googleSignInStart,
  addUsernameStart,
} from "./user.action";
import { AnyAction } from "@reduxjs/toolkit";
import { UserData } from "../../lib/firebase";
//* Typing for user state

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

//function using reducer hooks
//param state, dispatched
export const userReducer = (state = INITIAL_STATE, action: AnyAction) => {
  // console.log("dispatch");
  // console.log(action);
  if (signInSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload,
      isLoading: false,
    };
  }
  if (addUsernameSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload.user,
      isLoading: false,
    };
  }
  if (
    signOutStart.match(action) ||
    signUpStart.match(action) ||
    emailSignInStart.match(action) ||
    googleSignInStart.match(action) ||
    addUsernameStart.match(action)
  ) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (signOutSuccess.match(action)) {
    return {
      ...state,
      currentUser: null,
      isLoading: false,
    };
  }
  // if (
  //   signInStart.match(action) ||
  //   signUpFailed.match(action) ||
  //   signOutFailed.match(action)
  // ) {
  //   return {
  //     ...state,
  //     error: action.payload,
  //   };
  // }
  if (
    signInFailed.match(action) ||
    signUpFailed.match(action) ||
    signOutFailed.match(action)
  ) {
    return {
      ...state,
      error: action.payload,
      isLoading: false,
    };
  }
  return state;
};
