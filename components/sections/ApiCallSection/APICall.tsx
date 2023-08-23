import { Button, Stack, useToaster } from "rsuite";
import React, { useState } from "react";
import stylesSettings from "../../../styles/Settings.module.css";
import RequestMethod from "../../../models/api/requestMethod";
import { Session } from "next-auth";
import styles from "../../../styles/Settings.module.css";

interface APICallProps {
  session: Session;
}
/**
 * API Call component.
 */
export default function APICall(prop: APICallProps) {
  const { session } = prop;
  const [userInfo, setUserInfo] = useState<any>();

  const message =
    "Initiate a request to an external API and retrieve the response. This involves communicating with an external server through a " +
    "designated API, requesting specific data or executing particular actions inherent to the API's functionality.";

  async function handleApiCall() {
    try {
      const body = {
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(`/api/externalApi/callApi`, request);
      const usersData = await res.json();

      console.log(usersData);
      setUserInfo(usersData);
    } catch (err) {
      return null;
    }
  }

  return (
    <div className={styles.mainPanelDiv}>
      <div className={stylesSettings.tableMainPanelDiv}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>External API</h3>
            <p>Invoke an external API by clicking on the button below.</p>
          </Stack>
          <Button
            className={styles.addBtn}
            appearance="primary"
            size="md"
            onClick={handleApiCall}
          >
            Invoke API
          </Button>
        </Stack>
        <p>{message}</p>
        <h3>Output</h3>
        <pre className={stylesSettings.contentToCopy}>
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}
