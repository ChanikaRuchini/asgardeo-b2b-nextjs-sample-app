import Image from "next/image";
import SideNavItem from "../../../models/sideNav/sideNavItem";
import SideNavList from "../../../models/sideNav/sideNavList";
import { hideBasedOnScopes } from "../../../utils/front-end-util/frontendUtil";
import { Navbar, Nav, Stack, Popover, Dropdown, Avatar } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "../../../styles/common.module.css";
import logo from "../../../images/asgardeo-logo-transparent.png";
import { Session } from "next-auth";

export interface SidenavComponentProps {
  session: Session;
  sideNavData: SideNavList;
  activeKeySideNav: string | undefined;
  activeKeySideNavSelect: (event: string | undefined) => void;
  setSignOutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBarComponent(prop: SidenavComponentProps) {
  const {
    session,
    sideNavData,
    activeKeySideNav,
    activeKeySideNavSelect,
    setSignOutModalOpen,
  } = prop;

  const sideNavConfigList: SideNavList = sideNavData;
  const signOutOnClick = () => setSignOutModalOpen(true);

  return (
    <div className={styles["navDiv"]}>
      <Navbar appearance="default" className={styles["navBar"]}>
        <Navbar.Brand href="https://wso2.com/asgardeo/">
          <Image src={logo} width={100} alt="logo" />
        </Navbar.Brand>
        <Nav activeKey={activeKeySideNav}>
          {sideNavConfigList.items.map((item: SideNavItem) => {
            if (item.items) {
              return (
                <Nav.Menu
                  className={styles["navItem"]}
                  eventKey={item.eventKey}
                  title={item.title}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(session.scope!, item.type, item.items)
                      : {}
                  }
                  key={item.eventKey}
                >
                  {item.items.map((item) => (
                    <Nav.Item
                      key={item.eventKey}
                      eventKey={item.eventKey}
                      onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}
                      style={
                        item.hideBasedOnScope
                          ? hideBasedOnScopes(
                              session.scope!,
                              item.type,
                              item.items,
                              item.scopes
                            )
                          : {}
                      }
                    >
                      <Stack spacing={10}>{item.title}</Stack>
                    </Nav.Item>
                  ))}
                </Nav.Menu>
              );
            } else {
              return (
                <Nav.Item
                  key={item.eventKey}
                  eventKey={item.eventKey}
                  onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(
                          session.scope!,
                          item.type,
                          item.items,
                          item.scopes
                        )
                      : {}
                  }
                >
                  <Stack spacing={10}>{item.title}</Stack>
                </Nav.Item>
              );
            }
          })}
        </Nav>
        <Nav pullRight>
          <Nav.Menu
            style={{ paddingRight: "15px" }}
            title={
              <p style={{ color: "black" }}>{session.user?.name.givenName!}</p>
            }
            icon={
              <Avatar
                circle
                src="https://avatars.githubusercontent.com/u/15609339"
                alt="@hiyangguo"
                style={{ marginRight: "20px" }}
              />
            }
          >
            <Nav.Item
              style={{ paddingRight: "85px" }}
              eventKey={"profile"}
              onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}
            >
              <Stack spacing={10}>{"Profile"}</Stack>
            </Nav.Item>
            <Nav.Item
              eventKey={"signOut"}
              onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}
            >
              <Stack spacing={10} className={styles.signout}>
                {
                  <a href="#/" onClick={() => signOutOnClick()}>
                    Sign out
                  </a>
                }
              </Stack>
            </Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBarComponent;
