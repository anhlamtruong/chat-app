import { createSelector } from "reselect";
import { UserState } from "./user.reducer";
import { RootState } from "../store";
//*& using Memorize
export const selectCurrentReducer = (state: RootState): UserState => state.user;
export const selectCurrentUser = createSelector(
  selectCurrentReducer,
  (user) => user.currentUser
);
export const selectCurrentUsername = createSelector(
  selectCurrentUser,
  (user) => {
    // console.log("FROM SELECTOR: ");
    // console.log(user?.username);
    return user?.username;
  }
);
// export const selectCurrentPhotoURL = createSelector(
//   selectCurrentUser,
//   (user) => user?.photoURL
// );
