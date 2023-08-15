import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { orgSignin } from "../utils/authorization-config-util/authorizationConfigUtil";
import FooterComponent from "../components/common/footerComponent/footerComponent";
import { Button, FlexboxGrid, Panel, Stack } from "rsuite";
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

                {/* <img
                  alt="react-logo"
                  src={REACT_LOGO}
                  className="react-logo-image logo"
                /> */}
              </div>
            </div>
            <div className={styles.logoContainer}>
              <h1>Enhance your application’s IAM experience with </h1>
              <Image
                alt="asgardeo-logo"
                src={logo}
                width={220}
                className={styles.asgardeoLogoImage}
              />
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
              {/* <a href={signUpURL}>
                <button className="btn-outline large-button">
                  Create an account
                </button>
              </a> */}
            </div>
            <br />
            <br />
            <div className={styles.containerColumn}>
              <a href="https://github.com/dasuni-30/asgardeo-react-sample-app">
                <Image
                  src={GITHUB_ICON}
                  className={styles.linkLogoImageSmall}
                  alt="github-logo"
                />
              </a>
              <a href="https://github.com/dasuni-30/asgardeo-react-sample-app">
                Explore the source code
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* 
      <div className={styles.main}>
        <div className={styles.middleDiv}>
          <FlexboxGrid align="middle">
            <FlexboxGrid.Item style={{ marginRight: "10px" }}>
              <Image src={logo} width={180} alt="logo" />
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
          <p className={styles.getStartedSectionComponentGetStartedTextP}>
            This is a sample application that demostrates B2B organization
            management flow using Asgardeo and next.js
          </p>

          <Button
            appearance="primary"
            className={styles.signInButton}
            size="sm"
            type="button"
            onClick={() => handleLogin()}
          >
            Sign In
          </Button>
        </div>

        <div className={styles.gridView}>
          <p>What can we do next? </p>
          <Stack spacing={20} className={styles.grid}>
            <Panel className={styles.card}>
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
                View Source
              </a>
            </Panel>
            <Panel className={styles.card}>
              <h3>Asgardeo Docs</h3>
              <p>
                Read our documentation for step-by-step guides on building IAM
                use cases.
              </p>
              <a
                href="https://wso2.com/asgardeo/docs/"
                target="_blank"
                rel="noreferrer"
              >
                Learn More
              </a>
            </Panel>

            <Panel className={styles.card}>
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

            <Panel className={styles.card}>
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
      </div> */}
      <FooterComponent />
    </>
  );
}
