import { Avatar, FlexboxGrid, Input, InputGroup, useToaster } from "rsuite";
import { Panel, Stack } from "rsuite";
import styles from "../../../styles/Home.module.css";
import { Session } from "next-auth";
import { infoTypeDialog } from "../../common/dialogComponent/dialogComponent";
import { getUrl } from "../../../utils/application-config-util/applicationConfigUtil";
import CopyIcon from "@rsuite/icons/Copy";
import Image from "next/image";
import UserGuide from "../../../images/user.png";
import Github from "../../../images/github.png";
import Docs from "../../../images/docs.png";

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
          <Stack direction="column" spacing={20} justifyContent="center">
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
              {/* &nbsp; Welcome to the
              <strong> {session.orgName} </strong>organization !! */}
            </h4>
            <h5>
              &nbsp; Welcome to the
              <strong> {session.orgName} </strong>organization !!
            </h5>
            <p className={styles.getStartedSectionComponentGetStartedTextP}>
              From here on you can experience the basic business application use
              cases integrated with Asgardeo for B2B organization management.
            </p>
          </Stack>
        </Panel>
      </div>
      <div className={styles.gridView}>
        <p>What can we do next? </p>
        <div className={styles.grid}>
          <Panel bordered className={styles.card}>
            <Image
              alt="github-logo"
              src={Github}
              className={styles.linkLogoImageSmall}
              width={35}
            />

            <strong>Github Repository</strong>
            <p>
              Lets go through the application codebase and contribute to our
              Asgardeo React Sample application.
            </p>
            <a
              href="https://github.com/ChanikaRuchini/asgardeo-b2b-nextjs-sample-app"
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
              width={35}
            />
            <strong>User Guide</strong>
            <p>
              Check out our user guide and we will guide you to integrate your
              applications with Asgardeo.
            </p>
            <a
              href="https://docs.google.com/document/d/1-yKHQgQE3-Pj5FRoBdOLf33u1Y41QWzNd3jdR6TVhIQ/edit#heading=h.s1ioojv1wyw6"
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
              width={35}
            />
            <strong>Asgardeo Docs</strong>
            <p>
              Read our Docs for the guides to provide the instructions for
              building IAM uses cases.
            </p>
            <a
              href="https://wso2.com/asgardeo/docs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </Panel>
        </div>
      </div>
    </div>
  );
}

interface AdminSectionProps {
  orgId: string;
}
