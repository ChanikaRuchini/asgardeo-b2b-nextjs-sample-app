import { SendUser, User } from "../../../../../models/user/user";
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
import { fieldValidate } from "../../../../../utils/front-end-util/frontendUtil";
import EmailFillIcon from "@rsuite/icons/EmailFill";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import {
  Divider,
  Loader,
  Modal,
  Panel,
  Radio,
  RadioGroup,
  Stack,
  useToaster,
} from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../styles/Settings.module.css";
import RequestMethod from "../../../../../models/api/requestMethod";
import { ValueType } from "rsuite/esm/Radio";
import { ApiError } from "../../../../../utils/api-util/apiErrors";

interface AddUserComponentProps {
  session: Session;
  open: boolean;
  onClose: () => void;
}

export enum InviteConst {
  INVITE = "pwd-method-invite",
  PWD = "pwd-method-pwd",
}

/**
 *
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 *
 * @returns Modal to add a user.
 */
export default function AddUserComponent(props: AddUserComponentProps) {
  const { session, open, onClose } = props;

  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const [inviteSelect, serInviteSelect] = useState<InviteConst>(
    InviteConst.INVITE
  );
  const [inviteShow, setInviteShow] = useState(LOADING_DISPLAY_BLOCK);
  const [passwordShow, setPasswordShow] = useState(LOADING_DISPLAY_NONE);

  const toaster = useToaster();

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("firstName", values.firstName, errors);
    errors = fieldValidate("familyName", values.familyName, errors);
    errors = fieldValidate("email", values.email, errors);
    errors = fieldValidate("password", values.password, errors);
    errors = fieldValidate("repassword", values.repassword, errors);

    return errors;
  };

  const inviteSelectOnChange = (value: ValueType): void => {
    serInviteSelect(value as InviteConst);

    switch (value as InviteConst) {
      case InviteConst.INVITE:
        setInviteShow(LOADING_DISPLAY_BLOCK);
        setPasswordShow(LOADING_DISPLAY_NONE);

        break;

      case InviteConst.PWD:
        setInviteShow(LOADING_DISPLAY_NONE);
        setPasswordShow(LOADING_DISPLAY_BLOCK);

        break;
    }
  };

  const onDataSubmit = (response: User | ApiError | null, form: any): void => {
    if (response) {
      if (response.error) {
        errorTypeDialog(toaster, "Error Occured", response.msg as string);
      } else {
        successTypeDialog(
          toaster,
          "Changes Saved Successfully",
          "User add to the organization successfully."
        );
        form.restart();
        onClose();
      }
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the user. Try again."
      );
    }
  };

  const onSubmit = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    addUser(
      session,
      inviteSelect,
      values.firstName,
      values.familyName,
      values.email,
      values.password
    )
      .then((response) => onDataSubmit(response, form))
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
  };

  async function addUser(
    session: Session,
    inviteConst: InviteConst,
    firstName: string,
    familyName: string,
    email: string,
    password: string
  ): Promise<User | ApiError | null> {
    try {
      const addUserEncode: SendUser = getAddUserBody(
        inviteConst,
        firstName,
        familyName,
        email,
        password
      ) as SendUser;
      const body = {
        orgId: session ? session.orgId : null,
        param: addUserEncode,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch("/api/settings/user/addUser", request);
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  function getAddUserBody(
    inviteConst: InviteConst,
    firstName: string,
    familyName: string,
    email: string,
    password: string
  ): SendUser | undefined {
    switch (inviteConst) {
      case InviteConst.INVITE:
        return {
          emails: [
            {
              primary: true,
              value: email,
            },
          ],
          name: {
            familyName: familyName,
            givenName: firstName,
          },
          "urn:scim:wso2:schema": {
            askPassword: "true",
          },
          userName: "DEFAULT/" + email,
        };

      case InviteConst.PWD:
        return {
          emails: [
            {
              primary: true,
              value: email,
            },
          ],
          name: {
            familyName: familyName,
            givenName: firstName,
          },
          password: password,
          schemas: [],
          userName: "DEFAULT/" + email,
        };

      default:
        return;
    }
  }

  return (
    <Modal
      className={styles.modal}
      backdrop="static"
      role="alertdialog"
      open={open}
      onClose={onClose}
      size="sm"
    >
      <Modal.Header>
        <Modal.Title>
          <h4>Add User</h4>
        </Modal.Title>
        <p>Add a New User to the Organization</p>
      </Modal.Header>

      <Modal.Body>
        <div className={styles.addUserMainDiv}>
          <div style={{ paddingRight: "20px" }}>
            <Form
              onSubmit={onSubmit}
              validate={validate}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                errors,
              }) => (
                <FormSuite
                  layout="vertical"
                  onSubmit={() => {
                    handleSubmit();
                  }}
                  fluid
                >
                  <FormField
                    name="firstName"
                    label="First Name"
                    needErrorMessage={true}
                  >
                    <FormSuite.Control name="input" />
                  </FormField>

                  <FormField
                    name="familyName"
                    label="Family Name"
                    needErrorMessage={true}
                  >
                    <FormSuite.Control name="input" />
                  </FormField>

                  <FormField
                    name="email"
                    label="Email (Username)"
                    needErrorMessage={true}
                  >
                    <FormSuite.Control name="input" type="email" />
                  </FormField>

                  <RadioGroup
                    name="radioList"
                    value={inviteSelect}
                    defaultValue={InviteConst.INVITE}
                    onChange={inviteSelectOnChange}
                  >
                    <b>Select the method to set the user password</b>
                    <Radio value={InviteConst.INVITE}>
                      Invite the user to set their own password
                    </Radio>

                    <div style={inviteShow}>
                      <EmailInvitePanel />
                      <br />
                    </div>

                    <Radio value={InviteConst.PWD}>
                      Set a password for the user
                    </Radio>

                    <div style={passwordShow}>
                      <br />

                      <FormField
                        name="password"
                        label="Password"
                        needErrorMessage={true}
                      >
                        <FormSuite.Control
                          name="input"
                          type="password"
                          autoComplete="off"
                        />
                      </FormField>

                      <FormField
                        name="repassword"
                        label="Re enter password"
                        needErrorMessage={true}
                      >
                        <FormSuite.Control
                          name="input"
                          type="password"
                          autoComplete="off"
                        />
                      </FormField>
                    </div>
                  </RadioGroup>
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
        </div>
      </Modal.Body>

      <div style={loadingDisplay}>
        <Loader size="lg" backdrop content="User is adding" vertical />
      </div>
    </Modal>
  );
}

function EmailInvitePanel() {
  return (
    <Panel bordered>
      <Stack spacing={30}>
        <EmailFillIcon style={{ fontSize: "3em" }} />
        An email with a confirmation link will be sent to the provided email
        address for the user to set their own password.
      </Stack>
    </Panel>
  );
}
