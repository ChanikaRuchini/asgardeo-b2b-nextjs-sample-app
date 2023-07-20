import { Input, InputGroup, useToaster } from "rsuite";
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
    <>
      <div className={styles.getStartedSectionComponentGetStartedTextDiv}>
        <Panel>
          <Stack direction="column" spacing={10} justifyContent="center">
            <Image
              className={styles.nextLogoImage}
              src={nextImage}
              alt="next image"
            />
            <h3>Quick Start Pack</h3>

            <p className={styles.getStartedSectionComponentGetStartedTextP}>
              This is a sample application that demostrates an B2B organization
              management flow using Asgardeo and next.js
            </p>
            <p>
              <strong>
                Hello {session.user?.name.givenName} {}
                {session.user?.name.familyName} !
              </strong>
            </p>
          </Stack>
        </Panel>
      </div>
      {checkAdmin(session.scope!) && <AdminSection orgId={session.orgId!} />}
    </>
  );
}

interface AdminSectionProps {
  orgId: string;
}

function AdminSection(prop: AdminSectionProps) {
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
