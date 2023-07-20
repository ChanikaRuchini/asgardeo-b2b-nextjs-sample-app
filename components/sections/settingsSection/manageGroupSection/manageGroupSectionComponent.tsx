import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Stack, Table } from "rsuite";
import AddGroupComponent from "./otherComponents/addGroupComponent";
import DeleteGroupComponent from "./otherComponents/deleteGroupComponent";
import EditGroupComponent from "./otherComponents/editGroupComponent";
import styles from "../../../../styles/Settings.module.css";
import { InternalUser, User } from "../../../../models/user/user";
import { Group, InternalGroup } from "../../../../models/group/group";
import RequestMethod from "../../../../models/api/requestMethod";
import { decodeGroup } from "../../../../utils/groupUtils";
import { decodeUser } from "../../../../utils/userUtils";

interface ManageGroupSectionComponentProps {
  session: Session;
}

/**
 *
 * @param prop - session
 *
 * @returns A component that will show the groups in a table view
 */
export default function ManageGroupSectionComponent(
  props: ManageGroupSectionComponentProps
) {
  const { session } = props;

  const [users, setUsers] = useState<InternalUser[] | null>([]);
  const [groups, setGroups] = useState<InternalGroup[] | null>([]);
  const [editGroupOpen, setEditGroupOpen] = useState<boolean>(false);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<InternalGroup | null>();
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false);
  const { Column, HeaderCell, Cell } = Table;

  const fetchData = useCallback(async () => {
    const res = await getGroups(session);
    await setGroups(res);
  }, [session]);

  async function getGroups(session: Session): Promise<InternalGroup[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch("/api/settings/group/viewGroups", request);
      const groupsData = await res.json();

      if (groupsData) {
        const groupsReturn: InternalGroup[] = [];

        if (groupsData.Resources) {
          groupsData.Resources.map((group: Group) => {
            const groupDetails = decodeGroup(group);

            if (groupDetails) {
              groupsReturn.push(groupDetails);
            }

            return null;
          });
        }

        return groupsReturn;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  const fetchAllUsers = useCallback(async () => {
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
    fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    if (!editGroupOpen || !addUserOpen || !deleteUserOpen) {
      fetchData();
    }
  }, [editGroupOpen, addUserOpen, deleteUserOpen, fetchData]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const closeEditDialog = (): void => {
    setOpenGroup(null);
    setEditGroupOpen(false);
  };

  const closeDeleteDialog = (): void => {
    setOpenGroup(null);
    setDeleteUserOpen(false);
  };

  const onEditClick = (group: InternalGroup): void => {
    setOpenGroup(group);
    setEditGroupOpen(true);
  };

  const onDeleteClick = (group: InternalGroup): void => {
    setOpenGroup(group);
    setDeleteUserOpen(true);
  };

  const closeAddUserDialog = (): void => {
    setAddUserOpen(false);
  };

  const onAddUserClick = (): void => {
    setAddUserOpen(true);
  };

  return (
    <div className={styles.tableMainPanelDiv}>
      {editGroupOpen ? (
        <EditGroupComponent
          session={session}
          open={editGroupOpen}
          onClose={closeEditDialog}
          group={openGroup!}
          userList={users!}
        />
      ) : null}

      {deleteUserOpen ? (
        <DeleteGroupComponent
          session={session}
          open={deleteUserOpen}
          onClose={closeDeleteDialog}
          group={openGroup!}
        />
      ) : null}

      <AddGroupComponent
        session={session}
        users={users!}
        open={addUserOpen}
        onClose={closeAddUserDialog}
      />
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h3>Manage Groups</h3>
          <p>Manage groups in the organization</p>
        </Stack>
        <Button appearance="primary" size="lg" onClick={onAddUserClick}>
          + New Group
        </Button>
      </Stack>

      {groups ? (
        <div style={{ height: "900", overflow: "auto" }}>
          <Table autoHeight data={groups}>
            <Column width={200} align="center">
              <HeaderCell>
                <h6>Group</h6>
              </HeaderCell>
              <Cell dataKey="displayName" />
            </Column>

            <Column width={200} align="center">
              <HeaderCell>
                <h6>User Store</h6>
              </HeaderCell>
              <Cell dataKey="userStore" />
            </Column>

            <Column flexGrow={1} align="center" fixed="right">
              <HeaderCell>
                <h6>Edit Group</h6>
              </HeaderCell>

              <Cell>
                {(rowData) => (
                  <span>
                    <a
                      onClick={() => onEditClick(rowData as InternalGroup)}
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
                <h6>Delete Group</h6>
              </HeaderCell>

              <Cell>
                {(rowData) => (
                  <span>
                    <a
                      onClick={() => onDeleteClick(rowData as InternalGroup)}
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
    </div>
  );
}
