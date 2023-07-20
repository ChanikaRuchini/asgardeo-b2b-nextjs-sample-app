import { requestOptionsWithBody } from "../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError, notPostError } from "../../../../utils/api-util/apiErrors";

export default async function patchGroupMembers(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const patchBody = body.param;
    const groupId = req.query.groupId;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Groups/${groupId}`,
            requestOptionsWithBody(session, RequestMethod.PATCH, patchBody)
        );

        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
