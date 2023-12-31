import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Loader, Stack, Table } from "rsuite";
import AddUserComponent from "./otherComponents/addUserComponent";
import EditUserComponent from "./otherComponents/editUserComponent";
import styles from "../../../../styles/Settings.module.css";
import { decodeUser } from "../../../../utils/userUtils";
import { InternalUser, User } from "../../../../models/user/user";
import RequestMethod from "../../../../models/api/requestMethod";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import DeleteUserComponent from "./otherComponents/deleteUserComponent";
import { useSession } from "next-auth/react";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../utils/front-end-util/frontendUtil";
import { orgSignin } from "../../../../utils/authorization-config-util/authorizationConfigUtil";

/**
 *
 *
 * @returns A component that will show the users in a table view
 */
export default function ManageUserSectionComponent() {
  //const { data: session, status } = useSession();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("wwwwwwwwwwwwwwww", session?.orgId);
      orgSignin();
    },
  });

  const [users, setUsers] = useState<InternalUser[] | null>([]);
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [openUser, setOpenUser] = useState<InternalUser | null>();
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false);
  const { Column, HeaderCell, Cell } = Table;
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

  const fetchData = useCallback(async () => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    const res = await getUsersList(session!);
    await setUsers(res);
    setLoadingDisplay(LOADING_DISPLAY_NONE);
  }, [session]);

  useEffect(() => {
    if (!editUserOpen || !addUserOpen || !deleteUserOpen) {
      fetchData();
    }
  }, [editUserOpen, addUserOpen, deleteUserOpen, fetchData]);

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

  const closeEditDialog = (): void => {
    setOpenUser(null);
    setEditUserOpen(false);
  };

  const onEditClick = (user: InternalUser): void => {
    setOpenUser(user);
    setEditUserOpen(true);
    console.log(openUser);
  };

  const closeAddUserDialog = (): void => {
    setAddUserOpen(false);
  };

  const onAddUserClick = (): void => {
    setAddUserOpen(true);
  };

  const onDeleteClick = (user: InternalUser): void => {
    setOpenUser(user);
    setDeleteUserOpen(true);
  };

  const closeDeleteDialog = (): void => {
    setOpenUser(null);
    setDeleteUserOpen(false);
  };

  return (
    <div className={styles.mainPanelDiv}>
      <div className={styles.tableMainPanelDiv}>
        {openUser ? (
          <EditUserComponent
            session={session!}
            open={editUserOpen}
            onClose={closeEditDialog}
            user={openUser}
          />
        ) : null}

        <AddUserComponent
          session={session!}
          open={addUserOpen}
          onClose={closeAddUserDialog}
        />

        {deleteUserOpen ? (
          <DeleteUserComponent
            session={session!}
            open={deleteUserOpen}
            onClose={closeDeleteDialog}
            user={openUser!}
          />
        ) : null}

        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>Manage Users</h3>
            <p>Manage users in the organization</p>
          </Stack>
          <Button
            className={styles.addBtn}
            appearance="primary"
            size="md"
            onClick={onAddUserClick}
          >
            Add User
          </Button>
        </Stack>

        {loadingDisplay == LOADING_DISPLAY_NONE && users && users.length > 0 ? (
          <div>
            <Table autoHeight data={users} style={{ marginTop: "20px" }}>
              <Column width={200}>
                <HeaderCell>
                  <h6>First Name</h6>
                </HeaderCell>
                <Cell dataKey="firstName" />
              </Column>

              <Column width={200}>
                <HeaderCell>
                  <h6>Last Name</h6>
                </HeaderCell>
                <Cell dataKey="familyName" />
              </Column>

              <Column width={200}>
                <HeaderCell>
                  <h6>Email (Username)</h6>
                </HeaderCell>
                <Cell dataKey="email" />
              </Column>

              <Column width={200} align="right">
                <HeaderCell>
                  <h6></h6>
                </HeaderCell>

                <Cell>
                  {(rowData) => (
                    <span>
                      <a
                        onClick={() => onEditClick(rowData as InternalUser)}
                        style={{ cursor: "pointer", paddingRight: "20px" }}
                      >
                        <EditIcon />
                      </a>
                      <a
                        onClick={() => onDeleteClick(rowData as InternalUser)}
                        style={{ cursor: "pointer" }}
                      >
                        <TrashIcon />
                      </a>
                    </span>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
        ) : null}
        <div style={loadingDisplay}>
          <Loader size="md" backdrop content="" vertical />
        </div>
      </div>
    </div>
  );
}
