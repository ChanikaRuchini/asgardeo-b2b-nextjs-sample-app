import AccordianItemHeaderComponent from "../../../../common/accordianItemHeaderComponent/accordianItemHeaderComponent";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Nav, Panel, Stack } from "rsuite";
import ButtonGroupIdentityProviderDetails from "./buttonGroupIdentityProviderDetails";
import General from "./idpDetailsSections/general";
import Settings from "./idpDetailsSections/settings";
import Groups from "./idpDetailsSections/groups";
import { getImageForTheIdentityProvider } from "../../../../../utils/identityProviderUtils";
import { selectedTemplateBaesedonTemplateId } from "../../../../../utils/applicationUtils";
import { IdentityProvider } from "../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../models/api/requestMethod";

interface IdentityProviderDetailsProps {
  session: Session;
  id: string;
  fetchAllIdPs: () => Promise<void>;
}

/**
 *
 * @param prop - session, id (idp id), fetchAllIdPs (function to fetch all Idps)
 *
 * @returns idp item details component
 */
export default function IdentityProviderDetails(
  props: IdentityProviderDetailsProps
) {
  const { session, id, fetchAllIdPs } = props;

  const [idpDetails, setIdpDetails] = useState<IdentityProvider | null>();
  const [activeKeyNav, setActiveKeyNav] = useState<string>("1");

  const fetchData = useCallback(async () => {
    const res: IdentityProvider | null = await getDetailedIdentityProvider(
      session,
      id
    );

    setIdpDetails(res);
  }, [session, id]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeKeyNavSelect = (eventKey: string): void => {
    setActiveKeyNav(eventKey);
  };

  const idpDetailsComponent = (activeKey: string): JSX.Element | undefined => {
    switch (activeKey) {
      case "1":
        return (
          <General
            session={session}
            idpDetails={idpDetails!}
            fetchData={fetchData}
          />
        );
      case "2":
        return <Settings session={session} idpDetails={idpDetails!} />;
      case "3":
        return <Groups session={session} idpDetails={idpDetails!} />;
    }
  };

  return idpDetails ? (
    <Panel
      header={
        <AccordianItemHeaderComponent
          imageSrc={getImageForTheIdentityProvider(idpDetails.templateId)}
          title={idpDetails.name}
          description={idpDetails.description}
        />
      }
      eventKey={id}
      id={id}
    >
      <div style={{ marginLeft: "25px", marginRight: "25px" }}>
        <Stack direction="column" alignItems="stretch">
          <ButtonGroupIdentityProviderDetails
            session={session}
            id={id}
            fetchAllIdPs={fetchAllIdPs}
            idpDetails={idpDetails}
          />
          <IdentityProviderDetailsNav
            activeKeyNav={activeKeyNav}
            idpDetails={idpDetails}
            activeKeyNavSelect={activeKeyNavSelect}
          />
          <div>{idpDetailsComponent(activeKeyNav)}</div>
        </Stack>
      </div>
    </Panel>
  ) : null;
}

interface IdentityProviderDetailsNavProps {
  idpDetails: IdentityProvider;
  activeKeyNav: string;
  activeKeyNavSelect: (eventKey: string) => void;
}

/**
 *
 * @param prop - `idpDetails`, `activeKeyNav`, `activeKeyNavSelect`
 *
 * @returns navigation component of idp details
 */
function IdentityProviderDetailsNav(prop: IdentityProviderDetailsNavProps) {
  const { idpDetails, activeKeyNav, activeKeyNavSelect } = prop;

  const templateIdCheck = (): boolean => {
    const selectedTemplate = selectedTemplateBaesedonTemplateId(
      idpDetails.templateId
    );

    if (selectedTemplate) {
      return true;
    } else {
      return false;
    }
  };

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
          General
        </Nav.Item>

        {templateIdCheck() ? (
          <Nav.Item
            eventKey="2"
            onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
          >
            Settings
          </Nav.Item>
        ) : null}

        <Nav.Item
          eventKey="3"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          Group
        </Nav.Item>

        <div style={{ flexGrow: "1" }}></div>
      </div>
    </Nav>
  );
}
