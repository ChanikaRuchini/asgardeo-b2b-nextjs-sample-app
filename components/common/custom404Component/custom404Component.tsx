import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Button, Stack } from "rsuite";
import styles from "./custom404Component.module.css";
import errorImage from "../../../public/404.svg";

export function Custom404Component() {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <Stack
      className={styles["errorMainContent"]}
      spacing={50}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Image src={errorImage} width={600} alt="404 image" />

      <Stack
        spacing={25}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <p className={styles["p"]}>
          <b>The page your searching seems to be missing.</b>
          <br />
          You can go back, or contact our <u>Customer Service</u> team if you
          need any help
        </p>

        <Button size="lg" appearance="ghost" onClick={goBack}>
          Go Back
        </Button>
      </Stack>
    </Stack>
  );
}

export default Custom404Component;
