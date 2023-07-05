/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
          <Panel
            bordered
            className={styles.getStartedSectionComponentGetStartedTextPanel}
          >
            <Stack direction="column" spacing={40} justifyContent="center">
              <Stack direction="column" spacing={10} justifyContent="center">
                <p>
                  <strong>
                    Welcome {session.user?.name.givenName} {}
                    {session.user?.name.familyName}
                  </strong>
                </p>
              </Stack>

              <p className={styles.getStartedSectionComponentGetStartedTextP}>
                This is a sample application that demostrates an B2B
                organization management flow using next.js
              </p>
            </Stack>
          </Panel>
        </div>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={20}>
        <Prerequisite orgId={session.orgId!} />
      </FlexboxGrid.Item>
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
