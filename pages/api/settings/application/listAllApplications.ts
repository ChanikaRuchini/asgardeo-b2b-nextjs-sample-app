import { dataNotRecievedError, notPostError } from "../../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../../utils/api-util/apiRequestOptions";
import { getOrgUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to view all applications
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function listAllApplications(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/applications`,
            requestOptions(session)
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
