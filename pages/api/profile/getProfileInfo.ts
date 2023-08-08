import { dataNotRecievedError } from "../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../utils/api-util/apiRequestOptions"
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
export default async function getProfileInfo(req: NextApiRequest, res: NextApiResponse) {

    console.log("aaaaaaaaaaaaa");
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }
    console.log("bbbbbbbbbbbbbbbb");

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getMeEnpointUrl(orgId)}/scim2/Me`,
            requestOptions(session)
        );
        console.log(getMeEnpointUrl(orgId));
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
