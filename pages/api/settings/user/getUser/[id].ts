import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../../../utils/api-util/apiRequestOptions";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to view users
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function getUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    //const id = req.query.id;

    try {
        const fetchData = await fetch(
            `https://api.asgardeo.io/t/7ac9ffce-cbd3-4066-b389-3cb815820efb/scim2/Me`,
            requestOptions(session)
        );
        console.log(getOrgUrl(orgId));
        const users = await fetchData.json();

        res.status(200).json(users);
    } catch (err) {
        console.log("err", err);

        return dataNotRecievedError(res);
    }
}
