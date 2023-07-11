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

import SideNavItem from "../../../models/sideNav/sideNavItem";
import SideNavList from "../../../models/sideNav/sideNavList";
import { hideBasedOnScopes } from "../../../utils/front-end-util/frontendUtil";
import { Navbar, Nav, Button, Stack, Tag } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "./navBarComponent.module.css";

export interface SidenavComponentProps {
  scope: string;
  sideNavData: SideNavList;
  activeKeySideNav: string | undefined;
  activeKeySideNavSelect: (event: string | undefined) => void;
  setSignOutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBarComponent(prop: SidenavComponentProps) {
  const {
    scope,
    sideNavData,
    activeKeySideNav,
    activeKeySideNavSelect,
    setSignOutModalOpen,
  } = prop;

  const sideNavConfigList: SideNavList = sideNavData;
  const signOutOnClick = () => setSignOutModalOpen(true);

  return (
    <div className={styles["navDiv"]}>
      <Navbar appearance="default" className={styles["navBar"]}>
        {/* <Navbar.Brand href="#">RSUITE</Navbar.Brand> */}
        <Nav activeKey={activeKeySideNav}>
          {sideNavConfigList.items.map((item: SideNavItem) => {
            if (item.items) {
              console.log("hide", item.hideBasedOnScope);
              return (
                <Nav.Menu
                  className={styles["navItem"]}
                  eventKey={item.eventKey}
                  title={item.title}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(scope, item.type, item.items)
                      : {}
                  }
                  key={item.eventKey}
                >
                  {/* {item.items.map((item) => (
                    <Nav.Item
                      key={item.eventKey}
                      eventKey={item.eventKey}
                      onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}
                      style={
                        item.hideBasedOnScope
                          ? hideBasedOnScopes(
                              scope,
                              item.type,
                              item.items,
                              item.scopes
                            )
                          : {}
                      }
                    >
                      <Stack spacing={10}>
                        {item.title}
                        {item.new ? (
                          <Tag>
                            <b>NEW</b>
                          </Tag>
                        ) : null}
                      </Stack>
                    </Nav.Item>
                  ))} */}
                </Nav.Menu>
              );
            } else {
              console.log("bbbbbbbbbbbbbbb");
              return (
                <Nav.Item
                  key={item.eventKey}
                  eventKey={item.eventKey}
                  onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(
                          scope,
                          item.type,
                          item.items,
                          item.scopes
                        )
                      : {}
                  }
                >
                  <Stack spacing={10}>
                    {item.title}
                    {item.new ? (
                      <Tag>
                        <b>NEW</b>
                      </Tag>
                    ) : null}
                  </Stack>
                </Nav.Item>
              );
            }
          })}
        </Nav>
        <Nav pullRight style={{ marginRight: "50px" }}>
          <Nav.Item onSelect={signOutOnClick}>Sign Out</Nav.Item>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBarComponent;
