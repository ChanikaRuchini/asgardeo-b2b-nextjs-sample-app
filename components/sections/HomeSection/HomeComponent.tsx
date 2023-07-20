import { FlexboxGrid, Input, InputGroup, useToaster } from "rsuite";
import { Panel, Stack } from "rsuite";
import styles from "../../../styles/Settings.module.css";
import { Session } from "next-auth";
import { infoTypeDialog } from "../../common/dialogComponent/dialogComponent";
import {
  CopyTextToClipboardCallback,
  copyTheTextToClipboard,
} from "../../../utils/util-common/common";
import { getUrl } from "../../../utils/application-config-util/applicationConfigUtil";
import CopyIcon from "@rsuite/icons/Copy";
import nextImage from "../../../public/next.svg";
import Image from "next/image";
import { checkAdmin } from "../../../utils/application-config-util/applicationConfigUtil";

interface HomeComponentProps {
  session: Session;
}

/**
 *
 * @returns The get started interface section.
 */
export default function HomeComponent(prop: HomeComponentProps) {
  const { session } = prop;
  return (
    <FlexboxGrid
      align="middle"
      justify="space-between"
      style={{ height: "80%" }}
    >
      <FlexboxGrid.Item colspan={20}>
        <div className={styles.getStartedSectionComponentGetStartedTextDiv}>
          <Panel bordered>
            <Stack direction="column" spacing={20} justifyContent="center">
              <Image
                className={styles.nextLogoImage}
                src={nextImage}
                alt="next image"
              />
              {/* <Stack direction="column" spacing={10} justifyContent="center">
                <p>
                  <strong>
                    Welcome {session.user?.name.givenName} {}
                    {session.user?.name.familyName}
                  </strong>
                </p>
              </Stack> */}
              <h2>Quick Start Pack</h2>

              <p className={styles.getStartedSectionComponentGetStartedTextP}>
                This is a sample application that demostrates an B2B
                organization management flow using Asgardeo and next.js
              </p>
              <p>
                <strong>
                  Welcome {session.user?.name.givenName} {}
                  {session.user?.name.familyName} !
                </strong>
              </p>
            </Stack>
          </Panel>
        </div>
      </FlexboxGrid.Item>
      {checkAdmin(session.scope!) && (
        <FlexboxGrid.Item colspan={20} style={{ marginTop: "50px" }}>
          <Prerequisite orgId={session.orgId!} />
        </FlexboxGrid.Item>
      )}
    </FlexboxGrid>
  );
}

interface PrerequisiteProps {
  orgId: string;
}

function Prerequisite(prop: PrerequisiteProps) {
  const { orgId } = prop;

  const toaster = useToaster();

  const copyValueToClipboard = (text: string) => {
    const callback: CopyTextToClipboardCallback = () =>
      infoTypeDialog(toaster, "Text copied to clipboard");

    copyTheTextToClipboard(text, callback);
  };

  return (
    <Panel bordered>
      <p>Share this link with your users to access the Application..</p>
      <br />
      <InputGroup>
        <Input readOnly value={getUrl(orgId)} size="lg" />
        <InputGroup.Button onClick={() => copyValueToClipboard(getUrl(orgId))}>
          <CopyIcon />
        </InputGroup.Button>
      </InputGroup>
    </Panel>
  );
}
