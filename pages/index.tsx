import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { orgSignin } from "../utils/authorization-config-util/authorizationConfigUtil";
import FooterComponent from "../components/common/footerComponent/footerComponent";
import { Button } from "rsuite";
import logo from "../public/asgardeo-logo-transparent.png";
import nextImage from "../public/next.svg";
import GITHUB_ICON from "../public/github.png";

export default function Home() {
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
      <div className={styles.App}>
        <header className={styles.AppHeaderSection}>
          <div>
            <div className={styles.container}>
              <div className={styles.logoContainer}>
                <Image
                  alt="react-logo"
                  src={nextImage}
                  width={120}
                  className={styles.nextLogoImageLogo}
                />
              </div>
            </div>
            <div className={styles.logoContainer}>
              <h1>
                Enhance your application’s IAM capabilities with
                <Image
                  alt="asgardeo-logo"
                  src={logo}
                  width={220}
                  className={styles.asgardeoLogoImage}
                />
              </h1>
            </div>
            <p className={styles.description}>
              This is a sample application that demostrates B2B organization
              management flow using Asgardeo and next.js
            </p>
            <div className={styles.buttonContainer}>
              <Button
                appearance="primary"
                className={styles.btn}
                size="md"
                onClick={() => handleLogin()}
              >
                Sign In
              </Button>
            </div>
            <br />
            <br />
            <div className={styles.containerColumn}>
              <a href="https://github.com/ChanikaRuchini/asgardeo-b2b-nextjs-sample-app">
                <Image
                  src={GITHUB_ICON}
                  className={styles.linkLogoImageSmall}
                  alt="github-logo"
                />
              </a>
              <a href="https://github.com/ChanikaRuchini/asgardeo-b2b-nextjs-sample-app">
                <b>Explore the source code</b>
              </a>
            </div>
          </div>
        </header>
      </div>
      <FooterComponent />
    </>
  );
}
