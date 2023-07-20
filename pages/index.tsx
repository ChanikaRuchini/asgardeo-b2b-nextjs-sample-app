import { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import styles from "../styles/Home.module.css";
import { orgSignin } from "../utils/authorization-config-util/authorizationConfigUtil";
import FooterComponent from "../components/common/footerComponent/footerComponent";

interface DerivedState {
  idToken: string[];
  decodedIdTokenHeader: string;
  decodedIDTokenPayload: Record<string, string | number | boolean>;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [derivedAuthenticationState, setDerivedAuthenticationState] =
    useState<DerivedState>();
  //   const idToken = session?.user?.idToken;

  //   if (status === "authenticated" && idToken) {
  //     const derivedState: DerivedState = {
  //       idToken: idToken.split("."),
  //       decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
  //       decodedIDTokenPayload: jwtDecode(idToken),
  //     };

  //     setDerivedAuthenticationState(derivedState);
  //   }
  // }, [session, status]);

  const handleLogin = () => {
    orgSignin();
  };

  return (
    <>
      <Head>
        <title>Asgardeo + Next.js B2B Sample</title>
        <meta
          name="description"
          content="Application created by create-next-app and next-auth to demostrate Asgardeo + Next.js integration"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.signInDiv}>
          {/* <div className={styles.description}> */}
          <div className={styles.center}>
            <h2>Asgardeo + Next.js B2B Sample App</h2>
          </div>
          <button onClick={() => handleLogin()} className={styles.loginButton}>
            Sign In
          </button>
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Next.js Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://wso2.com/asgardeo"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Asgardeo <span>-&gt;</span>
            </h2>
            <p>
              Discover Asgardeo, WSO2&apos;s SaaS Customer IAM (CIAM) solution.
            </p>
          </a>

          <a
            href="https://next-auth.js.org"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              NextAuth.js Docs <span>-&gt;</span>
            </h2>
            <p>
              Learn about NextAuth.js to add authentication to your Next.js app.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
      <FooterComponent />
    </>
  );
}
