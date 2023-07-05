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
import React, { useCallback, useEffect, useState } from "react";
import { Button, Stack, Table } from "rsuite";
import AddUserComponent from "./otherComponents/addUserComponent";
import EditUserComponent from "./otherComponents/editUserComponent";
import styles from "../../../../styles/Settings.module.css";
import { decodeUser } from "../../../../utils/userUtils";
import { InternalUser } from "../../../../models/user/user";
import RequestMethod from "../../../../models/api/requestMethod";

interface ManageUserSectionComponentProps {
  session: Session;
}

/**
 *
 * @param prop - orgName, orgId, session
 *
 * @returns A component that will show the users in a table view
 */
export default function ManageUserSectionComponent(
  props: ManageUserSectionComponentProps
) {
  const { session } = props;

  const [users, setUsers] = useState<InternalUser[]>([]);
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [openUser, setOpenUser] = useState<InternalUser>(null);

  const fetchData = useCallback(async () => {
    const res = await getUsersList(session);
    await setUsers(res);
  }, [session]);

  async function getUsersList(
    session: Session
  ): Promise<InternalUser[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch("/api/settings/user/viewUsers", request);
      const usersData = await res.json();

      if (usersData) {
        const usersReturn: InternalUser[] = [];

        if (usersData.Resources) {
          usersData.Resources.map((user: User) => {
            const userDetails = decodeUser(user);

            if (userDetails) {
              usersReturn.push(userDetails);
            }

            return null;
          });
        }

        return usersReturn;
      }
      return usersData;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    if (!editUserOpen || !addUserOpen) {
      fetchData();
    }
  }, [editUserOpen, addUserOpen, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { Column, HeaderCell, Cell } = Table;

  const closeEditDialog = (): void => {
    setOpenUser(null);
    setEditUserOpen(false);
  };

  const onEditClick = (user: InternalUser): void => {
    setOpenUser(user);
    setEditUserOpen(true);
  };

  const closeAddUserDialog = (): void => {
    setAddUserOpen(false);
  };

  const onAddUserClick = (): void => {
    console.log("uuu", users);
    setAddUserOpen(true);
  };

  return (
    <div className={styles.tableMainPanelDiv}>
      {openUser ? (
        <EditUserComponent
          session={session}
          open={editUserOpen}
          onClose={closeEditDialog}
          user={openUser}
        />
      ) : null}

      <AddUserComponent
        session={session}
        open={addUserOpen}
        onClose={closeAddUserDialog}
      />

      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h2>Manage Users</h2>
          <p>Manage users in the organization</p>
        </Stack>
        <Button appearance="primary" size="lg" onClick={onAddUserClick}>
          Add User
        </Button>
      </Stack>

      {users ? (
        <Table height={900} data={users}>
          <Column width={200} align="center">
            <HeaderCell>
              <h6>First Name</h6>
            </HeaderCell>
            <Cell dataKey="firstName" />
          </Column>

          <Column width={200} align="center">
            <HeaderCell>
              <h6>Last Name</h6>
            </HeaderCell>
            <Cell dataKey="familyName" />
          </Column>

          <Column flexGrow={2} align="center">
            <HeaderCell>
              <h6>Email (Username)</h6>
            </HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column flexGrow={1} align="center" fixed="right">
            <HeaderCell>
              <h6>Edit User</h6>
            </HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
                  <a
                    onClick={() => onEditClick(rowData as InternalUser)}
                    style={{ cursor: "pointer" }}
                  >
                    Edit
                  </a>
                </span>
              )}
            </Cell>
          </Column>
        </Table>
      ) : null}
    </div>
  );
}
