import FormButtonToolbar from "../../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import FormField from "../../../../../common/ui-basic-components/formField/formField";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../common/dialogComponent/dialogComponent";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../../../utils/front-end-util/frontendUtil";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../styles/Settings.module.css";
import { fieldValidate } from "../../../../../../utils/front-end-util/frontendUtil";
import { IdentityProvider } from "../../../../../../models/identityProvider/identityProvider";
import PatchOperation from "../../../../../../models/patchBody/patchOperation";
import RequestMethod from "../../../../../../models/api/requestMethod";

interface GeneralProps {
  fetchData: () => Promise<void>;
  session: Session;
  idpDetails: IdentityProvider | null;
}

/**
 *
 * @param prop - fetchData (function to fetch data after form is submitted), session, idpDetails
 *
 * @returns The general section of an idp
 */
export default function General(props: GeneralProps) {
  const { fetchData, session, idpDetails } = props;

  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

  const toaster: Toaster = useToaster();

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("name", values.name, errors);
    errors = fieldValidate("description", values.description, errors);

    return errors;
  };

  const onDataSubmit = (response: IdentityProvider | null, form: any): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "Idp updated successfully."
      );
      fetchData();
      form.restart();
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while updating the Idp. Try again."
      );
    }
  };

  const onUpdate = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    patchGeneralSettingsIdp(
      session,
      values.name,
      values.description,
      idpDetails!.id
    )
      .then((response) => onDataSubmit(response, form))
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
  };

  async function patchGeneralSettingsIdp(
    session: Session,
    name: string,
    description: string,
    idpId: string
  ): Promise<IdentityProvider | null> {
    try {
      const body: PatchOperation[] = [
        { operation: "REPLACE", path: "/description", value: description },
        { operation: "REPLACE", path: "/isPrimary", value: false },
        { operation: "REPLACE", path: "/name", value: name },
      ];
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
        `/api/settings/identityProvider/patchGeneralSettingsIdp/${idpId}`,
        request
      );
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <div className={styles.addUserMainDiv}>
      <div>
        <Form
          onSubmit={onUpdate}
          validate={validate}
          initialValues={{
            description: idpDetails!.description,
            name: idpDetails!.name,
          }}
          render={({ handleSubmit, form, submitting, pristine, errors }) => (
            <FormSuite
              layout="vertical"
              className={styles.addUserForm}
              onSubmit={() => {
                handleSubmit();
              }}
              fluid
            >
              <FormField name="name" label="Name" needErrorMessage={true}>
                <FormSuite.Control name="input" />
              </FormField>

              <FormField
                name="description"
                label="Description"
                needErrorMessage={true}
              >
                <FormSuite.Control name="input" />
              </FormField>

              <FormButtonToolbar
                submitButtonText="Update"
                submitButtonDisabled={
                  submitting || pristine || !checkIfJSONisEmpty(errors)
                }
                needCancel={false}
              />
            </FormSuite>
          )}
        />
      </div>

      <div style={loadingDisplay}>
        <Loader size="lg" backdrop content="User is adding" vertical />
      </div>
    </div>
  );
}
