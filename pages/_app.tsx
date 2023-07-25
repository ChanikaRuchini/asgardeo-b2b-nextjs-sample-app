import { AppProps } from "next/app";
import "rsuite/dist/rsuite.min.css";
import "./../custom-theme.less";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
