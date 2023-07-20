import { requestOptionsWithBody } from "../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { dataNotRecievedError, notPostError } from "../../../../utils/api-util/apiErrors";
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
        notPostError(res);
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

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
