import { Session } from "next-auth";
import { Checkbox, CheckboxGroup, Panel, Stack, useToaster } from "rsuite";
import {
  AuthenticatorInterface,
  IdentityProvider,
  IdentityProviderGroupInterface,
} from "../../../../../../../models/identityProvider/identityProvider";
import AccordianItemHeaderComponent from "../../../../../../common/accordianItemHeaderComponent/accordianItemHeaderComponent";
import { useCallback, useEffect, useState } from "react";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { Form } from "react-final-form";
import FormSuite from "rsuite/Form";
import FormField from "../../../../../../common/ui-basic-components/formField/formField";
import styles from "../../../../../../../styles/Settings.module.css";
import FormButtonToolbar from "../../../../../../common/ui-basic-components/formButtonToolbar/formButtonToolbar";
import {
  PatchGroupMapping,
  RoleGroup,
} from "../../../../../../../models/role/role";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../../common/dialogComponent/dialogComponent";

interface AuthenticatorGroupProps {
  session: Session;
  authenticator: AuthenticatorInterface;
  roleName: string;
}

/**
 *
 * @param prop - session, authenticator, roleName
 *
 * @returns Authenticator Group componet
 */
export default function AuthenticatorGroup(props: AuthenticatorGroupProps) {
  const { session, authenticator, roleName } = props;

  const [idpGroups, setIdpGroups] = useState<IdentityProviderGroupInterface[]>(
    []
  );

  const [initialAssigneGroups, setInitialAssignedGroups] = useState<string[]>(
    []
  );
  const toaster = useToaster();

  const fetchData = useCallback(async () => {
    const res: IdentityProvider = (await getDetailedIdentityProvider(
      session,
      authenticator.id
    )) as IdentityProvider;
    await setIdpGroups(res.groups!);
  }, [session]);

  const fetchIdpGroups = useCallback(async () => {
    const res: RoleGroup[] = (await getIdpAssignedGroups(
      session,
      roleName,
      authenticator.id
    )) as RoleGroup[];
    console.log("idpgroups", res);
    //  await setIdpGroups(res.groups!);
    if (res) {
      setInitialAssignedGroups(getInitialAssignedGroupNames(res));
    }
  }, [session]);

  const getInitialAssignedGroupNames = (groups: RoleGroup[]): string[] => {
    if (groups) {
      return groups.map((group) => group.name || "");
    }
    return [];
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchIdpGroups();
  }, []);

  async function getDetailedIdentityProvider(
    session: Session,
    id: string
  ): Promise<IdentityProvider | null> {
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
        `/api/settings/identityProvider/getDetailedIdentityProvider/${id}`,
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  async function getIdpAssignedGroups(
    session: Session,
    name: string,
    id: string
  ): Promise<RoleGroup[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        param: name,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch(
        `/api/settings/role/getIdpAssignedGroups/${id}`,
        request
      );
      const data = await res.json();
      return data.groups;
    } catch (err) {
      return null;
    }
  }

  const onSubmit = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    console.log("patch", getPatchgroups(values.groups.toString().split(",")));

    patchIdpGroups(session, roleName, values.groups.toString().split(","))
      .then((response) => onDataSubmit(response, form))
      .finally(() => {
        fetchIdpGroups().finally();
      });
  };
  const onDataSubmit = (response: RoleGroup[] | null, form: any): void => {
    if (response) {
      successTypeDialog(toaster, "Changes Saved Successfully.");
    } else {
      errorTypeDialog(toaster, "Error Occured. Try again.");
    }
  };

  async function patchIdpGroups(
    session: Session,
    roleName: string,
    patchGroups: string[]
  ): Promise<RoleGroup[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        param: roleName,
        patchBody: getPatchgroups(patchGroups),
        session: session,
      };

      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/role/patchIdpAssignedGroups/${authenticator.id}`,
        request
      );
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  function getPatchgroups(patchGroups: string[]): PatchGroupMapping {
    const added_groups: RoleGroup[] = [];
    const removed_groups: RoleGroup[] = [];

    for (const group of patchGroups) {
      if (!initialAssigneGroups.includes(group)) {
        added_groups.push({
          name: group,
        });
      }
    }

    for (const group of initialAssigneGroups) {
      if (!patchGroups.includes(group)) {
        removed_groups.push({
          name: group,
        });
      }
    }

    const patchBody: PatchGroupMapping = {
      added_groups: added_groups,
      removed_groups: removed_groups,
    };
    return patchBody;
  }

  return authenticator ? (
    <Panel
      header={
        <AccordianItemHeaderComponent
          title={authenticator.displayName}
          description={""}
        />
      }
    >
      <div className={styles.addUserMainDiv}>
        {idpGroups && idpGroups.length > 0 ? (
          <Form
            onSubmit={onSubmit}
            initialValues={{
              groups: initialAssigneGroups,
            }}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <FormSuite
                layout="vertical"
                onSubmit={() => {
                  handleSubmit();
                }}
                fluid
              >
                <FormField name="groups" label="" needErrorMessage={false}>
                  <FormSuite.Control name="checkbox" accepter={CheckboxGroup}>
                    {idpGroups.map((group) => (
                      <Checkbox key={group.id} value={group.name}>
                        {group.name}
                      </Checkbox>
                    ))}
                  </FormSuite.Control>
                </FormField>

                <FormButtonToolbar
                  submitButtonText="Submit"
                  needCancel={false}
                  submitButtonDisabled={submitting || pristine}
                />
              </FormSuite>
            )}
          />
        ) : (
          <Stack alignItems="center" direction="column">
            <p style={{ fontSize: 14, marginTop: "20px" }}>
              {"There are no groups available to assign to this role."}
            </p>
          </Stack>
        )}
      </div>
    </Panel>
  ) : null;
}
