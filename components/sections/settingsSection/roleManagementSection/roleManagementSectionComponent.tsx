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

import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, FlexboxGrid, PanelGroup, Stack } from "rsuite";
import RoleItem from "./otherComponents/roleItem/roleItem";
import styles from "../../../../styles/Settings.module.css";
import RequestMethod from "../../../../models/api/requestMethod";
import { Role } from "../../../../models/role/role";

interface RoleManagementSectionComponentProps {
  session: Session;
}

/**
 *
 * @param prop - session
 *
 * @returns The role management interface section.
 */
export default function RoleManagementSectionComponent(
  props: RoleManagementSectionComponentProps
) {
  const { session } = props;

  const [rolesList, setRolesList] = useState<Role[]>([]);

  const fetchAllRoles = useCallback(async () => {
    const res = await listAllRoles(session);

    if (res) {
      setRolesList(res);
    } else {
      setRolesList([]);
    }
  }, [session]);

  async function listAllRoles(session: Session): Promise<Role[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };

      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch("/api/settings/role/listAllRoles", request);
      const data = await res.json();

      if (data) {
        return data.roles;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h2>Role Management</h2>
          <p>Manage Application roles here.</p>
        </Stack>
      </Stack>

      {rolesList && rolesList.length > 0 ? (
        // <RolesList session={session} rolesList={rolesList} />

        <FlexboxGrid
          style={{ height: "60vh", marginTop: "24px", width: "100%" }}
          justify="start"
          align="top"
        >
          <div className={styles.idp__list}>
            <PanelGroup accordion bordered>
              {rolesList.map((role, index) => (
                <RoleItem session={session} role={role} key={index} />
              ))}
            </PanelGroup>
          </div>
        </FlexboxGrid>
      ) : (
        <FlexboxGrid
          style={{ height: "60vh", marginTop: "24px", width: "100%" }}
          justify="center"
          align="middle"
        >
          <Stack alignItems="center" direction="column">
            <p style={{ fontSize: 14, marginTop: "20px" }}>
              {"There are no roles created for the organization."}
            </p>
          </Stack>
        </FlexboxGrid>
      )}
    </Container>
  );
}
