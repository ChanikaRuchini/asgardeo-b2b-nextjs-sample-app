/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { InternalUser, User } from "../../../models/user/user";

interface ProfileComponentProps {
  session: Session;
}

/**
 *
 * @returns The get started interface section.
 */
export default function ProfileSectionComponent(prop: ProfileComponentProps) {
  const { session } = prop;

  const toaster = useToaster();

  const [user, setUser] = useState<InternalUser>(null);

  const fetchData = useCallback(async () => {
    const res = await controllerCallGetMe(session);
    console.log("res2", res);
    await setUser(res);
  }, [session]);

  async function controllerCallGetMe(session: Session): Promise<User | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(`/api/profile/getProfileInfo`, request);
      const usersData = await res.json();
      if (usersData) {
        const userDetails = decodeUser(usersData);
        return userDetails;
      }
      return usersData;
    } catch (err) {
      return null;
    }
  }

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

  const onDataSubmit = (response: User): void => {
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

  const onSubmit = async (values: Record<string, unknown>): Promise<void> => {
    // await controllerDecodeEditUser(
    //   session,
    //   session.userId,
    //   values.firstName as string,
    //   values.familyName as string,
    //   values.email as string
    // ).then((response) => {
    //   onDataSubmit(response);
    // });
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h2>User Profile</h2>
        </Stack>
      </Stack>
      <FlexboxGrid
        align="middle"
        justify="space-between"
        style={{ height: "100%" }}
      >
        <FlexboxGrid.Item colspan={20}>
          <div className={stylesSettings.addUserMainDiv}>
            {user ? (
              <Form
                onSubmit={onSubmit}
                validate={validate}
                initialValues={{
                  email: user.email,
                  familyName: user.familyName,
                  firstName: user.firstName,
                  username: user.username,
                }}
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
                      handleSubmit().then(form.restart);
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
                      <FormSuite.Control
                        name="input"
                        type="email"
                        readOnly={true}
                      />
                    </FormField>

                    <FormButtonToolbar
                      submitButtonText="Submit"
                      submitButtonDisabled={
                        submitting || pristine || !checkIfJSONisEmpty(errors)
                      }
                    />
                  </FormSuite>
                )}
              />
            ) : null}
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  );
}
