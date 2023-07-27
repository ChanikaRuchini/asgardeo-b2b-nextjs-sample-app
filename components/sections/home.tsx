import { signout } from "../../utils/authorization-config-util/authorizationConfigUtil";
import FooterComponent from "../common/footerComponent/footerComponent";
import { Session } from "next-auth";
import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import HomeComponent from "./HomeSection/HomeComponent";
import IdpSectionComponent from "./settingsSection/idpSection/idpSectionComponent";
import ManageUserSectionComponent from "./settingsSection/manageUserSection/manageUserSectionComponent";
import RoleManagementSectionComponent from "./settingsSection/roleManagementSection/roleManagementSectionComponent";
import NavData from "../../components/common/navBarComponent/data/nav.json";
import Custom500 from "../../pages/500";
import ProfileSectionComponent from "./profileSection/profileComponent";
import styles from "../../styles/Home.module.css";
import NavBarComponent from "../common/navBarComponent/navBarcomponent";
import ManageGroupSectionComponent from "./settingsSection/manageGroupSection/manageGroupSectionComponent";

interface HomeProps {
  name: string;
  session: Session;
}

/**
 *
 * @param prop - orgId, name, session, colorTheme
 *
 * @returns The home section. Mainly side nav bar and the section to show other settings sections.
 */
export default function Home(props: HomeProps): JSX.Element {
  const { name, session } = props;

  const [activeKeySideNav, setActiveKeySideNav] = useState<
    string | undefined
  >();

  const mainPanelComponenet = (activeKey: string | undefined): JSX.Element => {
    switch (activeKey) {
      case "1":
        return <HomeComponent session={session} />;
      case "2":
        return <ProfileSectionComponent session={session} />;
      case "3-1":
        return <ManageUserSectionComponent session={session} />;
      case "3-2":
        return <ManageGroupSectionComponent session={session} />;
      case "3-3":
        return <RoleManagementSectionComponent session={session} />;
      case "3-4":
        return <IdpSectionComponent session={session} />;
      default:
        return <HomeComponent session={session} />;
    }
  };

  const signOutCallback = (): void => {
    signout(session);
  };

  const activeKeySideNavSelect = (eventKey: string | undefined): void => {
    setActiveKeySideNav(eventKey);
  };

  const signOutModalOpen = (): void => {
    signout(session);
  };

  return (
    <div>
      {session && session.scope ? (
        <div className={styles["mainDiv"]}>
          <NavBarComponent
            scope={session.scope}
            loggedUser={session.user?.emails?.at(0)!}
            sideNavData={NavData}
            activeKeySideNav={activeKeySideNav}
            activeKeySideNavSelect={activeKeySideNavSelect}
            setSignOutModalOpen={signOutModalOpen}
          />
          <div className={styles["mainPanelDiv"]}>
            {mainPanelComponenet(activeKeySideNav)}
          </div>
          <FooterComponent />
        </div>
      ) : (
        <Custom500 />
      )}
    </div>
  );
}
