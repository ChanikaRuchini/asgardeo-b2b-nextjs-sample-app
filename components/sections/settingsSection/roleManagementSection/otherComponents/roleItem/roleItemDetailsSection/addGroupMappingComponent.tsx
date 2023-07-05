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

import FormButtonToolbar from "../../../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import FormField from "../../../../../../common/ui-basic-components/formField/formField";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../../common/dialogComponent/dialogComponent";
import { PatchMethod } from "../../../../../../../utils/util-common/common";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Checkbox, Loader, Modal, Table, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";
import {
  InternalRoleGroup,
  PatchGroupMapping,
  RoleGroup,
  RoleGroupList,
} from "../../../../../../../models/role/role";
import { InternalGroup } from "../../../../../../../models/group/group";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { encodeRoleGroup } from "../../../../../../../utils/roleUtils";

interface AddGroupMappingComponentProps {
  session: Session;
  roleGroups: InternalRoleGroup[] | [];
  groups: InternalGroup[] | [];
  roleName: string;
  open: boolean;
  onClose: () => void;
  getGroups: () => Promise<void>;
}

/**
 *
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 *
 * @returns Modal to add a group.
 */
export default function AddGroupMappingComponent(
  props: AddGroupMappingComponentProps
) {
  const { session, roleGroups, groups, roleName, open, onClose, getGroups } =
    props;
  const [newGroups, setNewGroups] = useState<InternalGroup[]>([]);
  const [checkedGroups, setCheckedGroups] = useState<InternalGroup[]>([]);

  const { Column, HeaderCell, Cell } = Table;

  const toaster = useToaster();

  console.log("group mapping", roleGroups);
  console.log("groups", groups);

  const onDataSubmit = (response: boolean | RoleGroupList, form): void => {
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
    setCheckedGroups([]);
  };

  useEffect(() => {
    setCheckedGroups([]);
  }, []);

  useEffect(() => {
    removeExistingRoles();
  }, []);

  const onSubmit = async (
    values: Record<string, string>,
    form
  ): Promise<void> => {
    patchGroupMappings(session, roleName, getSendGroupData(checkedGroups))
      .then((response) => onDataSubmit(response, form))
      .finally(() => {
        getGroups().finally();
      });
    onClose();
  };

  async function patchGroupMappings(
    session: Session,
    roleName: string,
    groupMapping: InternalRoleGroup[]
  ): Promise<RoleGroupList | null> {
    try {
      const patchBody: PatchGroupMapping = {
        added_groups: getEncodedRoleGroups(groupMapping),
        removed_groups: [],
      };
      console.log("body", patchBody);

      const body = {
        orgId: session ? session.orgId : null,
        param: patchBody,
        session: session,
      };

      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/role/patchGroupMappings/${roleName}`,
        request
      );
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  function getEncodedRoleGroups(
    internalRoleGroup: InternalRoleGroup[]
  ): RoleGroup[] {
    const roleGroup: RoleGroup[] = [];
    internalRoleGroup.map((group) => {
      roleGroup.push(encodeRoleGroup(group));
    });
    return roleGroup;
  }

  const removeExistingRoles = () => {
    const addedGroups: InternalGroup[] = [];

    groups.map((group) => {
      roleGroups.map((roleGroup) => {
        if (roleGroup.name === group.displayName) {
          addedGroups.push(group);
        }
      });
    });
    const remainingGroups = groups.filter(
      (group: InternalGroup) => !addedGroups?.includes(group)
    );
    console.log("addedGroups", remainingGroups);
    setNewGroups(remainingGroups);
  };

  return (
    <Modal
      backdrop="static"
      role="alertdialog"
      open={open}
      onClose={onClose}
      size="sm"
    >
      <Modal.Body>
        <div className={styles.addUserMainDiv}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <FormSuite
                layout="vertical"
                onSubmit={() => {
                  handleSubmit().then(form.restart);
                }}
                fluid
              >
                <FormField
                  name="addGroup"
                  label="Assign Groups"
                  helperText="Select groups to assign them to the role."
                  // needErrorMessage={true}
                >
                  <></>
                </FormField>
                <div>
                  <Table autoHeight autoWidth data={newGroups}>
                    <Column width={500} align="left">
                      <HeaderCell>
                        <h6>Groups</h6>
                      </HeaderCell>
                      <Cell dataKey="displayName">
                        {(rowData: InternalGroup) => {
                          return (
                            <Checkbox
                              onChange={(
                                value: any,
                                checked: boolean,
                                event: React.SyntheticEvent<HTMLInputElement>
                              ) => {
                                if (checked) {
                                  setCheckedGroups((prevUsers) => [
                                    ...prevUsers,
                                    rowData,
                                  ]);
                                } else {
                                  setCheckedGroups((prevUsers) =>
                                    prevUsers.filter((user) => user !== rowData)
                                  );
                                }
                              }}
                            >
                              {rowData.displayName}
                            </Checkbox>
                          );
                        }}
                      </Cell>
                    </Column>
                  </Table>
                </div>
                <br />
                <FormButtonToolbar
                  submitButtonText="Submit"
                  //  submitButtonDisabled={submitting || pristine}
                  onCancel={onClose}
                />
              </FormSuite>
            )}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

function getSendGroupData(groups: InternalGroup[]) {
  const roleGroup: InternalRoleGroup[] = groups.map((group) => ({
    name: group.displayName,
    userstore: group.userStore,
  }));
  return roleGroup;
}
