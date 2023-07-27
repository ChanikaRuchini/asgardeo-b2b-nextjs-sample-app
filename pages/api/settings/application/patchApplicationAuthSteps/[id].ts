import { requestOptionsWithBody } from "../../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";

/**
 * backend API call to patch authentication steps of an application
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function patchApplicationAuthSteps(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const model = body.param;
    const orgId = body.orgId;

    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/applications/${id}`,
            requestOptionsWithBody(session, RequestMethod.PATCH, model)
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
