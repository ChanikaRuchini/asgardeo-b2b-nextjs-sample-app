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

import FormButtonToolbar from "../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import FormField from "../../../../common/ui-basic-components/formField/formField";
import {
  errorTypeDialog,
  successTypeDialog,
  warningTypeDialog,
} from "../../../../common/dialogComponent/dialogComponent";
import {
  PatchMethod,
  checkIfJSONisEmpty,
} from "../../../../../utils/util-common/common";
import { fieldValidate } from "../../../../../utils/front-end-util/frontendUtil";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Checkbox, CheckboxGroup, Loader, Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import stylesSettings from "../../../../../styles/Settings.module.css";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../../utils/front-end-util/frontendUtil";
import { decodeUser } from "../../../../../utils/userUtils";
import RequestMethod from "../../../../../models/api/requestMethod";
import {
  Group,
  InternalGroup,
  Member,
  sendMemberList,
} from "../../../../../models/group/group";
import { InternalUser } from "../../../../../models/user/user";

interface EditGroupComponentProps {
  session: Session;
  group: InternalGroup;
  open: boolean;
  onClose: () => void;
  userList: InternalUser[];
}

/**
 *
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 *
 * @returns Modal form to edit the group
 */
export default function EditGroupComponent(prop: EditGroupComponentProps) {
  const { session, group, open, onClose, userList } = prop;

  const toaster = useToaster();

  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [initialAssignedUsers, setInitialAssignedUsers] = useState<string[]>(
    []
  );

  const fetchData = useCallback(async () => {
    const res = await viewUsersInGroup(session, group?.displayName);

    await setUsers(res);
    setInitialAssignedUsers(getInitialAssignedUserEmails(res));
  }, [open === true]);

  async function viewUsersInGroup(
    session: Session,
    group: string
  ): Promise<InternalUser[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        param: group,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/group/viewUsersInGroup?group=${group}`,
        request
      );
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

      return null;
    } catch (err) {
      return null;
    }
  }

  const getInitialAssignedUserEmails = (users: InternalUser[]): string[] => {
    if (users) {
      return users.map((user) => user.email);
    }

    return [];
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("groupName", values.groupName, errors);

    return errors;
  };

  const onDataSubmit = (response: boolean | Group, form): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "Group added to the organization successfully."
      );
      form.restart();
      onClose();
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the group. Try again."
      );
    }
  };

  const onRolesSubmit = (response: boolean): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "Group details edited successfully."
      );
      onClose();
    } else {
      warningTypeDialog(
        toaster,
        "Groups not Properly Updated",
        "Error occured while updating the groups. Try again."
      );
    }
  };

  const onSubmit = async (
    values: Record<string, string>,
    form
  ): Promise<void> => {
    const name = "DEFAULT/" + values.groupName;

    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    patchGroupName(session, group.id, PatchMethod.REPLACE, "displayName", name)
      .then((response) => onDataSubmit(response, form))
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));

    patchGroupMembers(session, group.id, getMembers(userList, values.users))
      .then((response) => onDataSubmit(response, form))
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
  };

  async function patchGroupName(
    session: Session,
    groupId: string,
    patchMethod: PatchMethod,
    path: string,
    value: string
  ): Promise<Group | null> {
    const editGroupName: SendEditGroupName = {
      Operations: [
        {
          op: "replace",
          path: path,
          value: value,
        },
      ],
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    };
    const body = {
      orgId: session ? session.orgId : null,
      param: editGroupName,
      session: session,
    };

    const request = {
      body: JSON.stringify(body),
      method: RequestMethod.POST,
    };
    const res = await fetch(
      `/api/settings/group/patchGroupName?groupId=${groupId}`,
      request
    );
    const data = await res.json();

    return data;
  }

  async function patchGroupMembers(
    session: Session,
    groupId: string,
    value: sendMemberList
  ): Promise<Group | null> {
    const editGroupMembers: SendEditGroupMembers = {
      Operations: [
        {
          op: "replace",
          value: value,
        },
      ],
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    };

    const body = {
      orgId: session ? session.orgId : null,
      param: editGroupMembers,
      session: session,
    };

    const request = {
      body: JSON.stringify(body),
      method: RequestMethod.POST,
    };
    const res = await fetch(
      `/api/settings/group/patchGroupMembers?groupId=${groupId}`,
      request
    );
    const data = await res.json();
    return data;
  }

  return (
    <Modal
      backdrop="static"
      role="alertdialog"
      open={open}
      onClose={onClose}
      size="sm"
    >
      <Modal.Header>
        <>
          <Modal.Title>
            <h4>Edit Group</h4>
          </Modal.Title>
          <p>Edit group details</p>
        </>
      </Modal.Header>
      <Modal.Body>
        <div className={stylesSettings.addUserMainDiv}>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            initialValues={{
              groupName: group?.displayName,
              users: initialAssignedUsers,
            }}
            render={({ handleSubmit, form, submitting, pristine, errors }) => (
              <FormSuite
                layout="vertical"
                onSubmit={() => {
                  handleSubmit().then(form.restart);
                }}
                fluid
              >
                <FormField
                  name="groupName"
                  label="Group Name"
                  helperText="Name of the group."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" />
                </FormField>

                <FormField
                  name="editUsers"
                  label="Edit Users"
                  helperText="Update users in the group."
                  needErrorMessage={true}
                >
                  <></>
                </FormField>

                <FormField name="users" label="" needErrorMessage={false}>
                  <FormSuite.Control name="checkbox" accepter={CheckboxGroup}>
                    {userList.map((user) => (
                      <Checkbox key={user.email} value={user.email}>
                        {user.email}
                      </Checkbox>
                    ))}
                  </FormSuite.Control>
                </FormField>

                <FormButtonToolbar
                  submitButtonText="Submit"
                  submitButtonDisabled={
                    submitting || pristine || !checkIfJSONisEmpty(errors)
                  }
                  onCancel={onClose}
                />
              </FormSuite>
            )}
          />
        </div>
      </Modal.Body>

      <div style={loadingDisplay}>
        <Loader
          size="lg"
          backdrop
          content="Group details are updating"
          vertical
        />
      </div>
    </Modal>
  );
}

function getMembers(
  fullUserList: InternalUser[],
  checkedUsers: string
): sendMemberList {
  const usernames = checkedUsers
    .toString()
    .split(",")
    .map((username) => username.trim());
  const members: Member[] = [];

  for (const user of fullUserList) {
    if (usernames.includes(user.email)) {
      members.push({
        display: "DEFAULT/" + user.email,
        value: user.id,
      });
    }
  }

  const result: sendMemberList = {
    members: members,
  };

  return result;
}
