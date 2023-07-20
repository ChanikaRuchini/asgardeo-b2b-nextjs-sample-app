import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Stack, Table } from "rsuite";
import AddUserComponent from "./otherComponents/addUserComponent";
import EditUserComponent from "./otherComponents/editUserComponent";
import styles from "../../../../styles/Settings.module.css";
import { decodeUser } from "../../../../utils/userUtils";
import { InternalUser, User } from "../../../../models/user/user";
import RequestMethod from "../../../../models/api/requestMethod";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import DeleteUserComponent from "./otherComponents/deleteUserComponent";

interface ManageUserSectionComponentProps {
  session: Session;
}

/**
 *
 * @param prop - session
 *
 * @returns A component that will show the users in a table view
 */
export default function ManageUserSectionComponent(
  props: ManageUserSectionComponentProps
) {
  const { session } = props;

  const [users, setUsers] = useState<InternalUser[] | null>([]);
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [openUser, setOpenUser] = useState<InternalUser | null>();
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false);
  const { Column, HeaderCell, Cell } = Table;

  const fetchData = useCallback(async () => {
    const res = await getUsersList(session);
    await setUsers(res);
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
    console.log(openUser);
  };

  const closeDeleteDialog = (): void => {
    setOpenUser(null);
    setDeleteUserOpen(false);
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

      {deleteUserOpen ? (
        <DeleteUserComponent
          session={session}
          open={deleteUserOpen}
          onClose={closeDeleteDialog}
          user={openUser!}
        />
      ) : null}

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
                    <EditIcon />
                  </a>
                </span>
              )}
            </Cell>
          </Column>
          <Column flexGrow={1} align="center" fixed="right">
            <HeaderCell>
              <h6>Delete User</h6>
            </HeaderCell>

            <Cell>
              {(rowData) => (
                <span>
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
      ) : null}
    </div>
  );
}
