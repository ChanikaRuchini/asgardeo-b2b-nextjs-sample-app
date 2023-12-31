import { requestOptionsWithBody } from "../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { dataNotRecievedError } from "../../../../utils/api-util/apiErrors";
import { NextApiRequest, NextApiResponse } from "next";
/**
 * backend API call to create a group
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function addGroup(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const user = body.param;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Groups`,
            requestOptionsWithBody(session, RequestMethod.POST, user)
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
