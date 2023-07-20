import { requestOptionsWithBody } from "../../../../../utils/api-util/apiRequestOptions";
import { getRolesEnpointUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import RequestMethod from "../../../../../models/api/requestMethod";
import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";

export default async function patchIdpAssignedGroups(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }
    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const patchBody = body.patchBody;
    const name = body.param;
    const id = req.query.id;
    console.log(body);

    try {
       
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${process.env.SHARED_APP_ID}/roles/${name}/identity-providers/${id}/assigned-groups`,
            requestOptionsWithBody(session, RequestMethod.PATCH, patchBody)
        );
        console.log(patchBody);
        const data = await fetchData.json();
            console.log("dt", data);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);

        return dataNotRecievedError(res);
    }
}
