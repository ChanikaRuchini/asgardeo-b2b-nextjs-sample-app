import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Loader, Stack, Table } from "rsuite";
import AddGroupComponent from "./otherComponents/addGroupComponent";
import DeleteGroupComponent from "./otherComponents/deleteGroupComponent";
import EditGroupComponent from "./otherComponents/editGroupComponent";
import styles from "../../../../styles/Settings.module.css";
import { InternalUser, User } from "../../../../models/user/user";
import { Group, InternalGroup } from "../../../../models/group/group";
import RequestMethod from "../../../../models/api/requestMethod";
import { decodeGroup } from "../../../../utils/groupUtils";
import { decodeUser } from "../../../../utils/userUtils";
import { useSession } from "next-auth/react";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../utils/front-end-util/frontendUtil";

/**
 *
 *
 * @returns A component that will show the groups in a table view
 */
export default function ManageGroupSectionComponent() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<InternalUser[] | null>([]);
  const [groups, setGroups] = useState<InternalGroup[] | null>([]);
  const [editGroupOpen, setEditGroupOpen] = useState<boolean>(false);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<InternalGroup | null>();
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false);
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const { Column, HeaderCell, Cell } = Table;

  const fetchData = useCallback(async () => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    const res = await getGroups(session!);
    await setGroups(res);
    setLoadingDisplay(LOADING_DISPLAY_NONE);
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
    const res = await getUsersList(session!);
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
    <div className={styles.mainPanelDiv}>
      <div className={styles.tableMainPanelDiv}>
        {editGroupOpen ? (
          <EditGroupComponent
            session={session!}
            open={editGroupOpen}
            onClose={closeEditDialog}
            group={openGroup!}
            userList={users!}
          />
        ) : null}

        {deleteUserOpen ? (
          <DeleteGroupComponent
            session={session!}
            open={deleteUserOpen}
            onClose={closeDeleteDialog}
            group={openGroup!}
          />
        ) : null}

        {addUserOpen ? (
          <AddGroupComponent
            session={session!}
            users={users!}
            open={addUserOpen}
            onClose={closeAddUserDialog}
          />
        ) : null}

        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>Manage Groups</h3>
            <p>Manage groups in the organization</p>
          </Stack>
          <Button
            style={{ borderRadius: "50px" }}
            appearance="primary"
            size="md"
            onClick={onAddUserClick}
          >
            Add Group
          </Button>
        </Stack>

        {loadingDisplay == LOADING_DISPLAY_NONE &&
        groups &&
        groups.length > 0 ? (
          <div>
            <Table autoHeight data={groups} style={{ marginTop: "20px" }}>
              <Column width={200}>
                <HeaderCell>
                  <h6>Group</h6>
                </HeaderCell>
                <Cell dataKey="displayName" />
              </Column>

              <Column width={200}>
                <HeaderCell>
                  <h6>User Store</h6>
                </HeaderCell>
                <Cell dataKey="userStore" />
              </Column>

              <Column flexGrow={1} fixed="right" align="right">
                <HeaderCell>
                  <h6></h6>
                </HeaderCell>

                <Cell>
                  {(rowData) => (
                    <span>
                      <a
                        onClick={() => onEditClick(rowData as InternalGroup)}
                        style={{ cursor: "pointer", paddingRight: "20px" }}
                      >
                        <EditIcon />
                      </a>
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
        <div style={loadingDisplay}>
          <Loader size="md" backdrop content="" vertical />
        </div>
      </div>
    </div>
  );
}
