import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../../../utils/api-util/apiRequestOptions";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to get groups of an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function getIdentityProviderGroups(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    const id = req.query.id;

    const url = `${getOrgUrl(orgId)}/api/server/v1/identity-providers/${id}/groups`;
    try {
        const fetchData = await fetch(
            url,
            requestOptions(session)
        );
        const data = await fetchData.json();
        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
