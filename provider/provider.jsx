"use client";

import { useRef } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { makeStore } from "@/app/store/store";

export function Providers({ children, session }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ReduxProvider store={storeRef.current}>{children}</ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
