import React from "react";
import styles from "./footerComponent.module.css";

export function FooterComponent() {
  return (
    <footer className={styles["footer"]}>
      <a
        href="https://wso2.com/asgardeo/"
        target="_blank"
        rel="noopener noreferrer"
      >
        WSO2 Sample Application
      </a>
    </footer>
  );
}

export default FooterComponent;
