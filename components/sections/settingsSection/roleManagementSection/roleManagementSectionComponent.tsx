import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, FlexboxGrid, PanelGroup, Stack } from "rsuite";
import RoleItem from "./otherComponents/roleItem/roleItem";
import styles from "../../../../styles/Settings.module.css";
import RequestMethod from "../../../../models/api/requestMethod";
import { Role } from "../../../../models/role/role";
import { ApplicationList } from "../../../../models/application/application";

interface RoleManagementSectionComponentProps {
  session: Session;
}

/**
 *
 * @param prop - session
 *
 * @returns The role management interface section.
 */
export default function RoleManagementSectionComponent(
  props: RoleManagementSectionComponentProps
) {
  const { session } = props;

  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [applicationId, setApplicationId] = useState<string>();

  const fetchAllRoles = useCallback(async () => {
    const res = await listAllRoles(session);
    if (res) {
      setRolesList(res);
    } else {
      setRolesList([]);
    }
  }, [session, applicationId]);

  async function listAllRoles(session: Session): Promise<Role[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
        appId: applicationId,
      };
      console.log("body", body);
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch("/api/settings/role/listAllRoles", request);
      const data = await res.json();

      if (data) {
        return data.roles;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  const fetchData = useCallback(async () => {
    const res: ApplicationList = (await listCurrentApplication(
      session
    )) as ApplicationList;

    console.log("id", res.applications[0].id);
    await setApplicationId(res.applications[0].id);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <div className={styles.mainPanelDiv}>
      <Container>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>Role Management</h3>
            <p>Manage Application roles here.</p>
          </Stack>
        </Stack>

        {rolesList && rolesList.length > 0 ? (
          <FlexboxGrid
            style={{ marginTop: "10px" }}
            justify="start"
            align="top"
          >
            <div className={styles.idp__list}>
              <PanelGroup accordion bordered>
                {rolesList.map((role, index) => (
                  <RoleItem
                    session={session}
                    role={role}
                    appId={applicationId!}
                    key={index}
                  />
                ))}
              </PanelGroup>
            </div>
          </FlexboxGrid>
        ) : (
          <FlexboxGrid
            style={{ height: "60vh", marginTop: "24px", width: "100%" }}
            justify="center"
            align="middle"
          >
            <Stack alignItems="center" direction="column">
              <p style={{ fontSize: 14, marginTop: "20px" }}>
                {"There are no roles created for the organization."}
              </p>
            </Stack>
          </FlexboxGrid>
        )}
      </Container>
    </div>
  );
}
