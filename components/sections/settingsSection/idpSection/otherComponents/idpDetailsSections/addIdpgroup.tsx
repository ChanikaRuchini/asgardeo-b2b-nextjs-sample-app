import { useEffect, useState } from "react";
import { Modal, Table, useToaster } from "rsuite";
import { fieldValidate } from "../../../../../../utils/front-end-util/frontendUtil";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../common/dialogComponent/dialogComponent";
import { Form } from "react-final-form";
import FormSuite from "rsuite/Form";
import FormField from "../../../../../common/ui-basic-components/formField/formField";
import FormButtonToolbar from "../../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import RequestMethod from "../../../../../../models/api/requestMethod";
import { Session } from "next-auth";
import { IdentityProviderGroupInterface } from "../../../../../../models/identityProvider/identityProvider";
import styles from "../../../../../../styles/Settings.module.css";

interface AddIdpGroupComponentProps {
  session: Session;
  id: string;
  groups: IdentityProviderGroupInterface[] | [];
  open: boolean;
  onClose: () => void;
}

/**
 *
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 *
 * @returns Modal to add a group.
 */
export default function AddIdpGroupComponent(props: AddIdpGroupComponentProps) {
  const { session, id, groups, open, onClose } = props;

  const { Column, HeaderCell, Cell } = Table;

  const toaster = useToaster();

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("groupName", values.groupName, errors);

    return errors;
  };

  const onDataSubmit = (
    response: IdentityProviderGroupInterface[] | null,
    form: any
  ): void => {
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

  const onSubmit = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    const newIdpGroupList: IdentityProviderGroupInterface[] = [
      ...groups,
      {
        id: "",
        name: values.groupName.trim(),
      },
    ];

    // Check if the group name is aleady present in the groupsList
    if (
      groups.some(
        (group: IdentityProviderGroupInterface) =>
          group.name === values.groupName.trim()
      )
    ) {
      errorTypeDialog(toaster, "Error Occured", "Group Name already exists.");

      return;
    }

    addIdentityProviderGroups(session, id, newIdpGroupList).then((response) =>
      onDataSubmit(response, form)
    );
    onClose();
  };

  async function addIdentityProviderGroups(
    session: Session,
    id: string,
    groups: IdentityProviderGroupInterface[]
  ): Promise<IdentityProviderGroupInterface[] | null> {
    try {
      const body = [groups];

      const requestBody = {
        orgId: session ? session.orgId : null,
        param: body,
        session: session,
      };
      const request = {
        body: JSON.stringify(requestBody),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/identityProvider/updateIdentityProviderGroups/${id}`,
        request
      );

      const data = await res.json();
      console.log(data);
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

                <br />
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
