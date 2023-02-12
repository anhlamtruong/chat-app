import { compose, configureStore, Action } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Middleware } from "redux";
import logger from "redux-logger";

import createSagaMiddleware from "@redux-saga/core";

//root-reducer
import { rootSaga } from "./root-saga";
import { rootReducer } from "./root-reducer";

export type RootState = ReturnType<typeof rootReducer>;
//* for the middleWares
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

//* type for the persists
type ExtendedPersistConfig = PersistConfig<RootState> & {
  whitelist: (keyof RootState)[];
};
const persistConfig: ExtendedPersistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "posts"],
};
//* config the sagaMiddleWare
const sagaMiddleware = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducer);

//* Using for activate the store in global
export const store = configureStore({
  reducer: persistedReducer,
  //* [2 === 3 && {a:'string'}].filter(Boolean) -----> [] casue false got filtered out
  //* [3 === 3 && {a:'string'}].filter(Boolean) -----> [{...}]
  middleware: [
    process.env.NODE_ENV !== "production" && logger,
    sagaMiddleware,
  ].filter((middleware): middleware is Middleware => Boolean(middleware)),
});
//function run the saga from the root Saga
sagaMiddleware.run(rootSaga);
//function run the persist of the store
export const persistor = persistStore(store);

//* Legacy
// const composedEnhancers =
//   (process.env.NODE_ENV !== "production" &&
//     window &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose;
