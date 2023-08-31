import FooterComponent from "./footerComponent/footerComponent";
import NavBarComponent from "./navBarComponent/navBarcomponent";
import styles from "../../styles/Home.module.css";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  const [activeKeyNav, setActiveKeyNav] = useState<string | undefined>();
  const activeKeyNavSelect = (eventKey: string | undefined): void => {
    setActiveKeyNav(eventKey);
  };

  return (
    <>
      <div className={styles["mainDiv"]}>
        <NavBarComponent
          activeKeyNav={activeKeyNav}
          activeKeyNavSelect={activeKeyNavSelect}
        />

        <main>{children}</main>
        <FooterComponent />
      </div>
    </>
  );
}
