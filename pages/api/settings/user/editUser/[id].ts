import { requestOptionsWithBody } from "../../../../../utils/api-util/apiRequestOptions";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError, notPostError } from "../../../../../utils/api-util/apiErrors";

/**
 * backend API call to edit a user
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function editUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const user = body.param;
    const orgId = body.orgId;

    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Users/${id}`,
            requestOptionsWithBody(session, RequestMethod.PATCH, user)
        );
        
        const data = await fetchData.json();
        console.log("datatiiiiiiiiiiiiii",fetchData);
        console.log("------------------------------------");
      //  console.log("datataaaaaaaa",data);
        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
