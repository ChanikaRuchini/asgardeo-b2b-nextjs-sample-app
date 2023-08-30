import FormButtonToolbar from "../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import FormField from "../../../../common/ui-basic-components/formField/formField";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../common/dialogComponent/dialogComponent";
import { checkIfJSONisEmpty } from "../../../../../utils/util-common/common";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../../utils/front-end-util/frontendUtil";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import {
  CheckPicker,
  Checkbox,
  Loader,
  Modal,
  Table,
  useToaster,
} from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../styles/Settings.module.css";
import { fieldValidate } from "../../../../../utils/front-end-util/frontendUtil";
import { InternalUser, UserList } from "../../../../../models/user/user";
import {
  AddedGroup,
  Member,
  SendGroup,
} from "../../../../../models/group/group";
import RequestMethod from "../../../../../models/api/requestMethod";
import { RowDataType } from "rsuite/esm/Table";
import { ApiError } from "../../../../../utils/api-util/apiErrors";

interface AddGroupComponentProps {
  session: Session;
  users: InternalUser[] | [];
  open: boolean;
  onClose: () => void;
}

interface UserData {
  label: string;
  value: string;
}

/**
 *
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 *
 * @returns Modal to add a group.
 */
export default function AddGroupComponent(props: AddGroupComponentProps) {
  const { session, users, open, onClose } = props;

  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const [checkedUsers, setCheckedUsers] = useState<InternalUser[]>([]);

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleCheckPickerChange = (values: string[]) => {
    setSelectedValues(values);
  };

  const { Column, HeaderCell, Cell } = Table;
  selectedValues;
  const toaster = useToaster();

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("groupName", values.groupName, errors);

    return errors;
  };

  const onDataSubmit = (
    response: AddedGroup | ApiError | null,
    form: any
  ): void => {
    if (response) {
      if ((response as ApiError).error) {
        errorTypeDialog(
          toaster,
          "Error Occured",
          (response as ApiError).msg as string
        );
      } else {
        successTypeDialog(
          toaster,
          "Changes Saved Successfully",
          "Group added to the organization successfully."
        );
        form.restart();
        onClose();
      }
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the group. Try again."
      );
    }
    setCheckedUsers([]);
  };

  useEffect(() => {
    setCheckedUsers([]);
    // if (users) {
    //   const data = users!.map((item) => ({
    //     label: item.email!,
    //     value: item.email!,
    //   }));
    //   setUserList(data);
    //   console.log("data", data);
    // }
  }, [session]);

  const getInitialAssignedUserEmails = (users: InternalUser[]): string[] => {
    if (users) {
      return users.map((user) => user.email || "");
    }

    return [];
  };

  const getAssignedUsers = (emails: string[]): InternalUser[] => {
    if (emails) {
      return emails
        .map((email) => {
          const user = users.find((user) => user.email === email);
          return user ? user : null;
        })
        .filter((user) => user !== null) as InternalUser[];
    }

    return [];
  };

  const onSubmit = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    addGroup(
      session,
      getSendGroupData(getAssignedUsers(selectedValues), values.groupName)
    )
      .then((response) => onDataSubmit(response, form))
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
  };

  async function addGroup(
    session: Session,
    group: SendGroup
  ): Promise<AddedGroup | ApiError | null> {
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

      const res = await fetch("/api/settings/group/addGroup", request);
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
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
            <h4>Add Group</h4>
          </Modal.Title>
          <p>Create new group and add users to the group</p>
        </>
      </Modal.Header>

      <Modal.Body>
        <div className={styles.addUserMainDiv}>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, form, submitting, pristine, errors }) => (
              <FormSuite
                layout="vertical"
                onSubmit={() => {
                  handleSubmit();
                }}
                fluid
              >
                <FormField
                  name="groupName"
                  label="Group Name"
                  helperText="Group name can contain between 3 to 30 
                                    alphanumeric characters, dashes (-), and underscores (_)."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" />
                </FormField>
                <FormField
                  name="editUsers"
                  label="Assign Users"
                  needErrorMessage={false}
                >
                  <></>
                </FormField>

                {/* <FormField name="users" label="" needErrorMessage={false}>
                  <FormSuite.Control name="checkPicker" accepter={CheckPicker}>
                    {users ? (
                      <div>
                        <CheckPicker
                          label="User"
                          data={userList}
                          style={{ width: 224 }}
                          value={selectedValues}
                          onChange={handleCheckPickerChange}
                        />
                      </div>
                    ) : null}
                  </FormSuite.Control>
                </FormField> */}

                {users ? (
                  <div>
                    <CheckPicker
                      label="User"
                      data={users!.map((item) => ({
                        label: item.email!,
                        value: item.email!,
                      }))}
                      style={{ width: 224 }}
                      value={selectedValues}
                      onChange={handleCheckPickerChange}
                      labelKey="label"
                    />
                  </div>
                ) : null}

                {/* {users ? (
                  <div>
                    <Table autoHeight data={users}>
                      <Column width={500} align="left">
                        <HeaderCell>
                          <h6>Asign Users</h6>
                        </HeaderCell>
                        <Cell dataKey="email">
                          {(rowData: RowDataType<InternalUser>) => {
                            return (
                              <Checkbox
                                checked={checkedUsers.includes(
                                  rowData as InternalUser
                                )}
                                onChange={(
                                  value: any,
                                  checked: boolean,
                                  event: React.SyntheticEvent<HTMLInputElement>
                                ) => {
                                  if (checked) {
                                    setCheckedUsers((prevUsers) => [
                                      ...prevUsers,
                                      rowData as InternalUser,
                                    ]);
                                  } else {
                                    setCheckedUsers((prevUsers) =>
                                      prevUsers.filter(
                                        (user) => user !== rowData
                                      )
                                    );
                                  }
                                }}
                              >
                                {rowData.email}
                              </Checkbox>
                            );
                          }}
                        </Cell>
                      </Column>
                    </Table>
                  </div>
                ) : null} */}
                <br />
                <FormButtonToolbar
                  submitButtonText="Create"
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
        <Loader size="lg" backdrop content="Group is adding" vertical />
      </div>
    </Modal>
  );
}

function getSendGroupData(users: InternalUser[], groupName: string) {
  const members: Member[] = users.map((user) => ({
    display: "DEFAULT/" + user.email,
    value: user.id,
  }));

  const sendData: SendGroup = {
    displayName: "DEFAULT/" + groupName,
    members: members,
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  };

  return sendData;
}
