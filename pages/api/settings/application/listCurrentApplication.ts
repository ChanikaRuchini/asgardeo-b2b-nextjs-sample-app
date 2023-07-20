import { requestOptions } from "../../../../utils/api-util/apiRequestOptions";
import { getOrgUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError, notPostError } from "../../../../utils/api-util/apiErrors";

/**
 * API call to get the initial details of the current application. Use the application name to filter out the 
 * application (`config.ManagementAPIConfig.SharedApplicationName`).
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns initial details of the current application
 */
export default async function listCurrentApplication(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    const appName = process.env.SHARED_APPICATION_NAME;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/applications?filter=name+eq+${appName}`,
            requestOptions(session)
        );
        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
