import { AnyAction } from "redux";
import { POSTS_ACTION_TYPES, PostItem } from "./post.types";
import {
  // CategoryAction,
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailed,
} from "./post.actions";

export type PostsState = {
  readonly posts: PostItem[];
  readonly isLoading: boolean;
  readonly error: Error | null;
};

export const POSTS_INITIAL_STATE: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
};

export const postsReducer = (
  state = POSTS_INITIAL_STATE,
  action = {} as AnyAction
): PostsState => {
  if (fetchPostsStart.match(action)) {
    return { ...state, isLoading: true };
  }
  if (fetchPostsSuccess.match(action)) {
    return { ...state, posts: action.payload, isLoading: false };
  }
  if (fetchPostsFailed.match(action)) {
    return { ...state, error: action.payload, isLoading: false };
  }
  return state;
  // const { type, payload } = = action;
  // switch (action.type) {
  //   case CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START:
  //     return { ...state, isLoading: true };
  //   case CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_SUCCESS:
  //     return { ...state, categories: action.payload, isLoading: false };
  //   case CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_FAILED:
  //     return { ...state, error: action.payload, isLoading: false };
  //   default:
  //     return state;
  // }
};
