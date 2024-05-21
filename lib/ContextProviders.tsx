"use client";

import AuthContextProvider from "./AuthContextProvider";

export default function ContextProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
