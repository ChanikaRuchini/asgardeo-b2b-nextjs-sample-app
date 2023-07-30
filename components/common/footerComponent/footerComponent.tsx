import React from "react";
import styles from "../../../styles/common.module.css";

// Add the date.
let date: Date = new Date();
let year = date.getFullYear();

export function FooterComponent() {
  return (
    <footer className={styles["footer"]}>
      <p>
        © {`${year}`} Copyright:
        <a href="https://wso2.com/"> WSO2.Inc</a>
      </p>
    </footer>
  );
}

export default FooterComponent;
