import AccordianItemHeaderComponent from "../../../../../common/accordianItemHeaderComponent/accordianItemHeaderComponent";
import { Session } from "next-auth";
import { useState } from "react";
import { Nav, Panel } from "rsuite";
import Permission from "./roleItemDetailsSection/permission";
import Groups from "./roleItemDetailsSection/groups";
import { Role } from "../../../../../../models/role/role";
import ExternalGroups from "./roleItemDetailsSection/extenalGroups";

interface RoleItemNavProps {
  activeKeyNav: string;
  activeKeyNavSelect: (eventKey: string) => void;
}

interface RoleItemProps {
  session: Session;
  role: Role;
}

/**
 *
 * @param prop - session, role(roledetails)
 *
 * @returns role item component.
 */
export default function RoleItem(props: RoleItemProps) {
  const { session, role } = props;

  const [activeKeyNav, setActiveKeyNav] = useState<string>("1");

  const activeKeyNavSelect = (eventKey: string): void => {
    setActiveKeyNav(eventKey);
  };

  const roleItemDetailsComponent = (activeKey: string): JSX.Element | null => {
    switch (activeKey) {
      case "1":
        return <Permission permissions={role.permissions} />;
      case "2":
        return <Groups session={session} roleDetails={role} />;
      case "3":
        return <ExternalGroups session={session} roleDetails={role} />;
      default:
        return null;
    }
  };

  return role ? (
    <Panel
      header={
        <AccordianItemHeaderComponent
          title={role.name}
          description={`Application role ${role.name} details`}
        />
      }
    >
      <div style={{ marginLeft: "25px", marginRight: "25px" }}>
        <RoleItemNav
          activeKeyNav={activeKeyNav}
          activeKeyNavSelect={activeKeyNavSelect}
        />
        <div>{roleItemDetailsComponent(activeKeyNav)}</div>
      </div>
    </Panel>
  ) : null;
}

/**
 *
 * @param prop - `activeKeyNav`, `activeKeyNavSelect`
 *
 * @returns navigation bar of role item section
 */
function RoleItemNav(props: RoleItemNavProps) {
  const { activeKeyNav, activeKeyNavSelect } = props;

  return (
    <Nav
      appearance="subtle"
      activeKey={activeKeyNav}
      style={{ marginBottom: 10, marginTop: 15 }}
    >
      <div
        style={{
          alignItems: "stretch",
          display: "flex",
        }}
      >
        <Nav.Item
          eventKey="1"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          Permissions
        </Nav.Item>

        <Nav.Item
          eventKey="2"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          Groups
        </Nav.Item>
        <Nav.Item
          eventKey="3"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          External Groups
        </Nav.Item>
      </div>
    </Nav>
  );
}
