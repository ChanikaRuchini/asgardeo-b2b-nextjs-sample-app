import { requestOptionsWithBody } from "../../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";    
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";

/**
 * backend API call to update federtated authenticators of an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function updateFederatedAuthenticators(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const request = body.param;

    const idpId = req.query.id;

    const url = `${getOrgUrl(orgId)}/api/server/v1/identity-providers/${idpId}` +
        `/federated-authenticators/${request[0]}`;

    try {
        const fetchData = await fetch(
            url,
            requestOptionsWithBody(session, RequestMethod.PUT, request[1])
        );
        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
