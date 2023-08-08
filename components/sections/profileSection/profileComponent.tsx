import { FlexboxGrid, Stack, useToaster } from "rsuite";
import { Form } from "react-final-form";
import FormSuite from "rsuite/Form";
import FormField from "../../common/ui-basic-components/formField/formField";
import FormButtonToolbar from "../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import stylesSettings from "../../../styles/Settings.module.css";
import { fieldValidate } from "../../../utils/front-end-util/frontendUtil";
import { Session } from "next-auth";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../common/dialogComponent/dialogComponent";
import { useCallback, useEffect, useState } from "react";
import { checkIfJSONisEmpty } from "../../../utils/util-common/common";
import { decodeUser } from "../../../utils/userUtils";
import RequestMethod from "../../../models/api/requestMethod";
import { InternalUser, SendEditUser, User } from "../../../models/user/user";

interface ProfileComponentProps {
  session: Session;
}

/**
 *
 * @returns The user profile section.
 */
export default function ProfileSectionComponent(prop: ProfileComponentProps) {
  const { session } = prop;

  const toaster = useToaster();
  const [user, setUser] = useState<InternalUser | null>();

  const fetchData = useCallback(async () => {
    const res = await getProfileDetails(session);
    await setUser(res);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("firstName", values.firstName, errors);
    errors = fieldValidate("familyName", values.familyName, errors);
    errors = fieldValidate("email", values.email, errors);

    return errors;
  };

  const onSubmit = async (values: Record<string, unknown>): Promise<void> => {
    await editProfile(
      session,
      values.firstName as string,
      values.familyName as string,
      values.email as string
    ).then((response) => {
      onDataSubmit(response);
    });
  };

  const onDataSubmit = (response: User | null): void => {
    if (response) {
      fetchData();
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "User details edited successfully."
      );
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while editing the user. Try again."
      );
    }
  };

  async function getProfileDetails(
    session: Session
  ): Promise<InternalUser | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      console.log("aaaaaaaaaa", body);
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      console.log("bbbbbbbbbbbbbb", request);

      const res = await fetch(`/api/profile/getProfileInfo`, request);
      const usersData = await res.json();
      console.log("ccccccccccccccccccc", usersData);

      if (usersData) {
        const userDetails = decodeUser(usersData);
        return userDetails;
      }
      return usersData;
    } catch (err) {
      return null;
    }
  }

  async function editProfile(
    session: Session,
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

      const res = await fetch(`/api/profile/updateProfileInfo`, request);
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <div className={stylesSettings.tableMainPanelDiv}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h3>User Profile</h3>
          <p>Update your profile information</p>
        </Stack>
      </Stack>

      {user ? (
        <div style={{width:"50%"}}>
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
                <FormSuite.Control name="input" type="email" readOnly={true} />
              </FormField>

              <FormButtonToolbar
                submitButtonText="Submit"
                needCancel={false}
                submitButtonDisabled={
                  submitting || pristine || !checkIfJSONisEmpty(errors)
                }
              />
            </FormSuite>
          )}
        />
         </div> 
      ) : null}
     
    </div>
  );
}
