import { dataNotRecievedError, notPostError } from "../../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../../utils/api-util/apiRequestOptions";
import { getOrgUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to view groups
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function viewGroups(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Groups?excludedAttributes=members`,
            requestOptions(session)
        );
        const groups = await fetchData.json();
        
        res.status(200).json(groups);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
