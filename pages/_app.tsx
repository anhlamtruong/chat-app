import "@/styles/globals.css";

import { useDispatch } from "react-redux";

import { checkUserSession } from "../store/user/user.action";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/user/user.selector";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";

import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </PersistGate>
      </Provider>
    </>
  );
}
