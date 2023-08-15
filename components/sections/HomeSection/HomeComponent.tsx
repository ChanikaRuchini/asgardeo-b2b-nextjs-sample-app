import { Avatar, FlexboxGrid, Input, InputGroup, useToaster } from "rsuite";
import { Panel, Stack } from "rsuite";
import styles from "../../../styles/Home.module.css";
import { Session } from "next-auth";
import { infoTypeDialog } from "../../common/dialogComponent/dialogComponent";
import {
  CopyTextToClipboardCallback,
  copyTheTextToClipboard,
} from "../../../utils/util-common/common";
import { getUrl } from "../../../utils/application-config-util/applicationConfigUtil";
import CopyIcon from "@rsuite/icons/Copy";
import Image from "next/image";
import UserGuide from "../../../public/user.png";
import Github from "../../../public/github.png";
import Docs from "../../../public/docs.png";

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
    <div className={styles.mainDiv}>
      <div className={styles.getStartedSectionComponentGetStartedTextDiv}>
        <Panel>
          <Stack direction="column" spacing={10} justifyContent="center">
            <Avatar
              circle
              size="lg"
              src="https://avatars.githubusercontent.com/u/15609339"
              alt="@hiyangguo"
              style={{ marginRight: "20px" }}
            />
            <h4>
              Hello&nbsp;
              <strong>
                {session.user?.name.givenName} {}
                {session.user?.name.familyName},
              </strong>
              &nbsp; Welcome to the
              <strong> {session.orgName} </strong>organization !!
            </h4>
            {/* <h5>Quick Start Boilerplate App</h5> */}

            <p className={styles.getStartedSectionComponentGetStartedTextP}>
              As you have already experienced the authentication flow to get
              here. From here you can experience of basic business application
              usecases with the support of Asgardeo B2B features.
            </p>
          </Stack>
        </Panel>
      </div>
      <div className={styles.gridView}>
        <p>What can we do next? </p>
        <div className={styles.grid}>
          <Panel bordered className={styles.card}>
            {/* <Image alt='react-logo' src={ card?.icon} className='link-logo-image-small logo'/> */}
            <Image
              alt="github-logo"
              src={Github}
              className={styles.linkLogoImageSmall}
            />

            <strong>Github Repository</strong>
            <p>
              Lets go through the application codebase and contribute to our
              Asgardeo React Sample application.
            </p>
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source
            </a>
          </Panel>
          <Panel bordered className={styles.card}>
            <Image
              alt="user-guide-logo"
              src={UserGuide}
              className={styles.linkLogoImageSmall}
            />
            <strong>User Guide</strong>
            <p>
              Check out our user guide and we will guide you to integrate your
              applications with Asgardeo.
            </p>
            <a
              href="https://wso2.com/asgardeo/docs/"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </Panel>

          <Panel bordered className={styles.card}>
            <Image
              alt="docs-logo"
              src={Docs}
              className={styles.linkLogoImageSmall}
            />
            <strong>Asgardeo Docs</strong>
            <p>
              Read our Docs for the guides to provide the instructions for
              building IAM uses cases.
            </p>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel>

          {/* <Panel bordered className={styles.card}>
            <strong>NextAuth.js Docs</strong>
            <p>
              Learn about NextAuth.js to add authentication to your Next.js
              applications.
            </p>
            <a
              href="https://next-auth.js.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel> */}
        </div>
      </div>
      {/* {checkAdmin(session.scope!) && <AdminSection orgId={session.orgId!} />} */}
    </div>
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
