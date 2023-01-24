import { createSelector } from "reselect";
import { UserState } from "./user.reducer";
import { RootState } from "../store";
//*& using Memorize
export const selectCurrentReducer = (state: RootState): UserState => state.user;
export const selectCurrentUser = createSelector(
  selectCurrentReducer,
  (user) => user.currentUser
);
