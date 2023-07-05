/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { List } from "rsuite";
import styles from "../../../../../../../styles/Settings.module.css";

interface PermissionProps {
  permissions?: string[];
}

/**
 *
 * @param prop - `session`, `permissions` - array
 *
 * @returns The permission section of role details
 */
export default function Permission(props: PermissionProps) {
  const { permissions } = props;
  return (
    <div className={styles.addUserMainDiv}>
      {permissions ? (
        permissions.length === 0 ? (
          <p> Permissions are not set at the moment.</p>
        ) : (
          <>
            <List size="sm">
              {permissions.map((item, index) => (
                <List.Item key={index} index={index}>
                  {item.name}
                </List.Item>
              ))}
            </List>
          </>
        )
      ) : null}
    </div>
  );
}
