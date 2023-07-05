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

import AccordianItemHeaderComponent from "../../../../../common/accordianItemHeaderComponent/accordianItemHeaderComponent";
import { Session } from "next-auth";
import { useState } from "react";
import { Nav, Panel } from "rsuite";
import Permission from "./roleItemDetailsSection/permission";
import Groups from "./roleItemDetailsSection/groups";
import { Role } from "../../../../../../models/role/role";

interface RoleItemNavProps {
  activeKeyNav: string;
  activeKeyNavSelect: (eventKey: string) => void;
}

interface RoleItemProps {
  session: Session;
  role: Role;
}

/**
 *
 * @param prop - `session`, `id`, `roleUri`
 *
 * @returns role item componet
 */
export default function RoleItem(props: RoleItemProps) {
  const { session, role } = props;

  const [activeKeyNav, setActiveKeyNav] = useState<string>("1");

  const activeKeyNavSelect = (eventKey: string): void => {
    setActiveKeyNav(eventKey);
  };

  const roleItemDetailsComponent = (activeKey): JSX.Element => {
    switch (activeKey) {
      case "1":
        return <Permission permissions={role.permissions} />;
      case "2":
        return <Groups session={session} roleDetails={role} />;
    }
  };

  return role ? (
    <Panel
      header={
        <AccordianItemHeaderComponent
          title={role.name}
          description={`Application role ${role.name} details`}
        />
      }
    >
      <div style={{ marginLeft: "25px", marginRight: "25px" }}>
        <RoleItemNav
          activeKeyNav={activeKeyNav}
          activeKeyNavSelect={activeKeyNavSelect}
        />
        <div>{roleItemDetailsComponent(activeKeyNav)}</div>
      </div>
    </Panel>
  ) : null;
}

/**
 *
 * @param prop - `activeKeyNav`, `activeKeyNavSelect`
 *
 * @returns navigation bar of role item section
 */
function RoleItemNav(props: RoleItemNavProps) {
  const { activeKeyNav, activeKeyNavSelect } = props;

  return (
    <Nav
      appearance="subtle"
      activeKey={activeKeyNav}
      style={{ marginBottom: 10, marginTop: 15 }}
    >
      <div
        style={{
          alignItems: "stretch",
          display: "flex",
        }}
      >
        <Nav.Item
          eventKey="1"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey)}
        >
          Permissions
        </Nav.Item>

        <Nav.Item
          eventKey="2"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey)}
        >
          Groups
        </Nav.Item>

        <div style={{ flexGrow: "1" }}></div>
      </div>
    </Nav>
  );
}
