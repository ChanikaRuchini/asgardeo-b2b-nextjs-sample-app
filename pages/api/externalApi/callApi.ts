import { dataNotRecievedError } from "../../../utils/api-util/apiErrors";
import { requestOptions } from "../../../utils/api-util/apiRequestOptions"
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to external api call
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function getProfileInfo(req: NextApiRequest, res: NextApiResponse) {

  
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;

    try {
        const fetchData = await fetch(
            `https://4b3606a5-0c21-401e-853c-8d72b4ea20ea-prod.e1-us-east-azure.choreoapis.dev/qovt/sampleapi/endpoint-9090-803/1.0.0/accounts`,
            requestOptions(session)
        );
        const data = await fetchData.json();
        console.log("data", data);

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
