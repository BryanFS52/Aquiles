"use client";
import { Provider } from "react-redux";
import store from "@redux/store";
import AuthHandler from "@components/AuthHandler";

export default function AuthCallback() {
  return (
    <Provider store={store}>
      <AuthHandler />
    </Provider>
  );
}
