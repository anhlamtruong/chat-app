import { all, call } from "typed-redux-saga";
import { userSagas } from "./user/user.saga";
import { postsSaga } from "./posts/post.saga";
export function* rootSaga() {
  yield* all([call(userSagas), call(postsSaga)]);
}
