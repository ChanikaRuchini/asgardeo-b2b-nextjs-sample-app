import { requestOptions } from "../../../../utils/api-util/apiRequestOptions";
import { getRolesEnpointUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../utils/api-util/apiErrors";

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
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const appId = body.appId;

    try {
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${appId}/roles`,
            requestOptions(session)
        );
        const data = await fetchData.json();
        if (fetchData.status >= 200 && fetchData.status < 300) {
            res.status(fetchData.status).json(data);
        } else {
            return res.status(data.status).json({
                error: true,
                msg: data.detail
            })
        }
    } catch (err) {
        return dataNotRecievedError(res);
    }
}
