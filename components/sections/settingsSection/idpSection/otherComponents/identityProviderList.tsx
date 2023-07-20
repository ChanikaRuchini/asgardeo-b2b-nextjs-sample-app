import { Session } from "next-auth";
import React from "react";
import { FlexboxGrid, PanelGroup } from "rsuite";
import IdentityProviderDetails from "./identityProviderDetails";
import styles from "../../../../../styles/Settings.module.css";
import { IdentityProvider } from "../../../../../models/identityProvider/identityProvider";

interface IdentityProviderListProps {
  idpList: IdentityProvider[];
  fetchAllIdPs: () => Promise<void>;
  session: Session;
}

/**
 *
 * @param prop - idpDetails (List of idp's), fetchAllIdPs (function to fetch all idp's), session
 *
 * @returns List of idp's created in the organization
 */
export default function IdentityProviderList(props: IdentityProviderListProps) {
  const { idpList, fetchAllIdPs, session } = props;

  return (
    <FlexboxGrid
      style={{ height: "60vh", marginTop: "24px", width: "100%" }}
      justify="start"
      align="top"
    >
      <div className={styles.idp__list}>
        <PanelGroup accordion defaultActiveKey={idpList[0].id} bordered>
          {idpList.map(({ id }) => (
            <IdentityProviderDetails
              key={id}
              session={session}
              id={id}
              fetchAllIdPs={fetchAllIdPs}
            />
          ))}
        </PanelGroup>
      </div>
    </FlexboxGrid>
  );
}
