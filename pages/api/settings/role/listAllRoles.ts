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

import { requestOptions } from "../../../../utils/api-util/apiRequestOptions";
import { getRolesEnpointUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import config from "../../../../config.json";
import { dataNotRecievedError, notPostError } from "../../../../utils/api-util/apiErrors";

/**
 * backend API call to list all roles.
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function listAllRoles(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    try {
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${config.BusinessAdminAppConfig.ApplicationConfig.SharedAppId}/roles`,
            requestOptions(session)
        );
        const data = await fetchData.json();
        console.log(data);

        res.status(200).json(data);
    } catch (err) {
        console.log(err);

        return dataNotRecievedError(res);
    }
}