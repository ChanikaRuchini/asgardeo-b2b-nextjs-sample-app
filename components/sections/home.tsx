/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { signout } from "../../utils/authorization-config-util/authorizationConfigUtil";
import FooterComponent from "../common/footerComponent/footerComponent";
import { Session } from "next-auth";
import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import HomeComponent from "./HomeSection/HomeComponent";
import IdpSectionComponent from "./settingsSection/idpSection/idpSectionComponent";
import ManageUserSectionComponent from "./settingsSection/manageUserSection/manageUserSectionComponent";
import RoleManagementSectionComponent from "./settingsSection/roleManagementSection/roleManagementSectionComponent";
import sidenavData from "../../components/common/navBarComponent/data/sideNav.json";
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
      case "3":
        return <ManageUserSectionComponent session={session} />;
      case "4":
        return <ManageGroupSectionComponent session={session} />;
      case "5":
        return <RoleManagementSectionComponent session={session} />;
      case "6":
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
            sideNavData={sidenavData}
            activeKeySideNav={activeKeySideNav}
            activeKeySideNavSelect={activeKeySideNavSelect}
            setSignOutModalOpen={signOutModalOpen}
          />
          <div className={styles["mainPanelDiv"]}>
            {mainPanelComponenet(activeKeySideNav)}
          </div>
        </div>
      ) : (
        <Custom500 />
      )}

      <FooterComponent />
    </div>
  );
}
