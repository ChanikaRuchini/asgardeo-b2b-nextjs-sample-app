import InfoOutlineIcon from "@rsuite/icons/InfoOutline";
import { infoTypeDialog } from "../../../../../../common/dialogComponent/dialogComponent";
import { CopyTextToClipboardCallback } from "../../../../../../../utils/util-common/common";
import { copyTheTextToClipboard } from "../../../../../../../utils/util-common/common";
import CopyIcon from "@rsuite/icons/Copy";
import React from "react";
import { Field } from "react-final-form";
import { Form, InputGroup, Stack, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import {
  IdentityProviderFederatedAuthenticatorProperty,
  IdentityProviderTemplate,
  IdentityProviderTemplateModel,
  IdentityProviderTemplateModelAuthenticatorProperty,
} from "../../../../../../../models/identityProvider/identityProvider";
import { selectedTemplateBaesedonTemplateId } from "../../../../../../../utils/applicationUtils";

interface SettingsFormSelectionProps {
  templateId: string;
  federatedAuthenticators: IdentityProviderFederatedAuthenticatorProperty[];
}

/**
 *
 * @param prop - templateId, federatedAuthenticators (federatedAuthenticators as a list)
 *
 * @returns Component of the settings section of the idp interface
 */
export default function SettingsFormSelection(
  props: SettingsFormSelectionProps
) {
  const { templateId, federatedAuthenticators } = props;

  const toaster: Toaster = useToaster();

  const propList = ():
    | IdentityProviderTemplateModelAuthenticatorProperty[]
    | null => {
    const selectedTemplate: IdentityProviderTemplate | null =
      selectedTemplateBaesedonTemplateId(templateId);
    console.log("template", selectedTemplate);
    if (selectedTemplate) {
      return selectedTemplate.idp!.federatedAuthenticators!.authenticators[0]
        .properties!;
    } else {
      return null;
    }
  };

  console.log("federatedAuthenticators", federatedAuthenticators);

  console.log("propList", propList);

  const selectedValue = (key: string): string => {
    const keyFederatedAuthenticator = federatedAuthenticators.filter(
      (obj) => obj.key === key
    )[0];

    return keyFederatedAuthenticator ? keyFederatedAuthenticator.value : "";
  };

  const copyValueToClipboard = (text: string): void => {
    const callback: CopyTextToClipboardCallback = () =>
      infoTypeDialog(toaster, "Text copied to clipboard");

    copyTheTextToClipboard(text, callback);
  };

  return (
    <>
      {propList() ? (
        propList()!.map((property) => {
          return (
            <Field
              id={property.key}
              key={property.key}
              name={property.key!}
              initialValue={selectedValue(property.key!)}
              render={({ input, meta }) => (
                <FormSuite.Group controlId={property.key}>
                  <FormSuite.ControlLabel>
                    <b>{property.displayName}</b>
                  </FormSuite.ControlLabel>
                  <InputGroup inside style={{ width: "100%" }}>
                    <FormSuite.Control
                      readOnly={property.readOnly ? property.readOnly : false}
                      {...input}
                    />

                    {property.readOnly ? (
                      <InputGroup.Button
                        onClick={() =>
                          copyValueToClipboard(selectedValue(property.key!))
                        }
                      >
                        <CopyIcon />
                      </InputGroup.Button>
                    ) : null}
                  </InputGroup>
                  <Stack style={{ marginTop: "1px" }}>
                    <InfoOutlineIcon
                      style={{ marginLeft: "1px", marginRight: "5px" }}
                    />
                    <Form.HelpText>{property.description}</Form.HelpText>
                  </Stack>

                  {meta.error && meta.touched && (
                    <FormSuite.ErrorMessage show={true}>
                      {meta.error}
                    </FormSuite.ErrorMessage>
                  )}
                </FormSuite.Group>
              )}
            />
          );
        })
      ) : (
        <p>Access the console to edit this connection</p>
      )}
    </>
  );
}
