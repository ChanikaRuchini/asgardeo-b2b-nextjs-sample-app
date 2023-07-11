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
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../common/dialogComponent/dialogComponent";
import { Session } from "next-auth";
import { Form } from "react-final-form";
import { Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import RequestMethod from "../../../../../models/api/requestMethod";
import { InternalUser } from "../../../../../models/user/user";

interface DeleteUserComponentProps {
  session: Session;
  open: boolean;
  onClose: () => void;
  user: InternalUser;
  getUsers: () => Promise<void>;
}

/**
 *
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 *
 * @returns Modal form to delete the group
 */
export default function DeleteUserComponent(prop: DeleteUserComponentProps) {
  const { session, open, onClose, user, getUsers } = prop;
  const toaster = useToaster();

  console.log("delete", user);

  const onGroupDelete = (response: boolean | null): void => {
    if (response) {
      successTypeDialog(toaster, "Success", "User Deleted Successfully");
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while deleting the User. Try again."
      );
    }
  };

  const onSubmit = (): void => {
    deleteUser(session, user?.id)
      .then((response) => onGroupDelete(response))
      .finally(() => {
        getUsers().finally();
      });

    onClose();
  };

  async function deleteUser(
    session: Session,
    id: string
  ): Promise<boolean | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch(`/api/settings/user/deleteUser/${id}`, request);
      const data = await res.json();

      if (data) {
        return true;
      }

      return null;
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
          <h4>Are you sure you want to delete the User?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, errors }) => (
            <FormSuite layout="vertical" onSubmit={onSubmit} fluid>
              <FormButtonToolbar
                submitButtonText="Delete"
                submitButtonDisabled={false}
                onCancel={onClose}
              />
            </FormSuite>
          )}
        />
      </Modal.Body>
    </Modal>
  );
}