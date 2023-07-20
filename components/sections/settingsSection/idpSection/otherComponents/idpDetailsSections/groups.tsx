import { Session } from "next-auth";
import {
  IdentityProvider,
  IdentityProviderClaimMappingInterface,
  IdentityProviderClaimsInterface,
} from "../../../../../../models/identityProvider/identityProvider";
import styles from "../../../../../../styles/Settings.module.css";
import RequestMethod from "../../../../../../models/api/requestMethod";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import FormSuite from "rsuite/Form";
import FormButtonToolbar from "../../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import FormField from "../../../../../common/ui-basic-components/formField/formField";
import { fieldValidate } from "../../../../../../utils/front-end-util/frontendUtil";
import GroupsList from "./groupsList";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../common/dialogComponent/dialogComponent";
import { useToaster } from "rsuite";

interface GroupsProps {
  session: Session;
  idpDetails: IdentityProvider;
}

export default function Groups(props: GroupsProps) {
  const { session, idpDetails } = props;
  const [idpClaims, setIdpClaims] =
    useState<IdentityProviderClaimsInterface | null>();
  const [groupAttribute, setGroupAttribute] = useState<string>("");
  const toaster = useToaster();

  const fetchData = useCallback(async () => {
    const res: IdentityProviderClaimsInterface | null =
      await getIdentityProviderClaims(session, idpDetails.id);

    await setIdpClaims(res);
    //await setGroupAttribute(getGroupAttribute());
  }, [session, idpDetails.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!idpClaims) {
      return;
    }

    setGroupAttribute(getGroupAttribute());
  }, [idpClaims]);

  const getGroupAttribute = (): string => {
    console.log("jjjjjjjjjj", idpClaims);
    if (idpClaims!.mappings!.length > 0) {
      const groupAttribute: IdentityProviderClaimMappingInterface | undefined =
        idpClaims!.mappings!.find(
          (claim: IdentityProviderClaimMappingInterface) => {
            return claim.localClaim.uri === "http://wso2.org/claims/groups";
          }
        );

      if (groupAttribute) {
        console.log("claim", groupAttribute.idpClaim);
        return groupAttribute.idpClaim;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  async function getIdentityProviderClaims(
    session: Session,
    id: string
  ): Promise<IdentityProviderClaimsInterface | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/identityProvider/getIdentityProviderClaims/${id}`,
        request
      );

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      return null;
    }
  }

  const onUpdate = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    console.log("groupAttribute", values.groupAttribute);
    if (values.groupAttribute.trim()) {
      const mappedAttribute: IdentityProviderClaimsInterface = {
        ...idpClaims,
        mappings: [
          {
            idpClaim: values.groupAttribute.trim(),
            localClaim: {
              uri: "http://wso2.org/claims/groups",
            },
          },
        ],
        roleClaim: {
          uri: "",
        },
        userIdClaim: {
          uri: "",
        },
      };

      idpClaims!.mappings?.forEach(
        (claim: IdentityProviderClaimMappingInterface) => {
          if (claim.localClaim.uri === "http://wso2.org/claims/username") {
            mappedAttribute!.mappings!.push(claim);
            mappedAttribute.userIdClaim = idpClaims!.userIdClaim;
          }

          if (claim.localClaim.uri === "http://wso2.org/claims/role") {
            mappedAttribute!.mappings!.push(claim);
            mappedAttribute.roleClaim = idpClaims!.roleClaim;
          }
        }
      );

      console.log("mappedAttribute", mappedAttribute);

      addIdentityProviderClaims(session, idpDetails.id, mappedAttribute)
        .then((response) => onDataSubmit(response))
        .finally(() => fetchData());
    }
  };

  const onDataSubmit = (
    response: IdentityProviderClaimsInterface | null
  ): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "Group added to the organization successfully."
      );
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the group. Try again."
      );
    }
  };

  async function addIdentityProviderClaims(
    session: Session,
    id: string,
    claims: IdentityProviderClaimsInterface
  ): Promise<IdentityProviderClaimsInterface | null> {
    try {
      const body = [claims];

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
        `/api/settings/identityProvider/updateIdentityProviderClaims/${id}`,
        request
      );

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      return null;
    }
  }

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("groupAttribute", values.groupAttribute, errors);
    return errors;
  };

  return (
    <div className={styles.addUserMainDiv}>
      <div>
        <Form
          onSubmit={onUpdate}
          validate={validate}
          initialValues={{
            groupAttribute: groupAttribute,
          }}
          render={({ handleSubmit, submitting, pristine, errors }) => (
            <FormSuite
              layout="vertical"
              className={styles.addUserForm}
              onSubmit={() => handleSubmit()}
              fluid
            >
              <FormField
                name="groupAttribute"
                label="Group attribute"
                helperText="The attribute from the Connection that will be mapped to the organization's group attribute. This should be defined for the attribute from the Connection to be returned."
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
      <GroupsList session={session} idpId={idpDetails.id} />
    </div>
  );
}
