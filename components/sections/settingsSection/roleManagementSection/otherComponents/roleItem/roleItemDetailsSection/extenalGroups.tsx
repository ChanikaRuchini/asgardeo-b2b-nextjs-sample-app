import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, FlexboxGrid, PanelGroup, Stack, useToaster } from "rsuite";
import styles from "../../../../../../../styles/Settings.module.css";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { Role } from "../../../../../../../models/role/role";
import {
  Application,
  ApplicationAuthenticatorInterface,
  ApplicationList,
  AuthenticationSequenceStep,
  AuthenticationSequenceStepOption,
} from "../../../../../../../models/application/application";
import { checkIfJSONisEmpty } from "../../../../../../../utils/util-common/common";
import { AuthenticatorInterface } from "../../../../../../../models/identityProvider/identityProvider";
import AuthenticatorGroup from "./authenticatorGroup";

interface ExternalGroupProps {
  session: Session;
  roleDetails: Role;
}

/**
 *
 * @param prop - session, roleDetails
 *
 * @returns The external groups section of role details
 */
export default function ExternalGroups(props: ExternalGroupProps) {
  const { session, roleDetails } = props;

  const toaster = useToaster();

  const [allApplications, setAllApplications] = useState<ApplicationList>();
  const [attributeStepAuthenticators, setAttributeStepAuthenticators] =
    useState<AuthenticationSequenceStepOption[]>([]);
  const [authenticatorGroups, setAuthenticatorGroups] = useState<
    AuthenticatorInterface[]
  >([]);
  const [openListAppicationModal, setOpenListAppicationModal] =
    useState<boolean>(false);

  const [federatedAuthenticators, setFederatedAuthenticators] = useState<
    AuthenticatorInterface[]
  >([]);

  const fetchData = useCallback(async () => {
    const res: ApplicationList = (await listCurrentApplication(
      session
    )) as ApplicationList;

    await setAllApplications(res);
  }, [session, openListAppicationModal]);

  const fetchApplicatioDetails = useCallback(async () => {
    if (
      !checkIfJSONisEmpty(allApplications) &&
      allApplications!.totalResults !== 0
    ) {
      await getApplication(session, allApplications!.applications[0].id).then(
        (response: Application | null) => {
          const attributeStepId: number =
            response?.authenticationSequence?.attributeStepId!;
          const attributeStep: AuthenticationSequenceStep =
            response?.authenticationSequence?.steps?.find((step: any) => {
              return step.id === attributeStepId;
            })!;
          setAttributeStepAuthenticators(attributeStep?.options);
        }
      );
    }
  }, [session, allApplications]);

  async function listCurrentApplication(
    session: Session
  ): Promise<ApplicationList | null> {
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
        "/api/settings/application/listCurrentApplication",
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  async function getApplication(
    session: Session,
    id: string
  ): Promise<Application | null> {
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
        `/api/settings/application/getApplication/${id}`,
        request
      );
      const data = await res.json();
      console.log("data", data);

      return data;
    } catch (err) {
      return null;
    }
  }

  const fetchFederatedAuthenticators = useCallback(async () => {
    const res = await getFederatedAuthenticators(session).then(
      (response: AuthenticatorInterface[] | null) => {
        return Promise.resolve(
          response!.filter((authenticator: AuthenticatorInterface) => {
            return (
              authenticator.type === "FEDERATED" &&
              authenticator.name !== "Organization Login"
            );
          })
        );
      }
    );
    console.log("fed", res);

    setFederatedAuthenticators(res!);
  }, [session, attributeStepAuthenticators]);

  const fetchAutheticatorGroups = () => {
    // Filter the federated autheticators that are in the attribute step
    const filteredFederatedAuthenticators: AuthenticatorInterface[] =
      federatedAuthenticators.filter(
        (federatedAuthenticator: AuthenticatorInterface) => {
          return attributeStepAuthenticators!.find(
            (attributeStepAuthenticator: ApplicationAuthenticatorInterface) => {
              return (
                federatedAuthenticator.name === attributeStepAuthenticator.idp
              );
            }
          );
        }
      );
    setAuthenticatorGroups(filteredFederatedAuthenticators);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchApplicatioDetails();
  }, [fetchApplicatioDetails]);

  useEffect(() => {
    fetchFederatedAuthenticators();
  }, [fetchFederatedAuthenticators]);

  useEffect(() => {
    if (
      federatedAuthenticators.length <= 0 ||
      attributeStepAuthenticators!.length <= 0
    ) {
      return;
    }

    fetchAutheticatorGroups();
  }, [federatedAuthenticators, attributeStepAuthenticators]);

  async function getFederatedAuthenticators(
    session: Session
  ): Promise<AuthenticatorInterface[] | null> {
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
        `/api/settings/identityProvider/getAuthenticators`,
        request
      );
      const data = await res.json();

      console.log("authetictors", data);

      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <Container>
      {authenticatorGroups && authenticatorGroups.length > 0 ? (
        <FlexboxGrid
          style={{ height: "60vh", marginTop: "24px", width: "100%" }}
          justify="start"
          align="top"
        >
          <div className={styles.idp__list}>
            <PanelGroup accordion bordered>
              {authenticatorGroups.map((authenticator, index) => (
                <AuthenticatorGroup
                  session={session}
                  authenticator={authenticator}
                  roleName={roleDetails.name}
                  key={index}
                />
              ))}
            </PanelGroup>
          </div>
        </FlexboxGrid>
      ) : (
        <Stack alignItems="center" direction="column">
          <p style={{ fontSize: 14, marginTop: "50px" }}>
            {"There are no roles created for the organization."}
          </p>
        </Stack>
      )}
    </Container>
  );
}
