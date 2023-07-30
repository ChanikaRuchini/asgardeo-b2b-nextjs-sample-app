import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import styles from "../styles/Home.module.css";
import { orgSignin } from "../utils/authorization-config-util/authorizationConfigUtil";
import FooterComponent from "../components/common/footerComponent/footerComponent";
import { Button, FlexboxGrid, Panel, Stack } from "rsuite";
import logo from "../public/asgardeo-logo-transparent.png";
import nextImage from "../public/next.svg";

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

      <div className={styles.main}>
        <div className={styles.signInDiv}>
          <div className={styles.center}>
            <FlexboxGrid align="middle">
              <FlexboxGrid.Item style={{ marginRight: "10px" }}>
                <Image src={logo} width={100} alt="logo" />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginRight: "10px" }}>
                <span>
                  <h2>+</h2>
                </span>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginRight: "10px" }}>
                <Image width={100} src={nextImage} alt="next image" />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginRight: "10px" }}>
                <span>
                  <h2>B2B Sample App</h2>
                </span>
              </FlexboxGrid.Item>
            </FlexboxGrid>
            {/* <Image src={logo} width={100} alt="logo" />
            <Image width={100} src={nextImage} alt="next image" />
            <h3>Asgardeo + Next.js B2B Sample App</h3> */}
          </div>
          <Button
            appearance="primary"
            className={styles.signInButton}
            size="md"
            type="button"
            onClick={() => handleLogin()}
          >
            Sign In
          </Button>
        </div>

        <Stack spacing={20} className={styles.grid}>
          <Panel bordered className={styles.card}>
            {/* <a
              href="https://wso2.com/asgardeo"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            > */}
            <h3>Asgardeo Docs</h3>
            <p>
              Read our documentation for step-by-step guides on building IAM use
              cases.
            </p>
            <a
              href="https://wso2.com/asgardeo/docs/"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </Panel>

          <Panel bordered className={styles.card}>
            <h3>Next.js Docs</h3>
            <p>
              Use Next.js documentation to find out in-depth information about
              Next.js features and API.
            </p>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel>

          <Panel bordered className={styles.card}>
            <h3>Github Repository</h3>
            <p>
              Go through the application codebase and contribute to our B2B
              Sample application.
            </p>
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel>

          <Panel bordered className={styles.card}>
            <h3>NextAuth.js Docs</h3>
            <p>
              Learn about NextAuth.js to add authentication to your Next.js
              applications.
            </p>
            <a
              href="https://next-auth.js.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel>
        </Stack>
      </div>
      <FooterComponent />
    </>
  );
}
