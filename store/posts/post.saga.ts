import { takeLatest, all, call, put } from "typed-redux-saga";
//*JS way
// import { takeLatest, all, call, put } from "redux-saga/effects";

import { getPostsFromUsername, PostItemsAndUserData } from "../../lib/firebase";

import {
  fetchPostsSuccess,
  fetchPostsFailed,
  FetchPostsStart,
} from "./post.actions";
import { setCurrentUser } from "../user/user.action";
import { PostItem, POSTS_ACTION_TYPES } from "./post.types";

export function* fetchPostsAsync({ payload: username }: FetchPostsStart) {
  try {
    const postsObject = yield* call(getPostsFromUsername, username as string);
    if (!postsObject) return;
    const { posts, user } = postsObject as PostItemsAndUserData;

    yield* put(fetchPostsSuccess(posts));
  } catch (error) {
    yield* put(fetchPostsFailed(error as Error));
  }
}
export function* onFetchPosts() {
  yield* takeLatest(POSTS_ACTION_TYPES.FETCH_POSTS_START, fetchPostsAsync);
}

export function* postsSaga() {
  yield* all([call(onFetchPosts)]);
}
