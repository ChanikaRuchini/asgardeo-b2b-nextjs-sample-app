import RequestMethod from "../../../models/api/requestMethod";
import { dataNotRecievedError, notPostError } from "../../../utils/api-util/apiErrors";
import { requestOptions, requestOptionsWithBody } from "../../../utils/api-util/apiRequestOptions"
import { getMeEnpointUrl } from "../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to view users
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function updateProfileInfo(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const user = body.param;
    const orgId = body.orgId;
    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getMeEnpointUrl(orgId)}/scim2/Me`,
            requestOptionsWithBody(session, RequestMethod.PATCH, user)
        );
        
        const data = await fetchData.json();
        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
