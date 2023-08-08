import React from "react";
import styles from "../../../styles/common.module.css";

// Add the date.
let date: Date = new Date();
let year = date.getFullYear();

export function FooterComponent() {
  return (
    <footer className={styles["footer"]}>
      <p>
        © {`${year}`}
        <a href="https://wso2.com/">&nbsp; WSO2 LLC </a>
      </p>
    </footer>
  );
}

export default FooterComponent;
