import { USER_ACTION_TYPES } from "./user.types";
import {
  signInFailed,
  signOutFailed,
  signUpFailed,
  signOutSuccess,
  signInSuccess,
  addUsernameSuccess,
} from "./user.action";
import { AnyAction } from "@reduxjs/toolkit";
import { UserData } from "../../lib/firebase";
//* Typing for user state

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly username: string | null;
};

export const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  username: null,
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
    };
  }
  if (addUsernameSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload.user,
      username: action.payload.username,
    };
  }
  if (signOutSuccess.match(action)) {
    return {
      ...state,
      currentUser: null,
    };
  }
  if (
    signInFailed.match(action) ||
    signUpFailed.match(action) ||
    signOutFailed.match(action)
  ) {
    return {
      ...state,
      error: action.payload,
    };
  }
  return state;
};
