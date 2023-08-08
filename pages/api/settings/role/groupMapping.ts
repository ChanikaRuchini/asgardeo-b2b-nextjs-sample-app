import { requestOptions } from "../../../../utils/api-util/apiRequestOptions";
import { getRolesEnpointUrl } from "../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../utils/api-util/apiErrors";

export default async function GroupMappings(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }
    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    const name = body.role;

    try {
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${process.env.SHARED_APP_ID}/roles/${name}/group-mapping`,
            requestOptions(session)
        );
        const data = await fetchData.json();

        if (fetchData.status >= 200 && fetchData.status < 300) {
            res.status(fetchData.status).json(data);
        } else {
            return res.status(fetchData.status).json({
                error: true,
                msg: data.detail
            })
        }    } catch (err) {

        return dataNotRecievedError(res);
    }
}
