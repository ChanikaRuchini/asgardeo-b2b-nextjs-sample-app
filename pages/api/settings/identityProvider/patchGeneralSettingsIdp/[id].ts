import { requestOptionsWithBody } from "../../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";    
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../../utils/api-util/apiErrors";

/**
 * backend API call to patch general settings of an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function patchGeneralSettingsIdp(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const request = body.param;

    const idpId = req.query.id;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/identity-providers/${idpId}`,
            requestOptionsWithBody(session, RequestMethod.PATCH, request)
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
