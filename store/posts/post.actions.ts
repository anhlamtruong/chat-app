import {
  createAction,
  Action,
  ActionWithPayload,
  withMatcher,
} from "../../lib/reducer/reducer.utils";
import { POSTS_ACTION_TYPES, PostItem, Posts } from "./post.types";
// import { getPostsAndDocuments } from "../../utils/firebase.utils";
// export const setPosts = (postsArray) =>
//   createAction(POSTS_ACTION_TYPES.SET_Posts, postsArray);

//* Typescript definition
export type FetchPostsStart = ActionWithPayload<
  POSTS_ACTION_TYPES.FETCH_POSTS_START,
  String
>;
export type FetchPostsSuccess = ActionWithPayload<
  POSTS_ACTION_TYPES.FETCH_POSTS_SUCCESS,
  PostItem[]
>;
export type FetchPostsFailed = ActionWithPayload<
  POSTS_ACTION_TYPES.FETCH_POSTS_FAILED,
  Error
>;

// export type PostItemAction =
//   | FetchPostsFailed
//   | FetchPostsStart
//   | FetchPostsSucces;

export const fetchPostsStart = withMatcher(
  (username: string): FetchPostsStart =>
    createAction(POSTS_ACTION_TYPES.FETCH_POSTS_START, username)
);

export const fetchPostsSuccess = withMatcher(
  (postsArray: PostItem[]): FetchPostsSuccess =>
    createAction(POSTS_ACTION_TYPES.FETCH_POSTS_SUCCESS, postsArray)
);

export const fetchPostsFailed = withMatcher(
  (error: Error): FetchPostsFailed =>
    createAction(POSTS_ACTION_TYPES.FETCH_POSTS_FAILED, error)
);

//* Redux- thunk function
/*
export const fetchPostsAsync = () => async (dispatch) => {
  dispatch(fetchPostsStart());
  try {
    const postsArray = await getPostsAndDocuments();
    dispatch(fetchPostsSuccess(postsArray));
  } catch (err) {
    dispatch(fetchPostsFailed(err));
  }
};
*/
