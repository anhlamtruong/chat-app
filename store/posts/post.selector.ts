import { createSelector } from "reselect";
import { PostsState } from "./post.reducer";
import { Posts } from "./post.types";
import { RootState } from "../store";
const selectPostReducer = (state: RootState): PostsState => state.posts;

export const selectPosts = createSelector(
  [selectPostReducer],
  (categoriesSlice) => categoriesSlice.posts
);

// export const selectCategoriesMap = createSelector(
//   [selectCategories],
//   (categories): CategoryMap =>
//     categories.reduce((acc, category) => {
//       const { title, items } = category;
//       acc[title.toLowerCase()] = items;
//       return acc;
//     }, {} as CategoryMap)
// );

export const selectPostsIsLoading = createSelector(
  [selectPostReducer],
  (postsSlice) => postsSlice.isLoading
);
