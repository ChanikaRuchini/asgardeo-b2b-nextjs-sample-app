import FormButtonToolbar from "../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import FormField from "../../../../common/ui-basic-components/formField/formField";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../common/dialogComponent/dialogComponent";
import { checkIfJSONisEmpty } from "../../../../../utils/util-common/common";
import { fieldValidate } from "../../../../../utils/front-end-util/frontendUtil";
import { Session } from "next-auth";
import { Form } from "react-final-form";
import { Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import stylesSettings from "../../../../../styles/Settings.module.css";
import RequestMethod from "../../../../../models/api/requestMethod";
import {
  InternalUser,
  SendEditUser,
  User,
} from "../../../../../models/user/user";
import { ApiError } from "../../../../../utils/api-util/apiErrors";

interface EditUserComponentProps {
  session: Session;
  user: InternalUser;
  open: boolean;
  onClose: () => void;
}

/**
 *
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 *
 * @returns Modal form to edit the user
 */
export default function EditUserComponent(prop: EditUserComponentProps) {
  const { session, user, open, onClose } = prop;

  const toaster = useToaster();

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("firstName", values.firstName, errors);
    errors = fieldValidate("familyName", values.familyName, errors);
    errors = fieldValidate("email", values.email, errors);
    errors = fieldValidate("username", values.username, errors);

    return errors;
  };

  const onDataSubmit = (response: User | ApiError | null, form: any): void => {
    if (response) {
      if (response.error) {
        errorTypeDialog(toaster, "Error Occured", response.msg as string);
      } else {
        successTypeDialog(
          toaster,
          "Changes Saved Successfully",
          "User details edited successfully."
        );
        form.restart();
        onClose();
      }
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while editing the user. Try again."
      );
    }
  };

  const onSubmit = async (
    values: Record<string, unknown>,
    form: any
  ): Promise<void> => {
    await editUser(
      session,
      user.id,
      values.firstName as string,
      values.familyName as string,
      values.email as string
    ).then((response) => {
      onDataSubmit(response, form);
    });
  };

  async function editUser(
    session: Session,
    id: string,
    firstName: string,
    familyName: string,
    email: string
  ): Promise<User | null> {
    try {
      const editUserEncode: SendEditUser = {
        Operations: [
          {
            op: "replace",
            value: {
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
              userName: "DEFAULT/" + email,
            },
          },
        ],
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      };

      const body = {
        orgId: session ? session.orgId : null,
        param: editUserEncode,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(`/api/settings/user/editUser/${id}`, request);
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
        <Modal.Title>
          <h4>Edit User</h4>
        </Modal.Title>
        <p>{`Edit user ${user.username}`}</p>
      </Modal.Header>
      <Modal.Body>
        <div className={stylesSettings.addUserMainDiv}>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            initialValues={{
              email: user.email,
              familyName: user.familyName,
              firstName: user.firstName,
              username: user.username,
            }}
            render={({ handleSubmit, form, submitting, pristine, errors }) => (
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
                  helperText="First name of the user."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" />
                </FormField>

                <FormField
                  name="familyName"
                  label="Family Name"
                  helperText="Family name of the user."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" />
                </FormField>

                <FormField
                  name="email"
                  label="Email (Username)"
                  helperText="Email of the user."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" type="email" />
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
    </Modal>
  );
}
