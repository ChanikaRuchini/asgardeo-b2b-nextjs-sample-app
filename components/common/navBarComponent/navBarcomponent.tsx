import Image from "next/image";
import navItem from "../../../models/nav/navItem";
import navList from "../../../models/nav/navList";
import { hideBasedOnScopes } from "../../../utils/front-end-util/frontendUtil";
import { Navbar, Nav, Avatar, Stack } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "../../../styles/common.module.css";
import logo from "../../../images/asgardeo-logo-transparent.png";
import NavData from "../../../components/common/navBarComponent/data/nav.json";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signout } from "../../../utils/authorization-config-util/authorizationConfigUtil";

export interface NavComponentProps {
  activeKeyNav: string | undefined;
  activeKeyNavSelect: (event: string | undefined) => void;
}

export function NavBarComponent(prop: NavComponentProps) {
  const { activeKeyNav, activeKeyNavSelect } = prop;
  const { data: session, status } = useSession();
  const NavConfigList: navList = NavData;
  const router = useRouter();

  const signOutOnClick = (
    eventKey: string,
    event: React.SyntheticEvent
  ): void => {
    signout(session!);
  };

  const handleNavItemSelect = (
    eventKey: string,
    event: React.SyntheticEvent
  ) => {
    // Find the selected item based on the eventKey
    const selectedItem = findItemByEventKey(NavConfigList.items, eventKey);
    if (selectedItem) {
      // Construct the full route and navigate
      const fullRoute = getFullRoute(selectedItem, session);
      router.push(fullRoute);
    }
  };

  // Function to find an item by eventKey in the items array
  const findItemByEventKey = (items: any[], eventKey: string): any => {
    for (const item of items) {
      if (item.eventKey === eventKey) {
        return item;
      }

      if (item.items) {
        const nestedItem = findItemByEventKey(item.items, eventKey);
        if (nestedItem) {
          return nestedItem;
        }
      }
    }
    return null;
  };

  // Function to construct the full route based on the selectedItem and session data
  const getFullRoute = (selectedItem: any, session: any) => {
    return `/o/${session.orgId}/${selectedItem.route}`;
  };

  const routeToProfile = (
    eventKey: string,
    event: React.SyntheticEvent
  ): void => {
    router.push(`/o/${session!.orgId}/profile`);
  };

  return (
    <div className={styles["navDiv"]}>
      <Navbar appearance="default" className={styles["navBar"]}>
        <Navbar.Brand href="https://wso2.com/asgardeo/">
          <Image src={logo} width={100} alt="logo" />
        </Navbar.Brand>
        <Nav activeKey={activeKeyNav}>
          {NavConfigList.items.map((item: navItem) => {
            if (item.items) {
              return (
                <Nav.Menu
                  className={styles["navItem"]}
                  eventKey={item.eventKey}
                  title={item.title}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(
                          session?.scope!,
                          item.type,
                          item.items
                        )
                      : {}
                  }
                  key={item.eventKey}
                >
                  {item.items.map((item) => (
                    <Nav.Item
                      key={item.eventKey}
                      eventKey={item.eventKey}
                      onSelect={(eventKey, event) => {
                        handleNavItemSelect(eventKey!, event);
                        activeKeyNavSelect(eventKey!);
                      }}
                      style={
                        item.hideBasedOnScope
                          ? hideBasedOnScopes(
                              session?.scope!,
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
                  onSelect={(eventKey, event) => {
                    handleNavItemSelect(eventKey!, event);
                    activeKeyNavSelect(eventKey!);
                  }}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(
                          session!.scope!,
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
              <p style={{ color: "black" }}>{session?.user?.name.givenName!}</p>
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
              onSelect={(eventKey, event) => {
                routeToProfile(eventKey!, event);
                activeKeyNavSelect(eventKey!);
              }}
            >
              <Stack spacing={10}>{"Profile"}</Stack>
            </Nav.Item>
            <Nav.Item
              eventKey={"signOut"}
              onSelect={(eventKey, event) => signOutOnClick(eventKey!, event)}
            >
              <Stack spacing={10} className={styles.signout}>
                {"Sign out"}
              </Stack>
            </Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBarComponent;
