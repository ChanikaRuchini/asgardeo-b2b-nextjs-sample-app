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

import { redirect } from "../../utils/authorization-config-util/authorizationConfigUtil";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    if (session.expires || session.error) {
      return redirect("/500");
    } else {
      const orgId = session.orgId;
      const orgName = session.orgName;

      return {
        props: { orgId, orgName },
      };
    }
  } else {
    return redirect("/404");
  }
}

interface MoveOrgProps {
  orgId: string;
  orgName: string;
}

/**
 *
 * @param prop - orgId, orgName
 *
 * @returns Interface to call organization switch function
 */
export default function MoveOrg(props: MoveOrgProps) {
  const { orgId, orgName } = props;

  if (typeof window !== "undefined") {
    const router = useRouter();
    router.push(`/o/${orgId}`);
  }
}
