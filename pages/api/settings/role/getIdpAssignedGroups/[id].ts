
import { dataNotRecievedError } from "../../../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../../../utils/api-util/apiRequestOptions";
import { getOrgUrl, getRolesEnpointUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to get all the details of an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function getIdpAssignedGroups(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }  

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const name = body.param;
    const appId= body.appId

    const id = req.query.id;
    try {
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${appId}/roles/${name}/identity-providers/${id}/assigned-groups`,
            requestOptions(session)
        );
        const data = await fetchData.json();
        if (fetchData.status >= 200 && fetchData.status < 300) {
            res.status(fetchData.status).json(data);
        } else {
            return res.status(fetchData.status).json({
                error: true,
                msg: data.detail
            })
        }
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
