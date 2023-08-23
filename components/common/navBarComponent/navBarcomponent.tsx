import Image from "next/image";
import SideNavItem from "../../../models/sideNav/sideNavItem";
import SideNavList from "../../../models/sideNav/sideNavList";
import { hideBasedOnScopes } from "../../../utils/front-end-util/frontendUtil";
import { Navbar, Nav, Stack, Popover, Dropdown, Avatar } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "../../../styles/common.module.css";
import logo from "../../../public/asgardeo-logo-transparent.png";
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
  const speaker = (
    <Popover className={styles.signout} arrow={false}>
      <a href="#/" onClick={() => signOutOnClick()}>
        Sign out
      </a>
      {/* <Button
        style={{ borderRadius: "50px", width: "100%" }}
        size="xs"
        appearance="ghost"
        onClick={signOutOnClick}
      >
        Log Out
      </Button> */}
    </Popover>
  );

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
        <Nav pullRight style={{ marginRight: "50px", paddingRight: "50px" }}>
          <Nav.Menu
            // className={styles["navItem"]}
            // title={
            //   <p style={{ marginRight: "10px", color: "black" }}>
            //     {session.user?.name.givenName! + session.user?.name.familyName}
            //   </p>
            // }
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
              style={{ paddingRight: "50px" }}
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

          {/* <Whisper placement="bottomStart" trigger="click" speaker={speaker1}>
              <Button>File</Button>
            </Whisper> */}

          {/* <Whisper
              placement="bottom"
              trigger="click"
              controlId="control-id-click"
              speaker={<CustomDropdown />}
            >
              <Avatar
                circle
                src="https://avatars.githubusercontent.com/u/15609339"
                alt="@hiyangguo"
                style={{ marginRight: "20px" }}
              />
            </Whisper> */}
          {/* <Dropdown
              onSelect={() => {}}
              renderTitle={(children) => (
                <Avatar
                  circle
                  src="https://avatars.githubusercontent.com/u/15609339"
                  alt="@hiyangguo"
                  style={{ marginRight: "20px" }}
                >
                  {children}
                </Avatar>
              )}
            >
              <CustomDropdown />
            </Dropdown> */}
          {/* </Nav.Item> */}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBarComponent;
