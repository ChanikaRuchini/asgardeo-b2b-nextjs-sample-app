import { AppProps } from "next/app";
import "rsuite/dist/rsuite.min.css";
import "./../styles/custom-theme.less";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
