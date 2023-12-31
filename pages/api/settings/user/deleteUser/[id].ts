import { requestOptionsWithBody } from "../../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../../utils/api-util/apiErrors";

export default async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Users/${id}`,
            requestOptionsWithBody(session, RequestMethod.DELETE, null)
        );
        res.status(fetchData.status).end();
    } catch (err) {
        
        return dataNotRecievedError(res);
    }
}
