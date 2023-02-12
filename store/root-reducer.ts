import { combineReducers } from "redux";
import { postsReducer } from "./posts/post.reducer";
import { userReducer } from "./user/user.reducer";

export const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
});
