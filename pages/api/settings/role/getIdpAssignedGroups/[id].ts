
import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";
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
        notPostError(res);
    }  

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const name = body.param;

    const id = req.query.id;
    try {
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${process.env.SHARED_APP_ID}/roles/${name}/identity-providers/${id}/assigned-groups`,
            requestOptions(session)
        );
        const data = await fetchData.json();
        console.log(data);

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
