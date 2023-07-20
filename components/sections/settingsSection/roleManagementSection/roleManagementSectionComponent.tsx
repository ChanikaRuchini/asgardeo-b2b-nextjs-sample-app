import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, FlexboxGrid, PanelGroup, Stack } from "rsuite";
import RoleItem from "./otherComponents/roleItem/roleItem";
import styles from "../../../../styles/Settings.module.css";
import RequestMethod from "../../../../models/api/requestMethod";
import { Role } from "../../../../models/role/role";

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

  const fetchAllRoles = useCallback(async () => {
    const res = await listAllRoles(session);
    if (res) {
      setRolesList(res);
    } else {
      setRolesList([]);
    }
  }, [session]);

  async function listAllRoles(session: Session): Promise<Role[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };

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

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h3>Role Management</h3>
          <p>Manage Application roles here.</p>
        </Stack>
      </Stack>

      {rolesList && rolesList.length > 0 ? (
        <FlexboxGrid
          style={{ marginTop: "24px", width: "100%" }}
          justify="start"
          align="top"
        >
          <div className={styles.idp__list}>
            <PanelGroup accordion bordered>
              {rolesList.map((role, index) => (
                <RoleItem session={session} role={role} key={index} />
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
  );
}
